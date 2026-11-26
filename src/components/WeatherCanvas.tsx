import React, { useEffect, useRef } from 'react';
import { WeatherCondition } from '../types';

interface WeatherCanvasProps {
  condition: WeatherCondition;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  phase: number;
}

export const WeatherCanvas: React.FC<WeatherCanvasProps> = ({ condition }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    const count =
      condition === 'rain' || condition === 'thunderstorm'
        ? 95
        : condition === 'snow'
          ? 65
          : condition === 'windy'
            ? 35
            : 25;

    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx:
        condition === 'rain' || condition === 'thunderstorm'
          ? -2.5
          : condition === 'windy'
            ? 7 + Math.random() * 5
            : (Math.random() - 0.5) * 0.8,
      vy:
        condition === 'rain' || condition === 'thunderstorm'
          ? 11 + Math.random() * 6
          : condition === 'snow'
            ? 1.2 + Math.random() * 1.5
            : condition === 'windy'
              ? (Math.random() - 0.5) * 1.2
              : -0.4 - Math.random() * 0.4,
      size:
        condition === 'snow'
          ? 2 + Math.random() * 3.5
          : condition === 'sunny'
            ? 2 + Math.random() * 3
            : 1 + Math.random() * 1.5,
      alpha: 0.25 + Math.random() * 0.55,
      phase: Math.random() * Math.PI * 2,
    }));

    let flashAlpha = 0;
    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      if (condition === 'thunderstorm') {
        if (Math.random() < 0.008) {
          flashAlpha = 0.32;
        }
        if (flashAlpha > 0.01) {
          ctx.fillStyle = `rgba(224, 242, 254, ${flashAlpha})`;
          ctx.fillRect(0, 0, width, height);
          flashAlpha *= 0.86;
        }
      }

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (condition === 'snow') {
          p.x += Math.sin(frame * 0.02 + p.phase) * 0.6;
        }

        if (p.y > height + 20) {
          p.y = -15;
          p.x = Math.random() * width;
        } else if (p.y < -20) {
          p.y = height + 15;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) p.x = -15;
        if (p.x < -20) p.x = width + 15;

        if (condition === 'rain' || condition === 'thunderstorm') {
          ctx.strokeStyle = `rgba(125, 211, 252, ${p.alpha})`;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.vx * 1.2, p.y + p.vy * 1.2);
          ctx.stroke();
        } else if (condition === 'snow') {
          ctx.fillStyle = `rgba(241, 245, 249, ${p.alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (condition === 'windy') {
          ctx.strokeStyle = `rgba(167, 243, 208, ${p.alpha * 0.6})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - 24, p.y);
          ctx.stroke();
        } else if (condition === 'sunny') {
          ctx.fillStyle = `rgba(253, 224, 71, ${p.alpha * 0.5})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = `rgba(203, 213, 225, ${p.alpha * 0.25})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 6, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [condition]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full rounded-3xl"
      aria-hidden="true"
    />
  );
};
