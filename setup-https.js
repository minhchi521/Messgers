#!/usr/bin/env node
/**
 * Create self-signed certificates using Node.js pem or manual
 */
import fs from 'fs';
import { execSync } from 'child_process';

console.log('🔐 Setting up HTTPS certificates...\n');

// Check if certs exist
if (fs.existsSync('cert.pem') && fs.existsSync('key.pem')) {
  console.log('✅ Certificates already exist');
  process.exit(0);
}

// Try using 'mkcert' tool first (best option)
try {
  console.log('📝 Checking for mkcert...');
  execSync('mkcert -version', { stdio: 'ignore' });
  console.log('✅ Found mkcert. Generating certificates...');
  
  try {
    execSync('mkcert -install', { stdio: 'ignore' });
  } catch (e) {
    // CA already installed, that's fine
  }
  
  execSync('mkcert localhost 127.0.0.1', { stdio: 'inherit' });
  
  // Copy generated files to standard names
  if (fs.existsSync('localhost+1.pem')) {
    fs.copyFileSync('localhost+1.pem', 'cert.pem');
    fs.copyFileSync('localhost+1-key.pem', 'key.pem');
    console.log('✅ Certificates ready: cert.pem, key.pem');
  }
  
} catch {
  // Fallback: Try PowerShell on Windows
  console.log('ℹ️  mkcert not found. Trying PowerShell...');
  
  try {
    const cmd = `
      $cert = New-SelfSignedCertificate -DnsName localhost,127.0.0.1 -Type SSLServerAuthentication -FriendlyName "Dev Local Cert" -NotAfter (Get-Date).AddYears(1)
      $pwd = ConvertTo-SecureString -String "pass" -Force -AsPlainText
      Export-PfxCertificate -Cert $cert -FilePath cert.pfx -Password $pwd -NoProperties | Out-Null
      Write-Host "Created cert.pfx"
    `;
    
    execSync(`powershell -NoProfile -Command "${cmd}"`, { stdio: 'inherit' });
    
    // Convert PFX to PEM if OpenSSL available
    try {
      execSync('openssl pkcs12 -in cert.pfx -out cert.pem -nodes -passin pass:pass -passout pass:pass', { stdio: 'inherit' });
      fs.unlinkSync('cert.pfx');
      console.log('✅ Converted to PEM format');
    } catch {
      console.log('⚠️  Could not convert to PEM. Update index.js to use .pfx format');
    }
    
  } catch (e) {
    console.error('❌ Failed to generate certificates');
    console.log('\n📚 Install mkcert: https://github.com/FiloSottile/mkcert#installation');
    process.exit(1);
  }
}

console.log('\n✅ Setup complete!\n');
console.log('To enable HTTPS, run:');
console.log('   $env:USE_HTTPS="true"; npm run dev  (PowerShell)');
console.log('   SET USE_HTTPS=true && npm run dev   (CMD)');
console.log('   export USE_HTTPS=true && npm run dev (Mac/Linux)');
console.log('\nThen visit: https://localhost:3000');
