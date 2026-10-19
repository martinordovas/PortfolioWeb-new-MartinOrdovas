import {
  Component,
  ElementRef,
  Inject,
  NgZone,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  signal,
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
  template: `
    <div class="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none">
      <!-- Mountain & sky background with cosmic glow -->
      <div
        class="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
        style="background-image: url('images/background.jpg');"
      ></div>

      <!-- Atmospheric gradient overlay for depth and contrast -->
      <div
        class="absolute inset-0 bg-gradient-to-b from-purple-950/20 via-black/30 to-black/75"
      ></div>

      <!-- Dynamic Canvas Starfield -->
      <canvas
        #starCanvas
        class="absolute inset-0 w-full h-full pointer-events-auto"
        (mousemove)="onMouseMove($event)"
        (mouseleave)="onMouseLeave()"
      ></canvas>
    </div>
  `,
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
  private mouse = { x: -1000, y: -1000, radius: 120 };
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

    // Responsive star count: ~80 on mobile, ~160 on desktop
    const count = width < 768 ? 75 : 150;
    this.particles = [];

    for (let i = 0; i < count; i++) {
      this.particles.push(this.createStar(width, height));
    }
  }

  private createStar(width: number, height: number): StarParticle {
    const size = Math.random() * 1.8 + 0.6;
    const speed = Math.random() * 0.4 + 0.2; // Smooth gentle drift
    const angle = (Math.PI / 180) * 45; // Drift bottom-right (45 degrees)

    return {
      x: Math.random() * width,
      y: Math.random() * height,
      size,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      alpha: Math.random(),
      alphaMin: Math.random() * 0.2 + 0.1,
      alphaMax: Math.random() * 0.5 + 0.5,
      alphaSpeed: (Math.random() * 0.01 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
      spikes: 5,
    };
  }

  private startAnimation(): void {
    // Run outside Angular zone so tick does not trigger change detection on every frame
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
      if (p.x > width + 20) p.x = -20;
      if (p.x < -20) p.x = width + 20;
      if (p.y > height + 20) p.y = -20;
      if (p.y < -20) p.y = height + 20;

      // Twinkle opacity
      p.alpha += p.alphaSpeed;
      if (p.alpha > p.alphaMax || p.alpha < p.alphaMin) {
        p.alphaSpeed = -p.alphaSpeed;
      }
      p.alpha = Math.max(0.05, Math.min(1, p.alpha));

      // Mouse interactivity (gentle repulse / flare)
      let currentSize = p.size;
      let currentAlpha = p.alpha;

      const dx = this.mouse.x - p.x;
      const dy = this.mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < this.mouse.radius && dist > 0) {
        const factor = (this.mouse.radius - dist) / this.mouse.radius;
        currentSize += factor * 1.5;
        currentAlpha = Math.min(1, currentAlpha + factor * 0.4);

        // Gentle displacement away from cursor
        p.x -= (dx / dist) * factor * 0.8;
        p.y -= (dy / dist) * factor * 0.8;
      }

      // Draw 5-pointed star
      this.drawStarShape(this.ctx, p.x, p.y, p.spikes, currentSize * 2, currentSize, currentAlpha);
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
    ctx.shadowBlur = 6;
    ctx.shadowColor = `rgba(255, 220, 240, ${alpha * 0.7})`;
    ctx.fill();
    ctx.restore();
  }
}
