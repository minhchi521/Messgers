# 📱 Mobile Video Call Setup Guide

## Overview

The chat application now supports mobile devices with optimized WebRTC video calling. Mobile users can make and receive calls with automatic UI adaptation.

## Features

### ✅ Mobile Optimizations

1. **Automatic Device Detection**
   - Detects mobile vs desktop devices
   - Uses appropriate UI layout for each device type

2. **Smart Navigation**
   - Desktop: Opens video call in new tab (better for multitasking)
   - Mobile: Navigates to call page in same window (avoids pop-up blocking)

3. **Mobile-Friendly Camera Constraints**
   - Lower resolution for mobile (480x640) vs desktop (1280x720)
   - Audio enhancements: echo cancellation, noise suppression, auto gain control
   - Fallback to basic constraints if specific ones fail

4. **Responsive UI Layout**
   - **Desktop**: Side-by-side video layout
   - **Mobile**: Full-screen remote video with PiP local video (bottom-right corner)

5. **Incoming Call Handling**
   - Browser confirm prompt for call acceptance
   - Automatic navigation to call page after acceptance
   - Immediate rejection option

## HTTPS Requirement

### Why HTTPS?

Mobile browsers require **HTTPS** to access camera and microphone (`getUserMedia` API). This is a security feature, not specific to this app.

### Setup for Local Testing

#### Option 1: Using Self-Signed Certificate (Recommended for Local Dev)

```bash
# Generate self-signed certificate
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes

# Or on Windows with Node.js:
node generate-cert.js
```

Then enable HTTPS in `index.js`:

```javascript
import https from "https";
import fs from "fs";

const useHttps = process.env.USE_HTTPS === "true";

let httpServer;
if (useHttps) {
  const options = {
    key: fs.readFileSync("./key.pem"),
    cert: fs.readFileSync("./cert.pem"),
  };
  httpServer = https.createServer(options, app);
} else {
  httpServer = createServer(app);
}
```

Then run with:

```bash
USE_HTTPS=true npm run dev
```

#### Option 2: ngrok (Easy Remote Testing)

```bash
# Install ngrok
npm install -g ngrok

# Run server on 3000
npm run dev

# In another terminal, expose it
ngrok http 3000
```

This gives you a public HTTPS URL instantly.

#### Option 3: Deploy to HTTPS Server

- Vercel
- Heroku
- DigitalOcean
- AWS

## Mobile Testing Checklist

### Before Testing on Mobile

- [ ] Server running (e.g., `npm run dev`)
- [ ] Know your laptop's IP: `ipconfig getifaddr en0` (Mac) or check network settings (Windows)
- [ ] Ensure mobile is on same WiFi network
- [ ] Browser allows camera/mic permissions
- [ ] Using HTTPS (for camera/mic access)

### Testing on Same Network

1. **Get your laptop IP:**

   ```bash
   ipconfig  # Windows
   ifconfig  # Mac/Linux
   ```

   Example: `192.168.1.100`

2. **On Mobile Browser:**
   - Open: `https://192.168.1.100:3000` (add port if not 80/443)
   - Accept certificate warning (self-signed)
   - Allow camera/mic permissions when prompted

3. **Join Chat:**
   - Create user ID (generated automatically)
   - Members list should update live
   - Phone icon should be clickable

4. **Test Video Call:**
   - Open page in 2 browser tabs/devices
   - Click phone icon in one tab
   - Other tab receives call prompt
   - Accept call → both cameras activate
   - Controls: mute audio (🎤), toggle camera (📹), end call (📞)

## Troubleshooting

### Problem: "Camera not available" on mobile

**Causes:**

- Not using HTTPS
- Camera permission not granted
- Browser doesn't support WebRTC

**Solutions:**

1. Make sure you're using `https://` not `http://`
2. Check browser camera permissions (Settings > Privacy)
3. Try different browser (Chrome, Firefox)
4. Restart phone

### Problem: "Pop-up blocked"

**Causes:**

- Browser blocking `window.open()`
- Trying to open call in new tab on mobile

**Solutions:**

1. Mobile: Navigate in same window (automatic in this app)
2. Desktop: Check browser pop-up settings
3. Disable pop-up blocker for this domain

### Problem: Incoming call not received

**Causes:**

- User not properly joined conversation
- userId not matching in server
- Socket connection dropped

**Solutions:**

1. Check browser console for errors
2. Verify both users have joined same conversation
3. Check server logs for socket connections

### Problem: "No microphone/camera found"

**Causes:**

- Device doesn't have camera/mic
- Already in use by another app
- Permission not granted

**Solutions:**

1. Check device has camera (most mobiles do)
2. Close other apps using camera
3. Grant permission in browser settings

## Server Configuration

### Environment Variables

```bash
# .env file

# Port (default: 3000)
PORT=3000

# HTTPS (default: false)
USE_HTTPS=false

# Environment
NODE_ENV=development
```

### Enable HTTPS for Production

```javascript
// In index.js
const useHttps = process.env.USE_HTTPS === "true";

if (useHttps) {
  const https = require("https");
  const fs = require("fs");

  const options = {
    key: fs.readFileSync("./key.pem"),
    cert: fs.readFileSync("./cert.pem"),
  };

  https.createServer(options, app).listen(PORT);
}
```

## Code Structure

### Mobile Detection

```javascript
function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
}
```

### Call Initiation Flow

```
[Caller - Desktop/Mobile]
    ↓
    Click 📞 button
    ↓
    isMobileDevice() check
    ├─ YES: window.location.href = call.html
    └─ NO: window.open(call.html)
    ↓
    Socket: call:initiate
    ↓
[Server]
    ↓
    Find receiver socket
    ↓
    Emit: call:incoming
    ↓
[Receiver - Desktop/Mobile]
    ↓
    Browser prompt: Accept?
    ├─ YES:
    │   ├─ Socket: call:accept
    │   └─ Navigate to call.html
    └─ NO:
        └─ Socket: call:reject
```

### WebRTC Offer/Answer Exchange

```
[Initiator]
    ↓
    pc.createOffer()
    ↓
    Socket: webrtc:signal { type: 'offer' }
    ↓
[Server]
    ↓
    Forward to receiver
    ↓
[Receiver]
    ↓
    pc.setRemoteDescription(offer)
    ↓
    pc.createAnswer()
    ↓
    Socket: webrtc:signal { type: 'answer' }
    ↓
[Server]
    ↓
    Forward to initiator
    ↓
[Initiator]
    ↓
    pc.setRemoteDescription(answer)
    ↓
    ICE candidates exchange
    ↓
    Video connected!
```

## Performance Tips

### For Slower Networks

1. Reduce video resolution:

   ```javascript
   video: { width: { ideal: 320 }, height: { ideal: 480 } }
   ```

2. Reduce frame rate:

   ```javascript
   video: {
     frameRate: {
       ideal: 15;
     }
   }
   ```

3. Use audio only:
   ```javascript
   video: false,
   audio: true
   ```

### For Better Video Quality

1. Increase bitrate (requires more bandwidth):

   ```javascript
   const bitrate = 2500; // kbps
   pc.addTrack(audioTrack, localStream);
   ```

2. Use better ICE servers (Google, Twilio, etc.)

## Network Requirements

- **Minimum**: 2 Mbps upload/download per participant
- **Recommended**: 5+ Mbps for HD video
- **Mobile 4G**: Usually sufficient, may have 200-300ms latency
- **WiFi**: Recommended for stable calls

## Browser Support

| Device  | Browser | Status       |
| ------- | ------- | ------------ |
| iPhone  | Safari  | ✅ Supported |
| iPhone  | Chrome  | ✅ Supported |
| Android | Chrome  | ✅ Supported |
| Android | Firefox | ✅ Supported |
| iPad    | Safari  | ✅ Supported |

**Note:** Older browsers may not support WebRTC. Update to latest version.

## Security Considerations

1. **Self-Signed Certificates**: Accept browser warnings only for testing
2. **Production**: Use proper SSL certificates (Let's Encrypt, etc.)
3. **CORS**: Currently allowing all origins for dev - restrict in production
4. **Socket.IO Auth**: Implement proper authentication middleware
5. **Encryption**: Consider DTLS for media encryption

## Future Improvements

- [ ] Screen sharing
- [ ] Recording calls
- [ ] Group video calls (3+ participants)
- [ ] Better UI with native app feel (React Native)
- [ ] Call history and missed calls
- [ ] Network quality indicators
- [ ] Bandwidth adaptation

---

**Last Updated:** May 6, 2026  
**Version:** 1.0.0
