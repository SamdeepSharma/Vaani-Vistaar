import { NextResponse } from 'next/server';
import { promisify } from 'util';
import { exec } from 'child_process';
import { readFile, unlink } from 'fs/promises';
import path from 'path';
const execAsync = promisify(exec);

export async function POST(request: Request) {
    try {
        const { text, language } = await request.json();
        
        if (!text) {
            return NextResponse.json(
                { error: 'No text provided for speech synthesis' },
                { status: 400 }
            );
        }

        const outputPath = path.join(process.cwd(), 'tmp', `${Date.now()}.mp3`);
        
        // Use python3 explicitly and add error handling
        const pythonCommand = process.platform === 'win32' ? 'python' : 'python3';

        const pythonScript = `
from gtts import gTTS
import json

try:
    tts = gTTS(text="""${text.replace(/"/g, '\\"')}""", lang="${language}")
    tts.save("${outputPath.replace(/\\/g, '\\\\')}")
    print(json.dumps({"success": True}))
except ImportError:
    print(json.dumps({"error": "Required Python package 'gTTS' is not installed. Please run: pip install gTTS"}))
except Exception as e:
    print(json.dumps({"error": str(e)}))
`;

        const { stdout, stderr } = await execAsync(`${pythonCommand} -c '${pythonScript}'`);
        
        if (stderr) {
            console.error('Python stderr:', stderr);
        }

        const result = JSON.parse(stdout);
        if (result.error) {
            throw new Error(result.error);
        }

        // Read the generated audio file
        const audioBuffer = await readFile(outputPath);

        // Clean up the temporary file
        await unlink(outputPath).catch(console.error);

        // Return the audio file
        return new Response(audioBuffer, {
            headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Disposition': 'attachment; filename="translated_audio.mp3"'
            }
        });

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { error: 'Text-to-speech conversion failed. Check if Python and required packages are installed.' },
            { status: 500 }
        );
    }
}