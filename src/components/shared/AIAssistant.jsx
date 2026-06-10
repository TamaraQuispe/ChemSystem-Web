import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Sparkles, Brain, Bot } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: '¡Hola! Soy ChemBot, tu tutor de química. ¿En qué experimento puedo ayudarte hoy?' }
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    setMessages([...messages, { role: 'user', text: inputValue }]);
    setInputValue('');
    
    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: '¡Buena pregunta! Basado en tu progreso actual en Estequiometría, te recomiendo revisar el balanceo de la reacción de combustión del metano. ¿Te gustaría que te explique los pasos?' 
      }]);
    }, 1000);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-primary text-white rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center z-50 group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <Bot size={30} className="relative z-10" />
      </motion.button>

      {/* Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8, x: 50 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, y: 100, scale: 0.8, x: 50 }}
            className="fixed bottom-28 right-8 w-[400px] max-w-[calc(100vw-64px)] h-[550px] glass-card rounded-3xl overflow-hidden flex flex-col z-50 border-white/40 shadow-2xl"
          >
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-primary to-primary-dark text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                  <Sparkles size={20} className="text-secondary" />
                </div>
                <div>
                  <p className="font-bold">ChemBot AI</p>
                  <p className="text-[10px] text-white/70 uppercase tracking-widest">Asistente Inteligente</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-grow overflow-y-auto p-6 space-y-4">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    "flex",
                    msg.role === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  <div className={cn(
                    "max-w-[80%] p-4 rounded-2xl text-sm",
                    msg.role === 'user' 
                      ? "bg-primary text-white rounded-tr-none shadow-lg shadow-primary/10" 
                      : "bg-gray-100 text-text-main rounded-tl-none"
                  )}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100">
              <div className="flex gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-100 focus-within:border-primary/30 focus-within:ring-4 focus-within:ring-primary/5 transition-all">
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Escribe tu duda aquí..."
                  className="flex-grow bg-transparent border-none outline-none px-2 text-sm"
                />
                <Button 
                  size="sm" 
                  className="w-10 h-10 p-0 rounded-xl"
                  onClick={handleSend}
                >
                  <Send size={18} />
                </Button>
              </div>
              <p className="text-[10px] text-center text-text-secondary mt-3">
                Impulsado por ChemBrain AI • Soporte 24/7
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistant;
