import ffmpeg from 'fluent-ffmpeg';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

export async function normalizeAudio(inputPath: string): Promise<string> {
  const outputPath = path.join(
    path.dirname(inputPath),
    `normalized-${path.basename(inputPath)}`
  );

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions([
        '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11',
        '-ar', '44100',
        '-ac', '2',
        '-b:a', '192k'
      ])
      .on('end', () => resolve(outputPath))
      .on('error', reject)
      .save(outputPath);
  });
}

export async function getAudioDuration(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) reject(err);
      resolve(metadata.format.duration || 0);
    });
  });
}