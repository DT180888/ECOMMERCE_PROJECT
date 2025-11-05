import { useEffect, useRef } from "react";
import { NeatGradient, NeatConfig } from "@firecms/neat";

const NEAT_CONFIG: NeatConfig = {
  colors: [
    { color: "#FF5373", enabled: true },
    { color: "#17E7FF", enabled: true },
    { color: "#FFC858", enabled: true },
    { color: "#6D3BFF", enabled: true },
    { color: "#f5e1e5", enabled: false },
  ],
  speed: 6,
  horizontalPressure: 7,
  verticalPressure: 8,
  waveFrequencyX: 2,
  waveFrequencyY: 1,
  waveAmplitude: 10,
  shadows: 3,
  highlights: 6,
  colorBrightness: 0.95,
  colorSaturation: -8,
  wireframe: false,
  colorBlending: 10,
  backgroundColor: "#003FFF",
  backgroundAlpha: 1,
  grainScale: 0,
  grainSparsity: 0,
  grainIntensity: 0,
  grainSpeed: 1,
  resolution: 1.3,
  yOffset: 0,
};

export default function NeatBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gradientRef = useRef<NeatGradient | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Khởi tạo hiệu ứng NEAT
    const gradient = new NeatGradient({
      ref: canvasRef.current,
      ...NEAT_CONFIG,
    });

    gradientRef.current = gradient;

    return () => {
      gradient.destroy();
      gradientRef.current = null;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        pointerEvents: "none",
      }}
    />
  );
}
