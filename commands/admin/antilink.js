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
            // Bot Contact Card
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

            // Reply With Contact Card
            const replyWithCard = async (text) => {
                return await sock.sendMessage(extra.from, {
                    text,
                    contextInfo: {
                        stanzaId: `AL-${Date.now()}`,
                        participant: botJid,
                        remoteJid: extra.from,
                        quotedMessage: quotedContact.message
                    }
                });
            };

            if (!args[0]) {
                const settings = database.getGroupSettings(extra.from);
                const status = settings.antilink ? '𝐎ɴ' : '𝐎ꜰꜰ';
                const action = settings.antilinkAction || 'delete';

                return replyWithCard(
                    `╭━━〔 🔗 𝐀ɴᴛɪʟɪɴᴋ 〕━━╮
┃
┃  ⚙️ *𝐂ᴏɴꜰɪɢᴜʀꫝᴛɪᴏɴ*
┃
┃  ◈ 𝐒ᴛꫝᴛᴜs : *${status}*
┃  ◈ 𝐀ᴄᴛɪᴏɴ : *${action}*
┃
┃  🛡️ Protects the group from
┃     unwanted links.
┃
┣━━━━━━━━━━━━━━━━━━━━
┃  📖 *𝐔sꫝɢᴇ*
┃
┃  ➤ .antilink on
┃  ➤ .antilink off
┃  ➤ .antilink set delete
┃  ➤ .antilink set kick
┃  ➤ .antilink get
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
                );
            }

            const opt = args[0].toLowerCase();

            // ON
            if (opt === 'on') {
                if (database.getGroupSettings(extra.from).antilink) {
                    return replyWithCard(
                        `╭━━〔 🔗 𝐀ɴᴛɪʟɪɴᴋ 〕━━╮
┃
┃  ⚠️ *𝐀ʟʀᴇꫝᴅʏ 𝐄ɴꫝʙʟᴇᴅ*
┃
┃  Antilink protection is already ON.
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
                    );
                }

                database.updateGroupSettings(extra.from, {
                    antilink: true
                });

                return replyWithCard(
                    `╭━━〔 🔗 𝐀ɴᴛɪʟɪɴᴋ 〕━━╮
┃
┃  ✅ *𝐒ᴜᴄᴄᴇssꜰᴜʟʟʏ 𝐄ɴꫝʙʟᴇᴅ*
┃
┃  Antilink protection has been
┃  turned ON successfully.
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
                );
            }

            // OFF
            if (opt === 'off') {
                database.updateGroupSettings(extra.from, {
                    antilink: false
                });

                return replyWithCard(
                    `╭━━〔 🔗 𝐀ɴᴛɪʟɪɴᴋ 〕━━╮
┃
┃  🔴 *𝐒ᴜᴄᴄᴇssꜰᴜʟʟʏ 𝐃ɪsꫝʙʟᴇᴅ*
┃
┃  Antilink protection has been
┃  turned OFF successfully.
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
                );
            }

            // SET ACTION
            if (opt === 'set') {
                if (args.length < 2) {
                    return replyWithCard(
                        `╭━━〔 ⚙️ 𝐒ᴇᴛ 𝐀ᴄᴛɪᴏɴ 〕━━╮
┃
┃  📌 *𝐏ʟᴇꫝsᴇ 𝐒ᴘᴇᴄɪꜰʏ 𝐀ɴ 𝐀ᴄᴛɪᴏɴ*
┃
┃  ➤ .antilink set delete
┃  ➤ .antilink set kick
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
                    );
                }

                const setAction = args[1].toLowerCase();

                if (!['delete', 'kick'].includes(setAction)) {
                    return replyWithCard(
                        `╭━━〔 ⚠️ 𝐈ɴᴠꫝʟɪᴅ 𝐀ᴄᴛɪᴏɴ 〕━━╮
┃
┃  Choose a valid action:
┃
┃  ➤ delete
┃  ➤ kick
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
                    );
                }

                database.updateGroupSettings(extra.from, {
                    antilinkAction: setAction,
                    antilink: true // Auto-enable when setting action
                });

                return replyWithCard(
                    `╭━━〔 ⚙️ 𝐀ᴄᴛɪᴏɴ 𝐔ᴘᴅꫝᴛᴇᴅ 〕━━╮
┃
┃  ✅ *𝐒ᴜᴄᴄᴇssꜰᴜʟʟʏ 𝐒ᴇᴛ*
┃
┃  ◈ 𝐀ᴄᴛɪᴏɴ : *${setAction}*
┃  ◈ 𝐒ᴛꫝᴛᴜs : *𝐎ɴ*
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
                );
            }

            // GET CONFIG
            if (opt === 'get') {
                const settings = database.getGroupSettings(extra.from);
                const status = settings.antilink ? 'ON' : 'OFF';
                const action = settings.antilinkAction || 'delete';

                return replyWithCard(
                    `╭━━〔 🔗 𝐀ɴᴛɪʟɪɴᴋ 𝐂ᴏɴꜰɪɢ 〕━━╮
┃
┃  ◈ 𝐒ᴛꫝᴛᴜs : *${status}*
┃  ◈ 𝐀ᴄᴛɪᴏɴ : *${action}*
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
                );
            }

            // Invalid Command
            return replyWithCard(
                `╭━━〔 ⚠️ 𝐈ɴᴠꫝʟɪᴅ 𝐂ᴏᴍᴍꫝɴᴅ 〕━━╮
┃
┃  Use .antilink for usage.
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
            );

        } catch (error) {
            await extra.reply(`❌ Error: ${error.message}`);
        }
    }
};
