/**
 * Group Link Command - Get group invite link
 * Styled Replies + Shahin Rana Contact Card Preview
 */

module.exports = {
  name: 'grouplink',
  aliases: ['link', 'invite'],
  category: 'admin',
  description: 'Get group invite link',
  usage: '.grouplink',
  groupOnly: true,
  adminOnly: true,
  botAdminNeeded: true,

  async execute(sock, msg, args, extra) {
    try {
      const chatId = extra.from;

      // ==============================
      // SHAHIN RANA CONTACT CARD
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
          remoteJid: chatId,
          fromMe: true,
          id: `SHAHIN-${Date.now()}`,
          participant: botJid
        },
        message: {
          contactMessage: {
            displayName: contactName,
            vcard
          }
        }
      };

      const replyWithCard = async (text) => {
        return sock.sendMessage(chatId, {
          text:
            `⎯꯭𝆭̽🌀᭡᪳𓆪𝐆ʀᴏᴜᴘ 𝐈ɴᴠɪᴛᴇ 𝐋ɪɴᴋ 𝆺𝅥𝆬⎯꯭𝆭̽🤍\n\n` +
            `${text}\n\n` +
            `⎯꯭𝆭̽🫀᭡᪳𝐗-𝐒ʜꫝʜɪɴ 𝐑ꫝɴꫝ 𝆺𝅥𝆬⎯꯭𝆭̽💗`,
          contextInfo: {
            stanzaId: quotedContact.key.id,
            participant: botJid,
            remoteJid: chatId,
            quotedMessage: quotedContact.message
          }
        });
      };

      // ==============================
      // GET GROUP INVITE LINK
      // ==============================

      const code = await sock.groupInviteCode(chatId);
      const link = `https://chat.whatsapp.com/${code}`;

      let text = `⎯꯭𝆭̽📱᭡᪳𓆪𝐆ʀᴏᴜᴘ : *${extra.groupMetadata.subject}*\n\n`;
      text += `⎯꯭𝆭̽🔗᭡᪳𓆪𝐈ɴᴠɪᴛᴇ 𝐋ɪɴᴋ :\n${link}\n\n`;
      text += `⎯꯭𝆭̽⚠️᭡᪳𓆪এই লিংকটি অপরিচিত কারও সঙ্গে শেয়ার করা থেকে বিরত থাকুন।`;

      await replyWithCard(text);

    } catch (error) {
      console.error('grouplink command error:', error);

      await extra.reply(
        `⎯꯭𝆭̽❌᭡᪳𓆪𝐆ʀᴏᴜᴘ 𝐋ɪɴᴋ 𝐅ꫝɪʟᴇᴅ!\n\n` +
        `⎯꯭𝆭̽💚᭡᪳𓆪গ্রুপ ইনভাইট লিংক তৈরি করা যায়নি।\n\n` +
        `⎯꯭𝆭̽⚠️᭡᪳𓆪𝐄ʀʀᴏʀ : ${error.message}\n\n` +
        `⎯꯭𝆭̽🫀᭡᪳𓆪𝐗-𝐒ʜꫝʜɪɴ 𝐑ꫝɴꫝ`
      );
    }
  }
};
 
