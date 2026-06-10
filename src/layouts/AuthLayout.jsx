import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Beaker, Atom, Microscope, BookOpen, Sparkles } from 'lucide-react';

const slides = [
  {
    icon: Beaker,
    title: 'Domina la Química con ChemSystem',
    desc: 'La plataforma SaaS líder que transforma la educación científica a través de laboratorios virtuales y analítica avanzada.',
    color: 'text-secondary',
  },
  {
    icon: Atom,
    title: 'Simuladores Moleculares Interactivos',
    desc: 'Explora reacciones químicas en 3D con motores físicos realistas. Ajusta temperatura, presión y concentraciones en tiempo real.',
    color: 'text-blue-300',
  },
  {
    icon: Microscope,
    title: 'Predicciones con Inteligencia Artificial',
    desc: 'Obtén análisis predictivos de rendimiento, estabilidad y eficiencia catalítica impulsados por machine learning.',
    color: 'text-purple-300',
  },
  {
    icon: BookOpen,
    title: 'Ruta de Aprendizaje Personalizada',
    desc: 'La IA adapta los módulos educativos a tu ritmo. Recibe recomendaciones inteligentes para mejorar tu desempeño.',
    color: 'text-emerald-300',
  },
];

const AuthLayout = ({ children, title, subtitle }) => {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = slides[current];

  return (
    <div className="min-h-screen w-full flex bg-background overflow-hidden">
      {/* Left Panel - Slider/Branding */}
      <div className="hidden lg:flex w-1/2 relative bg-primary-dark items-center justify-center overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-accent/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[100px]" />
        
        <div className="relative z-10 text-center px-12 max-w-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 mb-8">
                <slide.icon size={48} className={slide.color} />
              </div>
              
              <h1 className="text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight">
                {slide.title}
              </h1>
              
              <p className="text-lg xl:text-xl text-white/70 max-w-md mx-auto leading-relaxed">
                {slide.desc}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div className="mt-12 flex gap-3 justify-center">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrent(idx)}
                className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === current
                    ? 'bg-white scale-110 shadow-md'
                    : 'bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-20 overflow-y-auto">
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-full max-w-md"
        >
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-text-main mb-2">{title}</h2>
            <p className="text-text-secondary">{subtitle}</p>
          </div>
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
