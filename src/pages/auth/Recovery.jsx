import React from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const Recovery = () => {
  return (
    <AuthLayout 
      title="Recuperar contraseña" 
      subtitle="Te enviaremos un código para restablecer tu acceso."
    >
      <div className="space-y-6">
        <Input
          label="Correo electrónico institucional"
          placeholder="nombre@institucion.edu"
          type="email"
        />
        <Button className="w-full py-4">Enviar código</Button>
        <p className="text-center text-text-secondary">
          ¿Recordaste tu contraseña?{' '}
          <Link to="/login" className="font-semibold text-primary hover:text-primary-dark">
            Volver al login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Recovery;
