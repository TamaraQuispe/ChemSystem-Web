import React from 'react';
import { motion } from 'framer-motion';
import { 
  Check, 
  Beaker, 
  Lock, 
  Sparkles, 
  Play, 
  TrendingUp, 
  Smile, 
  Info,
  FlaskConical
} from 'lucide-react';
import { useModuleStore } from '../../store/moduleStore';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export const AIPath = () => {
  const { aiPath } = useModuleStore();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Main Roadmap (Center Column) */}
      <div className="lg:col-span-8 space-y-12">
        <nav className="flex items-center gap-8 border-b border-gray-100 pb-4 mb-8">
          {['Ruta', 'Dashboard', 'Portal', 'Colaboración'].map((tab, i) => (
            <button 
              key={tab} 
              className={`text-sm font-bold transition-all relative ${
                i === 0 ? 'text-primary' : 'text-text-secondary hover:text-primary'
              }`}
            >
              {tab}
              {i === 0 && <motion.div layoutId="activeTab" className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-primary" />}
            </button>
          ))}
        </nav>

        <header className="space-y-4">
          <h1 className="text-5xl font-black text-primary-dark tracking-tight">Ruta de Nivelación</h1>
          <p className="text-lg text-text-secondary max-w-2xl font-medium leading-relaxed">
            Tu mapa de aprendizaje adaptativo basado en el rendimiento del último examen de enlace químico.
          </p>
        </header>

        <div className="relative pl-12 lg:pl-32 pb-20">
          {/* Connecting Path SVG */}
          <svg className="absolute top-0 left-6 lg:left-16 w-32 h-full -z-10" viewBox="0 0 100 800" preserveAspectRatio="none">
            <path
              d="M 50 0 C 80 100 20 200 50 300 C 80 400 20 500 50 600 C 80 700 20 800 50 900"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="4"
              strokeDasharray="12 12"
            />
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 0.45 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              d="M 50 0 C 80 100 20 200 50 300 C 80 400 20 500 50 600 C 80 700 20 800 50 900"
              fill="none"
              stroke="#005B8F"
              strokeWidth="4"
            />
          </svg>

          <div className="space-y-24">
            {aiPath.nodes.map((node, index) => (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12 group"
              >
                {/* Node Icon */}
                <div className="relative shrink-0">
                  <div className={`w-16 h-16 rounded-3xl flex items-center justify-center border-4 shadow-xl relative z-10 transition-all duration-500 ${
                    node.status === 'completed' ? 'bg-secondary border-white text-primary' :
                    node.status === 'active' ? 'bg-primary border-white text-white scale-125 ring-8 ring-primary/10' :
                    'bg-gray-100 border-white text-gray-400'
                  }`}>
                    {node.status === 'completed' ? <Check size={28} strokeWidth={3} /> :
                     node.status === 'active' ? <Beaker size={28} /> :
                     <Lock size={24} />}
                  </div>
                </div>

                {/* Node Card */}
                <Card className={`p-8 border-none shadow-premium w-full relative overflow-hidden transition-all duration-300 ${
                  node.status === 'active' ? 'bg-white ring-1 ring-primary/10 shadow-2xl' : 
                  node.status === 'blocked' ? 'bg-gray-50/50 opacity-40' : 'bg-white'
                }`}>
                  {node.status === 'active' && (
                    <div className="absolute top-0 right-0 px-4 py-1.5 bg-accent text-white text-[10px] font-black uppercase tracking-widest rounded-bl-xl">
                      En curso
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-text-main mb-2">{node.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed mb-6 font-medium">
                    {index === 0 ? 'Dominio de la estructura fundamental y partículas subatómicas.' :
                     index === 1 ? 'Sistemas de nombres para óxidos, hidróxidos y ácidos binarios.' :
                     index === 2 ? 'Relaciones cuantitativas en reacciones químicas balanceadas.' :
                     'Constantes de equilibrio y Principio de Le Châtelier.'}
                  </p>
                  
                  {node.status === 'active' && (
                    <div className="space-y-2">
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '60%' }}
                          className="h-full bg-primary"
                        />
                      </div>
                    </div>
                  )}

                  {node.status === 'completed' && (
                    <Badge variant="success" className="bg-green-100 text-green-700 border-green-200">Completado</Badge>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Intelligence Panel (Right Column) */}
      <div className="lg:col-span-4 space-y-6">
        {/* Emotional State Card */}
        <Card className="p-6 border-none shadow-premium bg-white rounded-3xl flex items-center gap-6">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
              <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="213" strokeDashoffset="42" className="text-green-400" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-green-500">
              <Smile size={32} />
            </div>
          </div>
          <div>
            <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-1">Estado Emocional</p>
            <p className="text-lg font-black text-text-main">Nivel Óptimo</p>
            <p className="text-[10px] text-text-secondary font-medium">Listo para nuevos conceptos</p>
          </div>
        </Card>

        {/* AI Recommendations Card */}
        <Card className="p-8 border-none shadow-premium bg-white rounded-[2.5rem] space-y-8">
          <div className="flex items-center gap-3">
            <Sparkles className="text-accent" size={24} />
            <h2 className="text-xl font-black text-text-main">Recomendaciones IA</h2>
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">Micro-lección sugerida</p>
              <div className="relative group rounded-3xl overflow-hidden cursor-pointer">
                <img 
                  src="/Users/tamaraalison/.gemini/antigravity/brain/98c057de-1516-4485-b2c7-66fd482fff08/chemistry_nomenclature_tutorial_1778536622451.png" 
                  alt="Video"
                  className="w-full h-40 object-cover group-hover:scale-110 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white">
                    <Play size={20} fill="currentColor" />
                  </div>
                </div>
                <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[8px] font-bold text-white">
                  2:45 min
                </div>
              </div>
              <p className="font-bold text-sm text-text-main">Trucos para Nomenclatura Tradicional</p>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">Simulador Práctico</p>
              <div className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-100 rounded-2xl hover:shadow-premium transition-all cursor-pointer group">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-primary shadow-lg shadow-secondary/30 group-hover:scale-110 transition-transform">
                  <FlaskConical size={20} />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-text-main">Reactor de Óxidos v2.1</h5>
                  <p className="text-[10px] text-text-secondary font-medium">Práctica virtual obligatoria</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-[2rem] bg-accent/5 border border-accent/10 relative overflow-hidden">
              <div className="absolute -bottom-6 -right-6 text-accent/10">
                <Sparkles size={100} />
              </div>
              <div className="flex items-center gap-2 mb-3 text-accent">
                <Info size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">Tip del Mentor</span>
              </div>
              <p className="text-xs text-text-main leading-relaxed italic font-medium relative z-10">
                "Recuerda que los estados de oxidación son como el 'idioma' de la molécula. Si los dominas, la nomenclatura se vuelve automática."
              </p>
            </div>
          </div>
        </Card>

        {/* Total Progress Card */}
        <Card className="p-8 border-none shadow-3xl bg-primary-dark text-white rounded-[2.5rem] relative overflow-hidden">
          <div className="relative z-10 space-y-8">
            <div>
              <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-4">Progreso Total</p>
              <h3 className="text-6xl font-black">42<span className="text-2xl text-secondary">%</span></h3>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span className="text-white/50">Siguiente Hito</span>
                <TrendingUp size={14} className="text-secondary" />
              </div>
              <p className="text-lg font-bold">Examen de Suficiencia</p>
            </div>
          </div>
          {/* Abstract Pattern */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        </Card>
      </div>
    </div>
  );
};
