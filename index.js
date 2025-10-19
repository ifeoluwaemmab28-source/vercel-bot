// VERCEL WHATSAPP BOT - UBUNTU + VS CODE
console.log('🚀 Vercel WhatsApp Bot Starting...');

const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const http = require('http');

// HTTP Server for Vercel
const server = http.createServer((req, res) => {
  console.log('🌐 Vercel Request Received');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('🤖 WhatsApp Bot is running on Vercel!');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🌐 Server running on port ${PORT}`);
});

// WhatsApp Bot
async function startBot() {
  console.log('🔄 Initializing WhatsApp for Vercel...');
  
  try {
    const { state, saveCreds } = await useMultiFileAuthState('./auth_files');
    console.log('✅ Auth loaded for Vercel');
    
    const sock = makeWASocket({
      auth: state,
      printQRInTerminal: false
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
      const { connection, qr } = update;
      
      console.log('🔗 Vercel Connection Update:', connection);
      
      if (qr) {
        console.log('\n✨✨✨ VERCEL QR CODE ✨✨✨');
        console.log('==============================');
        qrcode.generate(qr, { small: true });
        console.log('==============================');
        console.log('📱 Scan with WhatsApp → Linked Devices');
        console.log('🚀 Bot will stay alive on Vercel!');
        console.log('✨✨✨✨✨✨✨✨✨✨✨✨✨✨\n');
      }
      
      if (connection === 'open') {
        console.log('🎉 VERCEL SUCCESS: WhatsApp Connected!');
        console.log('🤖 Bot is ready on Vercel!');
      }
      
      if (connection === 'close') {
        console.log('🔄 Vercel: Reconnecting...');
        setTimeout(startBot, 5000);
      }
    });

    sock.ev.on('messages.upsert', (m) => {
      const msg = m.messages[0];
      if (!msg.message || msg.key.fromMe) return;
      
      const text = msg.message.conversation || '';
      const sender = msg.key.remoteJid;
      const name = msg.pushName || 'User';
      
      console.log(`💬 Vercel Message from ${name}: ${text}`);
      
      if (text === 'ping') {
        sock.sendMessage(sender, { text: `🏓 Vercel Pong! ${name}` });
      }
      else if (text === 'menu') {
        sock.sendMessage(sender, { text: '🤖 Vercel Bot\nCommands: ping, menu, vercel' });
      }
      else if (text === 'vercel') {
        sock.sendMessage(sender, { text: '🚀 This bot is running on Vercel!' });
      }
    });

  } catch (error) {
    console.log('❌ Vercel Error:', error.message);
    setTimeout(startBot, 5000);
  }
}

// Start bot
startBot();
console.log('✅ Vercel bot process started!');