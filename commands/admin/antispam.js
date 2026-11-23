
/**
 * Antispam Command — delete message bursts, then warn or kick
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

      if (!args[0]) {
        const status = settings.antiSpam ? 'ON' : 'OFF';
        const action = settings.antiSpamAction || 'warn';

        return extra.reply(
          `╭━━━〔 🚫 〕━━━╮\n` +
          `   *⎯͢^᪲ꫝɴᴛɪ Sᴘꫝᴍ𐙚*\n` +
          `╰━━━━━━━━━━━━╯\n\n` +
          `⎯͢❖ *Sᴛꫝᴛᴜs:* ${status === 'ON' ? '🟢 ON' : '🔴 OFF'}\n` +
          `⎯͢❖ *ꫝᴄᴛɪᴏɴ:* ${action.toUpperCase()}\n` +
          `⎯͢❖ *Lɪᴍɪᴛ:* 5 messages / 8 seconds\n` +
          `⎯͢❖ *Sꫝᴍᴇ Tᴇxᴛ:* 3 times\n\n` +
          `╭━━〔 ⚙️ 〕━━╮\n` +
          `  *𝐂ᴏᴍᴍꫝɴᴅs*\n` +
          `╰━━━━━━━━━━╯\n\n` +
          `⎯͢➤ ${p}antispam on\n` +
          `⎯͢➤ ${p}antispam off\n` +
          `⎯͢➤ ${p}antispam set warn\n` +
          `⎯͢➤ ${p}antispam set kick\n` +
          `⎯͢➤ ${p}antispam get\n\n` +
          `╭━━〔 🛡️ 〕━━╮\n` +
          `Admins, Owner & Bot are exempt.\n` +
          `╰━━━━━━━━━━╯\n\n` +
          `   ⎯͢^᪲𝐒ʜꫝʜɪɴ 𝐑ꫝɴꫝ𐙚`
        );
      }

      const opt = args[0].toLowerCase();

      if (opt === 'on') {
        if (settings.antiSpam) {
          return extra.reply(
            `╭━━〔 ⚠️ 〕━━╮\n` +
            ` *ꫝɴᴛɪsᴘꫝᴍ ꫝʟʀᴇꫝᴅʏ Oɴ!*\n` +
            `╰━━━━━━━━━━╯`
          );
        }

        database.updateGroupSettings(extra.from, { antiSpam: true });

        return extra.reply(
          `╭━━〔 ✅ 〕━━╮\n` +
          ` *ꫝɴᴛɪsᴘꫝᴍ Eɴꫝʙʟᴇᴅ!*\n` +
          `╰━━━━━━━━━━╯\n\n` +
          `⎯͢❖ Spam protection is now ꫝctive.\n\n` +
          `⎯͢^᪲𝐒ʜꫝʜɪɴ 𝐑ꫝɴꫝ𐙚`
        );
      }

      if (opt === 'off') {
        database.updateGroupSettings(extra.from, { antiSpam: false });

        return extra.reply(
          `╭━━〔 🔴 〕━━╮\n` +
          ` *ꫝɴᴛɪsᴘꫝᴍ DISꫝBLED!*\n` +
          `╰━━━━━━━━━━╯\n\n` +
          `⎯͢❖ Spam protection is now inactive.\n\n` +
          `⎯͢^᪲𝐒ʜꫝʜɪɴ 𝐑ꫝɴꫝ𐙚`
        );
      }

      if (opt === 'set') {
        if (args.length < 2) {
          return extra.reply(
            `╭━━〔 ⚠️ 〕━━╮\n` +
            ` *ꫝᴄᴛɪᴏɴ Rᴇǫᴜɪʀᴇᴅ!*\n` +
            `╰━━━━━━━━━━╯\n\n` +
            `⎯͢➤ ${p}antispam set warn\n` +
            `⎯͢➤ ${p}antispam set kick\n\n` +
            `⎯͢^᪲𝐒ʜꫝʜɪɴ 𝐑ꫝɴꫝ𐙚`
          );
        }

        const setAction = args[1].toLowerCase();

        if (!['warn', 'kick'].includes(setAction)) {
          return extra.reply(
            `╭━━〔 ❌ 〕━━╮\n` +
            ` *INVꫝLID ꫝCTION!*\n` +
            `╰━━━━━━━━━━╯\n\n` +
            `⎯͢❖ Choose: *WARN* or *KICK*\n\n` +
            `⎯͢^᪲𝐒ʜꫝʜɪɴ 𝐑ꫝɴꫝ𐙚`
          );
        }

        database.updateGroupSettings(extra.from, {
          antiSpamAction: setAction,
          antiSpam: true,
        });

        return extra.reply(
          `╭━━〔 ✅ 〕━━╮\n` +
          ` *ꫝCTION UPDꫝTED!*\n` +
          `╰━━━━━━━━━━╯\n\n` +
          `⎯͢❖ *NEW ꫝCTION:* ${setAction.toUpperCase()}\n` +
          `⎯͢❖ *STꫝTUS:* ON\n\n` +
          `⎯͢^᪲𝐒ʜꫝʜɪɴ 𝐑ꫝɴꫝ𐙚`
        );
      }

      if (opt === 'get') {
        const status = settings.antiSpam ? 'ON' : 'OFF';
        const action = settings.antiSpamAction || 'warn';

        return extra.reply(
          `╭━━〔 ⚙️ 〕━━╮\n` +
          `   *ꫝɴᴛɪsᴘꫝᴍ CONFIG*\n` +
          `╰━━━━━━━━━━╯\n\n` +
          `⎯͢❖ *STꫝTUS:* ${status}\n` +
          `⎯͢❖ *ꫝCTION:* ${action.toUpperCase()}\n\n` +
          `⎯͢^᪲𝐒ʜꫝʜɪɴ 𝐑ꫝɴꫝ𐙚`
        );
      }

      return extra.reply(
        `╭━━〔 ⚠️ 〕━━╮\n` +
        ` *INVꫝLID COMMꫝND!*\n` +
        `╰━━━━━━━━━━╯\n\n` +
        `⎯͢❖ Type *${p}antispam* for usage.\n\n` +
        `⎯͢^᪲𝐒ʜꫝʜɪɴ 𝐑ꫝɴꫝ𐙚`
      );

    } catch (error) {
      await extra.reply(
        `╭━━〔 ❌ 〕━━╮\n` +
        ` *SOMETHING WENT WRONG!*\n` +
        `╰━━━━━━━━━━╯\n\n` +
        `⎯͢❖ *ERROR:* ${error.message}\n\n` +
        `⎯͢^᪲𝐒ʜꫝʜɪɴ 𝐑ꫝɴꫝ𐙚`
      );
    }
  },
};
