
/**
 * Group Stats Command - Top Member Event + VCard Contact Preview
 */

const { getStats } = require('../../utils/groupstats');
const axios = require('axios');

module.exports = {
    name: 'groupstats',
    aliases: ['stats', 'leaderboard', 'gstats', 'topmembers', 'msgs', 'messagestats'],
    category: 'general',
    description: 'Show today\'s group chat statistics',
    usage: '.groupstats',
    groupOnly: true,

    async execute(sock, msg, args, extra) {
        try {
            const from = extra.from;
            const stats = getStats(from);

            if (!stats)
                return extra.reply('📊 No activity recorded today.');

            const { total, users } = stats;

            // Get Group Name
            const metadata = extra.groupMetadata ||
                await sock.groupMetadata(from);

            const groupName = metadata.subject || 'Unknown Group';

            // Top 5 Active Members
            const sortedUsers = Object.entries(users)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5);

            if (!sortedUsers.length)
                return extra.reply('📊 No active users yet.');

            // Bengali Positions
            const positions = [
                '১ম স্থান',
                '২য় স্থান',
                '৩য় স্থান',
                '৪র্থ স্থান',
                '৫ম স্থান'
            ];

            // Create Winner List
            const topText = sortedUsers.map(([id, count], i) => {
                const user = id.split('@')[0];

                return `*⎯꯭𝆭̽🌸᭡᪳𓆪${positions[i]} 𝆺𝅥𝆬 @${user} ${count} messages*`;
            }).join('\n\n');

            const mentions = sortedUsers.map(([id]) => id);

            const text = `
*•━ Ξ ⤹• ᴛᴏᴘ ᴍᴇᴍʙᴇʀ ᴇᴠᴇɴᴛ 𓂃ꜛ⸙*

🏆*♡︎_আজকের গ্রুপ বিজয়ী ঘোষণা_..!!!🩵🌻🤌🏻🌀✨*

*😇 অভিনন্দন! আজকে ${groupName} এই গ্রুপে যারা বিজয়ী হয়েছেন..!!:*

\`⎯꯭𝆭̽🌸᭡᪳𓆪তাদের নাম নিচে দেওয়া হলো𝆺𝅥𝆬⎯꯭𝆭̽\`

${topText}

📊 *আজকের মোট মেসেজ: ${total} টি*

📊 *আগামীকাল কে হবেন গ্রুপের নতুন বিজয়ী?*

*দেখা হবে পরবর্তী Top Member Event-এ!* 🏆✨

*-•━🫀 Ξ ⤹• 𝐒ʜꫝʜɪɴ 𝐑ꫝɴꫝ𓂃ꜛ⸙*
`.trim();

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
                    remoteJid: from,
                    fromMe: true,
                    id: `GROUPSTATS-CONTACT-${Date.now()}`,
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

            // Send Group Stats with Contact Preview
            await sock.sendMessage(
                from,
                {
                    text,
                    mentions,

                    contextInfo: {
                        stanzaId: `GROUPSTATS-${Date.now()}`,
                        participant: botJid,
                        remoteJid: from,

                        // Hidden Contact Card
                        quotedMessage: quotedContact.message
                    }
                }
            );

        } catch (err) {
            console.error('[groupstats cmd] error:', err);
            extra.reply('❌ Error loading stats.');
        }
    }
};
