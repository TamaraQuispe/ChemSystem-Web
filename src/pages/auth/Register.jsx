import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import AuthLayout from '../../layouts/AuthLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../services/authService';

const registerSchema = z.object({
  name: z.string().min(3, 'Mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  institution: z.string().min(3, 'Institución requerida'),
});

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    try {
      const result = await authService.register(data.email, data.password, data.name);
      login(result.user, result.token);
      navigate('/role-selection');
    } catch (err) {
      setError(err.message || 'Error al registrarse');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Crea tu cuenta"
      subtitle="Únete a la comunidad científica más avanzada."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <Input
          label="Nombre completo"
          placeholder="Ej. Juan Pérez"
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Institución Educativa"
          placeholder="Ej. Universidad Nacional"
          error={errors.institution?.message}
          {...register('institution')}
        />

        <Input
          label="Correo electrónico"
          placeholder="nombre@institucion.edu"
          type="email"
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="relative">
          <Input
            label="Contraseña"
            placeholder="••••••••"
            type={showPassword ? 'text' : 'password'}
            error={errors.password?.message}
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-10 text-gray-400 hover:text-primary"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="flex items-start gap-2 pt-2">
          <input type="checkbox" className="mt-1 w-4 h-4 rounded border-gray-300 text-primary" required />
          <p className="text-xs text-text-secondary leading-relaxed">
            Acepto los <span className="text-primary font-bold">Términos de Servicio</span> y la <span className="text-primary font-bold">Política de Privacidad</span> de ChemSystem.
          </p>
        </div>

        <Button type="submit" className="w-full py-4 mt-4" isLoading={isLoading}>
          Crear Cuenta Premium
        </Button>

        <p className="text-center text-text-secondary mt-6">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="font-semibold text-primary hover:text-primary-dark">
            Inicia sesión
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Register;
