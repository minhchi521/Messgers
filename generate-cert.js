#!/usr/bin/env node

/**
 * Generate Self-Signed Certificate for HTTPS
 * Run: node generate-cert.js
 * 
 * This creates key.pem and cert.pem for local development
 * Use with: USE_HTTPS=true npm run dev
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const KEY_FILE = 'key.pem';
const CERT_FILE = 'cert.pem';

console.log('🔐 Generating self-signed certificate...\n');

// Check if files already exist
if (fs.existsSync(KEY_FILE) && fs.existsSync(CERT_FILE)) {
  console.log('✅ Certificate files already exist!');
  console.log(`   Key:  ${KEY_FILE}`);
  console.log(`   Cert: ${CERT_FILE}`);
  console.log('\n💡 To regenerate, delete these files and run again.');
  console.log('💡 To use: USE_HTTPS=true npm run dev\n');
  process.exit(0);
}

try {
  // Generate 30-day self-signed certificate
  const cmd = `openssl req -x509 -newkey rsa:4096 -nodes -out ${CERT_FILE} -keyout ${KEY_FILE} -days 30 -subj "/C=VN/ST=VN/L=VN/O=Dev/CN=localhost"`;
  
  execSync(cmd, { stdio: 'inherit' });

  console.log('\n✅ Certificate generated successfully!\n');
  console.log(`📁 Files created:`);
  console.log(`   • ${KEY_FILE}`);
  console.log(`   • ${CERT_FILE}`);
  console.log('\n🚀 To start server with HTTPS:\n');
  console.log('   USE_HTTPS=true npm run dev\n');
  console.log('📱 Then visit on mobile:\n');
  console.log('   https://YOUR_LAPTOP_IP:3000\n');
  console.log('⚠️  You\'ll see a certificate warning - this is normal for self-signed certificates.\n');

} catch (error) {
  console.error('❌ Error generating certificate:', error.message);
  console.error('\n💡 Make sure OpenSSL is installed:');
  console.error('   macOS: brew install openssl');
  console.error('   Ubuntu: sudo apt-get install openssl');
  console.error('   Windows: Download from https://slproweb.com/products/Win32OpenSSL.html\n');
  process.exit(1);
}
