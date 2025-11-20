/**
 * Extended WebGL2 shader sources for Timestream (Milestone M9 row indirection)
 */
export const VERT_SOURCE = `#version 300 es
precision highp float;
layout(location=0) in vec2 a_pos; // clip space quad
out vec2 v_uv;
void main(){
  v_uv = (a_pos + 1.0) * 0.5; // map clip -> UV
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

export const FRAG_SOURCE = `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 outColor;

uniform sampler2D u_tex;  // primary
uniform sampler2D u_texB; // secondary (adjacent LOD)
uniform float u_crossfade; // 0..1 weight toward secondary
uniform float u_rowCount;
uniform int u_blendMode;
uniform float u_timeStartMs;
uniform float u_timeEndMs;
uniform float u_highlightGain;
uniform int u_highlightMode;
uniform mat3 u_elemFire; // columns: fire, earth, air basis RGB
uniform vec3 u_elemWater; // water contribution

#define MAX_PLANETS 32
uniform int u_rowHighlight[MAX_PLANETS]; // harmonic highlight flags per row
uniform int u_rowMap[MAX_PLANETS]; // (M9) display row -> source row indirection

vec3 elementToRgb(vec4 feaw){
  float fire = feaw.r; float earth = feaw.g; float air = feaw.b; float water = feaw.a;
  vec3 rgb = u_elemFire * vec3(fire, earth, air) + water * u_elemWater;
  return clamp(rgb, 0.0, 1.0);
}

vec3 applyBlend(int mode, vec3 a, vec3 b){
  if(mode==0) return a * b;
  if(mode==1) return min(a + b, 1.0);
  if(mode==2) return 1.0 - (1.0 - a) * (1.0 - b);
  if(mode==3){
    vec3 r;
    r.r = a.r < 0.5 ? 2.0*a.r*b.r : 1.0 - 2.0*(1.0-a.r)*(1.0-b.r);
    r.g = a.g < 0.5 ? 2.0*a.g*b.g : 1.0 - 2.0*(1.0-a.g)*(1.0-b.g);
    r.b = a.b < 0.5 ? 2.0*a.b*b.b : 1.0 - 2.0*(1.0-a.b)*(1.0-b.b);
    return r;
  }
  if(mode==4) return abs(a - b);
  return a;
}

float computeHighlightFactor(int mode, vec4 feaw, int row){
  if(mode==0) return 0.0;
  float fire = feaw.r; float earth = feaw.g; float air = feaw.b; float water = feaw.a;
  float mx = max(max(fire, earth), max(air, water));
  float mn = min(min(fire, earth), min(air, water));
  if(mode==1){
    float purity = mx - ( (fire+earth+air+water - mx)/3.0 );
    return clamp(purity,0.0,1.0);
  } else if(mode==2){
    float balance = 1.0 - (mx - mn);
    return clamp(balance,0.0,1.0);
  } else if(mode==3){
    // harmonic resonance: flag gate * purity
    if (u_rowHighlight[row] == 0) return 0.0;
    float purity = mx - ( (fire+earth+air+water - mx)/3.0 );
    return clamp(purity,0.0,1.0);
  }
  return 0.0;
}

vec4 samplePrimary(vec2 uv){ return texture(u_tex, uv); }
vec4 sampleSecondary(vec2 uv){ return texture(u_texB, uv); }

void main(){
  // Row indirection mapping: remap v_uv.y to source row coordinate
  float rows = u_rowCount;
  float fRow = clamp(v_uv.y * rows, 0.0, rows - 0.0001);
  int dispRow = int(floor(fRow));
  int srcRow = u_rowMap[dispRow];
  // Phase 2 ordering integrity: negative sentinel means missing/invalid row -> transparent
  if (srcRow < 0) { outColor = vec4(0.0); return; }
  float mappedY = (float(srcRow) + 0.5) / rows; // center of source row
  vec2 mappedUV = vec2(v_uv.x, mappedY);
  vec4 sA = samplePrimary(mappedUV);
  vec4 sB = sampleSecondary(mappedUV);
  // If primary is empty (all zeros), show a dim purple diagnostic to avoid full black during bring-up
  if (sA == vec4(0.0)) {
    outColor = vec4(0.2, 0.0, 0.2, 1.0);
    return;
  }
  vec4 s = mix(sA, sB, u_crossfade);
  vec3 base = elementToRgb(s);
  vec3 blended = applyBlend(u_blendMode, base, base);
  float hf = computeHighlightFactor(u_highlightMode, s, srcRow);
  blended = clamp(blended * (1.0 + u_highlightGain * hf), 0.0, 1.0);
  outColor = vec4(blended,1.0);
}`;
