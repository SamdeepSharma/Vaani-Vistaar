import { exec as execCallback } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import { NextResponse } from 'next/server';
import { translate } from 'google-translate-api-x';


const exec = promisify(execCallback);

export async function normalizeAudio(inputPath: string): Promise<string> {
  const outputPath = path.join(
    path.dirname(inputPath),
    `normalized-${path.basename(inputPath)}`
  );

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .audioFilters('loudnorm=I=-16:TP=-1.5:LRA=11')
      .output(outputPath)
      .on('end', () => resolve(outputPath))
      .on('error', reject)
      .run();
  });
}

export async function getAudioDuration(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) reject(err);
      else resolve(metadata.format.duration || 0);
    });
  });
}

// types/index.ts
export interface TranscriptionSegment {
  start: number;
  end: number;
  text: string;
  speaker?: string;
}

export interface TranscriptionResult {
  success: boolean;
  text: string;
  segments: TranscriptionSegment[];
  error?: string;
}

export interface TranslationResponse {
  text: string;
  from?: {
    language: {
      iso: string;
    };
  };
}



// Directory setup
const uploadDir = path.join(process.cwd(), 'public', 'uploads');
const audioDir = path.join(uploadDir, 'audio');
const videoDir = path.join(uploadDir, 'video');
const outputDir = path.join(uploadDir, 'output');
const scriptDir = path.join(process.cwd(), 'scripts');
const tempDir = path.join(uploadDir, 'temp');

[uploadDir, audioDir, videoDir, outputDir, tempDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  async function cleanupTempFiles(files: string[]) {
    for (const file of files) {
      try {
        if (fs.existsSync(file)) {
          fs.unlinkSync(file);
        }
      } catch (error) {
        console.error(`Failed to delete temp file ${file}:`, error);
      }
    }
  }
  
  export async function POST(request: Request) {
    const tempFiles: string[] = [];
  
    try {
      // Parse form data
      const formData = await request.formData();
      const audioPath = formData.get('audioPath') as string;
      const videoPath = formData.get('videoPath') as string;
      const targetLanguage = formData.get('targetLanguage') as string;
  
      // Validate inputs
      if (!audioPath || !videoPath || !targetLanguage) {
        return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
      }
  
      // Get absolute paths
      const absoluteAudioPath = path.join(process.cwd(), 'public', audioPath);
      const absoluteVideoPath = path.join(process.cwd(), 'public', videoPath);
      const transcriptionOutputPath = path.join(outputDir, `${path.basename(audioPath, '.wav')}.json`);
  
      // Check if files exist
      if (!fs.existsSync(absoluteAudioPath) || !fs.existsSync(absoluteVideoPath)) {
        return NextResponse.json({ error: 'Source files not found' }, { status: 404 });
      }
  
      // Transcribe audio with speaker segmentation
      console.log('Starting transcription with speaker segmentation...');
      const pythonScript = path.join(scriptDir, 'transcribe.py');
      const { stdout: transcriptionRawOutput } = await exec(
        `python3 "${pythonScript}" "${absoluteAudioPath}" "${transcriptionOutputPath}" --speaker-segmentation`
      );
  
      // Parse and validate transcription result
      let transcriptionResult: TranscriptionResult;
      try {
        transcriptionResult = JSON.parse(transcriptionRawOutput);
        if (!transcriptionResult.success) {
          throw new Error(`Transcription failed: ${transcriptionResult.error}`);
        }
      } catch (e) {
        if (e instanceof Error) {
          throw new Error(`Failed to parse transcription output: ${e.message}`);
        } else {
          throw new Error('Failed to parse transcription output: Unknown error');
        }
      }
  
      if (!Array.isArray(transcriptionResult.segments)) {
        throw new Error('Invalid transcription result: segments is not an array');
      }
  
      // Generate speech for each speaker segment
      const translatedAudioPaths: string[] = [];
      const translatedSegments = [];
  
      for (const segment of transcriptionResult.segments) {
        // Translate text
        const translatedSegment = await translate(segment.text, { to: targetLanguage }) as TranslationResponse;
        if (!translatedSegment || typeof translatedSegment !== 'object' || !('text' in translatedSegment)) {
          throw new Error('Unexpected translation response format');
        }
  
        // Prepare text for TTS
        const escapedText = (translatedSegment.text || '')
          .replace(/"/g, '\\"')
          .replace(/\n/g, ' ')
          .replace(/[&<>]/g, '');
  
        // Generate audio file path
        const segmentAudioPath = path.join(
          tempDir,
          `speaker-${segment.speaker || 'unknown'}-${segment.start}.mp3`
        );
        tempFiles.push(segmentAudioPath);
  
        // Generate TTS audio
        const gttsCommand = `gtts-cli "${escapedText}" --lang ${targetLanguage} --output "${segmentAudioPath}"`;
        console.log(`Generating TTS for ${segment.speaker || 'unknown'}, Segment [${segment.start}-${segment.end}]`);
        
        await exec(gttsCommand);
        translatedAudioPaths.push(segmentAudioPath);
  
        translatedSegments.push({
          speaker: segment.speaker || 'unknown',
          originalText: segment.text,
          translatedText: translatedSegment.text
        });
      }
  
      // Combine all translated segments into one audio file
      const combinedAudioPath = path.join(tempDir, `combined-${path.basename(audioPath, '.wav')}.mp3`);
      tempFiles.push(combinedAudioPath);
  
      await new Promise<void>((resolve, reject) => {
        const command = ffmpeg();
        
        // Add input files
        translatedAudioPaths.forEach(file => {
          command.input(file);
        });
  
        // Setup concatenation
        command
          .complexFilter([{
            filter: 'concat',
            options: {
              n: translatedAudioPaths.length,
              v: 0,
              a: 1
            },
            outputs: 'concatenated'
          }])
          .map('[concatenated]')
          .output(combinedAudioPath)
          .on('end', () => resolve())
          .on('error', reject)
          .run();
      });
  
      // Normalize the combined audio file
      const normalizedAudioPath = await normalizeAudio(combinedAudioPath);
      tempFiles.push(normalizedAudioPath);
  
      // Check durations
      const originalDuration = await getAudioDuration(absoluteVideoPath);
      const translatedDuration = await getAudioDuration(normalizedAudioPath);
      console.log('Duration check:', { originalDuration, translatedDuration });
  
      // Merge audio with video
      const outputFileName = `translated-${Date.now()}-${path.basename(videoPath)}`;
      const outputVideoPath = path.join(outputDir, outputFileName);
  
      await new Promise<void>((resolve, reject) => {
        ffmpeg(absoluteVideoPath)
          .input(normalizedAudioPath)
          .outputOptions([
            '-map 0:v:0',    // take video from first input
            '-map 1:a:0',    // take audio from second input
            '-c:v copy',     // copy video codec
            '-c:a aac',      // encode audio as AAC
            '-shortest'      // end when shortest input ends
          ])
          .on('start', (commandLine) => {
            console.log('FFmpeg started:', commandLine);
          })
          .on('progress', (progress) => {
            console.log('Processing: ' + progress.percent + '% done');
          })
          .on('end', () => {
            console.log('FFmpeg has finished');
            resolve();
          })
          .on('error', (err) => {
            console.error('FFmpeg error:', err);
            reject(new Error(`FFmpeg failed: ${err.message}`));
          })
          .save(outputVideoPath);
      });
  
      // Clean up temporary files
      await cleanupTempFiles(tempFiles);
  
      // Generate relative path for response
      const relativeOutputPath = path.join('uploads', 'output', outputFileName)
        .replace(/\\/g, '/');
  
      // Return results
      return NextResponse.json({
        success: true,
        translatedVideoUrl: `/${relativeOutputPath}`,
        originalText: transcriptionResult.text,
        segments: translatedSegments,
        metadata: {
          originalDuration,
          translatedDuration
        }
      });
  
    } catch (error) {
      // Clean up temporary files in case of error
      await cleanupTempFiles(tempFiles);
  
      console.error('Translation error:', error);
      return NextResponse.json({ 
        error: 'Translation failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }, { status: 500 });
    }
  }