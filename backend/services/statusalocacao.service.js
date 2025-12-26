import prisma from '../lib/prisma.js';

export async function listarStatusAlocacao() {
  const status = await prisma.statusLocacao.findMany({
    where: { ativo: 1 },
    select: {
      id: true,
      statusAlocacao: true
    },
    orderBy: { statusAlocacao: 'asc' }
  });

  return status.map(s => ({
    Id: s.id,
    StatusAlocacao: s.statusAlocacao
  }));
}