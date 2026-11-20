
/**
 * Antibot Command — detect other Baileys bots via message-ID heuristics
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
    try {
      const p = config.prefix;
      const settings = database.getGroupSettings(extra.from);

      if (!args[0]) {
        const status = settings.antibot ? '𝐎𝐍 🟢' : '𝐎𝐅𝐅 🔴';
        const action = settings.antibotAction || 'warn';

        return extra.reply(
          `╭━━━〔 🛡️ 𝐀ɴᴛɪʙᴏᴛ 〕━━━╮\n` +
          `┃\n` +
          `┃ 🌐 𝐒ᴛꫝᴛᴜs : *${status}*\n` +
          `┃ ⚡ 𝐀ᴄᴛɪᴏɴ : *${action.toUpperCase()}*\n` +
          `┃\n` +
          `╰━━━━━━━━━━━━━━━━╯\n\n` +
          `╭━━〔 🛡️ 𝐏ʀᴏᴛᴇᴄᴛɪᴏɴ 〕━━╮\n` +
          `┃ 👑 Admins, Owner & This Bot\n` +
          `┃ 💎 are exempt from protection.\n` +
          `╰━━━━━━━━━━━━━━━━╯\n\n` +
          `╭━━〔 ⚙️ 𝐂ᴏᴍᴍꫝɴᴅ 𝐌ᴇɴᴜ 〕━━╮\n` +
          `┃ 🟢 ${p}antibot on\n` +
          `┃ 🔴 ${p}antibot off\n` +
          `┃ ⚡ ${p}antibot set warn | kick\n` +
          `┃ 📋 ${p}antibot get\n` +
          `╰━━━━━━━━━━━━━━━━╯\n\n` +
          `🌸 𝐏ᴏᴡᴇʀᴇᴅ 𝐁ʏ 𝐒ʜꫝʜɪɴ 𝐑ꫝɴꫝ`
        );
      }

      const opt = args[0].toLowerCase();

      if (opt === 'on') {
        if (settings.antibot) {
          return extra.reply(
            `╭━━━〔 🛡️ 𝐀ɴᴛɪʙᴏᴛ 〕━━━╮\n` +
            `┃\n` +
            `┃ 💚 𝐀ɴᴛɪʙᴏᴛ ɪs 𝐀ʟʀᴇᴀᴅʏ 𝐎𝐍!\n` +
            `┃ ✨ Protection is active.\n` +
            `┃\n` +
            `╰━━━━━━━━━━━━━━━━╯`
          );
        }

        database.updateGroupSettings(extra.from, { antibot: true });

        return extra.reply(
          `╭━━━〔 🛡️ 𝐀ɴᴛɪʙᴏᴛ 〕━━━╮\n` +
          `┃\n` +
          `┃ 🎉 𝐀ɴᴛɪʙᴏᴛ 𝐄ɴꫝʙʟᴇᴅ!\n` +
          `┃ 💚 𝐒ᴛꫝᴛᴜs : *𝐎𝐍*\n` +
          `┃ 🛡️ Group protection activated.\n` +
          `┃\n` +
          `╰━━━━━━━━━━━━━━━━╯\n\n` +
          `🌷 𝐍ᴏᴡ ʏᴏᴜʀ ɢʀᴏᴜᴘ ɪs 𝐏ʀᴏᴛᴇᴄᴛᴇᴅ! 💗`
        );
      }

      if (opt === 'off') {
        database.updateGroupSettings(extra.from, { antibot: false });

        return extra.reply(
          `╭━━━〔 🛡️ 𝐀ɴᴛɪʙᴏᴛ 〕━━━╮\n` +
          `┃\n` +
          `┃ ⚠️ 𝐀ɴᴛɪʙᴏᴛ 𝐃ɪsꫝʙʟᴇᴅ!\n` +
          `┃ ❤️‍🩹 𝐒ᴛꫝᴛᴜs : *𝐎𝐅𝐅*\n` +
          `┃ 🔓 Group protection deactivated.\n` +
          `┃\n` +
          `╰━━━━━━━━━━━━━━━━╯\n\n` +
          `🌙 𝐏ʀᴏᴛᴇᴄᴛɪᴏɴ ɪs ɴᴏᴡ 𝐎𝐅𝐅!`
        );
      }

      if (opt === 'set') {
        if (args.length < 2) {
          return extra.reply(
            `╭━━〔 ⚙️ 𝐒ᴇᴛ 𝐀ᴄᴛɪᴏɴ 〕━━╮\n` +
            `┃\n` +
            `┃ 📝 𝐔sꫝɢᴇ:\n` +
            `┃ 💬 ${p}antibot set warn\n` +
            `┃ 🚫 ${p}antibot set kick\n` +
            `┃\n` +
            `╰━━━━━━━━━━━━━━━━╯`
          );
        }

        const setAction = args[1].toLowerCase();

        if (!['warn', 'kick'].includes(setAction)) {
          return extra.reply(
            `╭━━━〔 ❌ 𝐈ɴᴠꫝʟɪᴅ 〕━━━╮\n` +
            `┃\n` +
            `┃ ⚠️ 𝐈ɴᴠꫝʟɪᴅ 𝐀ᴄᴛɪᴏɴ!\n` +
            `┃ 💡 Choose *warn* or *kick*.\n` +
            `┃\n` +
            `╰━━━━━━━━━━━━━━━━╯`
          );
        }

        database.updateGroupSettings(extra.from, {
          antibotAction: setAction,
          antibot: true,
        });

        return extra.reply(
          `╭━━━〔 ⚙️ 𝐀ɴᴛɪʙᴏᴛ 〕━━━╮\n` +
          `┃\n` +
          `┃ ✅ 𝐀ᴄᴛɪᴏɴ 𝐔ᴘᴅꫝᴛᴇᴅ!\n` +
          `┃ 🎯 𝐍ᴇᴡ 𝐀ᴄᴛɪᴏɴ : *${setAction.toUpperCase()}*\n` +
          `┃ 💚 𝐒ᴛꫝᴛᴜs : *𝐎𝐍*\n` +
          `┃\n` +
          `╰━━━━━━━━━━━━━━━━╯\n\n` +
          `✨ 𝐒ᴇᴛᴛɪɴɢs 𝐒ᴀᴠᴇᴅ 𝐒ᴜᴄᴄᴇssғᴜʟʟʏ! 💗`
        );
      }

      if (opt === 'get') {
        const status = settings.antibot ? '𝐎𝐍 🟢' : '𝐎𝐅𝐅 🔴';
        const action = settings.antibotAction || 'warn';

        return extra.reply(
          `╭━━━〔 📋 𝐀ɴᴛɪʙᴏᴛ 〕━━━╮\n` +
          `┃\n` +
          `┃ 🌐 𝐒ᴛꫝᴛᴜs : *${status}*\n` +
          `┃ ⚡ 𝐀ᴄᴛɪᴏɴ : *${action.toUpperCase()}*\n` +
          `┃ 🛡️ 𝐏ʀᴏᴛᴇᴄᴛɪᴏɴ : Active\n` +
          `┃\n` +
          `╰━━━━━━━━━━━━━━━━╯\n\n` +
          `💎 𝐀ɴᴛɪʙᴏᴛ 𝐂ᴏɴғɪɢᴜʀꫝᴛɪᴏɴ`
        );
      }

      return extra.reply(
        `╭━━━〔 ⚠️ 𝐈ɴᴠꫝʟɪᴅ 〕━━━╮\n` +
        `┃\n` +
        `┃ 📌 𝐔sꫝɢᴇ: \`${p}antibot\`\n` +
        `┃ 💡 Type the correct command.\n` +
        `┃\n` +
        `╰━━━━━━━━━━━━━━━━╯`
      );

    } catch (error) {
      await extra.reply(
        `╭━━━〔 ❌ 𝐄ʀʀᴏʀ 〕━━━╮\n` +
        `┃\n` +
        `┃ ⚠️ ${error.message}\n` +
        `┃\n` +
        `╰━━━━━━━━━━━━━━━━╯`
      );
    }
  },
};
