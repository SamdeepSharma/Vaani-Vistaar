import { FFmpeg } from '@ffmpeg/ffmpeg';

const ffmpeg = createFFmpeg({ log: true });

export const loadFFmpeg = async () => {
  if (!ffmpeg.loaded) {
    await ffmpeg.load();
  }
  return ffmpeg;
};

function createFFmpeg(arg0: { log: boolean; }): FFmpeg {
    return new FFmpeg();
}
