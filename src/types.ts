export type WeddingPhoto = {
  id: string;
  file: string;
  sourceName: string;
  sha256: string;
};

export type VoiceCue = {
  speaker: 'daniela' | 'anderson';
  text: string;
  file: string;
  startFrame: number;
  endFrame: number;
  durationFrames: number;
};

export type WeddingTimeline = {
  fps: number;
  introFrames: number;
  outroFrames: number;
  photoCount: number;
  photoDurationFrames: number;
  transitionFrames: number;
  photoSequenceFrames: number;
  durationFrames: number;
  narrationStartFrame: number;
  voiceCues: VoiceCue[];
  musicEnabled: boolean;
  incomplete: boolean;
  missing: string[];
  warnings: string[];
};
