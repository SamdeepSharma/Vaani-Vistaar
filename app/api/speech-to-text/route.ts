import { NextResponse } from 'next/server';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';
import { promisify } from 'util';
import { exec } from 'child_process';

const execAsync = promisify(exec);


const ensureTmpDir = async () => {
    const tmpDir = path.join(process.cwd(), 'tmp');
    try {
        await mkdir(tmpDir, { recursive: true });
        return tmpDir;
    } catch (error) {
        console.error('Error creating tmp directory:', error);
        throw new Error('Failed to create temporary directory');
    }
};



// Validate Python environment
const validatePythonEnv = async (pythonCommand: string) => {
    try {
        await execAsync(`${pythonCommand} --version`);

        const checkPackages = `
import sys
import subprocess

def check_packages():
    required = ['openai-whisper', 'torch', 'numpy']
    process = subprocess.run(['pip', 'list'], capture_output=True, text=True)
    installed = process.stdout.lower()

    missing = [pkg for pkg in required if pkg.lower() not in installed]

    if missing:
        msg = "Missing packages: " + ", ".join(missing)
        print(msg)
        sys.exit(1)
    else:
        print("All required packages are installed")

if __name__ == "__main__":
    check_packages()

`;

        const { stdout, stderr } = await execAsync(`${pythonCommand} -c "${checkPackages}"`);
        if (stderr || stdout.includes("Missing packages")) {
            throw new Error(`Missing required Python packages: ${stdout.trim()}`);
        }
        console.log('Python environment validated successfully');
    } catch (error) {
        console.error('Python environment validation error:', error);
        throw new Error(`Python environment validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};

// Clean up temporary files
const cleanupTempFile = async (filePath: string) => {
    try {
        await unlink(filePath);
        console.log('Cleaned up temporary file:', filePath);
    } catch (error) {
        console.error('Error cleaning up temporary file:', error);
    }
};

export async function POST(request: Request) {
    let tempFilePath: string | null = null;
    try {
        const tmpDir = await ensureTmpDir();

        const data = await request.formData();
        const audioFile: File | null = data.get('audio') as unknown as File;
        const language: string = data.get('language') as string;

        if (!audioFile) {
            return NextResponse.json(
                { error: 'No audio file provided' },
                { status: 400 }
            );
        }

        const bytes = await audioFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        tempFilePath = path.join(tmpDir, `${Date.now()}.mp3`);
        await writeFile(tempFilePath, buffer);

        const pythonCommand = process.platform === 'win32' ? 'python' : 'python3';

        await validatePythonEnv(pythonCommand);

     
        const pythonScript = `
import os
import sys
import json
import traceback

try:
    import whisper
except ImportError as e:
    error_msg = {
        "error": "Whisper package not found. Install with: pip install openai-whisper",
        "details": str(e)
    }
    print(json.dumps(error_msg), file=sys.stderr)
    sys.exit(1)

try:
    import warnings
    warnings.filterwarnings('ignore', message=r'.*SSL.*')

    model = whisper.load_model("base")
    audio_path = r"/Users/anchitmehra/Documents/coding/projects/new_vanni/vanni-vista/tmp/1731483194086.mp3"
    result = model.transcribe(audio_path)

    transcribed_text = result["text"].strip()
    if not transcribed_text:
        error_msg = {
            "error": "No speech detected in audio",
            "details": "The audio file appears to be empty or contains no recognizable speech"
        }
        print(json.dumps(error_msg), file=sys.stderr)
        sys.exit(1)

    output = {
        "text": transcribed_text,
        "language": result.get("language", "unknown"),
        "segments": [
            {
                "start": s["start"],
                "end": s["end"],
                "text": s["text"]
            }
            for s in result.get("segments", [])
        ]
    }
    print(json.dumps(output))

except Exception as e:
    error_msg = {
        "error": str(e),
        "details": traceback.format_exc()
    }
    print(json.dumps(error_msg), file=sys.stderr)
    sys.exit(1)

`

        

        console.log('Executing speech-to-text conversion');
        const { stdout, stderr } = await execAsync(`${pythonCommand} -c '${pythonScript}'`);

        if (stderr) {
            console.error('Speech-to-text error:', stderr);
            try {
                const errorObj = JSON.parse(stderr);
                return NextResponse.json(
                    { 
                        error: errorObj.error,
                        details: errorObj.details
                    },
                    { status: 500 }
                );
            } catch {
                return NextResponse.json(
                    { 
                        error: 'Speech recognition error',
                        details: stderr
                    },
                    { status: 500 }
                );
            }
        }


        try {
            const result = JSON.parse(stdout);
            console.log('Speech-to-text result:', result);
            return NextResponse.json(result);
        } catch (parseError) {
            console.error('Error parsing speech-to-text result:', parseError);
            return NextResponse.json(
                { 
                    error: 'Failed to parse speech recognition result',
                    details: parseError instanceof Error ? parseError.message : 'Unknown error'
                },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error('Speech-to-text error:', error);
        return NextResponse.json(
            {
                error: 'Failed to process audio',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    } finally {
        if (tempFilePath) {
            await cleanupTempFile(tempFilePath);
        }
    }
}
