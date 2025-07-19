import { NextResponse } from 'next/server';
import { promisify } from 'util';
import { exec } from 'child_process';
const execAsync = promisify(exec);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log('Received translation request with body:', body);  // Debug log
        
        const { text, targetLanguage } = body;
        
        // Validate input
        if (!text || text === 'undefined') {
            console.log('Invalid text received:', text);  // Debug log
            return NextResponse.json(
                { error: 'No valid text provided for translation' },
                { status: 400 }
            );
        }

        if (!targetLanguage) {
            console.log('Invalid target language:', targetLanguage);  // Debug log
            return NextResponse.json(
                { error: 'No target language specified' },
                { status: 400 }
            );
        }

        // Use python3 explicitly and add error handling
        const pythonCommand = process.platform === 'win32' ? 'python' : 'python3';
        
        // Escape special characters in the text
        const escapedText = text.replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
        
        const pythonScript = `
import sys
from googletrans import Translator
import json

try:
    text = """${escapedText}"""
    translator = Translator()
    translation = translator.translate(text, dest="${targetLanguage}")
    result = {
        "translatedText": translation.text,
        "source": translation.src,
        "confidence": getattr(translation, 'confidence', None)
    }
    print(json.dumps(result))
except Exception as e:
    error_message = str(e)
    print(json.dumps({"error": error_message}), file=sys.stderr)
`;

        console.log('Executing translation with Python script');  // Debug log
        
        const { stdout, stderr } = await execAsync(`${pythonCommand} -c '${pythonScript}'`);
        
        if (stderr) {
            console.error('Python stderr:', stderr);
            return NextResponse.json(
                { error: `Translation error: ${stderr}` },
                { status: 500 }
            );
        }

        try {
            const result = JSON.parse(stdout);
            console.log('Translation result:', result);  // Debug log
            
            if (result.error) {
                throw new Error(result.error);
            }
            
            return NextResponse.json(result);
        } catch (parseError) {
            console.error('Error parsing translation result:', parseError);
            return NextResponse.json(
                { error: 'Failed to parse translation result' },
                { status: 500 }
            );
        }

    } catch (error) {
        console.error('Translation error:', error);
        return NextResponse.json(
            { 
                error: 'Translation failed',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}