
/**
 * Goodbye - Enable/disable goodbye messages
 */

const db = require('../../database');

module.exports = {
  name: 'goodbye',
  aliases: ['goodbyeon', 'goodbyeoff'],
  category: 'admin',
  desc: 'Enable/disable goodbye messages',
  usage: 'goodbye on/off',
  groupOnly: true,
  adminOnly: true,
  botAdminNeeded: true,

  execute: async (sock, msg, args) => {
    try {
      const groupId = msg.key.remoteJid;
      const action = args[0]?.toLowerCase();

      const groupMetadata = await sock.groupMetadata(groupId);
      const groupName = groupMetadata.subject || 'Unknown Group';

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

      const settings = db.getGroupSettings(groupId);

      // STATUS
      if (!action || !['on', 'off'].includes(action)) {
        return await sock.sendMessage(
          groupId,
          {
            text:
`👋 *𝐆ᴏᴏᴅʙʏᴇ 𝐌ᴇssꫝɢᴇ*

*𝐒ᴛꫝᴛᴜs:* ${settings.goodbye ? '✅ Enabled' : '❌ Disabled'}

*𝐌ᴇssꫝɢᴇ:* ${settings.goodbyeMessage}

*𝐔sꫝɢᴇ:* .goodbye on/off

*𝐂ᴜsᴛᴏᴍɪᴢᴇ:* .setgoodbye <message>`
          },
          { quoted: msg }
        );
      }

      // UPDATE
      const enable = action === 'on';

      db.updateGroupSettings(groupId, {
        goodbye: enable
      });

      // CREATE CONTACT QUOTE (WITHOUT SENDING CONTACT SEPARATELY)
      const quotedContact = {
        key: {
          remoteJid: groupId,
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

      // GOODBYE TEXT
      const text = enable
        ? `👋 *𝐆ᴏᴏᴅʙʏᴇ 𝐌ᴇssꫝɢᴇ \`𝐎ɴ\` ғᴏʀ*\n*-•━Ξ ⤹• ${groupName}𓂃ꜛ⸙*`
        : `👋 *𝐆ᴏᴏᴅʙʏᴇ 𝐌ᴇssꫝɢᴇ \`𝐎ғғ\` ғᴏʀ*\n*-•━Ξ ⤹• ${groupName}𓂃ꜛ⸙*`;

      // SEND ONE MESSAGE WITH CONTACT QUOTE
      return await sock.sendMessage(
        groupId,
        { text },
        { quoted: quotedContact }
      );

    } catch (error) {
      console.error('Goodbye Error:', error);

      return await sock.sendMessage(
        msg.key.remoteJid,
        {
          text: `❌ *𝐆ᴏᴏᴅʙʏᴇ 𝐄ʀʀᴏʀ*\n\n${error.message}`
        },
        { quoted: msg }
      );
    }
  }
};
 
