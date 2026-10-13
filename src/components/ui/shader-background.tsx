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

// Premium emerald / teal / silk white palette for Sogd Realty
const DEFAULT_PALETTES: Record<ShaderVariant, [number, number, number][]> = {
  aurora: [
    [0.02, 0.59, 0.41], // Emerald #059669
    [0.05, 0.58, 0.53], // Teal #0D9488
    [0.08, 0.72, 0.65], // Vibrant mint/cyan #14B8A6
    [1.0, 1.0, 1.0],    // Silk white #FFFFFF
  ],
  "gradient-mesh": [
    [0.02, 0.59, 0.41], // Emerald #059669
    [0.05, 0.58, 0.53], // Deep teal #0D9488
    [0.18, 0.83, 0.75], // Mint highlight #2DD4BF
    [0.96, 0.99, 0.98], // Pearl white #F5FBF9
  ],
  "light-leak": [
    [0.05, 0.58, 0.53], // Teal #0D9488
    [0.96, 0.85, 0.55], // Soft sunbeam amber
    [0.02, 0.59, 0.41], // Emerald #059669
    [1.0, 1.0, 1.0],    // White
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

// Fluid silk waves shader (aurora)
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

  void main() {
    vec2 uv = v_uv;
    float aspect = u_resolution.x / max(u_resolution.y, 1.0);
    vec2 p = uv;
    p.x *= aspect;

    float t = u_time * 0.35;

    // Fluid undulating wave layers
    float w1 = sin(p.x * 1.8 + t * 0.7 + sin(p.y * 2.2 + t * 0.4) * 1.2);
    float w2 = cos(p.y * 2.0 - t * 0.5 + cos(p.x * 1.9 + t * 0.6) * 1.0);
    float w3 = sin((p.x + p.y) * 1.4 + t * 0.8);

    // Mouse interactive ripple
    vec2 m = u_mouse;
    m.x *= aspect;
    float mDist = length(p - m);
    float mInfluence = smoothstep(0.8, 0.0, mDist) * 0.25;

    float waveSum = (w1 + w2 + w3) / 3.0 + mInfluence;
    float norm = clamp(waveSum * 0.5 + 0.5, 0.0, 1.0);

    // Harmonious gradient blending
    vec3 col = mix(u_c1, u_c2, smoothstep(0.15, 0.65, norm));
    col = mix(col, u_c3, smoothstep(0.45, 0.85, norm + 0.15 * sin(t + p.x)));

    // Silk white light crest
    float crest = pow(smoothstep(0.6, 0.95, norm), 2.2);
    col = mix(col, u_c4, crest * 0.8);

    // Soft border fading
    float vig = 1.0 - length(v_uv - 0.5) * 0.45;
    vig = clamp(vig, 0.0, 1.0);

    gl_FragColor = vec4(col, clamp(u_intensity * vig, 0.0, 1.0));
  }
`;

// Smooth orbital gradient mesh
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
    float t = u_time * 0.3;

    // 4 orbital attractor centers
    vec2 p1 = vec2(0.25 + 0.2 * sin(t * 0.6), 0.25 + 0.2 * cos(t * 0.4));
    vec2 p2 = vec2(0.75 + 0.2 * cos(t * 0.5), 0.35 + 0.2 * sin(t * 0.7));
    vec2 p3 = vec2(0.50 + 0.25 * sin(t * 0.8), 0.80 + 0.15 * cos(t * 0.5));
    vec2 p4 = vec2(0.20 + 0.15 * cos(t * 0.3), 0.75 + 0.2 * sin(t * 0.6));

    float d1 = length(uv - p1);
    float d2 = length(uv - p2);
    float d3 = length(uv - p3);
    float d4 = length(uv - p4);

    float w1 = 1.0 / (d1 * d1 + 0.09);
    float w2 = 1.0 / (d2 * d2 + 0.09);
    float w3 = 1.0 / (d3 * d3 + 0.09);
    float w4 = 1.0 / (d4 * d4 + 0.09);

    float total = w1 + w2 + w3 + w4;
    vec3 col = (u_c1 * w1 + u_c2 * w2 + u_c3 * w3 + u_c4 * w4) / total;

    // Silk sheen highlight
    float sheen = pow(smoothstep(0.4, 0.9, 1.0 - d3), 3.0);
    col = mix(col, u_c4, sheen * 0.4);

    gl_FragColor = vec4(col, clamp(u_intensity * 0.9, 0.0, 1.0));
  }
`;

// Subtle light leak
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
    float t = u_time * 0.25;

    vec2 lightPos1 = vec2(0.2 + 0.15 * sin(t * 0.5), 0.1 + 0.1 * cos(t * 0.4));
    vec2 lightPos2 = vec2(0.85 + 0.1 * cos(t * 0.3), 0.2 + 0.15 * sin(t * 0.6));

    float dist1 = length(uv - lightPos1);
    float dist2 = length(uv - lightPos2);

    float angle1 = atan(uv.y - lightPos1.y, uv.x - lightPos1.x);
    float rays1 = sin(angle1 * 6.0 + t * 0.6) * 0.5 + 0.5;

    float flare1 = 1.0 / (dist1 * 3.2 + 0.4);
    float flare2 = 1.0 / (dist2 * 4.5 + 0.5);

    vec3 col = u_c4;
    col += u_c2 * flare1 * 0.65 * (0.8 + 0.2 * rays1);
    col += u_c1 * flare2 * 0.75;
    col += u_c3 * (1.0 - dist1 * 0.8) * 0.25;

    gl_FragColor = vec4(col, clamp((flare1 * 0.5 + flare2 * 0.4) * u_intensity, 0.0, 0.85));
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

    // 2. Initialize WebGL
    let gl: WebGLRenderingContext | null = null;
    try {
      gl =
        canvas.getContext("webgl", {
          alpha: true,
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

    // Quad geometry covering viewport
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
    const uMouse = gl.getUniformLocation(program, "u_mouse");
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
    gl.uniform2f(uMouse, 0.5, 0.5);

    // 4. Resize Handling with clamped DPR for mobile performance
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

    // Mouse move listener with smooth damping
    const handleMouseMove = (e: MouseEvent) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      targetMouseX = (e.clientX - rect.left) / rect.width;
      targetMouseY = 1.0 - (e.clientY - rect.top) / rect.height;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

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

    // 6. 60 FPS Animation loop
    const loop = () => {
      if (!isVisible || !gl) return;
      const elapsed = (performance.now() - startTime) * 0.001 * speed;
      gl.uniform1f(uTime, elapsed);

      // Smooth mouse interpolation
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

  // Fallback CSS Gradient classes when WebGL is disabled or on reduced motion
  const fallbackGradients: Record<ShaderVariant, string> = {
    aurora:
      "bg-gradient-to-tr from-emerald-100/90 via-teal-50 to-white dark:from-emerald-950 dark:via-teal-900/40 dark:to-slate-950",
    "gradient-mesh":
      "bg-gradient-to-br from-emerald-100/80 via-teal-100/40 to-white dark:from-emerald-900/40 dark:via-slate-900 dark:to-teal-900/30",
    "light-leak":
      "bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.2),rgba(255,255,255,0.9),transparent_70%)]",
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
          "absolute inset-0 h-full w-full pointer-events-none transition-opacity duration-700",
          hasWebGL ? "opacity-100" : "opacity-0"
        )}
      />

      {/* Fallback CSS Gradient layer */}
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 pointer-events-none transition-opacity duration-700",
          fallbackGradients[variant],
          hasWebGL ? "opacity-0" : "opacity-100"
        )}
      />

      {/* Content wrapper */}
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
}
