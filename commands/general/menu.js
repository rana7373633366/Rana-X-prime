/**
 * Menu Command - Display all available commands
 */

const config = require('../../config');
const { loadCommands } = require('../../utils/commandLoader');

module.exports = {
  name: 'menu',
  aliases: ['help', 'commands'],
  category: 'general',
  description: 'Show all available commands',
  usage: '.menu',
  
  async execute(sock, msg, args, extra) {
    try {
      // React to menu command
      await sock.sendMessage(extra.from, {
        react: {
          text: '📜',
          key: msg.key
        }
      });

      // Loading Message
      await sock.sendMessage(extra.from, {
        text: '.⋆⏤͟͟͞͞🌼𐙚𝐋ᴏꫝᴅɪɴɢ...⤹• 𓂃ꜛ⸙'
      }, { quoted: msg });


      const commands = loadCommands();
      const categories = {};
      
      // Group commands by category
      commands.forEach((cmd, name) => {
        if (cmd.name === name) { // Only count main command names, not aliases
          if (!categories[cmd.category]) {
            categories[cmd.category] = [];
          }
          categories[cmd.category].push(cmd);
        }
      });
      
      const ownerNames = Array.isArray(config.ownerName) ? config.ownerName : [config.ownerName];
      const displayOwner = ownerNames[0] || config.ownerName || 'Bot Owner';function fancyText(text = "") {

  text = String(text).toLowerCase();

  const first = {

    a:"𝐀",b:"𝐁",c:"𝐂",d:"𝐃",e:"𝐄",f:"𝐅",g:"𝐆",h:"𝐇",

    i:"𝐈",j:"𝐉",k:"𝐊",l:"𝐋",m:"𝐌",n:"𝐍",o:"𝐎",p:"𝐏",

    q:"𝐐",r:"𝐑",s:"𝐒",t:"𝐓",u:"𝐔",v:"𝐕",w:"𝐖",x:"𝐗",

    y:"𝐘",z:"𝐙"

  };

  const rest = {

    a:"ᴀ",b:"ʙ",c:"ᴄ",d:"ᴅ",e:"ᴇ",f:"ғ",g:"ɢ",h:"ʜ",

    i:"ɪ",j:"ᴊ",k:"ᴋ",l:"ʟ",m:"ᴍ",n:"ɴ",o:"ᴏ",p:"ᴘ",

    q:"ǫ",r:"ʀ",s:"ꜱ",t:"ᴛ",u:"ᴜ",v:"ᴠ",w:"ᴡ",x:"x",

    y:"ʏ",z:"ᴢ"

  };

  return [...text].map((c, i) => {

    if (/[a-z]/.test(c)) {

      return i === 0 ? first[c] : rest[c];

    }

    return c;

  }).join("");

}
 
   
const now = new Date();

const time = now.toLocaleTimeString('en-GB', {

  hour: '2-digit',

  minute: '2-digit',

  hour12: true

});

const date = now.toLocaleDateString('en-GB');

// Menu Header

let menuText = `*╭-•━ Ξ ⤹•𝐗-𝐒ʜꫝʜɪɴ-𝐁ᴏᴛ𓂃ꜛ⸙*
*┃🫀 ᴍᴏᴅᴇ    :PUBLIC 💞*
*┃👀 ᴘʀᴇғɪx  : ${config.prefix}*
*┃🫂 ᴜsᴇʀ: @${extra.sender.split('@')[0]}*
*┃👑ᴏᴡɴᴇʀ:*${displayOwner}
*┃🕊️𝐃ᴇᴠᴇʟᴏᴘᴇʀ: 𝐒ʜꫝʜɪɴ💗*
*┃⚙️𝐏ʟꫝᴛғᴏʀᴍ: ᴛᴇʀᴍᴜ𝘅*
*┃🍅𝐁ᴏᴛ:${config.botName}*
*┃📊 ᴄᴏᴍᴍꫝɴᴅs : ${commands.size}*
*╰•━───────────────♡︎*
`;




   // Read More Spacer
menuText += '\u200E'.repeat(4001);
      
   // General Commands
if (categories.general) {
  menuText += `*╭-•🫀 Ξ ⤹• ɢᴇɴᴇʀᴀʟ ᴄᴏᴍᴍᴀɴᴅs𓂃ꜛ⸙*\n`;

  categories.general.forEach(cmd => {
    menuText += `*┋  ➠ ${config.prefix}${fancyText(cmd.name)}*\n`;
  });

  menuText += `*╰─────────────────♡︎*\n\n`;
}

// AI Commands
if (categories.ai) {
  menuText += `*╭-•🫀 Ξ ⤹• ᴀɪ ᴄᴏᴍᴍᴀɴᴅs𓂃ꜛ⸙*\n`;

  categories.ai.forEach(cmd => {
    menuText += `*┋  ➠ ${config.prefix}${fancyText(cmd.name)}*\n`;
  });

  menuText += `*╰─────────────────♡︎*\n\n`;
}

// Group Commands
if (categories.group) {
  menuText += `*╭-•🫀 Ξ ⤹• ɢʀᴏᴜᴘ ᴄᴏᴍᴍᴀɴᴅs𓂃ꜛ⸙*\n`;

  categories.group.forEach(cmd => {
    menuText += `*┋  ➠ ${config.prefix}${fancyText(cmd.name)}*\n`;
  });

  menuText += `*╰─────────────────♡︎*\n\n`;
}

// Admin Commands
if (categories.admin) {
  menuText += `*╭-•🫀 Ξ ⤹• ᴀᴅᴍɪɴ ᴄᴏᴍᴍᴀɴᴅs𓂃ꜛ⸙*\n`;

  categories.admin.forEach(cmd => {
    menuText += `*┋  ➠ ${config.prefix}${fancyText(cmd.name)}*\n`;
  });

  menuText += `*╰─────────────────♡︎*\n\n`;
}

// Owner Commands
if (categories.owner) {
  menuText += `*╭-•🫀 Ξ ⤹• ᴏᴡɴᴇʀ ᴄᴏᴍᴍᴀɴᴅs𓂃ꜛ⸙*\n`;

  categories.owner.forEach(cmd => {
    menuText += `*┋  ➠ ${config.prefix}${fancyText(cmd.name)}*\n`;
  });

  menuText += `*╰─────────────────♡︎*\n\n`;
}

// Media Commands
if (categories.media) {
  menuText += `*╭-•🫀 Ξ ⤹• ᴍᴇᴅɪᴀ ᴄᴏᴍᴍᴀɴᴅs𓂃ꜛ⸙*\n`;

  categories.media.forEach(cmd => {
    menuText += `*┋  ➠ ${config.prefix}${fancyText(cmd.name)}*\n`;
  });

  menuText += `*╰─────────────────♡︎*\n\n`;
}

// Fun Commands
if (categories.fun) {
  menuText += `*╭-•🫀 Ξ ⤹• ғᴜɴ ᴄᴏᴍᴍᴀɴᴅs𓂃ꜛ⸙*\n`;

  categories.fun.forEach(cmd => {
    menuText += `*┋  ➠ ${config.prefix}${fancyText(cmd.name)}*\n`;
  });

  menuText += `*╰─────────────────♡︎*\n\n`;
}

// Economy Commands
if (categories.economy) {
  const economyCmds = categories.economy.filter(
    (cmd) => !cmd.ownerOnly || extra.isOwner
  );

  if (economyCmds.length) {
    menuText += `*╭-•🫀 Ξ ⤹• ᴇᴄᴏɴᴏᴍʏ ᴄᴏᴍᴍᴀɴᴅs𓂃ꜛ⸙*\n`;

    economyCmds.forEach(cmd => {
      menuText += `*┋  ➠ ${config.prefix}${fancyText(cmd.name)}*\n`;
    });

    menuText += `*╰─────────────────♡︎*\n\n`;
  }
}

// Utility Commands
if (categories.utility) {
  menuText += `*╭-•🫀 Ξ ⤹• ᴜᴛɪʟɪᴛʏ ᴄᴏᴍᴍᴀɴᴅs𓂃ꜛ⸙*\n`;

  categories.utility.forEach(cmd => {
    menuText += `*┋  ➠ ${config.prefix}${fancyText(cmd.name)}*\n`;
  });

  menuText += `*╰─────────────────♡︎*\n\n`;
}

// Anime Commands
if (categories.anime) {
  menuText += `*╭-•🫀 Ξ ⤹• ᴀɴɪᴍᴇ ᴄᴏᴍᴍᴀɴᴅs𓂃ꜛ⸙*\n`;

  categories.anime.forEach(cmd => {
    menuText += `*┋  ➠ ${config.prefix}${fancyText(cmd.name)}*\n`;
  });

  menuText += `*╰─────────────────♡︎*\n\n`;
}

// Textmaker Commands
if (categories.textmaker) {
  menuText += `*╭-•🫀 Ξ ⤹• ᴛᴇxᴛᴍᴀᴋᴇʀ ᴄᴏᴍᴍᴀɴᴅs𓂃ꜛ⸙*\n`;

  categories.textmaker.forEach(cmd => {
    menuText += `*┋  ➠ ${config.prefix}${fancyText(cmd.name)}*\n`;
  });

  menuText += `*╰─────────────────♡︎*\n\n`;
}
menuText += `_*Made with love by X-♡𝐑ꫝɴꫝ♡😩🫶*_\n`;   









      

      
            // ==============================
      // CONTACT CARD INFO
      // ==============================

      const botNumber = sock.user.id
        .split(':')[0]
        .split('@')[0];

      const contactName = '⎯͢^᪲𝐒ʜꫝʜɪɴ 𝐑ꫝɴꫝ𐙚';

      const vcard = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `FN:${contactName}`,
        `N:${contactName};;;;`,
        `TEL;type=CELL;type=VOICE;waid=${botNumber}:+${botNumber}`,
        'END:VCARD'
      ].join('\n');

      // ==============================
      // CONTACT CARD QUOTE
      // ==============================

      const quotedContact = {
        key: {
          remoteJid: extra.from,
          fromMe: true,
          id: `CONTACT_${Date.now()}`,
          participant: sock.user.id
        },
        message: {
          contactMessage: {
            displayName: contactName,
            vcard: vcard
          }
        },
        messageTimestamp: Math.floor(Date.now() / 1000)
      };

      // ==============================
      // SEND MENU WITH IMAGE + VCARD
      // ==============================

      const fs = require('fs');
      const path = require('path');
      const imagePath = path.join(__dirname, '../../utils/bot_image.jpg');

      if (fs.existsSync(imagePath)) {
        const imageBuffer = fs.readFileSync(imagePath);

        await sock.sendMessage(extra.from, {
          image: imageBuffer,
          caption: menuText,
          mentions: [extra.sender],
          contextInfo: {
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: config.newsletterJid || '120363429830985012@newsletter',
              newsletterName: config.botName,
              serverMessageId: -1
            }
          }
        }, { quoted: quotedContact });

      } else {
        await sock.sendMessage(extra.from, {
          text: menuText,
          mentions: [extra.sender]
        }, { quoted: quotedContact });
      }
      

      
 


 
       
   
   

           

 
   
     
              
            
          
        
 

        
          
 
      
      
    } catch (error) {
      await extra.reply(`❌ Error: ${error.message}`);
    }
  }
};
