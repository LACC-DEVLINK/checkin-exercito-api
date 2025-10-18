const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');
  console.log('🗑️  Limpando banco de dados...');

  // Limpar todos os usuários
  await prisma.user.deleteMany({});
  console.log('✅ Banco limpo!');
  console.log('');

  // Criar admin
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  const admin = await prisma.user.create({
    data: {
      name: 'Administrador',
      email: 'admin@exercito.mil.br',
      password: hashedPassword,
      role: 'ADMIN',
      isActive: true,
    },
  });

  console.log('✅ Admin criado com sucesso!');
  console.log('Email:', admin.email);
  console.log('Senha: admin123');
  console.log('Role:', admin.role);

  // Criar supervisor
  const hashedPasswordSupervisor = await bcrypt.hash('supervisor123', 12);
  
  const supervisor = await prisma.user.create({
    data: {
      name: 'Supervisor',
      email: 'supervisor@exercito.mil.br',
      password: hashedPasswordSupervisor,
      role: 'SUPERVISOR',
      isActive: true,
    },
  });

  console.log('✅ Supervisor criado com sucesso!');
  console.log('Email:', supervisor.email);
  console.log('Senha: supervisor123');

  // Criar operator
  const hashedPasswordOperator = await bcrypt.hash('operator123', 12);
  
  const operator = await prisma.user.create({
    data: {
      name: 'Operador',
      email: 'operator@exercito.mil.br',
      password: hashedPasswordOperator,
      role: 'OPERATOR',
      isActive: true,
    },
  });

  console.log('✅ Operador criado com sucesso!');
  console.log('Email:', operator.email);
  console.log('Senha: operator123');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
