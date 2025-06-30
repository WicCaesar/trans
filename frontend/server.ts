import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { MimeTypes } from './src/ts/types/server.types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;

const MIME_TYPES: MimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.map': 'application/json'
};

function serveFile(filePath: string, contentType: string, res: http.ServerResponse): void {
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        fs.readFile(path.join(__dirname, 'index.html'), (err, content) => {
          if (err) {
            res.writeHead(500);
            res.end('Erro interno do servidor');
            return;
          }
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(content, 'utf-8');
        });
      } else {
        res.writeHead(500);
        res.end(`Erro interno do servidor: ${err.code}`);
      }
      return;
    }

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content, 'utf-8');
  });
}

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  if (!req.url) {
    res.writeHead(400);
    res.end('URL inválida');
    return;
  }
  
  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
  
  if (!path.extname(filePath) && req.url && req.url.includes('/dist/ts/')) {
    filePath += '.js';
  } else if (!path.extname(filePath) || path.extname(filePath) === '') {
    filePath = path.join(__dirname, 'index.html');
  }
  
  const extname = path.extname(filePath);
  const contentType = MIME_TYPES[extname] || 'application/octet-stream';
  
  serveFile(filePath, contentType, res);
});

server.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Servidor frontend rodando em http://0.0.0.0:${PORT}`);
}); 