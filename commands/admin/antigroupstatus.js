
/**
 * Antigroupstatus - Block group status posts in the group
 * Contact Card + Full Stylish Replies
 */

const database = require('../../database');
const groupStatusTracker = require('../../utils/groupStatusTracker');

module.exports = {
    name: 'antigroupstatus',
    aliases: ['antigstatus', 'ags'],
    category: 'admin',
    description: 'Block group status posts (delete/kick)',
    usage: '.antigroupstatus <on/off/set/get>',
    groupOnly: true,
    adminOnly: true,
    botAdminNeeded: true,

    async execute(sock, msg, args, extra) {
        try {
            // ==============================
            // BOT CONTACT CARD
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
                    remoteJid: extra.from,
                    fromMe: true,
                    id: `AGS-CONTACT-${Date.now()}`,
                    participant: botJid
                },
                message: {
                    contactMessage: {
                        displayName: contactName,
                        vcard
                    }
                }
            };

            // ==============================
            // COMMON STYLED REPLY
            // ==============================

            const replyWithCard = async (text) => {
                const message =
                    `⎯꯭𝆭̽🌀᭡᪳𓆪𝐀ɴᴛɪɢʀᴏᴜᴘsᴛᴀᴛᴜs𝆺𝅥𝆬⎯꯭𝆭̽🤍\n\n` +
                    `${text}\n\n` +
                    `⎯꯭𝆭̽🫀᭡᪳𝐗-𝐒ʜꫝʜɪɴ 𝐑ꫝɴꫝ 𝆺𝅥𝆬⎯꯭𝆭̽💗`;

                return sock.sendMessage(extra.from, {
                    text: message,
                    contextInfo: {
                        stanzaId: `AGS-${Date.now()}`,
                        participant: botJid,
                        remoteJid: extra.from,
                        quotedMessage: quotedContact.message
                    }
                });
            };

            // ==============================
            // DELETE GROUP STATUS
            // ==============================

            const ctx = msg.message?.extendedTextMessage?.contextInfo;

            if (!args[0] && ctx?.stanzaId && ctx?.participant) {
                const known = groupStatusTracker.list(extra.from)
                    .find((e) => e.key.id === ctx.stanzaId);

                const target = known || {
                    key: {
                        remoteJid: extra.from,
                        fromMe: false,
                        id: ctx.stanzaId,
                        participant: ctx.participant,
                    },
                };

                const deleted = sock.revokeGroupStatus
                    ? await sock.revokeGroupStatus(extra.from, target)
                    : false;

                if (deleted) {
                    groupStatusTracker.remove(extra.from, [ctx.stanzaId]);
                }

                return replyWithCard(
                    deleted
                        ? (
                            `⎯꯭𝆭̽✅᭡᪳𓆪𝐒ᴛꫝᴛᴜs 𝐃ᴇʟᴇᴛᴇᴅ!𝆺𝅥𝆬⎯꯭𝆭̽\n\n` +
                            `⎯꯭𝆭̽🛡️᭡᪳𓆪Successfully deleted the group status.𝆺𝅥𝆬⎯꯭𝆭̽`
                        )
                        : (
                            `⎯꯭𝆭̽❌᭡᪳𓆪𝐃ᴇʟᴇᴛɪᴏɴ 𝐅ꫝɪʟᴇᴅ!𝆺𝅥𝆬⎯꯭𝆭̽\n\n` +
                            `⎯꯭𝆭̽⚠️᭡᪳𓆪Couldn't delete the status.𝆺𝅥𝆬⎯꯭𝆭̽`
                        )
                );
            }

            // ==============================
            // SHOW SETTINGS
            // ==============================

            if (!args[0]) {
                const settings = database.getGroupSettings(extra.from);
                const status = settings.antigroupstatus ? '𝐎ɴ 🟢' : '𝐎ꜰꜰ 🔴';
                const action = settings.antigroupstatusAction || 'delete';

                return replyWithCard(
                    `⎯꯭𝆭̽⚙️᭡᪳𓆪𝐂ᴏɴꜰɪɢᴜʀꫝᴛɪᴏɴ𝆺𝅥𝆬⎯꯭𝆭̽\n\n` +

                    `⎯꯭𝆭̽🌐᭡᪳𓆪𝐒ᴛꫝᴛᴜs : *${status}*𝆺𝅥𝆬⎯꯭𝆭̽\n` +
                    `⎯꯭𝆭̽⚡᭡᪳𓆪𝐀ᴄᴛɪᴏɴ : *${action}*𝆺𝅥𝆬⎯꯭𝆭̽\n\n` +

                    `⎯꯭𝆭̽🛡️᭡᪳𓆪𝐏ʀᴏᴛᴇᴄᴛɪᴏɴ𝆺𝅥𝆬⎯꯭𝆭̽\n` +
                    `⎯꯭𝆭̽💎᭡᪳𓆪Blocks members from posting𝆺𝅥𝆬⎯꯭𝆭̽\n` +
                    `⎯꯭𝆭̽📌᭡᪳𓆪WhatsApp group statuses.𝆺𝅥𝆬⎯꯭𝆭̽\n\n` +

                    `⎯꯭𝆭̽💡᭡᪳𓆪Reply to a group status𝆺𝅥𝆬⎯꯭𝆭̽\n` +
                    `⎯꯭𝆭̽🗑️᭡᪳𓆪To delete it.𝆺𝅥𝆬⎯꯭𝆭̽\n\n` +

                    `⎯꯭𝆭̽📖᭡᪳𓆪𝐂ᴏᴍᴍꫝɴᴅ 𝐌ᴇɴᴜ𝆺𝅥𝆬⎯꯭𝆭̽\n` +
                    `⎯꯭𝆭̽🟢᭡᪳𓆪.antigroupstatus on\n` +
                    `⎯꯭𝆭̽🔴᭡᪳𓆪.antigroupstatus off\n` +
                    `⎯꯭𝆭̽⚙️᭡᪳𓆪.antigroupstatus set delete\n` +
                    `⎯꯭𝆭̽🚫᭡᪳𓆪.antigroupstatus set kick\n` +
                    `⎯꯭𝆭̽📋᭡᪳𓆪.antigroupstatus get`
                );
            }

            const opt = args[0].toLowerCase();

            // ==============================
            // ON
            // ==============================

            if (opt === 'on') {
                if (database.getGroupSettings(extra.from).antigroupstatus) {
                    return replyWithCard(
                        `⎯꯭𝆭̽⚠️᭡᪳𓆪𝐀ʟʀᴇꫝᴅʏ 𝐄ɴꫝʙʟᴇᴅ!𝆺𝅥𝆬⎯꯭𝆭̽\n\n` +
                        `⎯꯭𝆭̽💚᭡᪳𓆪Anti Group Status is already ON.𝆺𝅥𝆬⎯꯭𝆭̽`
                    );
                }

                database.updateGroupSettings(extra.from, {
                    antigroupstatus: true
                });

                return replyWithCard(
                    `⎯꯭𝆭̽🎉᭡᪳𓆪𝐒ᴜᴄᴄᴇssғᴜʟʟʏ 𝐄ɴꫝʙʟᴇᴅ!𝆺𝅥𝆬⎯꯭𝆭̽\n\n` +
                    `⎯꯭𝆭̽💚᭡᪳𓆪𝐒ᴛꫝᴛᴜs : *𝐎ɴ*𝆺𝅥𝆬⎯꯭𝆭̽\n` +
                    `⎯꯭𝆭̽🛡️᭡᪳𓆪Anti Group Status has been𝆺𝅥𝆬⎯꯭𝆭̽\n` +
                    `⎯꯭𝆭̽✨᭡᪳𓆪turned ON successfully.𝆺𝅥𝆬⎯꯭𝆭̽`
                );
            }

            // ==============================
            // OFF
            // ==============================

            if (opt === 'off') {
                database.updateGroupSettings(extra.from, {
                    antigroupstatus: false
                });

                return replyWithCard(
                    `⎯꯭𝆭̽🔴᭡᪳𓆪𝐒ᴜᴄᴄᴇssғᴜʟʟʏ 𝐃ɪsꫝʙʟᴇᴅ!𝆺𝅥𝆬⎯꯭𝆭̽\n\n` +
                    `⎯꯭𝆭̽❤️‍🩹᭡᪳𓆪𝐒ᴛꫝᴛᴜs : *𝐎ꜰꜰ*𝆺𝅥𝆬⎯꯭𝆭̽\n` +
                    `⎯꯭𝆭̽🔓᭡᪳𓆪Anti Group Status has been𝆺𝅥𝆬⎯꯭𝆭̽\n` +
                    `⎯꯭𝆭̽🌙᭡᪳𓆪turned OFF successfully.𝆺𝅥𝆬⎯꯭𝆭̽`
                );
            }

            // ==============================
            // SET ACTION
            // ==============================

            if (opt === 'set') {
                if (args.length < 2) {
                    return replyWithCard(
                        `⎯꯭𝆭̽⚙️᭡᪳𓆪𝐒ᴇᴛ 𝐀ᴄᴛɪᴏɴ 𝐔sꫝɢᴇ𝆺𝅥𝆬⎯꯭𝆭̽\n\n` +
                        `⎯꯭𝆭̽📌᭡᪳𓆪𝐔sꫝɢᴇ :\n` +
                        `⎯꯭𝆭̽🗑️᭡᪳𓆪.antigroupstatus set delete\n` +
                        `⎯꯭𝆭̽🚫᭡᪳𓆪.antigroupstatus set kick`
                    );
                }

                const setAction = args[1].toLowerCase();

                if (!['delete', 'kick'].includes(setAction)) {
                    return replyWithCard(
                        `⎯꯭𝆭̽⚠️᭡᪳𓆪𝐈ɴᴠꫝʟɪᴅ 𝐀ᴄᴛɪᴏɴ!𝆺𝅥𝆬⎯꯭𝆭̽\n\n` +
                        `⎯꯭𝆭̽💡᭡᪳𓆪Choose a valid action:\n` +
                        `⎯꯭𝆭̽🗑️᭡᪳𓆪delete\n` +
                        `⎯꯭𝆭̽🚫᭡᪳𓆪kick`
                    );
                }

                database.updateGroupSettings(extra.from, {
                    antigroupstatusAction: setAction,
                    antigroupstatus: true
                });

                return replyWithCard(
                    `⎯꯭𝆭̽✅᭡᪳𓆪𝐀ᴄᴛɪᴏɴ 𝐔ᴘᴅꫝᴛᴇᴅ!𝆺𝅥𝆬⎯꯭𝆭̽\n\n` +
                    `⎯꯭𝆭̽🎯᭡᪳𓆪𝐀ᴄᴛɪᴏɴ : *${setAction}*𝆺𝅥𝆬⎯꯭𝆭̽\n` +
                    `⎯꯭𝆭̽💚᭡᪳𓆪𝐒ᴛꫝᴛᴜs : *𝐎ɴ*𝆺𝅥𝆬⎯꯭𝆭̽\n\n` +
                    `⎯꯭𝆭̽✨᭡᪳𓆪𝐒ᴜᴄᴄᴇssғᴜʟʟʏ 𝐒ᴇᴛ! 💗`
                );
            }

            // ==============================
            // GET CONFIG
            // ==============================

            if (opt === 'get') {
                const settings = database.getGroupSettings(extra.from);
                const status = settings.antigroupstatus ? '𝐎𝐍 🟢' : '𝐎𝐅𝐅 🔴';
                const action = settings.antigroupstatusAction || 'delete';

                return replyWithCard(
                    `⎯꯭𝆭̽📋᭡᪳𓆪𝐆ʀᴏᴜᴘ 𝐒ᴛꫝᴛᴜs 𝐂ᴏɴғɪɢ𝆺𝅥𝆬⎯꯭𝆭̽\n\n` +
                    `⎯꯭𝆭̽🌐᭡᪳𓆪𝐒ᴛꫝᴛᴜs : *${status}*𝆺𝅥𝆬⎯꯭𝆭̽\n` +
                    `⎯꯭𝆭̽⚡᭡᪳𓆪𝐀ᴄᴛɪᴏɴ : *${action}*𝆺𝅥𝆬⎯꯭𝆭̽`
                );
            }

            // ==============================
            // INVALID COMMAND
            // ==============================

            return replyWithCard(
                `⎯꯭𝆭̽⚠️᭡᪳𓆪𝐈ɴᴠꫝʟɪᴅ 𝐂ᴏᴍᴍꫝɴᴅ!𝆺𝅥𝆬⎯꯭𝆭̽\n\n` +
                `⎯꯭𝆭̽📌᭡᪳𓆪Use .antigroupstatus\n` +
                `⎯꯭𝆭̽💡᭡᪳𓆪To view available commands.`
            );

        } catch (error) {
            console.error('antigroupstatus.js error:', error);

            await extra.reply(
                `⎯꯭𝆭̽❌᭡᪳𓆪𝐀ɴᴛɪɢʀᴏᴜᴘsᴛᴀᴛᴜs 𝐄ʀʀᴏʀ!𝆺𝅥𝆬⎯꯭𝆭̽\n\n` +
                `⎯꯭𝆭̽⚠️᭡᪳𓆪${error.message}\n\n` +
                `⎯꯭𝆭̽🫀᭡᪳𝐗-𝐒ʜꫝʜɪɴ 𝐑ꫝɴꫝ 𝆺𝅥𝆬⎯꯭𝆭̽💗`
            );
        }
    }
};
