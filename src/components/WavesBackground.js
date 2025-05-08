// src/components/WavesBackground.js
import React, { useEffect, useRef } from 'react';

const WavesBackground = ({ color = 'rgba(79, 172, 254, 0.15)' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Hacer que el canvas ocupe todo el espacio disponible
    const resizeCanvas = () => {
      const parentElement = canvas.parentElement;
      if (parentElement) {
        canvas.width = parentElement.offsetWidth;
        canvas.height = parentElement.offsetHeight;
      }
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Configuración para las olas - VELOCIDAD AUMENTADA
    const waves = [
      { y: 0.3, length: 0.5, amplitude: 18, speed: 0.006 }, // Velocidad duplicada y amplitud aumentada
      { y: 0.4, length: 0.7, amplitude: 25, speed: 0.004 }, // Velocidad duplicada y amplitud aumentada
      { y: 0.5, length: 0.9, amplitude: 20, speed: 0.003 }, // Velocidad triplicada y amplitud aumentada
    ];
    
    let animationFrameId;
    let time = 0;
    
    // Función para dibujar las olas
    const drawWaves = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      waves.forEach(wave => {
        ctx.beginPath();
        
        // Dibujar cada ola
        for (let x = 0; x <= canvas.width; x++) {
          const dx = x / canvas.width;
          const y = wave.y * canvas.height + 
                   Math.sin(dx * wave.length * Math.PI * 2 + time * wave.speed * Math.PI * 2) * 
                   wave.amplitude;
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        // Completar el camino hasta la parte inferior
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        
        // Color de la ola con gradiente
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, color);
        gradient.addColorStop(0.5, 'rgba(0, 242, 254, 0.1)');
        gradient.addColorStop(1, color);
        
        ctx.fillStyle = gradient;
        ctx.fill();
      });
      
      // Incremento de tiempo aumentado para animación más rápida
      time += 0.015; // Aumentado desde 0.01
      animationFrameId = requestAnimationFrame(drawWaves);
    };
    
    drawWaves();
    
    // Limpieza
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [color]);
  
  return (
    <canvas 
      ref={canvasRef} 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none', // Para que no interfiera con los clics
      }} 
    />
  );
};

export default WavesBackground;