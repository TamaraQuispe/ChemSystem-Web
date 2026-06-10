import React from 'react';
import { motion } from 'framer-motion';
import { Award, Flame, Trophy, Star, Zap, CheckCircle, Lock } from 'lucide-react';
import { useAchievementStore, ACHIEVEMENTS } from '../../store/achievementStore';
import { Card } from '../../components/ui/Card';
import { cn } from '../../utils/cn';

const AchievementsPage = () => {
  const { totalXp, level, activitiesCompleted, simulationsCompleted, currentStreak, achievements } =
    useAchievementStore();

  const unlockedCount = achievements.filter((a) => a.unlockedAt).length;

  return (
    <div className="space-y-10 pb-16">
      
      {/* Header */}
      <div className="space-y-1.5">
        <h1 className="text-4xl font-extrabold text-[#0D2140] tracking-tight">
          Mis Logros
        </h1>
        <p className="text-base text-gray-500 font-medium">
          Sigue completando actividades para desbloquear más insignias y ganar experiencia.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="p-6 flex flex-col items-center text-center bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-3xl">
          <div className="w-12 h-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center mb-3 shadow-lg shadow-blue-500/20">
            <Zap size={24} className="fill-white" />
          </div>
          <span className="text-3xl font-black text-[#0D2140]">{totalXp}</span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">XP Total</span>
        </Card>

        <Card className="p-6 flex flex-col items-center text-center bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 rounded-3xl">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mb-3 shadow-lg shadow-emerald-500/20">
            <Trophy size={24} />
          </div>
          <span className="text-3xl font-black text-[#0D2140]">{level}</span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Nivel</span>
        </Card>

        <Card className="p-6 flex flex-col items-center text-center bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-3xl">
          <div className="w-12 h-12 rounded-2xl bg-purple-500 text-white flex items-center justify-center mb-3 shadow-lg shadow-purple-500/20">
            <Award size={24} />
          </div>
          <span className="text-3xl font-black text-[#0D2140]">{unlockedCount}</span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Insignias</span>
        </Card>

        <Card className="p-6 flex flex-col items-center text-center bg-gradient-to-br from-amber-50 to-white border border-amber-100 rounded-3xl">
          <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center mb-3 shadow-lg shadow-amber-500/20">
            <Flame size={24} className="fill-white" />
          </div>
          <span className="text-3xl font-black text-[#0D2140]">{currentStreak}</span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Racha (días)</span>
        </Card>
      </div>

      {/* Progress to next level */}
      <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-black text-[#0D2140] tracking-tight">Progreso al siguiente nivel</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
              Nivel {level} · {totalXp} XP
            </p>
          </div>
          <span className="text-lg font-black text-primary">
            Nv. {level + 1}
          </span>
        </div>
        <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden p-0.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((totalXp % 200) / 200) * 100}%` }}
            className="h-full bg-gradient-to-r from-primary to-blue-500 rounded-full"
          />
        </div>
        <p className="text-[10px] text-gray-400 font-semibold mt-2">
          {200 - (totalXp % 200)} XP restantes para el siguiente nivel
        </p>
      </div>

      {/* Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-50 border border-gray-100 rounded-[2rem] p-6 text-center">
          <p className="text-3xl font-black text-[#0D2140]">{activitiesCompleted}</p>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Actividades completadas</p>
        </div>
        <div className="bg-gray-50 border border-gray-100 rounded-[2rem] p-6 text-center">
          <p className="text-3xl font-black text-[#0D2140]">{simulationsCompleted}</p>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Simulaciones completadas</p>
        </div>
        <div className="bg-gray-50 border border-gray-100 rounded-[2rem] p-6 text-center">
          <p className="text-3xl font-black text-[#0D2140]">{currentStreak}</p>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Racha actual (días)</p>
        </div>
      </div>

      {/* Achievements Grid */}
      <section>
        <h2 className="text-2xl font-extrabold text-[#0D2140] tracking-tight mb-8">
          Insignias y Logros
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ACHIEVEMENTS.map((def, idx) => {
            const unlocked = achievements.find((a) => a.id === def.id)?.unlockedAt;
            return (
              <motion.div
                key={def.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={cn(
                  "rounded-[2rem] p-6 border-2 transition-all duration-300",
                  unlocked
                    ? "bg-white border-amber-200 shadow-md"
                    : "bg-gray-50 border-gray-100 opacity-70"
                )}
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-sm",
                    unlocked ? "bg-gradient-to-br from-amber-400 to-yellow-500" : "bg-gray-200"
                  )}>
                    {unlocked ? def.icon : <Lock size={20} className="text-gray-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className={cn(
                        "text-sm font-black tracking-tight",
                        unlocked ? "text-[#0D2140]" : "text-gray-400"
                      )}>
                        {def.title}
                      </h4>
                      {unlocked && <CheckCircle size={14} className="text-emerald-500 shrink-0" />}
                    </div>
                    <p className={cn(
                      "text-[10px] font-semibold leading-relaxed",
                      unlocked ? "text-gray-500" : "text-gray-400"
                    )}>
                      {def.description}
                    </p>
                    {unlocked && (
                      <p className="text-[9px] font-bold text-amber-600 mt-2">
                        +{def.xp} XP · {new Date(unlocked).toLocaleDateString('es', { day: '2-digit', month: 'short' })}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

    </div>
  );
};

export default AchievementsPage;
