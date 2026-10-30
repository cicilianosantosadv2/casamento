import crypto from 'node:crypto';
import fs from 'node:fs';

export const FPS = 30;
export const BASE_PHOTO_FRAMES = 103; // 3,433 segundos por fotografia
export const MIN_PHOTO_FRAMES = 90;
export const MAX_PHOTO_FRAMES = 105;
export const TRANSITION_FRAMES = 6; // 0,20s de sobreposicao
export const INTRO_FRAMES = 360;
export const OUTRO_FRAMES = 240;
export const NARRATION_HEAD_FRAMES = 210;
export const NARRATION_TAIL_FRAMES = 120;

export function photoSequenceFrames(count, duration, overlap) {
  return count === 0 ? 0 : count * duration - (count - 1) * overlap;
}

export function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

export function sha256File(file) {
  return sha256(fs.readFileSync(file));
}

export function naturalCompare(a, b) {
  return a.localeCompare(b, 'pt-BR', {numeric: true, sensitivity: 'base'});
}

export function calculateCues(segmentsBySpeaker, voiceStartFrame) {
  let cursor = voiceStartFrame;
  const cues = [];
  for (const speaker of ['daniela', 'anderson']) {
    const segments = segmentsBySpeaker[speaker] ?? [];
    if (segments.length === 0) continue;
    // Respira entre os votos; sem sobrepor uma voz a outra.
    if (cues.length > 0) cursor += 45;
    for (const seg of segments) {
      const durationFrames = Math.max(1, Math.ceil(Number(seg.durationSeconds) * FPS));
      cues.push({
        speaker,
        text: seg.text,
        file: seg.file,
        startFrame: cursor,
        endFrame: cursor + durationFrames,
        durationFrames,
      });
      cursor += durationFrames + Math.max(0, Number(seg.pauseAfterFrames ?? 11));
    }
  }
  return cues;
}

export function choosePhotoDuration({count, cues, overlap=TRANSITION_FRAMES}) {
  const lastAudioEnd = cues.length ? Math.max(...cues.map(c => c.endFrame)) : 0;
  // Busca duracao nominal de 3 a 3,5s que preserve o fim da narracao.
  for (let d = BASE_PHOTO_FRAMES; d <= MAX_PHOTO_FRAMES; d++) {
    const photosEnd = INTRO_FRAMES + photoSequenceFrames(count, d, overlap);
    if (lastAudioEnd + NARRATION_TAIL_FRAMES <= photosEnd) {
      return {durationFrames: d, fits: true, shortfallFrames: 0};
    }
  }
  const maxEnd = INTRO_FRAMES + photoSequenceFrames(count, MAX_PHOTO_FRAMES, overlap);
  return {
    durationFrames: MAX_PHOTO_FRAMES,
    fits: count === 0 ? false : lastAudioEnd + NARRATION_TAIL_FRAMES <= maxEnd,
    shortfallFrames: Math.max(0, lastAudioEnd + NARRATION_TAIL_FRAMES - maxEnd),
  };
}
