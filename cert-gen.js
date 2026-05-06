#!/usr/bin/env node
/**
 * Generate Self-Signed Certificate using Node.js
 * No OpenSSL required
 */
import { exec } from 'child_process';
import fs from 'fs';

console.log('🔐 Generating self-signed certificate...\n');

// Try using pem package if available, otherwise guide user
try {
  // Try pem package
  const pem = await import('pem');
  pem.createCertificate({ days: 365, selfSigned: true }, (err, keys) => {
    if (err) throw err;
    fs.writeFileSync('key.pem', keys.serviceKey);
    fs.writeFileSync('cert.pem', keys.certificate);
    console.log('✅ Certificate created: cert.pem & key.pem');
    console.log('\nRun with HTTPS:');
    console.log('   SET USE_HTTPS=true && npm run dev  (Windows)');
    console.log('   export USE_HTTPS=true && npm run dev  (Mac/Linux)');
  });
} catch {
  // Fallback: Use PowerShell New-SelfSignedCertificate on Windows
  console.log('ℹ️  Using PowerShell to generate certificate...\n');
  
  const psCmd = `
$cert = New-SelfSignedCertificate -DnsName "localhost,127.0.0.1" -CertStoreLocation "cert:\\CurrentUser\\My" -FriendlyName "DevCert" -NotAfter (Get-Date).AddYears(1);
$pwd = ConvertTo-SecureString -String "password" -Force -AsPlainText;
Export-PfxCertificate -Cert $cert -FilePath "cert.pfx" -Password $pwd;
$myCert = Get-ChildItem -Path cert:\\CurrentUser\\My | Where-Object {$_.Thumbprint -eq $cert.Thumbprint};
$CertPath = "Cert:\\CurrentUser\\My\\" + $myCert.Thumbprint;
Export-Certificate -Cert $CertPath -FilePath "cert.cer" -Type CERT;
Write-Host "✅ Certificate generated: cert.cer & cert.pfx";
  `;

  exec(`powershell -Command "${psCmd}"`, (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Error:', error.message);
      console.log('\n📝 Manual setup:');
      console.log('1. Install mkcert: https://github.com/FiloSottile/mkcert');
      console.log('2. Run: mkcert localhost 127.0.0.1');
      console.log('3. This creates: localhost+1-key.pem & localhost+1.pem');
      console.log('4. Copy to cert.pem & key.pem');
      console.log('5. Run: SET USE_HTTPS=true && npm run dev');
      return;
    }
    console.log(stdout);
    console.log('\n✅ Done! Now run:');
    console.log('   SET USE_HTTPS=true && npm run dev');
  });
}
