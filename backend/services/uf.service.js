import prisma from '../lib/prisma.js';

export async function listarUfs() {
  const ufs = await prisma.uF.findMany({
    where: { Ativo: 1 },
    select: {
      Id: true,
      Nome: true
    },
    orderBy: { Nome: 'asc' }
  });

  return ufs.map(uf => ({
    Id: uf.Id,
    nome: uf.Nome
  }));
}