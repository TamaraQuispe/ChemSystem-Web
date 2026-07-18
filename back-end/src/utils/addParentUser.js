require('dotenv').config();
const bcrypt = require('bcrypt');
const { sequelize, User } = require('../models');

async function addParentUser() {
  try {
    await sequelize.authenticate();
    console.log('✓ Conexión a BD establecida');

    const [user, created] = await User.findOrCreate({
      where: { email: 'padre@chemsystem.edu' },
      defaults: {
        email: 'padre@chemsystem.edu',
        password_hash: await bcrypt.hash('password123', 10),
        name: 'Ana Mendoza',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
        role: 'parent',
        level: 8,
        xp: 450,
      }
    });

    if (created) {
      console.log('✓ Usuario padre creado: padre@chemsystem.edu / password123');
    } else {
      console.log('→ El usuario padre ya existe');
    }

    process.exit(0);
  } catch (err) {
    console.error('✗ Error:', err);
    process.exit(1);
  }
}

addParentUser();
