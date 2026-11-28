
/**
 * Antilink Command - Toggle antilink protection with delete/kick options
 */

const database = require('../../database');

module.exports = {
    name: 'antilink',
    aliases: [],
    category: 'admin',
    description: 'Configure antilink protection (delete/kick)',
    usage: '.antilink <on/off/set/get>',
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
                    id: `AL-CONTACT-${Date.now()}`,
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
            // STYLED REPLY WITH CONTACT CARD
            // ==============================

            const replyWithCard = async (text) => {
                const message =
                    `⎯꯭𝆭̽🌀᭡᪳𓆪𝐀ɴᴛɪʟɪɴᴋ𝆺𝅥𝆬⎯꯭𝆭̽🤍\n\n` +
                    `${text}\n\n` +
                    `⎯꯭𝆭̽🫀᭡᪳𝐗-𝐒ʜꫝʜɪɴ 𝐑ꫝɴꫝ 𝆺𝅥𝆬⎯꯭𝆭̽💗`;

                return await sock.sendMessage(extra.from, {
                    text: message,
                    contextInfo: {
                        stanzaId: `AL-${Date.now()}`,
                        participant: botJid,
                        remoteJid: extra.from,
                        quotedMessage: quotedContact.message
                    }
                });
            };

            // ==============================
            // NO ARGUMENT
            // ==============================

            if (!args[0]) {
                const settings = database.getGroupSettings(extra.from);
                const status = settings.antilink ? '𝐎𝐍 🟢' : '𝐎𝐅𝐅 🔴';
                const action = settings.antilinkAction || 'delete';

                return replyWithCard(
                    `⎯꯭𝆭̽⚙️᭡᪳𓆪𝐂ᴏɴꜰɪɢᴜʀꫝᴛɪᴏɴ𝆺𝅥𝆬⎯꯭𝆭̽🤍\n\n` +
                    `⎯꯭𝆭̽💚᭡᪳𓆪𝐒ᴛꫝᴛᴜs : *${status}*𝆺𝅥𝆬⎯꯭𝆭̽🤍\n` +
                    `⎯꯭𝆭̽⚡᭡᪳𓆪𝐀ᴄᴛɪᴏɴ : *${action.toUpperCase()}*𝆺𝅥𝆬⎯꯭𝆭̽🤍\n\n` +

                    `⎯꯭𝆭̽🛡️᭡᪳𓆪𝐏ʀᴏᴛᴇᴄᴛɪᴏɴ𝆺𝅥𝆬⎯꯭𝆭̽🤍\n` +
                    `⎯꯭𝆭̽🔗᭡᪳𓆪Protects the group from unwanted links.𝆺𝅥𝆬⎯꯭𝆭̽\n\n` +

                    `⎯꯭𝆭̽📖᭡᪳𓆪𝐂ᴏᴍᴍꫝɴᴅ 𝐌ᴇɴᴜ𝆺𝅥𝆬⎯꯭𝆭̽🤍\n` +
                    `⎯꯭𝆭̽🟢᭡᪳𓆪.antilink on𝆺𝅥𝆬\n` +
                    `⎯꯭𝆭̽🔴᭡᪳𓆪.antilink off𝆺𝅥𝆬\n` +
                    `⎯꯭𝆭̽🗑️᭡᪳𓆪.antilink set delete𝆺𝅥𝆬\n` +
                    `⎯꯭𝆭̽🚫᭡᪳𓆪.antilink set kick𝆺𝅥𝆬\n` +
                    `⎯꯭𝆭̽📋᭡᪳𓆪.antilink get𝆺𝅥𝆬⎯꯭𝆭̽🤍`
                );
            }

            const opt = args[0].toLowerCase();

            // ==============================
            // ON
            // ==============================

            if (opt === 'on') {
                if (database.getGroupSettings(extra.from).antilink) {
                    return replyWithCard(
                        `⎯꯭𝆭̽⚠️᭡᪳𓆪𝐀ʟʀᴇꫝᴅʏ 𝐄ɴꫝʙʟᴇᴅ!𝆺𝅥𝆬⎯꯭𝆭̽\n\n` +
                        `⎯꯭𝆭̽💚᭡᪳𓆪Antilink protection is already ON.𝆺𝅥𝆬⎯꯭𝆭̽🤍`
                    );
                }

                database.updateGroupSettings(extra.from, {
                    antilink: true
                });

                return replyWithCard(
                    `⎯꯭𝆭̽🎉᭡᪳𓆪 𝐏ʀᴏᴛᴇᴄᴛɪᴏɴ 𝐄ɴꫝʙʟᴇᴅ!𝆺𝅥𝆬⎯꯭𝆭̽\n` +
                    `⎯꯭𝆭̽💚᭡᪳𓆪𝐒ᴛꫝᴛᴜs : *𝐎𝐍*𝆺𝅥𝆬⎯꯭𝆭̽🤍\n` +
                    `⎯꯭𝆭̽🔗᭡᪳𓆪Antilink protection has been turned ON successfully.𝆺𝅥𝆬⎯꯭𝆭̽`
                );
            }

            // ==============================
            // OFF
            // ==============================

            if (opt === 'off') {
                database.updateGroupSettings(extra.from, {
                    antilink: false
                });

                return replyWithCard(
                    `⎯꯭𝆭̽⚠️᭡᪳𓆪𝐏ʀᴏᴛᴇᴄᴛɪᴏɴ 𝐃ɪsꫝʙʟᴇᴅ!𝆺𝅥𝆬⎯꯭𝆭̽\n` +
                    `⎯꯭𝆭̽❤️‍🩹᭡᪳𓆪𝐒ᴛꫝᴛᴜs : *𝐎𝐅𝐅*𝆺𝅥𝆬⎯꯭𝆭̽🤍\n` +
                    `⎯꯭𝆭̽🔓᭡᪳𓆪Antilink protection has been turned OFF successfully.𝆺𝅥𝆬⎯꯭𝆭̽`
                );
            }

            // ==============================
            // SET ACTION
            // ==============================

            if (opt === 'set') {
                if (args.length < 2) {
                    return replyWithCard(
                        `⎯꯭𝆭̽⚙️᭡᪳𓆪𝐒ᴇᴛ 𝐀ᴄᴛɪᴏɴ𝆺𝅥𝆬⎯꯭𝆭̽🤍\n\n` +
                        `⎯꯭𝆭̽📌᭡᪳𓆪𝐏ʟᴇꫝsᴇ 𝐒ᴘᴇᴄɪꜰʏ 𝐀ɴ 𝐀ᴄᴛɪᴏɴ𝆺𝅥𝆬⎯꯭𝆭̽\n` +
                        `⎯꯭𝆭̽🗑️᭡᪳𓆪.antilink set delete𝆺𝅥𝆬\n` +
                        `⎯꯭𝆭̽🚫᭡᪳𓆪.antilink set kick𝆺𝅥𝆬⎯꯭𝆭̽🤍`
                    );
                }

                const setAction = args[1].toLowerCase();

                if (!['delete', 'kick'].includes(setAction)) {
                    return replyWithCard(
                        `⎯꯭𝆭̽⚠️᭡᪳𓆪𝐈ɴᴠꫝʟɪᴅ 𝐀ᴄᴛɪᴏɴ!𝆺𝅥𝆬⎯꯭𝆭̽\n\n` +
                        `⎯꯭𝆭̽💡᭡᪳𓆪Choose a valid action:𝆺𝅥𝆬⎯꯭𝆭̽🤍\n` +
                        `⎯꯭𝆭̽🗑️᭡᪳𓆪delete𝆺𝅥𝆬\n` +
                        `⎯꯭𝆭̽🚫᭡᪳𓆪kick𝆺𝅥𝆬⎯꯭𝆭̽🤍`
                    );
                }

                database.updateGroupSettings(extra.from, {
                    antilinkAction: setAction,
                    antilink: true
                });

                return replyWithCard(
                    `⎯꯭𝆭̽✅᭡᪳𓆪𝐀ᴄᴛɪᴏɴ 𝐔ᴘᴅꫝᴛᴇᴅ!𝆺𝅥𝆬⎯꯭𝆭̽\n` +
                    `⎯꯭𝆭̽🎯᭡᪳𓆪𝐀ᴄᴛɪᴏɴ : *${setAction.toUpperCase()}*𝆺𝅥𝆬⎯꯭𝆭̽🤍\n` +
                    `⎯꯭𝆭̽💚᭡᪳𓆪𝐒ᴛꫝᴛᴜs : *𝐎𝐍*𝆺𝅥𝆬⎯꯭𝆭̽🤍\n\n` +
                    `⎯꯭𝆭̽✨᭡᪳𓆪𝐒ᴜᴄᴄᴇssꜰᴜʟʟʏ 𝐒ᴇᴛ!𝆺𝅥𝆬⎯꯭𝆭̽`
                );
            }

            // ==============================
            // GET CONFIG
            // ==============================

            if (opt === 'get') {
                const settings = database.getGroupSettings(extra.from);
                const status = settings.antilink ? '𝐎𝐍 🟢' : '𝐎𝐅𝐅 🔴';
                const action = settings.antilinkAction || 'delete';

                return replyWithCard(
                    `⎯꯭𝆭̽📋᭡᪳𓆪𝐀ɴᴛɪʟɪɴᴋ 𝐂ᴏɴꜰɪɢ𝆺𝅥𝆬⎯꯭𝆭̽🤍\n\n` +
                    `⎯꯭𝆭̽💚᭡᪳𓆪𝐒ᴛꫝᴛᴜs : *${status}*𝆺𝅥𝆬⎯꯭𝆭̽🤍\n` +
                    `⎯꯭𝆭̽⚡᭡᪳𓆪𝐀ᴄᴛɪᴏɴ : *${action.toUpperCase()}*𝆺𝅥𝆬⎯꯭𝆭̽🤍`
                );
            }

            // ==============================
            // INVALID COMMAND
            // ==============================

            return replyWithCard(
                `⎯꯭𝆭̽⚠️᭡᪳𓆪𝐈ɴᴠꫝʟɪᴅ 𝐂ᴏᴍᴍꫝɴᴅ!𝆺𝅥𝆬⎯꯭𝆭̽\n\n` +
                `⎯꯭𝆭̽📌᭡᪳𓆪Use .antilink for usage.𝆺𝅥𝆬⎯꯭𝆭̽🤍`
            );

        } catch (error) {
            console.error('Antilink Error:', error);

            await extra.reply(
                `⎯꯭𝆭̽🌀᭡᪳𓆪𝐀ɴᴛɪʟɪɴᴋ𝆺𝅥𝆬⎯꯭𝆭̽🤍\n\n` +
                `⎯꯭𝆭̽❌᭡᪳𓆪𝐄ʀʀᴏʀ : ${error.message}𝆺𝅥𝆬⎯꯭𝆭̽\n\n` +
                `⎯꯭𝆭̽🫀᭡᪳𝐗-𝐒ʜꫝʜɪɴ 𝐑ꫝɴꫝ 𝆺𝅥𝆬⎯꯭𝆭̽💗`
            );
        }
    }
};
