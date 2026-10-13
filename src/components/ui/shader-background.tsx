"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export type ShaderVariant = "aurora" | "gradient-mesh" | "light-leak";

export interface ShaderBackgroundProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: ShaderVariant;
  speed?: number;
  intensity?: number;
  colorPalette?: [string, string, string, string]; // 4 hex colors
  children?: React.ReactNode;
}

// Deep, vibrant luxury emerald / cyan / mint palette
const DEFAULT_PALETTES: Record<ShaderVariant, [number, number, number][]> = {
  aurora: [
    [0.02, 0.62, 0.45], // Emerald #059669
    [0.05, 0.75, 0.68], // Vibrant Teal #0D9488
    [0.01, 0.16, 0.14], // Deep Midnight Forest #022C22
    [0.18, 0.88, 0.78], // Mint Crest Highlight #2DD4BF
  ],
  "gradient-mesh": [
    [0.03, 0.58, 0.42], // Emerald #059669
    [0.08, 0.72, 0.65], // Bright Teal #14B8A6
    [0.02, 0.20, 0.18], // Deep Jade #04362E
    [0.22, 0.92, 0.82], // Electric Mint #2DD4BF
  ],
  "light-leak": [
    [0.05, 0.65, 0.58], // Teal #0D9488
    [0.96, 0.85, 0.52], // Soft warm sunbeam #FCD34D
    [0.02, 0.28, 0.24], // Forest base #064E3B
    [1.0, 1.0, 1.0],    // White flare
  ],
};

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16);
  if (clean.length === 3) {
    const r = ((num >> 8) & 0xf) * 17;
    const g = ((num >> 4) & 0xf) * 17;
    const b = (num & 0xf) * 17;
    return [r / 255, g / 255, b / 255];
  }
  return [((num >> 16) & 0xff) / 255, ((num >> 8) & 0xff) / 255, (num & 0xff) / 255];
}

const VERTEX_SHADER_SRC = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = (a_position + 1.0) * 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

// Liquid Aurora with Simplex Noise Flow (60 FPS, striking visuals)
const AURORA_FRAGMENT_SHADER = `
  precision mediump float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform vec3 u_c1;
  uniform vec3 u_c2;
  uniform vec3 u_c3;
  uniform vec3 u_c4;
  uniform float u_intensity;
  varying vec2 v_uv;

  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
      dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = v_uv;
    float aspect = u_resolution.x / max(u_resolution.y, 1.0);
    vec2 p = uv;
    p.x *= aspect;

    float t = u_time * 0.45;

    // Organic liquid turbulence
    float n1 = snoise(p * 1.6 + vec2(t * 0.28, -t * 0.18));
    float n2 = snoise(p * 2.4 - vec2(t * 0.22, t * 0.32) + vec2(n1 * 0.4));
    float n3 = snoise(p * 3.2 + vec2(-t * 0.35, t * 0.25) + vec2(n2 * 0.3));

    float wave = (n1 * 0.52 + n2 * 0.34 + n3 * 0.14) * 0.5 + 0.5;

    // Interactive mouse ripple
    vec2 m = u_mouse;
    m.x *= aspect;
    float mDist = length(p - m);
    float mInf = smoothstep(0.8, 0.0, mDist) * 0.25;
    wave = clamp(wave + mInf, 0.0, 1.0);

    // Rich color mixing
    vec3 col = mix(u_c3, u_c1, smoothstep(0.08, 0.52, wave));
    col = mix(col, u_c2, smoothstep(0.38, 0.78, wave + n2 * 0.18));
    col = mix(col, u_c4, pow(smoothstep(0.62, 0.96, wave), 2.2) * 0.9);

    // Soft border vignette
    float vig = 1.0 - length(v_uv - 0.5) * 0.35;
    vig = clamp(vig, 0.0, 1.0);

    gl_FragColor = vec4(col * u_intensity * vig, 1.0);
  }
`;

// Dynamic Mesh Gradient
const GRADIENT_MESH_FRAGMENT_SHADER = `
  precision mediump float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform vec3 u_c1;
  uniform vec3 u_c2;
  uniform vec3 u_c3;
  uniform vec3 u_c4;
  uniform float u_intensity;
  varying vec2 v_uv;

  void main() {
    vec2 uv = v_uv;
    float t = u_time * 0.4;

    vec2 p1 = vec2(0.25 + 0.22 * sin(t * 0.6), 0.25 + 0.22 * cos(t * 0.4));
    vec2 p2 = vec2(0.75 + 0.22 * cos(t * 0.5), 0.35 + 0.22 * sin(t * 0.7));
    vec2 p3 = vec2(0.50 + 0.28 * sin(t * 0.8), 0.80 + 0.18 * cos(t * 0.5));
    vec2 p4 = vec2(0.20 + 0.18 * cos(t * 0.3), 0.75 + 0.22 * sin(t * 0.6));

    float d1 = length(uv - p1);
    float d2 = length(uv - p2);
    float d3 = length(uv - p3);
    float d4 = length(uv - p4);

    float w1 = 1.0 / (d1 * d1 + 0.08);
    float w2 = 1.0 / (d2 * d2 + 0.08);
    float w3 = 1.0 / (d3 * d3 + 0.08);
    float w4 = 1.0 / (d4 * d4 + 0.08);

    float total = w1 + w2 + w3 + w4;
    vec3 col = (u_c1 * w1 + u_c2 * w2 + u_c3 * w3 + u_c4 * w4) / total;

    float sheen = pow(smoothstep(0.4, 0.9, 1.0 - d3), 3.0);
    col = mix(col, u_c4, sheen * 0.5);

    gl_FragColor = vec4(col * u_intensity, 1.0);
  }
`;

const LIGHT_LEAK_FRAGMENT_SHADER = `
  precision mediump float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform vec3 u_c1;
  uniform vec3 u_c2;
  uniform vec3 u_c3;
  uniform vec3 u_c4;
  uniform float u_intensity;
  varying vec2 v_uv;

  void main() {
    vec2 uv = v_uv;
    float t = u_time * 0.28;

    vec2 lightPos1 = vec2(0.2 + 0.15 * sin(t * 0.5), 0.1 + 0.1 * cos(t * 0.4));
    vec2 lightPos2 = vec2(0.85 + 0.1 * cos(t * 0.3), 0.2 + 0.15 * sin(t * 0.6));

    float dist1 = length(uv - lightPos1);
    float dist2 = length(uv - lightPos2);

    float angle1 = atan(uv.y - lightPos1.y, uv.x - lightPos1.x);
    float rays1 = sin(angle1 * 6.0 + t * 0.6) * 0.5 + 0.5;

    float flare1 = 1.0 / (dist1 * 3.2 + 0.4);
    float flare2 = 1.0 / (dist2 * 4.5 + 0.5);

    vec3 col = u_c3;
    col += u_c2 * flare1 * 0.7 * (0.8 + 0.2 * rays1);
    col += u_c1 * flare2 * 0.8;
    col += u_c4 * (1.0 - dist1 * 0.8) * 0.3;

    gl_FragColor = vec4(col * u_intensity, clamp((flare1 * 0.6 + flare2 * 0.5) * u_intensity, 0.0, 1.0));
  }
`;

function compileShader(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.warn("Shader compile error:", gl.getShaderInfoLog(s));
    gl.deleteShader(s);
    return null;
  }
  return s;
}

export function ShaderBackground({
  variant = "aurora",
  speed = 1.0,
  intensity = 1.0,
  colorPalette,
  className,
  children,
  ...props
}: ShaderBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null);

  useEffect(() => {
    // 1. Accessibility check
    if (typeof window !== "undefined") {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      if (prefersReducedMotion) {
        setHasWebGL(false);
        return;
      }
    }

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // 2. Initialize WebGL
    let gl: WebGLRenderingContext | null = null;
    try {
      gl =
        canvas.getContext("webgl", {
          alpha: false,
          antialias: false,
          powerPreference: "low-power",
        }) ||
        (canvas.getContext(
          "experimental-webgl"
        ) as WebGLRenderingContext | null);
    } catch {
      gl = null;
    }

    if (!gl) {
      setHasWebGL(false);
      return;
    }

    setHasWebGL(true);

    // 3. Compile Shaders
    const fragSrc =
      variant === "aurora"
        ? AURORA_FRAGMENT_SHADER
        : variant === "gradient-mesh"
        ? GRADIENT_MESH_FRAGMENT_SHADER
        : LIGHT_LEAK_FRAGMENT_SHADER;

    const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SRC);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, fragSrc);
    if (!vs || !fs) {
      setHasWebGL(false);
      return;
    }

    const program = gl.createProgram();
    if (!program) {
      setHasWebGL(false);
      return;
    }

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn("WebGL link error:", gl.getProgramInfoLog(program));
      setHasWebGL(false);
      return;
    }

    gl.useProgram(program);

    // Fullscreen quad
    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posAttr = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

    // Uniforms
    const uTime = gl.getUniformLocation(program, "u_time");
    const uRes = gl.getUniformLocation(program, "u_resolution");
    const uMouse = gl.getUniformLocation(program, "u_mouse");
    const uC1 = gl.getUniformLocation(program, "u_c1");
    const uC2 = gl.getUniformLocation(program, "u_c2");
    const uC3 = gl.getUniformLocation(program, "u_c3");
    const uC4 = gl.getUniformLocation(program, "u_c4");
    const uIntensity = gl.getUniformLocation(program, "u_intensity");

    let palette: [number, number, number][] = DEFAULT_PALETTES[variant];
    if (colorPalette && colorPalette.length === 4) {
      palette = colorPalette.map(hexToRgb);
    }

    gl.uniform3fv(uC1, palette[0]);
    gl.uniform3fv(uC2, palette[1]);
    gl.uniform3fv(uC3, palette[2]);
    gl.uniform3fv(uC4, palette[3]);
    gl.uniform1f(uIntensity, intensity);
    gl.uniform2f(uMouse, 0.5, 0.5);

    // 4. Resize Handling
    let animId = 0;
    let isVisible = true;
    let startTime = performance.now();
    let mouseX = 0.5;
    let mouseY = 0.5;
    let targetMouseX = 0.5;
    let targetMouseY = 0.5;

    const resize = () => {
      if (!canvas || !container || !gl) return;
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.floor(rect.width * dpr);
      const h = Math.floor(rect.height * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = Math.max(w, 1);
        canvas.height = Math.max(h, 1);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(uRes, canvas.width, canvas.height);
      }
    };

    resize();
    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(container);

    const handleMouseMove = (e: MouseEvent) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      targetMouseX = (e.clientX - rect.left) / rect.width;
      targetMouseY = 1.0 - (e.clientY - rect.top) / rect.height;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // 5. Battery saver: Pause when scrolled off screen
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisible = entry?.isIntersecting ?? false;
        if (isVisible && !animId) {
          startTime = performance.now();
          loop();
        } else if (!isVisible && animId) {
          cancelAnimationFrame(animId);
          animId = 0;
        }
      },
      { threshold: 0.05 }
    );
    intersectionObserver.observe(container);

    // 6. 60 FPS Loop
    const loop = () => {
      if (!isVisible || !gl) return;
      const elapsed = (performance.now() - startTime) * 0.001 * speed;
      gl.uniform1f(uTime, elapsed);

      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;
      gl.uniform2f(uMouse, mouseX, mouseY);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      if (animId) cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      if (gl) {
        gl.deleteBuffer(quadBuffer);
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
      }
    };
  }, [variant, speed, intensity, colorPalette]);

  const fallbackGradients: Record<ShaderVariant, string> = {
    aurora:
      "bg-gradient-to-tr from-emerald-950 via-teal-900 to-emerald-800",
    "gradient-mesh":
      "bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950",
    "light-leak":
      "bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.4),rgba(4,47,46,0.9),transparent_70%)]",
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={cn(
          "absolute inset-0 h-full w-full pointer-events-none transition-opacity duration-700",
          hasWebGL ? "opacity-100" : "opacity-0"
        )}
      />

      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 pointer-events-none transition-opacity duration-700",
          fallbackGradients[variant],
          hasWebGL ? "opacity-0" : "opacity-100"
        )}
      />

      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
}
