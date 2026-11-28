/**
 * Delete Group Status Command
 * Styled Replies + Shahin Rana Contact Card Preview
 */

const groupStatusTracker = require('../../utils/groupStatusTracker');

module.exports = {
  name: 'delgcstatus',
  aliases: ['delgstatus', 'delgs'],
  category: 'admin',
  description: 'Delete existing group status posts for everyone',
  usage: '.delgcstatus (or reply to a group status)',
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
            `⎯꯭𝆭̽🌀᭡᪳𓆪𝐃ᴇʟᴇᴛᴇ 𝐆ʀᴏᴜᴘ 𝐒ᴛꫝᴛᴜs 𝆺𝅥𝆬⎯꯭𝆭̽🤍\n\n` +
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
      // FIND STATUS TARGETS
      // ==============================

      const ctx = msg.message?.extendedTextMessage?.contextInfo;

      let targets;

      if (
        ctx?.stanzaId &&
        groupStatusTracker.isGroupStatusMessage(ctx.quotedMessage)
      ) {
        targets = [{
          key: {
            remoteJid: chatId,
            id: ctx.stanzaId,
            fromMe: false,
            ...(ctx.participant ? { participant: ctx.participant } : {})
          }
        }];

        const known = groupStatusTracker
          .list(chatId)
          .find((e) => e.key.id === ctx.stanzaId);

        if (known) targets = [known];
      } else {
        targets = groupStatusTracker.list(chatId);
      }

      // ==============================
      // NO STATUS FOUND
      // ==============================

      if (!targets.length) {
        return replyWithCard(
          `⎯꯭𝆭̽📭᭡᪳𓆪𝐍ᴏ 𝐆ʀᴏᴜᴘ 𝐒ᴛꫝᴛᴜs 𝐅ᴏᴜɴᴅ!\n\n` +
          `⎯꯭𝆭̽💚᭡᪳𓆪ডিলিট করার মতো কোনো গ্রুপ স্ট্যাটাস পাওয়া যায়নি।\n\n` +
          `⎯꯭𝆭̽💡᭡᪳𓆪আমি শুধু সেই স্ট্যাটাসগুলো ডিলিট করতে পারি, যেগুলো বট অনলাইনে থাকা অবস্থায় দেখেছে এবং গত ২৪ ঘণ্টার মধ্যে পোস্ট করা হয়েছে।\n\n` +
          `⎯꯭𝆭̽📌᭡᪳𓆪চাইলে কোনো গ্রুপ স্ট্যাটাসে রিপ্লাই দিয়ে এই কমান্ড ব্যবহার করতে পারো।`
        );
      }

      // ==============================
      // DELETE STATUS
      // ==============================

      await extra.react('⏳');

      const deleted = [];
      let failed = 0;

      for (const target of targets) {
        try {
          const ok = sock.revokeGroupStatus
            ? await sock.revokeGroupStatus(chatId, target)
            : false;

          if (ok) {
            deleted.push(target.key.id);
          } else {
            failed++;
          }
        } catch (e) {
          failed++;
          console.error('delgcstatus delete error:', e.message);
        }
      }

      groupStatusTracker.remove(chatId, deleted);

      // ==============================
      // FINAL RESULT
      // ==============================

      await extra.react(deleted.length ? '✅' : '❌');

      const text = failed
        ? `⎯꯭𝆭̽🗑️᭡᪳𓆪𝐃ᴇʟᴇᴛᴇᴅ : *${deleted.length}* 𝐆ʀᴏᴜᴘ 𝐒ᴛꫝᴛᴜs\n\n` +
          `⎯꯭𝆭̽❌᭡᪳𓆪𝐅ꫝɪʟᴇᴅ : *${failed}*\n\n` +
          `⎯꯭𝆭̽💚᭡᪳𓆪কিছু স্ট্যাটাস ডিলিট করা যায়নি।`
        : `⎯꯭𝆭̽✅᭡᪳𓆪𝐒ᴜᴄᴄᴇssғᴜʟʟʏ 𝐃ᴇʟᴇᴛᴇᴅ!\n\n` +
          `⎯꯭𝆭̽🗑️᭡᪳𓆪𝐃ᴇʟᴇᴛᴇᴅ : *${deleted.length}* 𝐆ʀᴏᴜᴘ 𝐒ᴛꫝᴛᴜs\n\n` +
          `⎯꯭𝆭̽💚᭡᪳𓆪সবগুলো স্ট্যাটাস সবার জন্য ডিলিট করা হয়েছে।`;

      await replyWithCard(text);

    } catch (error) {
      console.error('delgcstatus command error:', error);

      await extra.reply(
        `⎯꯭𝆭̽❌᭡᪳𓆪𝐃ᴇʟᴇᴛᴇ 𝐅ꫝɪʟᴇᴅ!\n\n` +
        `⎯꯭𝆭̽💚᭡᪳𓆪গ্রুপ স্ট্যাটাস ডিলিট করা যায়নি। বটের অ্যাডমিন পারমিশন আছে কি না যাচাই করো।\n\n` +
        `⎯꯭𝆭̽🫀᭡᪳𓆪𝐗-𝐒ʜꫝʜɪɴ 𝐑ꫝɴꫝ`
      );
    }
  },
};
 
