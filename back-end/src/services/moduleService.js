const { Module, UserModule } = require('../models');

async function getModuleContent(moduleId, userId) {
  const mod = await Module.findByPk(moduleId);
  if (!mod) throw new Error('Módulo no encontrado');

  let userProgress = null;
  if (userId) {
    userProgress = await UserModule.findOne({
      where: { user_id: userId, module_id: moduleId },
    });
  }

  return {
    id: mod.id,
    title: mod.title,
    description: mod.description,
    slug: mod.slug,
    difficulty: mod.difficulty,
    category: mod.category,
    duration_minutes: mod.duration_minutes,
    order_index: mod.order_index,
    xp_reward: mod.xp_reward,
    thumbnail_url: mod.thumbnail_url,
    objectives: mod.content?.objectives || [],
    prerequisites: mod.content?.prerequisites || [],
    sections: mod.content?.sections || [],
    finalExam: mod.final_exam || [],
    summary: mod.summary || {},
    curiosities: mod.curiosities || [],
    userProgress,
  };
}

module.exports = { getModuleContent };
