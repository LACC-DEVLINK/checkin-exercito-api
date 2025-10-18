const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');
  
  // Verificar se já existem usuários
  const existingUsersCount = await prisma.user.count();
  
  if (existingUsersCount > 0) {
    console.log(`ℹ️  Banco já contém ${existingUsersCount} usuário(s). Pulando seed...`);
    console.log('💡 Para recriar usuários, limpe o banco manualmente.');
    return;
  }

  console.log('📝 Criando usuários padrão...');
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
  console.log('   Email:', admin.email);
  console.log('   Senha: admin123');
  console.log('   Role:', admin.role);
  console.log('');

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
  console.log('   Email:', supervisor.email);
  console.log('   Senha: supervisor123');
  console.log('');

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
  console.log('   Email:', operator.email);
  console.log('   Senha: operator123');
  console.log('');
  console.log('🎉 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
