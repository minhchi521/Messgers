#!/usr/bin/env node
/**
 * Create self-signed certificate for HTTPS
 * Works on Windows with PowerShell
 */
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🔐 Creating self-signed certificate...\n');

try {
  // Check if cert already exists
  if (fs.existsSync('cert.pem') && fs.existsSync('key.pem')) {
    console.log('✅ Certificate already exists: cert.pem, key.pem');
    process.exit(0);
  }

  // Use PowerShell on Windows to generate cert
  const certCmd = `
    $cert = New-SelfSignedCertificate \`
      -DnsName "localhost,127.0.0.1" \`
      -CertStoreLocation "cert:\\CurrentUser\\My" \`
      -FriendlyName "LocalDevCert" \`
      -HashAlgorithm SHA256 \`
      -NotAfter (Get-Date).AddYears(1)
    
    $pwd = ConvertTo-SecureString -String "123456" -Force -AsPlainText
    Export-PfxCertificate -Cert "cert:\\CurrentUser\\My\\$($cert.Thumbprint)" -FilePath "temp.pfx" -Password $pwd | Out-Null
    
    Write-Host "✅ Certificate generated successfully"
  `;

  console.log('📝 Running PowerShell...');
  execSync(`powershell -Command "${certCmd}"`, { stdio: 'inherit' });

  // If PowerShell worked, convert PFX to PEM
  if (fs.existsSync('temp.pfx')) {
    console.log('📝 Converting PFX to PEM...');
    
    // Use OpenSSL if available
    try {
      execSync('openssl pkcs12 -in temp.pfx -out cert.pem -nodes -password pass:123456', { stdio: 'inherit' });
      fs.unlinkSync('temp.pfx');
      console.log('✅ Certificates created: cert.pem');
    } catch {
      console.log('⚠️  OpenSSL not available. Using PFX format instead.');
      fs.renameSync('temp.pfx', 'cert.pfx');
      console.log('✅ Certificate created: cert.pfx (for .NET apps)');
    }
  }

  console.log('\n✅ Ready to use HTTPS!\n');
  console.log('Run with:');
  console.log('   SET USE_HTTPS=true && npm run dev  (Windows)');
  console.log('   export USE_HTTPS=true && npm run dev  (Mac/Linux)');

} catch (error) {
  console.error('❌ Error generating certificate:', error.message);
  console.log('\n📝 Alternative: Use mkcert');
  console.log('1. Install: https://github.com/FiloSottile/mkcert');
  console.log('2. Run: mkcert localhost 127.0.0.1');
  console.log('3. Copy: localhost+1.pem → cert.pem & localhost+1-key.pem → key.pem');
  console.log('4. Then: SET USE_HTTPS=true && npm run dev');
  process.exit(1);
}
