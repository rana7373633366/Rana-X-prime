/**
 * Demote Command - Remove admin privileges
 * Styled Replies + Shahin Rana Contact Card Preview
 */

const { findParticipant } = require('../../utils/jidHelper');

module.exports = {
  name: 'demote',
  aliases: ['removeadmin'],
  category: 'admin',
  description: 'Remove admin privileges from member',
  usage: '.demote @user',
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
            `⎯꯭𝆭̽🌀᭡᪳𓆪𝐃ᴇᴍᴏᴛᴇ 𝐀ᴅᴍɪɴ 𝆺𝅥𝆬⎯꯭𝆭̽🤍\n\n` +
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
      // FIND TARGET USER
      // ==============================

      let target;
      const ctx = msg.message?.extendedTextMessage?.contextInfo;
      const mentioned = ctx?.mentionedJid || [];

      if (mentioned && mentioned.length > 0) {
        target = mentioned[0];
      } else if (ctx?.participant && ctx.stanzaId && ctx.quotedMessage) {
        target = ctx.participant;
      } else {
        return replyWithCard(
          `⎯꯭𝆭̽❌᭡᪳𓆪𝐔sᴇʀ 𝐍ᴏᴛ 𝐒ᴇʟᴇᴄᴛᴇᴅ!\n\n` +
          `⎯꯭𝆭̽💚᭡᪳𓆪যাকে অ্যাডমিন থেকে সরাতে চাও তাকে মেনশন করো অথবা তার মেসেজে রিপ্লাই দাও।\n\n` +
          `⎯꯭𝆭̽💡᭡᪳𓆪𝐄xꫝᴍᴘʟᴇ : .demote @user`
        );
      }

      // ==============================
      // FETCH FRESH GROUP METADATA
      // ==============================

      const freshMetadata = await sock.groupMetadata(chatId);

      // LID-aware participant matching
      const foundParticipant = findParticipant(
        freshMetadata.participants,
        target
      );

      if (!foundParticipant) {
        return replyWithCard(
          `⎯꯭𝆭̽❌᭡᪳𓆪𝐔sᴇʀ 𝐍ᴏᴛ 𝐅ᴏᴜɴᴅ!\n\n` +
          `⎯꯭𝆭̽💚᭡᪳𓆪এই মেম্বারকে গ্রুপে খুঁজে পাওয়া যায়নি।`
        );
      }

      // ==============================
      // CHECK ADMIN STATUS
      // ==============================

      if (
        foundParticipant.admin !== 'admin' &&
        foundParticipant.admin !== 'superadmin'
      ) {
        return replyWithCard(
          `⎯꯭𝆭̽⚠️᭡᪳𓆪𝐍ᴏᴛ 𝐀ɴ 𝐀ᴅᴍɪɴ!\n\n` +
          `⎯꯭𝆭̽💚᭡᪳𓆪এই মেম্বার বর্তমানে গ্রুপের অ্যাডমিন নয়।`
        );
      }

      // ==============================
      // DEMOTE USER
      // ==============================

      await sock.groupParticipantsUpdate(
        chatId,
        [target],
        'demote'
      );

      // ==============================
      // SUCCESS MESSAGE
      // ==============================

      await sock.sendMessage(chatId, {
        text:
          `⎯꯭𝆭̽✅᭡᪳𓆪𝐀ᴅᴍɪɴ 𝐃ᴇᴍᴏᴛᴇᴅ!\n\n` +
          `⎯꯭𝆭̽👤᭡᪳𓆪𝐔sᴇʀ : @${target.split('@')[0]}\n\n` +
          `⎯꯭𝆭̽💚᭡᪳𓆪এই মেম্বারের অ্যাডমিন পারমিশন সরিয়ে দেওয়া হয়েছে।\n\n` +
          `⎯꯭𝆭̽🫀᭡᪳𓆪𝐗-𝐒ʜꫝʜɪɴ 𝐑ꫝɴꫝ`,
        mentions: [target],
        contextInfo: {
          stanzaId: quotedContact.key.id,
          participant: botJid,
          remoteJid: chatId,
          quotedMessage: quotedContact.message
        }
      });

    } catch (error) {
      console.error('demote command error:', error);

      await extra.reply(
        `⎯꯭𝆭̽❌᭡᪳𓆪𝐃ᴇᴍᴏᴛᴇ 𝐅ꫝɪʟᴇᴅ!\n\n` +
        `⎯꯭𝆭̽💚᭡᪳𓆪অ্যাডমিন পারমিশন সরানো যায়নি।\n\n` +
        `⎯꯭𝆭̽⚠️᭡᪳𓆪𝐄ʀʀᴏʀ : ${error.message}\n\n` +
        `⎯꯭𝆭̽🫀᭡᪳𓆪𝐗-𝐒ʜꫝʜɪɴ 𝐑ꫝɴꫝ`
      );
    }
  }
};
