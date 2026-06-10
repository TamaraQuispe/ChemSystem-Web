import React from 'react';
import { User, Bell, Shield, Palette, Globe, CreditCard } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { cn } from '../../utils/cn';

const Settings = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-text-main">Ajustes</h2>
        <p className="text-text-secondary">Gestiona tu perfil, preferencias y suscripción.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Navigation */}
        <div className="space-y-1">
          {[
            { icon: User, label: 'Perfil' },
            { icon: Bell, label: 'Notificaciones' },
            { icon: Shield, label: 'Seguridad' },
            { icon: Palette, label: 'Apariencia' },
            { icon: Globe, label: 'Idioma' },
            { icon: CreditCard, label: 'Suscripción' },
          ].map((item, idx) => (
            <button 
              key={idx} 
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                idx === 0 ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-text-secondary hover:bg-gray-100"
              )}
            >
              <item.icon size={18} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="md:col-span-3 space-y-6">
          <Card className="p-8 space-y-6">
            <h3 className="text-xl font-bold text-text-main">Información Personal</h3>
            <div className="flex items-center gap-6 pb-6 border-b border-gray-100">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-primary to-accent" />
              <div className="space-y-2">
                <Button variant="outline" size="sm">Cambiar Foto</Button>
                <p className="text-[10px] text-text-secondary uppercase font-bold">JPG, GIF o PNG. Max 2MB.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Nombre" defaultValue="Juan Pérez" />
              <Input label="Apellido" defaultValue="Científico" />
              <Input label="Correo" defaultValue="juan@u-quimica.edu" disabled />
              <Input label="Institución" defaultValue="Universidad de Ciencias" />
            </div>

            <div className="pt-4">
              <Button>Guardar Cambios</Button>
            </div>
          </Card>

          <Card className="p-8 border-red-100 bg-red-50/50">
            <h3 className="text-xl font-bold text-red-600 mb-2">Zona de Peligro</h3>
            <p className="text-sm text-text-secondary mb-6">Eliminar tu cuenta borrará todos tus datos y progreso de forma permanente.</p>
            <Button variant="ghost" className="text-red-500 hover:bg-red-100">Eliminar Cuenta</Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
