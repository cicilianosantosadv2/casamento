import React from 'react';
import {Composition} from 'remotion';
import {WeddingFilm} from './WeddingFilm';
import rawTimeline from './data/timeline.json';
import type {WeddingTimeline} from './types';

const timeline=rawTimeline as WeddingTimeline;

export const RemotionRoot: React.FC = () => (
  <Composition
    id="WeddingFilm"
    component={WeddingFilm}
    width={1920}
    height={1080}
    fps={30}
    durationInFrames={Math.max(30,timeline.durationFrames)}
  />
);
