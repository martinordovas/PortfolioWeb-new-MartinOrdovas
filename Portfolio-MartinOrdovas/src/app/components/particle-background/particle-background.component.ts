import {
  Component,
  ElementRef,
  Inject,
  NgZone,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface StarParticle {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  alpha: number;
  alphaMin: number;
  alphaMax: number;
  alphaSpeed: number;
  spikes: number;
}

@Component({
  selector: 'app-particle-background',
  standalone: true,
  templateUrl: './particle-background.component.html',
  styles: [
    `
      :host {
        display: contents;
      }
    `,
  ],
})
export class ParticleBackgroundComponent implements OnInit, OnDestroy {
  @ViewChild('starCanvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx: CanvasRenderingContext2D | null = null;
  private animationFrameId: number | null = null;
  private particles: StarParticle[] = [];
  private mouse = { x: -1000, y: -1000, radius: 100 };
  private isBrowser: boolean;
  private boundResizeHandler = () => this.onWindowResize();

  constructor(
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser || typeof window === 'undefined') return;

    this.initCanvas();
    if (!this.ctx || typeof this.ctx.clearRect !== 'function') return;

    window.addEventListener('resize', this.boundResizeHandler);
    this.createParticles();
    this.startAnimation();
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.boundResizeHandler);
    }
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  onMouseMove(event: MouseEvent): void {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    this.mouse.x = event.clientX - rect.left;
    this.mouse.y = event.clientY - rect.top;
  }

  onMouseLeave(): void {
    this.mouse.x = -1000;
    this.mouse.y = -1000;
  }

  private initCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext ? canvas.getContext('2d', { alpha: true }) : null;
    if (this.ctx) {
      this.updateCanvasDimensions();
    }
  }

  private onWindowResize(): void {
    this.updateCanvasDimensions();
    this.createParticles();
  }

  private updateCanvasDimensions(): void {
    const canvas = this.canvasRef.nativeElement;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth;
    const height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    if (this.ctx) {
      this.ctx.resetTransform();
      this.ctx.scale(dpr, dpr);
    }
  }

  private createParticles(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Density of fine stars
    const count = width < 768 ? 90 : 180;
    this.particles = [];

    for (let i = 0; i < count; i++) {
      this.particles.push(this.createStar(width, height));
    }
  }

  private createStar(width: number, height: number): StarParticle {
    // Smaller, delicate star size (0.35px to 1.1px)
    const size = Math.random() * 0.75 + 0.35;
    const speed = Math.random() * 0.35 + 0.15; // Gentle natural drift
    const angle = (Math.PI / 180) * 45; // Drift bottom-right (45 deg)

    return {
      x: Math.random() * width,
      y: Math.random() * height,
      size,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      alpha: Math.random(),
      alphaMin: Math.random() * 0.15 + 0.05,
      alphaMax: Math.random() * 0.45 + 0.55,
      alphaSpeed: (Math.random() * 0.008 + 0.004) * (Math.random() > 0.5 ? 1 : -1),
      spikes: 5,
    };
  }

  private startAnimation(): void {
    this.ngZone.runOutsideAngular(() => {
      const render = () => {
        this.drawScene();
        this.animationFrameId = requestAnimationFrame(render);
      };
      this.animationFrameId = requestAnimationFrame(render);
    });
  }

  private drawScene(): void {
    if (!this.ctx) return;
    const canvas = this.canvasRef.nativeElement;
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Update position
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges
      if (p.x > width + 10) p.x = -10;
      if (p.x < -10) p.x = width + 10;
      if (p.y > height + 10) p.y = -10;
      if (p.y < -10) p.y = height + 10;

      // Twinkle opacity
      p.alpha += p.alphaSpeed;
      if (p.alpha > p.alphaMax || p.alpha < p.alphaMin) {
        p.alphaSpeed = -p.alphaSpeed;
      }
      p.alpha = Math.max(0.04, Math.min(1, p.alpha));

      // Mouse interactivity (gentle delicate highlight)
      let currentSize = p.size;
      let currentAlpha = p.alpha;

      const dx = this.mouse.x - p.x;
      const dy = this.mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < this.mouse.radius && dist > 0) {
        const factor = (this.mouse.radius - dist) / this.mouse.radius;
        currentSize += factor * 0.8;
        currentAlpha = Math.min(1, currentAlpha + factor * 0.35);

        // Subtle displacement away from cursor
        p.x -= (dx / dist) * factor * 0.5;
        p.y -= (dy / dist) * factor * 0.5;
      }

      // Draw delicate 5-pointed star
      this.drawStarShape(
        this.ctx,
        p.x,
        p.y,
        p.spikes,
        currentSize * 1.5,
        currentSize * 0.6,
        currentAlpha
      );
    }
  }

  private drawStarShape(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    spikes: number,
    outerRadius: number,
    innerRadius: number,
    alpha: number
  ): void {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);

    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();

    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.shadowBlur = 3;
    ctx.shadowColor = `rgba(255, 235, 245, ${alpha * 0.6})`;
    ctx.fill();
    ctx.restore();
  }
}
