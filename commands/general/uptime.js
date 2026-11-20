/**

 * Uptime Command - Display bot uptime

 */

const config = require('../../config');

module.exports = {

  name: 'uptime',

  aliases: ['runtime', 'botuptime', 'alive', 'up'],

  category: 'general',

  description: 'Show bot uptime',

  usage: '.uptime',

  async execute(sock, msg, args, extra) {

    try {

      // ==============================

      // PROCESS UPTIME

      // ==============================

      const uptimeMs = process.uptime() * 1000;

      const days = Math.floor(

        uptimeMs / (1000 * 60 * 60 * 24)

      );

      const hours = Math.floor(

        (uptimeMs / (1000 * 60 * 60)) % 24

      );

      const minutes = Math.floor(

        (uptimeMs / (1000 * 60)) % 60

      );

      const seconds = Math.floor(

        (uptimeMs / 1000) % 60

      );

      const uptime =

        `${days}d ${hours}h ${minutes}m ${seconds}s`;

      // ==============================

      // RANDOM EMOJI

      // ==============================

      const emojis = [

        "🌷", "🌹", "🪻", "🌺", "🌼",

        "🦚", "🦋", "🐼", "🦄", "🐬",

        "🌙", "☄️", "🌟", "⭐", "🌈",

        "🍁", "🍂", "🍀", "🎐", "🎀",

        "🎭", "🎨", "🎪", "🎡", "🎠",

        "🧸", "🪁", "🪄", "💠", "🔮",

        "💜", "💙", "🩵", "🤎", "🩶"

      ];

      const randomEmoji =

        emojis[Math.floor(Math.random() * emojis.length)];

      // ==============================

      // RANDOM STATUS

      // ==============================

      const statuses = [

        "⎯꯭᪵🦋꯭ ⃪😂 এতক্ষণ ধরে জেগে আছি, কেউ চা-ও দিল না!",

        "⎯꯭᪵🦋꯭ ⃪😴 ঘুমানোর সুযোগ পাই না, সবাই শুধু কমান্ড দেয়!",

        "⎯꯭᪵🦋꯭ ⃪🤣 বটের বয়স বাড়ছে, কিন্তু বুদ্ধি বাড়ছে না!",

        "⎯꯭᪵🦋꯭ ⃪🐸 এতক্ষণ Online, তবুও কেউ ভালোবাসে না!",

        "⎯꯭᪵🦋꯭ ⃪😎 Uptime চলছে, Attitude-ও চলছে!",

        "⎯꯭᪵🦋꯭ ⃪💀 এতক্ষণ ধরে চালু আছি, বন্ধ হওয়ার নামই নেই!",

        "⎯꯭᪵🦋꯭ ⃪🥴 Server ক্লান্ত, কিন্তু বট এখনো অবিবাহিত!",

        "⎯꯭᪵🦋꯭ ⃪😂 সবাই ঘুমায়, বট পাহারা দেয়!",

        "⎯꯭᪵🦋꯭ ⃪😈 এতক্ষণ ধরে Online—এখন আমাকে ছুটি দাও!",

        "⎯꯭᪵🦋꯭ ⃪🐼 Uptime দেখছো কেন? চাকরিতে ঢুকবা নাকি?",

        "⎯꯭᪵🦋꯭ ⃪🤭 বট এতক্ষণ টিকে আছে, তোমরা এখনো ঝগড়া করতেছো!",

        "⎯꯭᪵🦋꯭ ⃪🔥 যতক্ষণ Uptime, ততক্ষণ Full Power!",

        "⎯꯭᪵🦋꯭ ⃪🤣 Server বলছে 'আর পারছি না', বট বলছে 'চলতেই থাক!'",

        "⎯꯭᪵🦋꯭ ⃪🗿 Uptime কম না ভাই, ধৈর্যটাই বেশি!",

        "⎯꯭᪵🦋꯭ ⃪👑 Online থাকার রাজা—𝐒ʜꫝʜɪɴ 𝐁ᴏᴛ!",

        "⎯꯭᪵🦋꯭ ⃪🫠 এতক্ষণ ধরে জেগে আছি, এখন একটা বালিশ চাই!",

        "⎯꯭᪵🦋꯭ ⃪😂 Uptime চলছে, কিন্তু আমার ভাগ্য এখনো Offline!",

        "⎯꯭᪵🦋꯭ ⃪🚀 বট থামে না, শুধু মাঝে মাঝে Drama করে!",

        "⎯꯭᪵🦋꯭ ⃪😹 Restart-এর নাম শুনলেই বটের হার্টবিট বেড়ে যায়!",

        "⎯꯭᪵🦋꯭ ⃪💗 এতক্ষণ ধরে Online, অথচ কেউ 'কেমন আছো' জিজ্ঞেস করলো না!"

      ];

      const randomStatus =

        statuses[Math.floor(Math.random() * statuses.length)];

      // ==============================

      // BOT WHATSAPP ID

      // ==============================

      const botId = sock.user.id;

      const botNumber = botId

        .split(':')[0]

        .split('@')[0];

      const botJid =

        `${botNumber}@s.whatsapp.net`;

      // ==============================

      // CONTACT NAME

      // ==============================

      const contactName =

        '⎯͢^᪲𝐒ʜꫝʜɪɴ 𝐑ꫝɴꫝ𐙚';

      // ==============================

      // VCARD

      // ==============================

      const vcard = [

        'BEGIN:VCARD',

        'VERSION:3.0',

        `FN:${contactName}`,

        `N:${contactName};;;;`,

        `TEL;type=CELL;type=VOICE;waid=${botNumber}:+${botNumber}`,

        'END:VCARD'

      ].join('\n');

      // ==============================

      // HIDDEN CONTACT PREVIEW

      // ==============================

      const quotedContact = {

        key: {

          remoteJid: extra.from,

          fromMe: true,

          id: `UPTIME-CONTACT-${Date.now()}`,

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

      // UPTIME MESSAGE

      // ==============================

      const message =

        `*⎯͢✧𝐔ᴘᴛɪᴍᴇ ${randomEmoji} ᥫ᭡:* ${uptime}\n\n` +

        `${randomStatus}\n\n` +

        `-•━ Ξ ⤹•𝐒ʜꫝʜɪɴ 𝐑ꫝɴꫝ 𓂃ꜛ⸙`;

      // ==============================

      // SEND ONE MESSAGE

      // ==============================

      await sock.sendMessage(

        extra.from,

        {

          text: message,

          contextInfo: {

            stanzaId:

              `UPTIME-${Date.now()}`,

            participant: botJid,

            remoteJid: extra.from,

            // Hidden contact preview

            quotedMessage:

              quotedContact.message

          }

        }

      );

      // ==============================

      // REACTION

      // ==============================

      try {

        await sock.sendMessage(

          msg.key.remoteJid,

          {

            react: {

              text: randomEmoji,

              key: msg.key

            }

          }

        );

      } catch (e) {

        // Ignore reaction errors

      }

    } catch (error) {

      console.error(

        'Error in uptime command:',

        error

      );

      await extra.reply(

        '❌ Failed to fetch uptime.'

      );

    }

  }

};
