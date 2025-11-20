/**
 * WebGL2 initialization helpers (Milestone M9 update: row indirection uniform)
 */
import { DEFAULT_ELEMENT_COLOR_MAP } from '../elementColorMap';
export interface GLResources {
  gl: WebGL2RenderingContext;
  program: WebGLProgram;
  vao: WebGLVertexArrayObject;
  tex: WebGLTexture;      // primary LOD texture
  texB: WebGLTexture;     // secondary LOD texture (crossfade)
  uLocations: {
    tex: WebGLUniformLocation | null;
    texB: WebGLUniformLocation | null;
    rowCount: WebGLUniformLocation | null;
    blendMode: WebGLUniformLocation | null;
    timeStartMs: WebGLUniformLocation | null;
    timeEndMs: WebGLUniformLocation | null;
    highlightGainLoc: WebGLUniformLocation | null;
    highlightModeLoc: WebGLUniformLocation | null;
    crossfadeLoc: WebGLUniformLocation | null;
    rowMapLoc: WebGLUniformLocation | null; // (M9)
  elemFireLoc?: WebGLUniformLocation | null;
  elemWaterLoc?: WebGLUniformLocation | null;
  rowHighlightLoc?: WebGLUniformLocation | null;
  };
}

function compile(gl: WebGL2RenderingContext, type: number, src: string): WebGLShader {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(sh) || 'Shader compile failed');
  }
  return sh;
}

function link(gl: WebGL2RenderingContext, vs: WebGLShader, fs: WebGLShader): WebGLProgram {
  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(prog) || 'Program link failed');
  }
  return prog;
}

export function initGL(canvas: HTMLCanvasElement, vertSrc: string, fragSrc: string): GLResources {
  const gl = canvas.getContext('webgl2');
  if (!gl) throw new Error('WebGL2 not supported');
  const vs = compile(gl, gl.VERTEX_SHADER, vertSrc);
  const fs = compile(gl, gl.FRAGMENT_SHADER, fragSrc);
  const program = link(gl, vs, fs);
  const vao = gl.createVertexArray()!;
  gl.bindVertexArray(vao);
  // Fullscreen quad (two triangles)
  const quad = new Float32Array([
    -1, -1,  1, -1,  -1, 1,
    -1,  1,  1, -1,   1, 1
  ]);
  const vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  const tex = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  const texB = gl.createTexture()!;
  gl.bindTexture(gl.TEXTURE_2D, texB);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  const uLocations = {
    tex: gl.getUniformLocation(program, 'u_tex'),
    texB: gl.getUniformLocation(program, 'u_texB'),
    rowCount: gl.getUniformLocation(program, 'u_rowCount'),
    blendMode: gl.getUniformLocation(program, 'u_blendMode'),
    timeStartMs: gl.getUniformLocation(program, 'u_timeStartMs'),
    timeEndMs: gl.getUniformLocation(program, 'u_timeEndMs'),
    highlightGainLoc: gl.getUniformLocation(program, 'u_highlightGain'),
    highlightModeLoc: gl.getUniformLocation(program, 'u_highlightMode'),
    crossfadeLoc: gl.getUniformLocation(program, 'u_crossfade'),
    rowMapLoc: gl.getUniformLocation(program, 'u_rowMap'), // (M9)
    elemFireLoc: gl.getUniformLocation(program, 'u_elemFire'),
  elemWaterLoc: gl.getUniformLocation(program, 'u_elemWater'),
  rowHighlightLoc: gl.getUniformLocation(program, 'u_rowHighlight')
  } as const;

  // Initialize default element color mapping uniforms (ESM import)
  if (uLocations.elemFireLoc && uLocations.elemWaterLoc) {
    const m = DEFAULT_ELEMENT_COLOR_MAP;
    // Column-major mat3: columns are fire, earth, air
    const mat = new Float32Array([
      m.fire[0], m.fire[1], m.fire[2],
      m.earth[0], m.earth[1], m.earth[2],
      m.air[0], m.air[1], m.air[2]
    ]);
    gl.useProgram(program);
    gl.uniformMatrix3fv(uLocations.elemFireLoc, false, mat);
    gl.uniform3f(uLocations.elemWaterLoc, m.water[0], m.water[1], m.water[2]);
  }

  return { gl, program, vao, tex, texB, uLocations };
}
