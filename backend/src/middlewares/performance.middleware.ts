import type { Request, Response, NextFunction } from 'express';

export function monitorarPerformance(req: Request, res: Response, next: NextFunction) {
  const inicioProcessamento = performance.now();
  const clientTimestamp = req.headers['x-client-timestamp'];

  if (clientTimestamp) {
    const latenciaIdaReal = inicioProcessamento - Number(clientTimestamp);
    console.log(`[BACK-PERF] Latência Real de Ida (Rede): ${latenciaIdaReal.toFixed(2)} ms`);
    console.log('\n')
  }

  const originalSend = res.send;
  
  res.send = function (body): Response {
    const fimProcessamento = performance.now();
    const tempoProcessamento = fimProcessamento - inicioProcessamento;

    res.setHeader('x-server-processing-time', String(tempoProcessamento));
    res.setHeader('Access-Control-Expose-Headers', 'x-server-processing-time');

    console.log(`[BACK-PERF] Rota: ${req.method} ${req.url} | Processamento: ${tempoProcessamento.toFixed(2)} ms`);
    
    return originalSend.call(this, body);
  };

  next();
}