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

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  alpha: number;
  maxAlpha: number;
  decay: number;
}

@Component({
  selector: 'app-particle-background',
  standalone: true,
  templateUrl: './particle-background.component.html',
  styleUrl: './particle-background.component.css',
})
export class ParticleBackgroundComponent implements OnInit, OnDestroy {
  @ViewChild('starCanvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx: CanvasRenderingContext2D | null = null;
  private animationFrameId: number | null = null;
  private particles: StarParticle[] = [];
  private shootingStars: ShootingStar[] = [];
  private mouse = { x: -1000, y: -1000, radius: 100 };
  private isBrowser: boolean;
  private boundResizeHandler = () => this.onWindowResize();
  private nextShootingStarTimer = 0;

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

    const count = width < 768 ? 90 : 190;
    this.particles = [];
    this.shootingStars = [];

    for (let i = 0; i < count; i++) {
      this.particles.push(this.createStar(width, height));
    }
  }

  private createStar(width: number, height: number): StarParticle {
    const size = Math.random() * 0.8 + 0.35;
    const speed = Math.random() * 0.3 + 0.1;
    const angle = (Math.PI / 180) * 40; // Drift angle

    return {
      x: Math.random() * width,
      y: Math.random() * height,
      size,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      alpha: Math.random(),
      alphaMin: Math.random() * 0.15 + 0.05,
      alphaMax: Math.random() * 0.5 + 0.5,
      alphaSpeed: (Math.random() * 0.008 + 0.003) * (Math.random() > 0.5 ? 1 : -1),
      spikes: 5,
    };
  }

  private spawnShootingStar(width: number, height: number): void {
    const angle = (Math.PI / 180) * (30 + Math.random() * 25);
    const speed = Math.random() * 6 + 8;
    this.shootingStars.push({
      x: Math.random() * (width * 0.7),
      y: Math.random() * (height * 0.3),
      length: Math.random() * 80 + 60,
      speed,
      angle,
      alpha: 0,
      maxAlpha: Math.random() * 0.6 + 0.4,
      decay: Math.random() * 0.015 + 0.01,
    });
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

    // Draw and update star particles
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      p.x += p.vx;
      p.y += p.vy;

      if (p.x > width + 10) p.x = -10;
      if (p.x < -10) p.x = width + 10;
      if (p.y > height + 10) p.y = -10;
      if (p.y < -10) p.y = height + 10;

      p.alpha += p.alphaSpeed;
      if (p.alpha > p.alphaMax || p.alpha < p.alphaMin) {
        p.alphaSpeed = -p.alphaSpeed;
      }
      p.alpha = Math.max(0.05, Math.min(1, p.alpha));

      let currentSize = p.size;
      let currentAlpha = p.alpha;

      const dx = this.mouse.x - p.x;
      const dy = this.mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < this.mouse.radius && dist > 0) {
        const factor = (this.mouse.radius - dist) / this.mouse.radius;
        currentSize += factor * 0.9;
        currentAlpha = Math.min(1, currentAlpha + factor * 0.4);

        p.x -= (dx / dist) * factor * 0.6;
        p.y -= (dy / dist) * factor * 0.6;
      }

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

    // Manage and draw shooting stars (meteors)
    this.nextShootingStarTimer++;
    if (this.nextShootingStarTimer > 180 + Math.random() * 220) {
      this.spawnShootingStar(width, height);
      this.nextShootingStarTimer = 0;
    }

    for (let i = this.shootingStars.length - 1; i >= 0; i--) {
      const ss = this.shootingStars[i];
      ss.x += Math.cos(ss.angle) * ss.speed;
      ss.y += Math.sin(ss.angle) * ss.speed;
      ss.alpha += 0.05;
      if (ss.alpha > ss.maxAlpha) {
        ss.maxAlpha -= ss.decay;
      }

      if (ss.maxAlpha <= 0 || ss.x > width || ss.y > height) {
        this.shootingStars.splice(i, 1);
        continue;
      }

      const grad = this.ctx.createLinearGradient(
        ss.x,
        ss.y,
        ss.x - Math.cos(ss.angle) * ss.length,
        ss.y - Math.sin(ss.angle) * ss.length
      );
      grad.addColorStop(0, `rgba(224, 242, 254, ${Math.max(0, ss.maxAlpha)})`);
      grad.addColorStop(1, 'rgba(56, 189, 248, 0)');

      this.ctx.save();
      this.ctx.strokeStyle = grad;
      this.ctx.lineWidth = 1.5;
      this.ctx.beginPath();
      this.ctx.moveTo(ss.x, ss.y);
      this.ctx.lineTo(
        ss.x - Math.cos(ss.angle) * ss.length,
        ss.y - Math.sin(ss.angle) * ss.length
      );
      this.ctx.stroke();
      this.ctx.restore();
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

    ctx.fillStyle = `rgba(224, 242, 254, ${alpha})`;
    ctx.shadowBlur = 4;
    ctx.shadowColor = `rgba(56, 189, 248, ${alpha * 0.75})`;
    ctx.fill();
    ctx.restore();
  }
}
