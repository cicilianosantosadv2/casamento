import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import rawPhotos from '../data/photos.json';
import type {WeddingPhoto} from '../types';

const photos = rawPhotos as WeddingPhoto[];
const pic = (index:number) => staticFile(photos[index]?.file ?? 'referencia/cerimonia-original.jpg');
const thumbNames=['O COMEÇO','NOSSA HISTÓRIA','O GRANDE DIA','O AMANHÃ'];

// A abertura reproduz a linguagem de uma vitrine de streaming, sem marcas ou interfaces oficiais.
// As miniaturas são fotos REAIS importadas pelo usuário, nunca imagens generativas representando acontecimentos.
export const Opening:React.FC=()=>{
 const frame=useCurrentFrame();
 const {fps}=useVideoConfig();
 const fadeIn=interpolate(frame,[0,Math.round(fps*1.1)],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 const fadeOut=interpolate(frame,[Math.round(fps*9.8),Math.round(fps*11.8)],[1,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 const opacity=Math.max(0,Math.min(fadeIn,fadeOut));
 const photoScale=interpolate(frame,[0,Math.round(fps*12)],[1.025,1.095],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 const titleX=interpolate(frame,[0,Math.round(fps*1.7)],[32,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
 const ids=photos.length ? [0,Math.floor(photos.length*.29),Math.floor(photos.length*.61),photos.length-1] : [0,0,0,0];
 return <AbsoluteFill style={{overflow:'hidden',background:'#090808',fontFamily:'Arial, Helvetica, sans-serif',color:'#f8f2e9'}}>
   <AbsoluteFill>
     <Img src={staticFile('referencia/cerimonia-original.jpg')} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center 42%',transform:`scale(${photoScale})`,filter:'contrast(1.04) saturate(.86) brightness(.8)'}}/>
   </AbsoluteFill>
   <AbsoluteFill style={{background:'linear-gradient(90deg,rgba(7,6,7,.98) 0%,rgba(8,7,8,.94) 24%,rgba(8,7,8,.75) 44%,rgba(8,7,8,.23) 73%,rgba(8,7,8,.1) 100%)'}}/>
   <AbsoluteFill style={{background:'linear-gradient(0deg,rgba(0,0,0,.98) 0%,rgba(0,0,0,.22) 38%,transparent 75%)'}}/>
   <AbsoluteFill style={{opacity, transform:`translateX(${titleX}px)`}}>
    <div style={{position:'absolute',top:95,left:108,letterSpacing:9,fontSize:19,color:'#dac4a0',fontWeight:500}}>UM FILME ESPECIAL</div>
    <div style={{position:'absolute',top:169,left:101,fontSize:118,lineHeight:.9,letterSpacing:-3,fontFamily:'Georgia, Times New Roman, serif',textShadow:'0 4px 36px #050505',maxWidth:910}}>Daniela <span style={{color:'#c7a37c'}}>&</span><br/>Anderson</div>
    <div style={{position:'absolute',top:417,left:109,fontSize:24,letterSpacing:9,fontWeight:400,color:'#e9dcc8'}}>UMA HISTÓRIA DE AMOR</div>
    <div style={{position:'absolute',top:491,left:110,maxWidth:630,fontSize:26,lineHeight:1.48,color:'#ded4c9',fontWeight:300}}>Dez anos de escolhas, sonhos e pequenos cuidados. Uma história que continua a ser construída todos os dias.</div>
    <div style={{position:'absolute',top:659,left:110,display:'flex',gap:18,alignItems:'center'}}>
     <div style={{borderRadius:8,background:'#ede9e5',color:'#111',padding:'17px 31px',fontSize:25,fontWeight:700,display:'flex',alignItems:'center',gap:16}}><span style={{fontSize:23}}>▶</span> Nosso filme</div>
     <div style={{borderRadius:8,border:'1px solid rgba(255,255,255,.5)',background:'rgba(0,0,0,.26)',padding:'17px 27px',fontSize:24}}>10 anos de história</div>
    </div>
    <div style={{position:'absolute',top:797,left:109,fontSize:17,letterSpacing:9,color:'#d3c3ac'}}>MOMENTOS DA NOSSA HISTÓRIA</div>
    <div style={{position:'absolute',left:106,top:837,right:101,display:'flex',gap:18}}>
    {ids.map((index,i)=><div key={i} style={{width:410}}>
      <div style={{height:143,border:'1px solid rgba(217,192,156,.58)',background:'#191716',borderRadius:7,overflow:'hidden'}}>
       <Img src={pic(index)} style={{width:'100%',height:'100%',objectFit:'cover',objectPosition:'center',filter:'saturate(.84) contrast(1.06)'}}/>
      </div>
      <div style={{fontSize:17,marginTop:12,color:'#f7ead8',fontFamily:'Georgia, serif'}}>{String(i+1).padStart(2,'0')} &nbsp; {thumbNames[i]}</div>
    </div>)}
    </div>
   </AbsoluteFill>
 </AbsoluteFill>;
};
