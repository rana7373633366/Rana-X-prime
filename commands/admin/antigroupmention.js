
/**
 * Anti-Group Mention Command
 * Toggle antigroupmention protection with delete/kick options
 */

const database = require('../../database');

module.exports = {
  name: 'antigroupmention',
  aliases: ['agm'],
  category: 'admin',
  description: 'Configure antigroupmention protection (delete/kick)',
  usage: '.antigroupmention <on/off/set/get>',
  groupOnly: true,
  adminOnly: true,
  botAdminNeeded: true,

  async execute(sock, msg, args, extra) {
    try {
      // ==============================
      // BOT CONTACT CARD
      // ==============================

      const botNumber = sock.user.id
        .split(':')[0]
        .split('@')[0];

      const botJid = `${botNumber}@s.whatsapp.net`;

      const contactName =
        '⎯͢^᪲𝐒ʜꫝʜɪɴ 𝐑ꫝɴꫝ𐙚';

      const vcard = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `FN:${contactName}`,
        `N:${contactName};;;;`,
        `TEL;type=CELL;type=VOICE;waid=${botNumber}:+${botNumber}`,
        'END:VCARD'
      ].join('\n');

      // ==============================
      // CONTACT PREVIEW
      // ==============================

      const quotedContact = {
        key: {
          remoteJid: extra.from,
          fromMe: true,
          id: `AGM-CONTACT-${Date.now()}`,
          participant: botJid
        },
        message: {
          contactMessage: {
            displayName: contactName,
            vcard: vcard
          }
        }
      };

      // ==============================
      // STYLED REPLY
      // ==============================

      const replyWithCard = async (text) => {
        const message =
          `⎯꯭𝆭̽🌀᭡᪳𓆪𝐀ɴᴛɪɢʀᴏᴜᴘᴍᴇɴᴛɪᴏɴ𝆺𝅥𝆬⎯꯭𝆭̽🤍\n\n` +
          `${text}\n\n` +
          `⎯꯭𝆭̽🫀᭡᪳𝐗-𝐒ʜꫝʜɪɴ 𝐑ꫝɴꫝ 𝆺𝅥𝆬⎯꯭𝆭̽💗`;

        return await sock.sendMessage(
          extra.from,
          {
            text: message,
            contextInfo: {
              stanzaId: `AGM-${Date.now()}`,
              participant: botJid,
              remoteJid: extra.from,
              quotedMessage: quotedContact.message
            }
          }
        );
      };

      // ==============================
      // NO ARGUMENT
      // ==============================

      if (!args[0]) {
        const settings = database.getGroupSettings(extra.from);

        const status = settings.antigroupmention
          ? '𝐎𝐍 🟢'
          : '𝐎𝐅𝐅 🔴';

        const action = settings.antigroupmentionAction || 'delete';

        return replyWithCard(
          `⎯꯭𝆭̽🌐᭡᪳𓆪𝐒ᴛꫝᴛᴜs : *${status}*𝆺𝅥𝆬⎯꯭𝆭̽🤍\n` +
          `⎯꯭𝆭̽⚡᭡᪳𓆪𝐀ᴄᴛɪᴏɴ : *${action.toUpperCase()}*𝆺𝅥𝆬⎯꯭𝆭̽🤍\n\n` +

          `⎯꯭𝆭̽🛡️᭡᪳𓆪𝐏ʀᴏᴛᴇᴄᴛɪᴏɴ𝆺𝅥𝆬⎯꯭𝆭̽🤍\n` +
          `⎯꯭𝆭̽🚫᭡᪳𓆪Group Mention Protection𝆺𝅥𝆬⎯꯭𝆭̽\n` +
          `⎯꯭𝆭̽💎᭡᪳𓆪Keep your group protected.𝆺𝅥𝆬⎯꯭𝆭̽🤍\n\n` +

          `⎯꯭𝆭̽⚙️᭡᪳𓆪𝐂ᴏᴍᴍꫝɴᴅ 𝐌ᴇɴᴜ𝆺𝅥𝆬⎯꯭𝆭̽🤍\n` +
          `⎯꯭𝆭̽🟢᭡᪳𓆪.antigroupmention on𝆺𝅥𝆬\n` +
          `⎯꯭𝆭̽🔴᭡᪳𓆪.antigroupmention off𝆺𝅥𝆬\n` +
          `⎯꯭𝆭̽⚡᭡᪳𓆪.antigroupmention set delete𝆺𝅥𝆬\n` +
          `⎯꯭𝆭̽⚡᭡᪳𓆪.antigroupmention set kick𝆺𝅥𝆬\n` +
          `⎯꯭𝆭̽📋᭡᪳𓆪.antigroupmention get𝆺𝅥𝆬⎯꯭𝆭̽🤍`
        );
      }

      // ==============================
      // OPTION
      // ==============================

      const opt = args[0].toLowerCase();

      // ==============================
      // ON
      // ==============================

      if (opt === 'on') {
        if (
          database.getGroupSettings(extra.from)
            .antigroupmention
        ) {
          return replyWithCard(
            `⎯꯭𝆭̽💚᭡᪳𓆪𝐏ʀᴏᴛᴇᴄᴛɪᴏɴ ɪs 𝐀ʟʀᴇᴀᴅʏ 𝐎𝐍!𝆺𝅥𝆬⎯꯭𝆭̽🤍\n` +
            `⎯꯭𝆭̽✨᭡᪳𓆪Everything is working.𝆺𝅥𝆬⎯꯭𝆭̽`
          );
        }

        database.updateGroupSettings(
          extra.from,
          {
            antigroupmention: true
          }
        );

        return replyWithCard(
          `⎯꯭𝆭̽🎉᭡᪳𓆪 𝐏ʀᴏᴛᴇᴄᴛɪᴏɴ 𝐄ɴꫝʙʟᴇᴅ!𝆺𝅥𝆬⎯꯭𝆭̽\n` +
          `⎯꯭𝆭̽💚᭡᪳𓆪𝐒ᴛꫝᴛᴜs : *𝐎𝐍*𝆺𝅥𝆬⎯꯭𝆭̽🤍\n` +
          `⎯꯭𝆭̽🛡️᭡᪳𓆪Group protection activated.𝆺𝅥𝆬⎯꯭𝆭̽\n\n` +
          `⎯꯭𝆭̽🌷᭡᪳𓆪𝐘ᴏᴜʀ ɢʀᴏᴜᴘ ɪs ɴᴏᴡ 𝐏ʀᴏᴛᴇᴄᴛᴇᴅ! 💗𝆺𝅥𝆬⎯꯭𝆭̽`
        );
      }

      // ==============================
      // OFF
      // ==============================

      if (opt === 'off') {
        database.updateGroupSettings(
          extra.from,
          {
            antigroupmention: false
          }
        );

        return replyWithCard(
          `⎯꯭𝆭̽⚠️᭡᪳𓆪𝐏ʀᴏᴛᴇᴄᴛɪᴏɴ 𝐃ɪsꫝʙʟᴇᴅ!𝆺𝅥𝆬⎯꯭𝆭̽\n` +
          `⎯꯭𝆭̽❤️‍🩹᭡᪳𓆪𝐒ᴛꫝᴛᴜs : *𝐎𝐅𝐅*𝆺𝅥𝆬⎯꯭𝆭̽🤍\n` +
          `⎯꯭𝆭̽🔓᭡᪳𓆪Protection is now disabled.𝆺𝅥𝆬⎯꯭𝆭̽\n\n` +
          `⎯꯭𝆭̽🌙᭡᪳𓆪𝐏ʀᴏᴛᴇᴄᴛɪᴏɴ ɪs ɴᴏᴡ 𝐎𝐅𝐅!𝆺𝅥𝆬⎯꯭𝆭̽`
        );
      }

      // ==============================
      // SET ACTION
      // ==============================

      if (opt === 'set') {
        if (args.length < 2) {
          return replyWithCard(
            `⎯꯭𝆭̽📝᭡᪳𓆪𝐔sꫝɢᴇ :𝆺𝅥𝆬⎯꯭𝆭̽🤍\n` +
            `⎯꯭𝆭̽🗑️᭡᪳𓆪.antigroupmention set delete𝆺𝅥𝆬\n` +
            `⎯꯭𝆭̽🚫᭡᪳𓆪.antigroupmention set kick𝆺𝅥𝆬⎯꯭𝆭̽`
          );
        }

        const setAction = args[1].toLowerCase();

        if (!['delete', 'kick'].includes(setAction)) {
          return replyWithCard(
            `⎯꯭𝆭̽❌᭡᪳𓆪𝐈ɴᴠꫝʟɪᴅ 𝐀ᴄᴛɪᴏɴ!𝆺𝅥𝆬⎯꯭𝆭̽\n` +
            `⎯꯭𝆭̽💡᭡᪳𓆪Choose *delete* or *kick*.𝆺𝅥𝆬⎯꯭𝆭̽🤍`
          );
        }

        database.updateGroupSettings(
          extra.from,
          {
            antigroupmentionAction: setAction,
            antigroupmention: true
          }
        );

        return replyWithCard(
          `⎯꯭𝆭̽✅᭡᪳𓆪𝐀ᴄᴛɪᴏɴ 𝐔ᴘᴅꫝᴛᴇᴅ!𝆺𝅥𝆬⎯꯭𝆭̽\n` +
          `⎯꯭𝆭̽🎯᭡᪳𓆪𝐍ᴇᴡ 𝐀ᴄᴛɪᴏɴ : *${setAction.toUpperCase()}*𝆺𝅥𝆬⎯꯭𝆭̽🤍\n` +
          `⎯꯭𝆭̽💚᭡᪳𓆪𝐒ᴛꫝᴛᴜs : *𝐎𝐍*𝆺𝅥𝆬⎯꯭𝆭̽\n\n` +
          `⎯꯭𝆭̽✨᭡᪳𓆪𝐒ᴇᴛᴛɪɴɢs 𝐒ꫝᴠᴇᴅ 𝐒ᴜᴄᴄᴇssғᴜʟʟʏ! 💗𝆺𝅥𝆬⎯꯭𝆭̽`
        );
      }

      // ==============================
      // GET
      // ==============================

      if (opt === 'get') {
        const settings = database.getGroupSettings(extra.from);

        const status = settings.antigroupmention
          ? '𝐎𝐍 🟢'
          : '𝐎𝐅𝐅 🔴';

        const action = settings.antigroupmentionAction || 'delete';

        return replyWithCard(
          `⎯꯭𝆭̽🌐᭡᪳𓆪𝐒ᴛꫝᴛᴜs : *${status}*𝆺𝅥𝆬⎯꯭𝆭̽🤍\n` +
          `⎯꯭𝆭̽⚡᭡᪳𓆪𝐀ᴄᴛɪᴏɴ : *${action.toUpperCase()}*𝆺𝅥𝆬⎯꯭𝆭̽🤍\n` +
          `⎯꯭𝆭̽🛡️᭡᪳𓆪𝐏ʀᴏᴛᴇᴄᴛɪᴏɴ : Active𝆺𝅥𝆬⎯꯭𝆭̽\n\n` +
          `⎯꯭𝆭̽💎᭡᪳𓆪𝐀ɴᴛɪɢʀᴏᴜᴘᴍᴇɴᴛɪᴏɴ 𝐂ᴏɴғɪɢᴜʀꫝᴛɪᴏɴ𝆺𝅥𝆬⎯꯭𝆭̽`
        );
      }

      // ==============================
      // INVALID OPTION
      // ==============================

      return replyWithCard(
        `⎯꯭𝆭̽⚠️᭡᪳𓆪𝐈ɴᴠꫝʟɪᴅ 𝐎ᴘᴛɪᴏɴ!𝆺𝅥𝆬⎯꯭𝆭̽\n` +
        `⎯꯭𝆭̽📌᭡᪳𓆪𝐔sꫝɢᴇ : .antigroupmention𝆺𝅥𝆬⎯꯭𝆭̽\n` +
        `⎯꯭𝆭̽💡᭡᪳𓆪Type the correct command.𝆺𝅥𝆬⎯꯭𝆭̽🤍`
      );

    } catch (error) {
      console.error(
        'Antigroupmention Error:',
        error
      );

      await extra.reply(
        `⎯꯭𝆭̽🌀᭡᪳𓆪𝐀ɴᴛɪɢʀᴏᴜᴘᴍᴇɴᴛɪᴏɴ𝆺𝅥𝆬⎯꯭𝆭̽🤍\n\n` +
        `⎯꯭𝆭̽❌᭡᪳𓆪𝐄ʀʀᴏʀ : ${error.message}𝆺𝅥𝆬⎯꯭𝆭̽\n\n` +
        `⎯꯭𝆭̽🫀᭡᪳𝐗-𝐒ʜꫝʜɪɴ 𝐑ꫝɴꫝ 𝆺𝅥𝆬⎯꯭𝆭̽💗`
      );
    }
  }
};
