
/**
 * GetPP Command - Profile Picture + Contact Preview
 */

const axios = require('axios');

module.exports = {
  name: 'getpp',
  aliases: ['gp', 'getpic'],
  category: 'general',
  description: 'Get profile picture of a user',
  usage: '.getpp (reply to message or tag user)',

  async execute(sock, msg, args, extra) {
    try {
      let targetUser = null;

      // Reply check
      const quotedMessage =
        msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

      if (quotedMessage) {
        targetUser =
          msg.message.extendedTextMessage.contextInfo.participant;
      } else {
        // Mention check
        const mentionedJid =
          msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;

        if (mentionedJid?.length > 0) {
          targetUser = mentionedJid[0];
        } else {
          targetUser = extra.sender;
        }
      }

      if (!targetUser) {
        return extra.reply('❌ Could not identify target user.');
      }

      try {
        // Get target profile picture
        const ppUrl = await sock.profilePictureUrl(
          targetUser,
          'image'
        );

        if (!ppUrl) {
          return extra.reply('❌ Profile picture not found.');
        }

        const response = await axios.get(ppUrl, {
          responseType: 'arraybuffer'
        });

        const buffer = Buffer.from(response.data);

        // Bot ID
        const botNumber = sock.user.id
          .split(':')[0]
          .split('@')[0];

        const botJid = `${botNumber}@s.whatsapp.net`;

        // Contact name
        const contactName =
          '⎯͢^᪲𝐒ʜꫝʜɪɴ 𝐑ꫝɴꫝ𐙚';

        // VCard
        const vcard = [
          'BEGIN:VCARD',
          'VERSION:3.0',
          `FN:${contactName}`,
          `N:${contactName};;;;`,
          `TEL;type=CELL;type=VOICE;waid=${botNumber}:+${botNumber}`,
          'END:VCARD'
        ].join('\n');

        // Get bot profile thumbnail
        let jpegThumbnail;

        try {
          const botPP = await sock.profilePictureUrl(
            botJid,
            'image'
          );

          if (botPP) {
            const thumbResponse = await axios.get(botPP, {
              responseType: 'arraybuffer'
            });

            jpegThumbnail = Buffer.from(thumbResponse.data);
          }
        } catch (e) {
          // Continue without thumbnail
        }

        // Hidden Contact Preview
        const quotedContact = {
          key: {
            remoteJid: extra.from,
            fromMe: true,
            id: `GETPP-CONTACT-${Date.now()}`,
            participant: botJid
          },

          message: {
            contactMessage: {
              displayName: contactName,
              vcard: vcard,
              ...(jpegThumbnail ? { jpegThumbnail } : {})
            }
          }
        };

        // Send image with Contact Preview
        await sock.sendMessage(
          extra.from,
          {
            image: buffer,

            caption:
              `👤 *PROFILE PICTURE*\n\n` +
              `🦋 User: @${targetUser.split('@')[0]}\n\n` +
              `-•━ Ξ ⤹•𝐒ʜꫝʜɪɴ 𝐑ꫝɴꫝ 𓂃ꜛ⸙`,

            mentions: [targetUser],

            contextInfo: {
              stanzaId: `GETPP-${Date.now()}`,
              participant: botJid,
              remoteJid: extra.from,

              // Contact Card Preview
              quotedMessage: quotedContact.message
            }
          }
        );

      } catch (profileError) {
        console.error('GetPP Profile Error:', profileError);

        return extra.reply(
          '❌ Profile picture not found for this user.'
        );
      }

    } catch (error) {
      console.error('GetPP Error:', error);

      extra.reply(
        '❌ Profile picture not found for this user.'
      );
    }
  }
};
