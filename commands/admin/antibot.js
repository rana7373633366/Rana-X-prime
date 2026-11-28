
/**
 * Antibot Command — detect other Baileys bots via message-ID heuristics
 * Contact Card + Full Stylish Replies
 */

const database = require('../../database');
const config = require('../../config');

module.exports = {
  name: 'antibot',
  aliases: ['nobot'],
  category: 'admin',
  description: 'Kick/warn other bots that post in the group (Baileys ID heuristic)',
  usage: '.antibot <on/off/set/get>',
  groupOnly: true,
  adminOnly: true,
  botAdminNeeded: true,

  async execute(sock, msg, args, extra) {

    // ==============================
    // CONTACT CARD + COMMON REPLY
    // ==============================

    const replyWithCard = async (text) => {
      const botNumber = sock.user.id.split(':')[0].split('@')[0];
      const botJid = `${botNumber}@s.whatsapp.net`;

      const contactName = '⎯͢^᪲𝐒ʜꫝʜɪɴ 𝐑ꫝɴꫝ𐙚';

      const vcard = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `FN:${contactName}`,
        `N:${contactName};;;;`,
        `TEL;type=CELL;type=VOICE;waid=${botNumber}:+${botNumber}`,
        'END:VCARD'
      ].join('\n');

      const quotedContact = {
        key: {
          remoteJid: extra.from,
          fromMe: true,
          id: `ANTIBOT-${Date.now()}`,
          participant: botJid
        },
        message: {
          contactMessage: {
            displayName: contactName,
            vcard
          }
        }
      };

      const message =
        `⎯꯭𝆭̽🌀᭡᪳𓆪𝐀ɴᴛɪʙᴏᴛ𝆺𝅥𝆬⎯꯭𝆭̽🤍\n\n` +
        `${text}\n\n` +
        `⎯꯭𝆭̽🫀᭡᪳𝐗-𝐒ʜꫝʜɪɴ 𝐑ꫝɴꫝ 𝆺𝅥𝆬⎯꯭𝆭̽💗`;

      return sock.sendMessage(extra.from, {
        text: message,
        contextInfo: {
          stanzaId: quotedContact.key.id,
          participant: botJid,
          remoteJid: extra.from,
          quotedMessage: quotedContact.message
        }
      });
    };

    try {
      const p = config.prefix;
      const settings = database.getGroupSettings(extra.from);

      // ==============================
      // STATUS + COMMAND MENU
      // ==============================

      if (!args[0]) {
        const status = settings.antibot ? '𝐎𝐍 🟢' : '𝐎𝐅𝐅 🔴';
        const action = settings.antibotAction || 'warn';

        return replyWithCard(
          `⎯꯭𝆭̽🌐᭡᪳𓆪𝐒ᴛꫝᴛᴜs : *${status}*𝆺𝅥𝆬⎯꯭𝆭̽\n` +
          `⎯꯭𝆭̽⚡᭡᪳𓆪𝐀ᴄᴛɪᴏɴ : *${action.toUpperCase()}*𝆺𝅥𝆬⎯꯭𝆭̽\n\n` +

          `⎯꯭𝆭̽🛡️᭡᪳𓆪𝐏ʀᴏᴛᴇᴄᴛɪᴏɴ𝆺𝅥𝆬⎯꯭𝆭̽\n` +
          `⎯꯭𝆭̽👑᭡᪳𓆪Admins, Owner & This Bot𝆺𝅥𝆬⎯꯭𝆭̽\n` +
          `⎯꯭𝆭̽💎᭡᪳𓆪Are exempt from protection.𝆺𝅥𝆬⎯꯭𝆭̽\n\n` +

          `⎯꯭𝆭̽⚙️᭡᪳𓆪𝐂ᴏᴍᴍꫝɴᴅ 𝐌ᴇɴᴜ𝆺𝅥𝆬⎯꯭𝆭̽\n` +
          `⎯꯭𝆭̽🟢᭡᪳𓆪${p}antibot on\n` +
          `⎯꯭𝆭̽🔴᭡᪳𓆪${p}antibot off\n` +
          `⎯꯭𝆭̽⚡᭡᪳𓆪${p}antibot set warn | kick\n` +
          `⎯꯭𝆭̽📋᭡᪳𓆪${p}antibot get`
        );
      }

      const opt = args[0].toLowerCase();

      // ==============================
      // ANTIBOT ON
      // ==============================

      if (opt === 'on') {
        if (settings.antibot) {
          return replyWithCard(
            `⎯꯭𝆭̽💚᭡᪳𓆪𝐀ɴᴛɪʙᴏᴛ ɪs 𝐀ʟʀᴇᴀᴅʏ 𝐎𝐍!𝆺𝅥𝆬⎯꯭𝆭̽\n\n` +
            `⎯꯭𝆭̽✨᭡᪳𓆪𝐏ʀᴏᴛᴇᴄᴛɪᴏɴ ɪs 𝐀ᴄᴛɪᴠᴇ!𝆺𝅥𝆬⎯꯭𝆭̽`
          );
        }

        database.updateGroupSettings(extra.from, {
          antibot: true
        });

        return replyWithCard(
          `⎯꯭𝆭̽🎉᭡᪳𓆪𝐀ɴᴛɪʙᴏᴛ 𝐄ɴꫝʙʟᴇᴅ!𝆺𝅥𝆬⎯꯭𝆭̽\n\n` +
          `⎯꯭𝆭̽💚᭡᪳𓆪𝐒ᴛꫝᴛᴜs : *𝐎𝐍*𝆺𝅥𝆬⎯꯭𝆭̽\n` +
          `⎯꯭𝆭̽🛡️᭡᪳𓆪𝐆ʀᴏᴜᴘ 𝐏ʀᴏᴛᴇᴄᴛɪᴏɴ 𝐀ᴄᴛɪᴠᴀᴛᴇᴅ!𝆺𝅥𝆬⎯꯭𝆭̽\n\n` +
          `⎯꯭𝆭̽🌷᭡᪳𓆪𝐘ᴏᴜʀ 𝐆ʀᴏᴜᴘ ɪs 𝐍ᴏᴡ 𝐏ʀᴏᴛᴇᴄᴛᴇᴅ! 💗`
        );
      }

      // ==============================
      // ANTIBOT OFF
      // ==============================

      if (opt === 'off') {
        database.updateGroupSettings(extra.from, {
          antibot: false
        });

        return replyWithCard(
          `⎯꯭𝆭̽⚠️᭡᪳𓆪𝐀ɴᴛɪʙᴏᴛ 𝐃ɪsꫝʙʟᴇᴅ!𝆺𝅥𝆬⎯꯭𝆭̽\n\n` +
          `⎯꯭𝆭̽❤️‍🩹᭡᪳𓆪𝐒ᴛꫝᴛᴜs : *𝐎𝐅𝐅*𝆺𝅥𝆬⎯꯭𝆭̽\n` +
          `⎯꯭𝆭̽🔓᭡᪳𓆪𝐆ʀᴏᴜᴘ 𝐏ʀᴏᴛᴇᴄᴛɪᴏɴ 𝐃ᴇᴀᴄᴛɪᴠᴀᴛᴇᴅ!𝆺𝅥𝆬⎯꯭𝆭̽\n\n` +
          `⎯꯭𝆭̽🌙᭡᪳𓆪𝐏ʀᴏᴛᴇᴄᴛɪᴏɴ ɪs 𝐍ᴏᴡ 𝐎𝐅𝐅!`
        );
      }

      // ==============================
      // SET ACTION
      // ==============================

      if (opt === 'set') {
        if (args.length < 2) {
          return replyWithCard(
            `⎯꯭𝆭̽⚙️᭡᪳𓆪𝐒ᴇᴛ 𝐀ᴄᴛɪᴏɴ 𝐔sꫝɢᴇ𝆺𝅥𝆬⎯꯭𝆭̽\n\n` +
            `⎯꯭𝆭̽📝᭡᪳𓆪𝐔sꫝɢᴇ :\n` +
            `⎯꯭𝆭̽💬᭡᪳𓆪${p}antibot set warn\n` +
            `⎯꯭𝆭̽🚫᭡᪳𓆪${p}antibot set kick`
          );
        }

        const setAction = args[1].toLowerCase();

        if (!['warn', 'kick'].includes(setAction)) {
          return replyWithCard(
            `⎯꯭𝆭̽❌᭡᪳𓆪𝐈ɴᴠꫝʟɪᴅ 𝐀ᴄᴛɪᴏɴ!𝆺𝅥𝆬⎯꯭𝆭̽\n\n` +
            `⎯꯭𝆭̽💡᭡᪳𓆪𝐂ʜᴏᴏsᴇ *warn* ᴏʀ *kick*.`
          );
        }

        database.updateGroupSettings(extra.from, {
          antibotAction: setAction,
          antibot: true
        });

        return replyWithCard(
          `⎯꯭𝆭̽✅᭡᪳𓆪𝐀ᴄᴛɪᴏɴ 𝐔ᴘᴅꫝᴛᴇᴅ!𝆺𝅥𝆬⎯꯭𝆭̽\n\n` +
          `⎯꯭𝆭̽🎯᭡᪳𓆪𝐍ᴇᴡ 𝐀ᴄᴛɪᴏɴ : *${setAction.toUpperCase()}*\n` +
          `⎯꯭𝆭̽💚᭡᪳𓆪𝐒ᴛꫝᴛᴜs : *𝐎𝐍*\n\n` +
          `⎯꯭𝆭̽✨᭡᪳𓆪𝐒ᴇᴛᴛɪɴɢs 𝐒ᴀᴠᴇᴅ 𝐒ᴜᴄᴄᴇssғᴜʟʟʏ! 💗`
        );
      }

      // ==============================
      // GET CONFIGURATION
      // ==============================

      if (opt === 'get') {
        const status = settings.antibot ? '𝐎𝐍 🟢' : '𝐎𝐅𝐅 🔴';
        const action = settings.antibotAction || 'warn';

        return replyWithCard(
          `⎯꯭𝆭̽📋᭡᪳𓆪𝐀ɴᴛɪʙᴏᴛ 𝐂ᴏɴғɪɢᴜʀꫝᴛɪᴏɴ𝆺𝅥𝆬⎯꯭𝆭̽\n\n` +
          `⎯꯭𝆭̽🌐᭡᪳𓆪𝐒ᴛꫝᴛᴜs : *${status}*𝆺𝅥𝆬⎯꯭𝆭̽\n` +
          `⎯꯭𝆭̽⚡᭡᪳𓆪𝐀ᴄᴛɪᴏɴ : *${action.toUpperCase()}*𝆺𝅥𝆬⎯꯭𝆭̽\n` +
          `⎯꯭𝆭̽🛡️᭡᪳𓆪𝐏ʀᴏᴛᴇᴄᴛɪᴏɴ : *Active*𝆺𝅥𝆬⎯꯭𝆭̽`
        );
      }

      // ==============================
      // INVALID COMMAND
      // ==============================

      return replyWithCard(
        `⎯꯭𝆭̽⚠️᭡᪳𓆪𝐈ɴᴠꫝʟɪᴅ 𝐂ᴏᴍᴍꫝɴᴅ!𝆺𝅥𝆬⎯꯭𝆭̽\n\n` +
        `⎯꯭𝆭̽📌᭡᪳𓆪𝐔sꫝɢᴇ : \`${p}antibot\`\n` +
        `⎯꯭𝆭̽💡᭡᪳𓆪𝐓ʏᴘᴇ 𝐓ʜᴇ 𝐂ᴏʀʀᴇᴄᴛ 𝐂ᴏᴍᴍꫝɴᴅ.`
      );

    } catch (error) {
      console.error('antibot.js error:', error);

      try {
        return await replyWithCard(
          `⎯꯭𝆭̽❌᭡᪳𓆪𝐀ɴᴛɪʙᴏᴛ 𝐄ʀʀᴏʀ!𝆺𝅥𝆬⎯꯭𝆭̽\n\n` +
          `⎯꯭𝆭̽⚠️᭡᪳𓆪${error.message}`
        );
      } catch (replyError) {
        console.error('antibot error reply failed:', replyError);
        return extra.reply(`❌ Antibot Error: ${error.message}`);
      }
    }
  }
};
