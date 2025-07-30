#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting Workers Vacation Management API...\n');

if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
  console.log('Installing dependencies...');
  const install = spawn('npm', ['install'], { stdio: 'inherit' });

  install.on('close', (code) => {
    if (code === 0) {
      console.log('Dependencies installed successfully!\n');
      startDevServer();
    } else {
      console.error('Failed to install dependencies');
      process.exit(1);
    }
  });
} else {
  startDevServer();
}

function startDevServer() {
  console.log('Starting development server...');
  console.log('API documentation will be available at: http://localhost:3000/api-docs/');
  console.log('Example usage script: node example-usage.js\n');

  const dev = spawn('npm', ['run', 'dev'], { stdio: 'inherit' });

  dev.on('close', (code) => {
    console.log(`\nDevelopment server stopped with code ${code}`);
  });

  process.on('SIGINT', () => {
    console.log('\nShutting down...');
    dev.kill('SIGINT');
  });

  process.on('SIGTERM', () => {
    console.log('\nShutting down...');
    dev.kill('SIGTERM');
  });
}
