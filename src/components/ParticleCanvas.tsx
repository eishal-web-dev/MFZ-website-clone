import { useEffect, useRef } from 'react';
import type { Product } from '@/data/products';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  rotation: number;
  vr: number;
}

interface Props {
  product: Product;
  reduced: boolean;
}

export function ParticleCanvas({ product, reduced }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const productRef = useRef(product);
  productRef.current = product;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let particles: Particle[] = [];
    const count = reduced ? 25 : 70;
    let mouseX = 0;
    let mouseY = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };
    canvas.addEventListener('mousemove', onMove);

    const spawn = (): Particle => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const p = productRef.current;
      return {
        x: Math.random() * w,
        y: h + Math.random() * 50,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -(Math.random() * 1.2 + 0.4),
        size: Math.random() * 6 + 2,
        life: 0,
        maxLife: Math.random() * 300 + 200,
        rotation: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.05,
      };
    };

    for (let i = 0; i < count; i++) {
      const p = spawn();
      p.life = Math.random() * p.maxLife;
      p.y = Math.random() * canvas.offsetHeight;
      particles.push(p);
    }

    const drawParticle = (p: Particle) => {
      const c = productRef.current.particleColor;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      const alpha = Math.min(1, (p.maxLife - p.life) / 60) * Math.min(1, p.life / 30);
      ctx.globalAlpha = alpha * 0.8;

      switch (productRef.current.particleType) {
        case 'sparks':
        case 'embers':
          ctx.shadowBlur = 8;
          ctx.shadowColor = c;
          ctx.fillStyle = c;
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 'potato':
          ctx.fillStyle = c;
          ctx.fillRect(-p.size, -p.size, p.size * 2, p.size * 2);
          break;
        case 'ramen':
          ctx.strokeStyle = c;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(-p.size * 2, 0);
          ctx.quadraticCurveTo(0, -p.size, p.size * 2, 0);
          ctx.stroke();
          break;
        case 'herbs':
        case 'chilli':
          ctx.fillStyle = c;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size, p.size * 0.4, 0, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 'flakes':
        case 'crumbs':
        default:
          ctx.fillStyle = c;
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.lineTo(p.size, p.size);
          ctx.lineTo(-p.size, p.size);
          ctx.closePath();
          ctx.fill();
          break;
      }
      ctx.restore();
    };

    const tick = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vr;

        // mouse repel
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          p.x += (dx / dist) * 0.5;
          p.y += (dy / dist) * 0.5;
        }

        if (p.life > p.maxLife || p.y < -20) {
          particles[i] = spawn();
        }
        drawParticle(p);
      });

      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMove);
    };
  }, [reduced]);

  const isDark = (hex: string) => {
    const c = hex.replace('#', '');
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 < 128;
  };

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ mixBlendMode: isDark(product.bgColor) ? 'screen' : 'normal' }}
    />
  );
}
