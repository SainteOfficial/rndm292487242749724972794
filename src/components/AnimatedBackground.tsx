import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export const AnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles: Particle[] = [];
    const particleCount = 50;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      opacity: number;
      direction: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color = `rgba(${Math.random() * 50 + 150}, ${
          Math.random() * 50 + 150
        }, ${Math.random() * 50 + 150}, 0.5)`;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.direction = Math.random() > 0.5 ? 1 : -1;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.opacity += 0.01 * this.direction;

        if (this.opacity >= 0.7 || this.opacity <= 0.2) {
          this.direction *= -1;
        }

        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = `rgba(${parseInt(this.color.split(',')[0].slice(5))}, 
                              ${parseInt(this.color.split(',')[1])}, 
                              ${parseInt(this.color.split(',')[2])}, 
                              ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const drawGradient = () => {
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2
      );
      gradient.addColorStop(0, '#13141d');
      gradient.addColorStop(0.5, '#0f1018');
      gradient.addColorStop(1, '#10101a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      drawGradient();
      
      particles.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      gsap.to({}, {
        duration: 0,
        onComplete: () => requestAnimationFrame(animate),
      });
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
    />
  );
};