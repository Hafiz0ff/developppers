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

// Default luxury emerald / Sughd palette: deep emerald, vibrant teal, sky highlight, deep slate
const DEFAULT_PALETTES: Record<ShaderVariant, [number, number, number][]> = {
  aurora: [
    [0.05, 0.58, 0.53], // Emerald #0D9488
    [0.02, 0.38, 0.28], // Deep forest #065F46
    [0.06, 0.73, 0.65], // Bright teal #10B981
    [0.01, 0.17, 0.14], // Midnight #022C22
  ],
  "gradient-mesh": [
    [0.05, 0.58, 0.53], // #0D9488 (Teal)
    [0.13, 0.77, 0.65], // #22C55E (Mint/Emerald)
    [0.02, 0.29, 0.24], // #044E3F
    [0.08, 0.12, 0.19], // Slate night #131F30
  ],
  "light-leak": [
    [0.15, 0.68, 0.6], // Vibrant cyan-teal
    [0.92, 0.76, 0.35], // Warm gold sun reflection
    [0.05, 0.45, 0.38], // Deep jade
    [0.02, 0.1, 0.08], // Base
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

const AURORA_FRAGMENT_SHADER = `
  precision mediump float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_c1;
  uniform vec3 u_c2;
  uniform vec3 u_c3;
  uniform vec3 u_c4;
  uniform float u_intensity;
  varying vec2 v_uv;

  float wave(vec2 uv, float t, float freq, float speed) {
    return sin(uv.x * freq + t * speed) * cos(uv.y * (freq * 0.7) - t * (speed * 0.8));
  }

  void main() {
    vec2 uv = v_uv;
    float t = u_time * 0.35;

    // Undulating wave coordinates
    float w1 = wave(uv, t, 3.2, 0.8) * 0.25;
    float w2 = wave(uv + vec2(0.5, 0.2), t * 1.2, 4.5, -0.6) * 0.2;
    float w3 = wave(uv - vec2(0.3, 0.7), t * 0.7, 2.1, 0.5) * 0.3;

    vec2 p = uv + vec2(w1 + w2, w2 + w3);

    // Layered color gradients
    vec3 col = mix(u_c4, u_c2, clamp(p.y * 1.2, 0.0, 1.0));
    col = mix(col, u_c1, clamp(w1 * 2.5 + (1.0 - p.x), 0.0, 1.0));
    col = mix(col, u_c3, clamp((w2 + w3) * 3.0, 0.0, 1.0));

    // Soft celestial vignette
    float vignette = 1.0 - length((uv - 0.5) * 1.2);
    vignette = clamp(vignette, 0.0, 1.0);

    gl_FragColor = vec4(col * u_intensity, vignette * 0.9);
  }
`;

const GRADIENT_MESH_FRAGMENT_SHADER = `
  precision mediump float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_c1;
  uniform vec3 u_c2;
  uniform vec3 u_c3;
  uniform vec3 u_c4;
  uniform float u_intensity;
  varying vec2 v_uv;

  void main() {
    vec2 uv = v_uv;
    float t = u_time * 0.4;

    // 4 orbital attractor points
    vec2 p1 = vec2(0.3 + 0.2 * sin(t * 0.7), 0.3 + 0.2 * cos(t * 0.5));
    vec2 p2 = vec2(0.7 + 0.2 * cos(t * 0.6), 0.4 + 0.2 * sin(t * 0.8));
    vec2 p3 = vec2(0.5 + 0.25 * sin(t * 0.9), 0.8 + 0.15 * cos(t * 0.7));
    vec2 p4 = vec2(0.2 + 0.15 * cos(t * 0.4), 0.7 + 0.2 * sin(t * 0.6));

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

    // Organic grain micro-texture to avoid color banding
    float grain = fract(sin(dot(uv.xy, vec2(12.9898, 78.233))) * 43758.5453) * 0.03 - 0.015;

    gl_FragColor = vec4((col + grain) * u_intensity, 0.85);
  }
`;

const LIGHT_LEAK_FRAGMENT_SHADER = `
  precision mediump float;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec3 u_c1;
  uniform vec3 u_c2;
  uniform vec3 u_c3;
  uniform vec3 u_c4;
  uniform float u_intensity;
  varying vec2 v_uv;

  void main() {
    vec2 uv = v_uv;
    float t = u_time * 0.3;

    // Light source centers that gently pan
    vec2 lightPos1 = vec2(0.2 + 0.15 * sin(t * 0.5), 0.1 + 0.1 * cos(t * 0.4));
    vec2 lightPos2 = vec2(0.85 + 0.1 * cos(t * 0.3), 0.2 + 0.15 * sin(t * 0.6));

    // Rays radiating from corner
    float dist1 = length(uv - lightPos1);
    float dist2 = length(uv - lightPos2);

    float angle1 = atan(uv.y - lightPos1.y, uv.x - lightPos1.x);
    float rays1 = sin(angle1 * 7.0 + t * 0.8) * 0.5 + 0.5;

    float flare1 = 1.0 / (dist1 * 3.0 + 0.4);
    float flare2 = 1.0 / (dist2 * 4.5 + 0.5);

    vec3 col = u_c4;
    col += u_c2 * flare1 * 0.7 * (0.8 + 0.2 * rays1);
    col += u_c1 * flare2 * 0.8;
    col += u_c3 * (1.0 - dist1 * 0.8) * 0.3;

    gl_FragColor = vec4(col * u_intensity, clamp(flare1 * 0.6 + flare2 * 0.5, 0.0, 0.85));
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
    // 1. Accessibility: Check for prefers-reduced-motion
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

    // 2. Initialize WebGL with error boundary
    let gl: WebGLRenderingContext | null = null;
    try {
      gl =
        canvas.getContext("webgl", {
          alpha: true,
          antialias: false,
          powerPreference: "low-power", // battery optimization for mobile
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

    // Quad geometry covering full screen
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

    // Uniform locations
    const uTime = gl.getUniformLocation(program, "u_time");
    const uRes = gl.getUniformLocation(program, "u_resolution");
    const uC1 = gl.getUniformLocation(program, "u_c1");
    const uC2 = gl.getUniformLocation(program, "u_c2");
    const uC3 = gl.getUniformLocation(program, "u_c3");
    const uC4 = gl.getUniformLocation(program, "u_c4");
    const uIntensity = gl.getUniformLocation(program, "u_intensity");

    // Colors
    let palette: [number, number, number][] = DEFAULT_PALETTES[variant];
    if (colorPalette && colorPalette.length === 4) {
      palette = colorPalette.map(hexToRgb);
    }

    gl.uniform3fv(uC1, palette[0]);
    gl.uniform3fv(uC2, palette[1]);
    gl.uniform3fv(uC3, palette[2]);
    gl.uniform3fv(uC4, palette[3]);
    gl.uniform1f(uIntensity, intensity);

    // 4. Resize Handling with clamped DPR
    let animId = 0;
    let isVisible = true;
    let startTime = performance.now();

    const resize = () => {
      if (!canvas || !container || !gl) return;
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5); // Mobile battery clamp
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

    // 5. IntersectionObserver: Pause when out of screen (battery saving)
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

    // 6. Animation loop
    const loop = () => {
      if (!isVisible || !gl) return;
      const elapsed = (performance.now() - startTime) * 0.001 * speed;
      gl.uniform1f(uTime, elapsed);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      if (animId) cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      if (gl) {
        gl.deleteBuffer(quadBuffer);
        gl.deleteProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
      }
    };
  }, [variant, speed, intensity, colorPalette]);

  // Fallback CSS Gradient classes when WebGL is disabled or on low power mode
  const fallbackGradients: Record<ShaderVariant, string> = {
    aurora:
      "bg-gradient-to-tr from-emerald-950/40 via-teal-900/20 to-emerald-600/10",
    "gradient-mesh":
      "bg-gradient-to-br from-emerald-900/30 via-slate-900/20 to-teal-800/20",
    "light-leak":
      "bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.25),rgba(251,191,36,0.1),transparent_70%)]",
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      {/* Canvas Element */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={cn(
          "absolute inset-0 h-full w-full pointer-events-none transition-opacity duration-1000",
          hasWebGL ? "opacity-100" : "opacity-0"
        )}
      />

      {/* Fallback CSS Gradient layer */}
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 pointer-events-none transition-opacity duration-1000",
          fallbackGradients[variant],
          hasWebGL ? "opacity-20" : "opacity-100"
        )}
      />

      {/* Content wrapper */}
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
}
