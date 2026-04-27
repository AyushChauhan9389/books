"use client";

import { useEffect, useRef } from "react";

/**
 * Renders a 3D Minecraft skin using skinview3d (Three.js-based).
 * Dynamically imports skinview3d in useEffect to avoid SSR issues.
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
  const viewerRef = useRef<unknown>(null);

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
        // Transparent background so it composites over the page
        preserveDrawingBuffer: false,
        enableControls: false,
      });

      // Transparent bg
      viewer.renderer.setClearColor(0x000000, 0);

      // Use skinview3d's built-in camera — just set FOV and zoom
      viewer.fov = 30;
      viewer.zoom = 0.9;

      // Soft lighting
      viewer.globalLight.intensity = 3.0;
      viewer.cameraLight.intensity = 0.4;

      // Gentle idle animation
      viewer.animation = new skinview3d.IdleAnimation();
      viewer.animation.speed = 0.5;

      viewer.autoRotate = false;

      // Very slight rotation so it's not perfectly flat — just a hint of 3D
      viewer.playerWrapper.rotation.y = 0.15;

      viewerRef.current = viewer;
    })();

    return () => {
      disposed = true;
      if (viewerRef.current) {
        (viewerRef.current as { dispose: () => void }).dispose();
        viewerRef.current = null;
      }
    };
  }, [src, width, height]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width, height, display: "block" }}
    />
  );
}
