import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, User, Mail, Camera } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { cn } from '../../utils/cn';
import { useAuthStore } from '../../store/authStore';
import { studentService } from '../../services/studentService';

const Settings = () => {
  const { user, login } = useAuthStore();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar_url: user?.avatar_url || '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const updated = await studentService.updateProfile({ name: form.name, avatar_url: form.avatar_url });
      login(updated, localStorage.getItem('chemsystem_token'));
      setMessage('Perfil actualizado correctamente');
    } catch (err) {
      setMessage(err.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-black text-primary-dark tracking-tight">Configuración</h1>
        <p className="text-text-secondary font-semibold mt-1">Administra tu perfil y preferencias</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="p-8">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="flex items-center gap-6 mb-8">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-gray-200 overflow-hidden border-2 border-white shadow-md">
                  <img src={form.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${form.name || 'User'}`}
                    alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <button type="button" className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary text-white rounded-lg flex items-center justify-center shadow">
                  <Camera size={14} />
                </button>
              </div>
              <div>
                <p className="text-lg font-black text-primary-dark">{form.name || 'Usuario'}</p>
                <p className="text-xs font-bold text-text-secondary">{user?.role === 'student' ? 'Estudiante' : user?.role}</p>
              </div>
            </div>

            <Input label="Nombre completo" placeholder="Tu nombre" value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <Input label="Correo electrónico" placeholder="correo@ejemplo.com" value={form.email} disabled />
            <Input label="URL de avatar" placeholder="https://ejemplo.com/avatar.png" value={form.avatar_url}
              onChange={e => setForm(f => ({ ...f, avatar_url: e.target.value }))} />

            {message && (
              <div className={cn(
                "text-xs font-bold px-4 py-3 rounded-xl",
                message.includes('actualizado') ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'
              )}>{message}</div>
            )}

            <Button type="submit" className="w-full bg-primary-dark text-white" isLoading={saving}>
              <Save size={18} /> Guardar Cambios
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default Settings;
