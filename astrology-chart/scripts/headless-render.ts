// TD3.1 Headless render harness stub
// Attempts to create an OffscreenCanvas WebGL2 context, render a tiny deterministic frame,
// and emit a hash JSON artifact. If unavailable, exits with code 0 but prints skip notice.

import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

interface HashResult { width: number; height: number; hash: string; pixels: number; }

function fnv1a(bytes: Uint8Array): string { let h=0x811c9dc5>>>0; for(let i=0;i<bytes.length;i++){ h^=bytes[i]; h=Math.imul(h,0x01000193);} return ('00000000'+(h>>>0).toString(16)).slice(-8); }

async function main(){
  const supportsOffscreen = typeof (globalThis as any).OffscreenCanvas !== 'undefined';
  if(!supportsOffscreen){
    console.log('[headless-render] OffscreenCanvas not available; skipping (ok).');
    return;
  }
  const canvas = new (globalThis as any).OffscreenCanvas(64, 32);
  const gl: WebGL2RenderingContext | null = canvas.getContext('webgl2');
  if(!gl){
    console.log('[headless-render] WebGL2 context unavailable; skipping.');
    return;
  }
  // Minimal shader pair: draw solid color gradient deterministically
  const vert = `#version 300 es\nprecision highp float;layout(location=0) in vec2 a_pos;out vec2 v;void main(){v=a_pos;gl_Position=vec4(a_pos,0.,1.);} `;
  const frag = `#version 300 es\nprecision highp float;in vec2 v;out vec4 o;void main(){float g=(v.x+1.0)*0.5; o=vec4(g, g*0.5, 1.0-g, 1.0);} `;
  function compile(type:number, src:string){ const sh=gl.createShader(type)!; gl.shaderSource(sh, src); gl.compileShader(sh); if(!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh) || 'compile fail'); return sh; }
  function link(vs:WebGLShader, fs:WebGLShader){ const p=gl.createProgram()!; gl.attachShader(p,vs); gl.attachShader(p,fs); gl.linkProgram(p); if(!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) || 'link fail'); return p; }
  const vs = compile(gl.VERTEX_SHADER, vert);
  const fs = compile(gl.FRAGMENT_SHADER, frag);
  const prog = link(vs, fs);
  gl.useProgram(prog);
  const vao = gl.createVertexArray(); gl.bindVertexArray(vao);
  const quad = new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]);
  const vbo = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, vbo); gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW); gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
  gl.viewport(0,0,64,32);
  gl.clearColor(0,0,0,1); gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES,0,6);
  const pixels = new Uint8Array(64*32*4);
  gl.readPixels(0,0,64,32, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
  const hash = fnv1a(pixels);
  const result: HashResult = { width:64, height:32, hash, pixels: pixels.length };
  const outPath = resolve('artifacts/headless/hash-baseline.json');
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(result, null, 2));
  console.log('[headless-render] wrote', outPath, 'hash', hash);
}

main().catch(e=>{ console.error('[headless-render] error', e); process.exitCode = 1; });
