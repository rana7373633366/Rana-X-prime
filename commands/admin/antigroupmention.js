
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
      // REPLY WITH CONTACT CARD
      // ==============================

      const replyWithCard = async (text) => {
        return await sock.sendMessage(
          extra.from,
          {
            text: text,
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
          `╭━━━〔 🛡️ 𝐀ɴᴛɪɢʀᴏᴜᴘᴍᴇɴᴛɪᴏɴ 〕━━━╮\n` +
          `┃\n` +
          `┃ 🌐 𝐒ᴛꫝᴛᴜs : *${status}*\n` +
          `┃ ⚡ 𝐀ᴄᴛɪᴏɴ : *${action.toUpperCase()}*\n` +
          `┃\n` +
          `╰━━━━━━━━━━━━━━━━━━╯\n\n` +
          `╭━━〔 🛡️ 𝐏ʀᴏᴛᴇᴄᴛɪᴏɴ 〕━━╮\n` +
          `┃ 🚫 Group Mention Protection\n` +
          `┃ 💎 Keep your group protected.\n` +
          `╰━━━━━━━━━━━━━━━━╯\n\n` +
          `╭━━〔 ⚙️ 𝐂ᴏᴍᴍꫝɴᴅ 𝐌ᴇɴᴜ 〕━━╮\n` +
          `┃ 🟢 .antigroupmention on\n` +
          `┃ 🔴 .antigroupmention off\n` +
          `┃ ⚡ .antigroupmention set delete\n` +
          `┃ ⚡ .antigroupmention set kick\n` +
          `┃ 📋 .antigroupmention get\n` +
          `╰━━━━━━━━━━━━━━━━╯\n\n` +
          `🌸 𝐏ᴏᴡᴇʀᴇᴅ 𝐁ʏ 𝐒ʜꫝʜɪɴ 𝐑ꫝɴꫝ`
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
            `╭━━━〔 🛡️ 𝐀ɴᴛɪɢʀᴏᴜᴘᴍᴇɴᴛɪᴏɴ 〕━━━╮\n` +
            `┃\n` +
            `┃ 💚 𝐏ʀᴏᴛᴇᴄᴛɪᴏɴ ɪs 𝐀ʟʀᴇᴀᴅʏ 𝐎𝐍!\n` +
            `┃ ✨ Everything is working.\n` +
            `┃\n` +
            `╰━━━━━━━━━━━━━━━━━━╯`
          );
        }

        database.updateGroupSettings(
          extra.from,
          {
            antigroupmention: true
          }
        );

        return replyWithCard(
          `╭━━━〔 🛡️ 𝐀ɴᴛɪɢʀᴏᴜᴘᴍᴇɴᴛɪᴏɴ 〕━━━╮\n` +
          `┃\n` +
          `┃ 🎉 𝐏ʀᴏᴛᴇᴄᴛɪᴏɴ 𝐄ɴꫝʙʟᴇᴅ!\n` +
          `┃ 💚 𝐒ᴛꫝᴛᴜs : *𝐎𝐍*\n` +
          `┃ 🛡️ Group protection activated.\n` +
          `┃\n` +
          `╰━━━━━━━━━━━━━━━━━━╯\n\n` +
          `🌷 𝐘ᴏᴜʀ ɢʀᴏᴜᴘ ɪs ɴᴏᴡ 𝐏ʀᴏᴛᴇᴄᴛᴇᴅ! 💗`
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
          `╭━━━〔 🛡️ 𝐀ɴᴛɪɢʀᴏᴜᴘᴍᴇɴᴛɪᴏɴ 〕━━━╮\n` +
          `┃\n` +
          `┃ ⚠️ 𝐏ʀᴏᴛᴇᴄᴛɪᴏɴ 𝐃ɪsꫝʙʟᴇᴅ!\n` +
          `┃ ❤️‍🩹 𝐒ᴛꫝᴛᴜs : *𝐎𝐅𝐅*\n` +
          `┃ 🔓 Protection is now disabled.\n` +
          `┃\n` +
          `╰━━━━━━━━━━━━━━━━━━╯\n\n` +
          `🌙 𝐏ʀᴏᴛᴇᴄᴛɪᴏɴ ɪs ɴᴏᴡ 𝐎𝐅𝐅!`
        );
      }

      // ==============================
      // SET ACTION
      // ==============================

      if (opt === 'set') {
        if (args.length < 2) {
          return replyWithCard(
            `╭━━〔 ⚙️ 𝐒ᴇᴛ 𝐀ᴄᴛɪᴏɴ 〕━━╮\n` +
            `┃\n` +
            `┃ 📝 𝐔sꫝɢᴇ:\n` +
            `┃ 🗑️ .antigroupmention set delete\n` +
            `┃ 🚫 .antigroupmention set kick\n` +
            `┃\n` +
            `╰━━━━━━━━━━━━━━━━╯`
          );
        }

        const setAction = args[1].toLowerCase();

        if (!['delete', 'kick'].includes(setAction)) {
          return replyWithCard(
            `╭━━━〔 ❌ 𝐈ɴᴠꫝʟɪᴅ 〕━━━╮\n` +
            `┃\n` +
            `┃ ⚠️ 𝐈ɴᴠꫝʟɪᴅ 𝐀ᴄᴛɪᴏɴ!\n` +
            `┃ 💡 Choose *delete* or *kick*.\n` +
            `┃\n` +
            `╰━━━━━━━━━━━━━━━━╯`
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
          `╭━━━〔 ⚙️ 𝐀ɴᴛɪɢʀᴏᴜᴘᴍᴇɴᴛɪᴏɴ 〕━━━╮\n` +
          `┃\n` +
          `┃ ✅ 𝐀ᴄᴛɪᴏɴ 𝐔ᴘᴅꫝᴛᴇᴅ!\n` +
          `┃ 🎯 𝐍ᴇᴡ 𝐀ᴄᴛɪᴏɴ : *${setAction.toUpperCase()}*\n` +
          `┃ 💚 𝐒ᴛꫝᴛᴜs : *𝐎𝐍*\n` +
          `┃\n` +
          `╰━━━━━━━━━━━━━━━━━━╯\n\n` +
          `✨ 𝐒ᴇᴛᴛɪɴɢs 𝐒ꫝᴠᴇᴅ 𝐒ᴜᴄᴄᴇssғᴜʟʟʏ! 💗`
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
          `╭━━━〔 📋 𝐀ɴᴛɪɢʀᴏᴜᴘᴍᴇɴᴛɪᴏɴ 〕━━━╮\n` +
          `┃\n` +
          `┃ 🌐 𝐒ᴛꫝᴛᴜs : *${status}*\n` +
          `┃ ⚡ 𝐀ᴄᴛɪᴏɴ : *${action.toUpperCase()}*\n` +
          `┃ 🛡️ 𝐏ʀᴏᴛᴇᴄᴛɪᴏɴ : Active\n` +
          `┃\n` +
          `╰━━━━━━━━━━━━━━━━━━╯\n\n` +
          `💎 𝐀ɴᴛɪɢʀᴏᴜᴘᴍᴇɴᴛɪᴏɴ 𝐂ᴏɴғɪɢᴜʀꫝᴛɪᴏɴ`
        );
      }

      // ==============================
      // INVALID OPTION
      // ==============================

      return replyWithCard(
        `╭━━━〔 ⚠️ 𝐈ɴᴠꫝʟɪᴅ 〕━━━╮\n` +
        `┃\n` +
        `┃ 📌 𝐔sꫝɢᴇ: .antigroupmention\n` +
        `┃ 💡 Type the correct command.\n` +
        `┃\n` +
        `╰━━━━━━━━━━━━━━━━╯`
      );

    } catch (error) {
      console.error(
        'Antigroupmention Error:',
        error
      );

      await extra.reply(
        `╭━━━〔 ❌ 𝐄ʀʀᴏʀ 〕━━━╮\n` +
        `┃\n` +
        `┃ ⚠️ ${error.message}\n` +
        `┃\n` +
        `╰━━━━━━━━━━━━━━━━╯`
      );
    }
  }
};
