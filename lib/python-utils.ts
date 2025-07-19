import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';

const execAsync = promisify(exec);

// Ensure temporary directory exists
const tmpDir = './tmp';
if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir);
}

export async function executePythonScript(script: string): Promise<any> {
    try {
        const { stdout, stderr } = await execAsync(`python -c "${script}"`);
        
        if (stderr) {
            console.error('Python stderr:', stderr);
        }

        return JSON.parse(stdout);
    } catch (error) {
        console.error('Error executing Python script:', error);
        throw error;
    }
}

export function cleanupTempFiles() {
    const files = fs.readdirSync(tmpDir);
    for (const file of files) {
        fs.unlinkSync(`${tmpDir}/${file}`);
    }
}

// Clean up temporary files periodically (every hour)
setInterval(cleanupTempFiles, 3600000);