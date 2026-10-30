import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import type {WeddingPhoto} from '../types';

export const PhotoScene:React.FC<{photo:WeddingPhoto;durationFrames:number;index:number}> = ({photo,durationFrames,index}) => {
  const frame=useCurrentFrame();
  const progress=Math.min(1,Math.max(0,frame/Math.max(1,durationFrames-1)));
  // Ken Burns 100% orientado por quadros para exportacao estavel.
  const zoom=interpolate(progress,[0,1],index%2===0?[1.02,1.065]:[1.065,1.02]);
  const pan=interpolate(progress,[0,1],index%4<2?[-12,12]:[12,-12]);
  const src=staticFile(photo.file);
  return (
    <AbsoluteFill style={{background:'#080909',overflow:'hidden'}}>
      <AbsoluteFill style={{transform:'scale(1.2)',filter:'blur(42px) brightness(0.43)'}}>
        <Img src={src} style={{width:'100%',height:'100%',objectFit:'cover'}} />
      </AbsoluteFill>
      <AbsoluteFill style={{justifyContent:'center',alignItems:'center',overflow:'hidden'}}>
        <Img src={src} style={{width:'100%',height:'100%',objectFit:'contain',transform:`translateX(${pan}px) scale(${zoom})`,filter:'contrast(1.03) saturate(0.94)'}}/>
      </AbsoluteFill>
      <AbsoluteFill style={{background:'linear-gradient(180deg,rgba(0,0,0,0.16),transparent 28%,transparent 67%,rgba(0,0,0,0.2))',pointerEvents:'none'}}/>
    </AbsoluteFill>
  );
};
