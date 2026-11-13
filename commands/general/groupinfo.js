
/**
 * Group Info Command - Stylish Group Information + VCard Contact Preview
 */

module.exports = {
    name: 'groupinfo',
    aliases: ['info', 'ginfo'],
    category: 'general',
    description: 'Show group information',
    usage: '.groupinfo',
    groupOnly: true,

    async execute(sock, msg, args, extra) {
        try {
            const axios = require('axios');

            const metadata = extra.groupMetadata;

            const participants = metadata.participants || [];

            const admins = participants.filter(
                p => p.admin === 'admin' || p.admin === 'superadmin'
            );

            const members = participants.filter(p => !p.admin);

            const totalMembers = participants.length;
            const totalAdmins = admins.length;
            const totalNonAdmins = members.length;

            const created = metadata.creation
                ? new Date(metadata.creation * 1000).toLocaleDateString('en-GB')
                : 'Unknown';

            const description = metadata.desc || 'No Description';

            let text = `*╭--•━🔗 Ξ ⤹• ɢʀᴏᴜᴘ ɪɴғᴏ𓂃ꜛ⸙*\n`;

            text += `*├❖* 🍓 \`ɢʀᴏᴜᴘ:\` ${metadata.subject || 'Unknown'}\n`;
            text += `*├❖* 🍅 \`ɢʀᴏᴜᴘ ɪᴅ:\` ${metadata.id}\n`;
            text += `*├❖* 🍑 \`ᴛᴏᴛᴀʟ ᴍᴇᴍʙᴇʀ:\` ${totalMembers}\n`;
            text += `*├❖* 👑 \`ᴀᴅᴍɪɴꜱ:\` ${totalAdmins}\n`;
            text += `*├❖* 🤸‍♂️ \`ɴᴏɴ-ᴀᴅᴍɪɴ:\` ${totalNonAdmins}\n`;
            text += `*├❖* 📅 \`ᴄʀᴇᴀᴛᴇᴅ:\` ${created}\n`;
            text += `*├❖* 🍁 \`ʀᴇꜱᴛʀɪᴄᴛᴇᴅ:\` ${metadata.restrict ? '✓ Enabled' : '✗ Disabled'}\n`;
            text += `*├❖* 🐁 \`ᴀɴɴᴏᴜɴᴄᴇ:\` ${metadata.announce ? '✓ Enabled' : '✗ Disabled'}\n`;
            text += `*├❖* 🪹 \`ᴅᴇꜱᴄʀɪᴘᴛɪᴏɴ:\`\n`;
            text += `*├❖* 🪷 ${description}\n`;

            text += `*├━━━━━━━━━━━━━━━━━━━━♡︎*\n`;
            text += `*├❖* 🏆 \`ɢʀᴏᴜᴘ ᴀᴅᴍɪɴꜱ\n`;

            const adminEmojis = ['🥇', '🥈', '🥉'];

            admins.forEach((admin, index) => {
                const emoji = adminEmojis[index] || '🏅';
                const number = admin.id.split('@')[0];

                text += `*├❖* ${emoji} ${index + 1}. @${number}\n`;
            });

            text += `*╰•━───────────────♡︎*`;

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
                key: {
                    remoteJid: extra.from,
                    fromMe: true,
                    id: `GROUPINFO-CONTACT-${Date.now()}`,
                    participant: botJid
                },

                message: {
                    contactMessage: {
                        displayName: contactName,
                        vcard: vcard,
                        ...(jpegThumbnail ? {
                            jpegThumbnail
                        } : {})
                    }
                }
            };

            // Send Group Info with Contact Preview
            await sock.sendMessage(
                extra.from,
                {
                    text: text,

                    mentions: admins.map(a => a.id),

                    contextInfo: {
                        stanzaId: `GROUPINFO-${Date.now()}`,
                        participant: botJid,
                        remoteJid: extra.from,

                        // Hidden Contact Card
                        quotedMessage: quotedContact.message
                    }
                }
            );

        } catch (error) {
            console.error('GroupInfo Error:', error);
            await extra.reply(`❌ Error: ${error.message}`);
        }
    }
};
