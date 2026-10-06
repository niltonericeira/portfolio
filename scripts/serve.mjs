import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.env.PORT || 8080);
const types = {
  '.pdf': 'application/pdf',
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

const server = createServer(async (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const relative = pathname === '/' ? 'index.html' : pathname.slice(1);
    const path = resolve(root, relative);
    // Serve only public site assets; keep repository and tooling files private.
    const publicPath = /^(?:[^/]+\.(?:html|webmanifest|xml|txt)|service-worker\.js|(?:assets|css|js)\/.+)$/;
    if (!path.startsWith(root + sep) || relative.split('/').some(part => part.startsWith('.')) || !publicPath.test(relative)) {
      response.writeHead(404).end('Não encontrado');
      return;
    }
    const content = await readFile(path);
    response.writeHead(200, {
      'Content-Type': types[extname(path)] || 'application/octet-stream',
      'Cache-Control': 'no-store',
      'Content-Length': content.length,
    });
    response.end(request.method === 'HEAD' ? undefined : content);
  } catch (error) {
    const status = error instanceof URIError ? 400 : ['ENOENT', 'EISDIR', 'ENOTDIR'].includes(error.code) ? 404 : 500;
    response.writeHead(status).end(status === 404 ? 'Não encontrado' : 'Falha na requisição');
  }
});

server.on('error', (error) => {
  console.error(error.code === 'EADDRINUSE'
    ? `Porta ${port} ocupada. Execute com outra porta: PORT=8081 npm start`
    : error.message);
  process.exitCode = 1;
});
server.listen(port, '127.0.0.1', () => {
  console.log(`Portfólio disponível em http://localhost:${port}`);
  console.log('Para encerrar, pressione Ctrl+C.');
});
