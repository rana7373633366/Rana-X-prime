
/**
 * Antispam Command — delete message bursts, then warn or kick
 * Contact Card + Full Stylish Replies
 */

const database = require('../../database');
const config = require('../../config');

module.exports = {
  name: 'antispam',
  aliases: ['nospam'],
  category: 'admin',
  description: 'Delete fast message bursts and warn or kick the sender',
  usage: '.antispam <on/off/set/get>',
  groupOnly: true,
  adminOnly: true,
  botAdminNeeded: true,

  async execute(sock, msg, args, extra) {
    try {
      const p = config.prefix;
      const settings = database.getGroupSettings(extra.from);

      // ==============================
      // BOT CONTACT CARD
      // ==============================

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
          id: `ANTISPAM-${Date.now()}`,
          participant: botJid
        },
        message: {
          contactMessage: {
            displayName: contactName,
            vcard
          }
        }
      };

      // ==============================
      // COMMON STYLED REPLY
      // ==============================

      const replyWithCard = async (text) => {
        const message =
          `⎯꯭𝆭̽🌀᭡᪳𓆪𝐀ɴᴛɪsᴘᴀᴍ𝆺𝅥𝆬⎯꯭𝆭̽🤍\n\n` +
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

      // ==============================
      // STATUS + COMMAND MENU
      // ==============================

      if (!args[0]) {
        const status = settings.antiSpam ? '𝐎𝐍 🟢' : '𝐎𝐅𝐅 🔴';
        const action = settings.antiSpamAction || 'warn';

        return replyWithCard(
          `⎯꯭𝆭̽🌐᭡᪳𓆪𝐒ᴛꫝᴛᴜs : *${status}*𝆺𝅥𝆬⎯꯭𝆭̽\n` +
          `⎯꯭𝆭̽⚡᭡᪳𓆪𝐀ᴄᴛɪᴏɴ : *${action.toUpperCase()}*𝆺𝅥𝆬⎯꯭𝆭̽\n\n` +

          `⎯꯭𝆭̽🛡️᭡᪳𓆪𝐏ʀᴏᴛᴇᴄᴛɪᴏɴ𝆺𝅥𝆬⎯꯭𝆭̽\n` +
          `⎯꯭𝆭̽🚫᭡᪳𓆪5 messages in 8 seconds𝆺𝅥𝆬⎯꯭𝆭̽\n` +
          `⎯꯭𝆭̽🔁᭡᪳𓆪Same text 3 times𝆺𝅥𝆬⎯꯭𝆭̽\n` +
          `⎯꯭𝆭̽👑᭡᪳𓆪Admins, Owner & This Bot𝆺𝅥𝆬⎯꯭𝆭̽\n` +
          `⎯꯭𝆭̽💎᭡᪳𓆪Are exempt from protection.𝆺𝅥𝆬⎯꯭𝆭̽\n\n` +

          `⎯꯭𝆭̽⚙️᭡᪳𓆪𝐂ᴏᴍᴍꫝɴᴅ 𝐌ᴇɴᴜ𝆺𝅥𝆬⎯꯭𝆭̽\n` +
          `⎯꯭𝆭̽🟢᭡᪳𓆪${p}antispam on\n` +
          `⎯꯭𝆭̽🔴᭡᪳𓆪${p}antispam off\n` +
          `⎯꯭𝆭̽⚡᭡᪳𓆪${p}antispam set warn | kick\n` +
          `⎯꯭𝆭̽📋᭡᪳𓆪${p}antispam get`
        );
      }

      const opt = args[0].toLowerCase();

      // ==============================
      // ANTISPAM ON
      // ==============================

      if (opt === 'on') {
        if (settings.antiSpam) {
          return replyWithCard(
            `⎯꯭𝆭̽💚᭡᪳𓆪𝐀ɴᴛɪsᴘᴀᴍ ɪs 𝐀ʟʀᴇᴀᴅʏ 𝐎𝐍!𝆺𝅥𝆬⎯꯭𝆭̽\n\n` +
            `⎯꯭𝆭̽✨᭡᪳𓆪𝐏ʀᴏᴛᴇᴄᴛɪᴏɴ ɪs 𝐀ᴄᴛɪᴠᴇ!𝆺𝅥𝆬⎯꯭𝆭̽`
          );
        }

        database.updateGroupSettings(extra.from, {
          antiSpam: true
        });

        return replyWithCard(
          `⎯꯭𝆭̽🎉᭡᪳𓆪𝐀ɴᴛɪsᴘᴀᴍ 𝐄ɴꫝʙʟᴇᴅ!𝆺𝅥𝆬⎯꯭𝆭̽\n\n` +
          `⎯꯭𝆭̽💚᭡᪳𓆪𝐒ᴛꫝᴛᴜs : *𝐎𝐍*𝆺𝅥𝆬⎯꯭𝆭̽\n` +
          `⎯꯭𝆭̽🛡️᭡᪳𓆪Group Spam Protection Activated!𝆺𝅥𝆬⎯꯭𝆭̽\n\n` +
          `⎯꯭𝆭̽🌷᭡᪳𓆪𝐘ᴏᴜʀ 𝐆ʀᴏᴜᴘ ɪs 𝐍ᴏᴡ 𝐏ʀᴏᴛᴇᴄᴛᴇᴅ! 💗`
        );
      }

      // ==============================
      // ANTISPAM OFF
      // ==============================

      if (opt === 'off') {
        database.updateGroupSettings(extra.from, {
          antiSpam: false
        });

        return replyWithCard(
          `⎯꯭𝆭̽⚠️᭡᪳𓆪𝐀ɴᴛɪsᴘᴀᴍ 𝐃ɪsꫝʙʟᴇᴅ!𝆺𝅥𝆬⎯꯭𝆭̽\n\n` +
          `⎯꯭𝆭̽❤️‍🩹᭡᪳𓆪𝐒ᴛꫝᴛᴜs : *𝐎𝐅𝐅*𝆺𝅥𝆬⎯꯭𝆭̽\n` +
          `⎯꯭𝆭̽🔓᭡᪳𓆪Group Spam Protection Deactivated!𝆺𝅥𝆬⎯꯭𝆭̽\n\n` +
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
            `⎯꯭𝆭̽💬᭡᪳𓆪${p}antispam set warn\n` +
            `⎯꯭𝆭̽🚫᭡᪳𓆪${p}antispam set kick`
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
          antiSpamAction: setAction,
          antiSpam: true,
        });

        return replyWithCard(
          `⎯꯭𝆭̽✅᭡᪳𓆪𝐀ᴄᴛɪᴏɴ 𝐔ᴘᴅꫝᴛᴇᴅ!𝆺𝅥𝆬⎯꯭𝆭̽\n\n` +
          `⎯꯭𝆭̽🎯᭡᪳𓆪𝐍ᴇᴡ 𝐀ᴄᴛɪᴏɴ : *${setAction.toUpperCase()}*𝆺𝅥𝆬⎯꯭𝆭̽\n` +
          `⎯꯭𝆭̽💚᭡᪳𓆪𝐒ᴛꫝᴛᴜs : *𝐎𝐍*𝆺𝅥𝆬⎯꯭𝆭̽\n\n` +
          `⎯꯭𝆭̽✨᭡᪳𓆪𝐒ᴇᴛᴛɪɴɢs 𝐒ᴀᴠᴇᴅ 𝐒ᴜᴄᴄᴇssғᴜʟʟʏ! 💗`
        );
      }

      // ==============================
      // GET CONFIGURATION
      // ==============================

      if (opt === 'get') {
        const status = settings.antiSpam ? '𝐎𝐍 🟢' : '𝐎𝐅𝐅 🔴';
        const action = settings.antiSpamAction || 'warn';

        return replyWithCard(
          `⎯꯭𝆭̽📋᭡᪳𓆪𝐀ɴᴛɪsᴘᴀᴍ 𝐂ᴏɴғɪɢᴜʀꫝᴛɪᴏɴ𝆺𝅥𝆬⎯꯭𝆭̽\n\n` +
          `⎯꯭𝆭̽🌐᭡᪳𓆪𝐒ᴛꫝᴛᴜs : *${status}*𝆺𝅥𝆬⎯꯭𝆭̽\n` +
          `⎯꯭𝆭̽⚡᭡᪳𓆪𝐀ᴄᴛɪᴏɴ : *${action.toUpperCase()}*𝆺𝅥𝆬⎯꯭𝆭̽\n` +
          `⎯꯭𝆭̽🛡️᭡᪳𓆪𝐏ʀᴏᴛᴇᴄᴛɪᴏɴ : *Active*𝆺𝅥𝆬⎯꯭𝆭̽\n\n` +
          `⎯꯭𝆭̽🚫᭡᪳𓆪5 messages in 8 seconds\n` +
          `⎯꯭𝆭̽🔁᭡᪳𓆪Same text 3 times`
        );
      }

      // ==============================
      // INVALID COMMAND
      // ==============================

      return replyWithCard(
        `⎯꯭𝆭̽⚠️᭡᪳𓆪𝐈ɴᴠꫝʟɪᴅ 𝐂ᴏᴍᴍꫝɴᴅ!𝆺𝅥𝆬⎯꯭𝆭̽\n\n` +
        `⎯꯭𝆭̽📌᭡᪳𓆪𝐔sꫝɢᴇ : \`${p}antispam\`\n` +
        `⎯꯭𝆭̽💡᭡᪳𓆪𝐓ʏᴘᴇ 𝐓ʜᴇ 𝐂ᴏʀʀᴇᴄᴛ 𝐂ᴏᴍᴍꫝɴᴅ.`
      );

    } catch (error) {
      console.error('antispam.js error:', error);

      await extra.reply(
        `⎯꯭𝆭̽❌᭡᪳𓆪𝐀ɴᴛɪsᴘᴀᴍ 𝐄ʀʀᴏʀ!𝆺𝅥𝆬⎯꯭𝆭̽\n\n` +
        `⎯꯭𝆭̽⚠️᭡᪳𓆪${error.message}\n\n` +
        `⎯꯭𝆭̽🫀᭡᪳𝐗-𝐒ʜꫝʜɪɴ 𝐑ꫝɴꫝ 𝆺𝅥𝆬⎯꯭𝆭̽💗`
      );
    }
  },
};
