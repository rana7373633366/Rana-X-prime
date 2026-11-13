
/**
 * GitHub Command - Hidden VCard Contact Preview
 */

module.exports = {
    name: 'github',
    aliases: ['repo', 'git', 'source', 'sc', 'script'],
    category: 'general',
    description: 'Show GitHub username',
    usage: '.github',

    async execute(sock, msg, args, extra) {
        try {
            const axios = require('axios');

            const username = "ʏᴏᴜʀ ᴜꜱᴇʀ ɴᴀᴍᴇ";

            // Bot ID
            const botNumber = sock.user.id
                .split(':')[0]
                .split('@')[0];

            const botJid = `${botNumber}@s.whatsapp.net`;

            // Contact Name
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

            // Bot Profile Thumbnail
            let jpegThumbnail;

            try {
                const ppUrl = await sock.profilePictureUrl(
                    botJid,
                    'image'
                );

                if (ppUrl) {
                    const response = await axios.get(ppUrl, {
                        responseType: 'arraybuffer'
                    });

                    jpegThumbnail = Buffer.from(response.data);
                }
            } catch (e) {
                // Continue without thumbnail
            }

            // Hidden Contact Preview
            const quotedContact = {
                contactMessage: {
                    displayName: contactName,
                    vcard: vcard,
                    ...(jpegThumbnail ? {
                        jpegThumbnail
                    } : {})
                }
            };

            // Send GitHub Message
            await sock.sendMessage(
                extra.from,
                {
                    text:
                        `*⎯͢✦ 𝐆ɪᴛʜᴜʙ ⪼ 〈${username}〉*`,

                    contextInfo: {
                        stanzaId: `GITHUB-${Date.now()}`,
                        participant: botJid,
                        remoteJid: extra.from,

                        // Contact Card Preview
                        quotedMessage: quotedContact
                    }
                }
            );

        } catch (error) {
            console.error('GitHub Error:', error);
            await extra.reply(`❌ Error: ${error.message}`);
        }
    }
};
