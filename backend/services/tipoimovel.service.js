import prisma from '../lib/prisma.js';

export async function listarTipoImovel() {
  const tipos = await prisma.tipoImovel.findMany({
    where: { ativo: 1 },
    select: {
      id: true,
      tipo: true
    },
    orderBy: { tipo: 'asc' }
  });

  return tipos.map(t => ({
    Id: t.id,
    Tipo: t.tipo
  }));
}