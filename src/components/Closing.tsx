import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

export const Closing:React.FC = () => {
 const frame=useCurrentFrame();
 const {fps}=useVideoConfig();
 const opacity=interpolate(frame,[0,1.3*fps,5.1*fps,7.9*fps],[0,1,1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 return (
  <AbsoluteFill style={{background:'radial-gradient(ellipse at center,#1e1b19,#030304 73%)',color:'#f6ede1',justifyContent:'center',alignItems:'center',fontFamily:'Georgia,serif'}}>
    <div style={{opacity,textAlign:'center'}}>
      <div style={{fontFamily:'Segoe UI, Arial, sans-serif',letterSpacing:9,fontSize:24,color:'#c0a077',marginBottom:35}}>CONTINUAR CAMINHANDO COM VOCÊ</div>
      <div style={{fontSize:90}}>Daniela <span style={{color:'#c0a077'}}>&</span> Anderson</div>
      <div style={{fontFamily:'Segoe UI, Arial, sans-serif',fontSize:23,letterSpacing:5,marginTop:43,color:'#baad99'}}>UMA HISTÓRIA QUE CONTINUA</div>
    </div>
  </AbsoluteFill>
 );
};
