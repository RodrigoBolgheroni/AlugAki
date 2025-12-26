import prisma from './backend/lib/prisma.js';

async function testar() {
  try {
    await prisma.$connect();
    console.log('✅ Conectou no banco!');
    
    const ufs = await prisma.uF.findMany();
    console.log('Estados encontrados:', ufs.length);
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ ERRO:', error.message);
  }
}

testar();