import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Users, Heart, ArrowRight } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { useAuthStore } from '../../store/authStore';
import api from '../../services/api';

const roles = [
  {
    id: 'student',
    title: 'Estudiante',
    description: 'Accede a laboratorios virtuales, retos y tu ruta de aprendizaje personalizada.',
    icon: GraduationCap,
    color: 'bg-primary',
    accent: 'text-primary'
  },
  {
    id: 'teacher',
    title: 'Docente',
    description: 'Gestiona tus clases, analiza el progreso de tus alumnos y crea contenido educativo.',
    icon: Users,
    color: 'bg-accent',
    accent: 'text-accent'
  },
  {
    id: 'parent',
    title: 'Padre de Familia',
    description: 'Realiza el seguimiento del rendimiento académico y apoyo emocional de tus hijos.',
    icon: Heart,
    color: 'bg-secondary',
    accent: 'text-[#005B8F]'
  }
];

const RoleSelection = () => {
  const navigate = useNavigate();
  const setRole = useAuthStore((state) => state.setRole);
  const login = useAuthStore((state) => state.login);
  const user = useAuthStore((state) => state.user);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role) {
      navigate(user.role === 'teacher' ? '/teacher/dashboard' : '/home', { replace: true });
    }
  }, [user, navigate]);

  const handleSelectRole = async (roleId) => {
    setError('');
    try {
      await api.patch('/auth/role', { role: roleId });
      setRole(roleId);
      login({ ...user, role: roleId }, localStorage.getItem('chemsystem_token'));
      if (roleId === 'teacher') {
        navigate('/teacher/dashboard');
      } else {
        navigate('/home');
      }
    } catch (err) {
      setError(err.message || 'Error al actualizar rol');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 sm:p-12">
      <div className="text-center mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-text-main mb-4"
        >
          Elige tu perfil en <span className="text-primary">ChemSystem</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-text-secondary text-lg max-w-xl mx-auto"
        >
          Personalizaremos tu experiencia basándonos en tu rol para ofrecerte las mejores herramientas.
        </motion.p>
        {error && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-sm font-bold mt-4"
          >
            {error}
          </motion.p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {roles.map((role, index) => (
          <motion.div
            key={role.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.2 }}
            whileHover={{ y: -8 }}
            className="cursor-pointer"
            onClick={() => handleSelectRole(role.id)}
          >
            <Card className="h-full flex flex-col items-center text-center p-8 border-2 border-transparent hover:border-primary/20 transition-all duration-300">
              <div className={`w-20 h-20 ${role.color} rounded-3xl flex items-center justify-center mb-6 shadow-lg`}>
                <role.icon size={36} className="text-white" />
              </div>
              <h3 className={`text-2xl font-black ${role.accent} tracking-tight mb-3`}>
                {role.title}
              </h3>
              <p className="text-text-secondary text-sm font-semibold leading-relaxed mb-8 flex-grow">
                {role.description}
              </p>
              <div className="flex items-center gap-2 text-sm font-bold text-primary group">
                <span>Seleccionar</span>
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RoleSelection;
