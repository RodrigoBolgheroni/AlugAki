// ============================================
// ERROR HANDLER MIDDLEWARE
// ============================================
// Middleware global para tratar erros de forma padronizada

export const errorHandler = (err, req, res, next) => {
    console.error('❌ Erro capturado:', err);
  
    // Erro do Prisma - Registro não encontrado
    if (err.code === 'P2025') {
      return res.status(404).json({
        erro: 'Registro não encontrado',
        detalhes: err.message
      });
    }
  
    // Erro do Prisma - Violação de constraint única
    if (err.code === 'P2002') {
      return res.status(409).json({
        erro: 'Registro duplicado',
        detalhes: `O campo ${err.meta?.target} já existe`,
        campo: err.meta?.target
      });
    }
  
    // Erro do Prisma - Violação de chave estrangeira
    if (err.code === 'P2003') {
      return res.status(400).json({
        erro: 'Referência inválida',
        detalhes: 'O registro referenciado não existe'
      });
    }
  
    // Erro de validação customizado
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        erro: 'Erro de validação',
        detalhes: err.message
      });
    }
  
    // Erro genérico
    const statusCode = err.statusCode || 500;
    const mensagem = err.message || 'Erro interno do servidor';
  
    res.status(statusCode).json({
      erro: mensagem,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  };
  
  // Middleware para rotas não encontradas (404)
  export const notFoundHandler = (req, res, next) => {
    res.status(404).json({
      erro: 'Rota não encontrada',
      path: req.originalUrl,
      method: req.method
    });
  };