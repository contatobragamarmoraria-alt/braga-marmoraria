import { spawn } from 'child_process';

console.log('Starting server via npm start...');

const server = spawn('npm', ['start'], {
  stdio: 'inherit',
  shell: true
});

server.on('close', (code) => {
  process.exit(code);
});
