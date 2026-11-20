/**
 * Antibadword Command - Detect and delete bad words (delete/kick/warn)
 */

const database = require('../../database');

module.exports = {
  name: 'antibadword',
  aliases: ['antibad', 'nobadword'],
  category: 'admin',
  description: 'Configure antibadword protection (delete/kick/warn)',
  usage: '.antibadword <on/off/set/get>',
  groupOnly: true,
  adminOnly: true,
  botAdminNeeded: true,

  async execute(sock, msg, args, extra) {
    try {
      const botNumber = sock.user.id;
      const contactName = '⎯͢^᪲𝐒ʜꫝʜɪɴ 𝐑ꫝɴꫝ𐙚';

      const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${contactName}
TEL;type=CELL;type=VOICE;waid=${botNumber.split(':')[0]}:+${botNumber.split(':')[0]}
END:VCARD`;

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
            vcard
          }
        },
        messageTimestamp: Math.floor(Date.now() / 1000)
      };

      const replyWithCard = async (text) => {
        return sock.sendMessage(
          extra.from,
          { text },
          { quoted: quotedContact }
        );
      };

      if (!args[0]) {
        const settings = database.getGroupSettings(extra.from);
        const status = settings.antibadword ? '𝐎ɴ' : '𝐎ғғ';
        const action = settings.antibadwordAction || '𝐝ᴇʟᴇᴛᴇ';

        return replyWithCard(
          `🚫 *𝐀ɴᴛɪʙꫝᴅᴡᴏʀᴅ 𝐒ᴛꫝᴛᴜs*\n\n` +
          `𝐒ᴛꫝᴛᴜs: *${status}*\n` +
          `𝐀ᴄᴛɪᴏɴ: *${action}*\n\n` +
          `𝐔sꫝɢᴇ:\n` +
          `  .antibadword on\n` +
          `  .antibadword off\n` +
          `  .antibadword set delete | kick | warn\n` +
          `  .antibadword get`
        );
      }

      const opt = args[0].toLowerCase();

      if (opt === 'on') {
        if (database.getGroupSettings(extra.from).antibadword) {
          return replyWithCard('𝐀ɴᴛɪʙꫝᴅᴡᴏʀᴅ ɪs ꫝʟʀᴇꫝᴅʏ 𝐎ɴ');
        }

        database.updateGroupSettings(extra.from, { antibadword: true });
        return replyWithCard('𝐀ɴᴛɪʙꫝᴅᴡᴏʀᴅ ʜꫝs ʙᴇᴇɴ ᴛᴜʀɴᴇᴅ 𝐎ɴ');
      }

      if (opt === 'off') {
        database.updateGroupSettings(extra.from, { antibadword: false });
        return replyWithCard('𝐀ɴᴛɪʙꫝᴅᴡᴏʀᴅ ʜꫝs ʙᴇᴇɴ ᴛᴜʀɴᴇᴅ 𝐎ғғ');
      }

      if (opt === 'set') {
        if (args.length < 2) {
          return replyWithCard(
            '𝐏ʟᴇꫝsᴇ sᴘᴇᴄɪғʏ ꫝɴ ꫝᴄᴛɪᴏɴ: .antibadword set delete | kick | warn'
          );
        }

        const setAction = args[1].toLowerCase();

        if (!['delete', 'kick', 'warn'].includes(setAction)) {
          return replyWithCard(
            '𝐈ɴᴠꫝʟɪᴅ ꫝᴄᴛɪᴏɴ. 𝐂ʜᴏᴏsᴇ delete, kick, ᴏʀ warn.'
          );
        }

        database.updateGroupSettings(extra.from, {
          antibadwordAction: setAction,
          antibadword: true,
        });

        return replyWithCard(
          `𝐀ɴᴛɪʙꫝᴅᴡᴏʀᴅ ꫝᴄᴛɪᴏɴ sᴇᴛ ᴛᴏ ${setAction}`
        );
      }

      if (opt === 'get') {
        const settings = database.getGroupSettings(extra.from);
        const status = settings.antibadword ? '𝐎ɴ' : '𝐎ғғ';
        const action = settings.antibadwordAction || 'delete';

        return replyWithCard(
          `𝐀ɴᴛɪʙꫝᴅᴡᴏʀᴅ 𝐂ᴏɴғɪɢᴜʀꫝᴛɪᴏɴ:\n` +
          `𝐒ᴛꫝᴛᴜs: ${status}\n` +
          `𝐀ᴄᴛɪᴏɴ: ${action}`
        );
      }

      return replyWithCard('𝐔sᴇ .antibadword ғᴏʀ ᴜsꫝɢᴇ.');

    } catch (error) {
      await extra.reply(`❌ 𝐄ʀʀᴏʀ: ${error.message}`);
    }
  },
};
