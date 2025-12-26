// ============================================
// ASYNC HANDLER MIDDLEWARE
// ============================================
// Evita ter que escrever try-catch em todo controller
// Captura erros automaticamente e passa para o error.middleware

export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };