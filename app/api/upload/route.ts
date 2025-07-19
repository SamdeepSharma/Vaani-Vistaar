import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
const uploadDir = path.join(process.cwd(), 'public', 'uploads');
const audioDir = path.join(uploadDir, 'audio');
const videoDir = path.join(uploadDir, 'video');
[uploadDir, audioDir, videoDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('video') as File;
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }
    const uniqueSuffix = Date.now().toString();
    const safeFilename = `video-${uniqueSuffix}.mp4`.replace(/[^a-zA-Z0-9-_.]/g, '');
    const videoFilePath = path.join(videoDir, safeFilename);
    const audioFilename = `audio-${uniqueSuffix}.wav`;
    const audioFilePath = path.join(audioDir, audioFilename);
    // Save video file
    const bytes = await file.arrayBuffer();
    await writeFile(videoFilePath, Buffer.from(bytes));
    // Extract audio
    await new Promise((resolve, reject) => {
      ffmpeg(videoFilePath)
        .toFormat('wav')
        .audioChannels(1)
        .audioFrequency(16000)
        .on('end', resolve)
        .on('error', reject)
        .save(audioFilePath);
    });
    const relativeVideoPath = path.join('uploads', 'video', safeFilename).replace(/\\/g, '/');
    const relativeAudioPath = path.join('uploads', 'audio', audioFilename).replace(/\\/g, '/');
    return NextResponse.json({
      success: true,
      videoPath: `${relativeVideoPath}`,
      audioPath: `${relativeAudioPath}`
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      error: 'Upload failed', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}