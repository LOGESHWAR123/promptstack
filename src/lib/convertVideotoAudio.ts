import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

export async function convertVideoToAudio(
  file: File,
  format: 'mp3' | 'wav' = 'mp3'
): Promise<Blob> {
  const ffmpeg = createFFmpeg({ log: true });

  await ffmpeg.load();

  const extension = file.name.split('.').pop() || 'mp4';
  const inputName = `input.${extension}`;
  const outputName = `output.${format}`;

  ffmpeg.FS('writeFile', inputName, await fetchFile(file));

  await ffmpeg.run('-i', inputName, '-vn', '-acodec', 'libmp3lame', outputName);

  const data = ffmpeg.FS('readFile', outputName);

  return new Blob([data.buffer], { type: `audio/${format}` });
}
