import React from 'react';
import {AbsoluteFill, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Audio} from '@remotion/media';
import {TransitionSeries,linearTiming} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import rawPhotos from './data/photos.json';
import rawTimeline from './data/timeline.json';
import type {WeddingPhoto,WeddingTimeline} from './types';
import {Opening} from './components/Opening';
import {Closing} from './components/Closing';
import {PhotoScene} from './components/PhotoScene';

const photos=rawPhotos as WeddingPhoto[];
const timeline=rawTimeline as WeddingTimeline;

const musicLevel=(frame:number):number=>{
  // Volume linear: limiar leve fora da narração; musica abaixo dos votos.
  const fadeIn=Math.max(0,Math.min(1,frame/75));
  const fadeOut=Math.max(0,Math.min(1,(timeline.durationFrames-frame)/100));
  let duck=0;
  for (const cue of timeline.voiceCues) {
    if (frame<cue.startFrame-26 || frame>cue.endFrame+35) continue;
    const enter=Math.max(0,Math.min(1,(frame-(cue.startFrame-26))/26));
    const exit=Math.max(0,Math.min(1,((cue.endFrame+35)-frame)/35));
    duck=Math.max(duck,Math.min(enter,exit));
  }
  return Math.max(0.01,(0.17-0.12*duck)*Math.min(fadeIn,fadeOut));
};

const PhotoSequence:React.FC=()=>{
 if (!photos.length) {
   return <AbsoluteFill style={{background:'#181615',justifyContent:'center',alignItems:'center',color:'#e4d6bf',fontSize:44,fontFamily:'Georgia,serif'}}>Fotografias pendentes de importação</AbsoluteFill>;
 }
 return (
  <TransitionSeries>
    {photos.flatMap((photo,index)=>[
      ...(index>0 ? [<TransitionSeries.Transition key={`fade-${photo.id}`} presentation={fade()} timing={linearTiming({durationInFrames:timeline.transitionFrames})}/>] : []),
      <TransitionSeries.Sequence key={`photo-${photo.id}`} durationInFrames={timeline.photoDurationFrames} premountFor={15}>
        <PhotoScene photo={photo} durationFrames={timeline.photoDurationFrames} index={index}/>
      </TransitionSeries.Sequence>,
    ])}
  </TransitionSeries>
 );
};

export const WeddingFilm:React.FC=()=>{
 const frame=useCurrentFrame();
 return (
  <AbsoluteFill style={{background:'#050506'}}>
    <Sequence from={0} durationInFrames={timeline.introFrames} name="Abertura">
      <Opening/>
    </Sequence>
    {photos.length>0 && (
      <Sequence from={timeline.introFrames} durationInFrames={timeline.photoSequenceFrames} name="178 Fotografias">
        <PhotoSequence/>
      </Sequence>
    )}
    <Sequence from={timeline.introFrames+timeline.photoSequenceFrames} durationInFrames={timeline.outroFrames} name="Encerramento">
      <Closing/>
    </Sequence>
    {timeline.musicEnabled && <Audio src={staticFile('audio/trilha.mp3')} loop volume={musicLevel(frame)} name="Trilha instrumental"/>}
    {timeline.voiceCues.map((cue,i)=>(
      <Audio key={`${cue.speaker}-${i}`} from={cue.startFrame} durationInFrames={cue.durationFrames} src={staticFile(cue.file)} volume={0.95} name={`Votos ${cue.speaker} ${i+1}`} />
    ))}
  </AbsoluteFill>
 );
};
