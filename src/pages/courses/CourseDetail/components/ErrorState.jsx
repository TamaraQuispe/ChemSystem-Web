import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

export const ErrorState = ({ error }) => (
  <div className="max-w-4xl mx-auto py-12 px-4 text-center">
    <AlertTriangle size={48} className="text-gray-300 mx-auto mb-4" />
    <p className="text-lg font-bold text-text-secondary">
      {error || 'Curso no encontrado'}
    </p>
    <Link to="/modules" className="text-sm font-bold text-primary mt-4 inline-block">
      ← Volver a módulos
    </Link>
  </div>
);
