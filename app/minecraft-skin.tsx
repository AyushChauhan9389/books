"use client";

import { useCallback, useEffect, useRef } from "react";

interface SkinViewerLike {
  playerObject: {
    skin: {
      head: { rotation: { x: number; y: number } };
    };
  };
  dispose: () => void;
}

/**
 * Renders a 3D Minecraft skin using skinview3d (Three.js-based).
 * The head follows the mouse cursor.
 */
export function MinecraftSkin({
  src,
  width = 160,
  height = 300,
  className,
}: {
  src: string;
  width?: number;
  height?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewerRef = useRef<SkinViewerLike | null>(null);
  // Store current & target head rotation for smooth lerping
  const headRotation = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);

  const onMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height * 0.25; // head is near top quarter

    // Normalise to -1..1 range
    const dx = (e.clientX - centerX) / (window.innerWidth / 2);
    const dy = (e.clientY - centerY) / (window.innerHeight / 2);

    // Clamp rotation so the head doesn't spin around
    const maxYaw = 0.8; // radians
    const maxPitch = 0.5;
    targetRotation.current = {
      x: Math.max(-maxPitch, Math.min(maxPitch, dy * maxPitch)),
      y: Math.max(-maxYaw, Math.min(maxYaw, dx * maxYaw)),
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;

    (async () => {
      const skinview3d = await import("skinview3d");
      if (disposed) return;

      const viewer = new skinview3d.SkinViewer({
        canvas,
        width,
        height,
        skin: src,
        preserveDrawingBuffer: false,
        enableControls: false,
      });

      viewer.renderer.setClearColor(0x000000, 0);
      viewer.fov = 30;
      viewer.zoom = 0.9;
      viewer.globalLight.intensity = 3.0;
      viewer.cameraLight.intensity = 0.4;
      // Wave the right arm while head tracking stays manual
      const wave = new skinview3d.WaveAnimation();
      wave.speed = 0.5;
      viewer.animation = wave;
      viewer.autoRotate = false;
      viewer.playerWrapper.rotation.y = 0.15;

      viewerRef.current = viewer as unknown as SkinViewerLike;

      // Smooth lerp loop for head tracking
      const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
      const tick = () => {
        if (disposed) return;
        const v = viewerRef.current;
        if (v) {
          headRotation.current.x = lerp(headRotation.current.x, targetRotation.current.x, 0.1);
          headRotation.current.y = lerp(headRotation.current.y, targetRotation.current.y, 0.1);
          v.playerObject.skin.head.rotation.x = headRotation.current.x;
          v.playerObject.skin.head.rotation.y = headRotation.current.y;
        }
        rafId.current = requestAnimationFrame(tick);
      };
      rafId.current = requestAnimationFrame(tick);
    })();

    document.addEventListener("mousemove", onMouseMove);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId.current);
      document.removeEventListener("mousemove", onMouseMove);
      if (viewerRef.current) {
        viewerRef.current.dispose();
        viewerRef.current = null;
      }
    };
  }, [src, width, height, onMouseMove]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width, height, display: "block" }}
    />
  );
}
