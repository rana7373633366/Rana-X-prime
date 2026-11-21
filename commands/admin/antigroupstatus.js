/**
 * Antigroupstatus - Block group status posts in the group
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
                    id: `AGS-CONTACT-${Date.now()}`,
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
                        stanzaId: `AGS-${Date.now()}`,
                        participant: botJid,
                        remoteJid: extra.from,
                        quotedMessage: quotedContact.message
                    }
                });
            };

            // Delete Group Status
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
                        ? `╭━━〔 🛡️ 𝐀ɴᴛɪ 𝐆ʀᴏᴜᴘ 𝐒ᴛꫝᴛᴜs 〕━━╮
┃
┃  ✅ *𝐒ᴛꫝᴛᴜs 𝐃ᴇʟᴇᴛᴇᴅ*
┃
┃  Successfully deleted the group status.
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
                        : `╭━━〔 🛡️ 𝐀ɴᴛɪ 𝐆ʀᴏᴜᴘ 𝐒ᴛꫝᴛᴜs 〕━━╮
┃
┃  ❌ *𝐃ᴇʟᴇᴛɪᴏɴ 𝐅ꫝɪʟᴇᴅ*
┃
┃  Couldn't delete the status.
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
                );
            }

            // Show Settings
            if (!args[0]) {
                const settings = database.getGroupSettings(extra.from);
                const status = settings.antigroupstatus ? '𝐎ɴ' : '𝐎ꜰꜰ';
                const action = settings.antigroupstatusAction || 'delete';

                return replyWithCard(
                    `╭━━〔 🛡️ 𝐀ɴᴛɪ 𝐆ʀᴏᴜᴘ 𝐒ᴛꫝᴛᴜs 〕━━╮
┃
┃  ⚙️ *𝐂ᴏɴꜰɪɢᴜʀꫝᴛɪᴏɴ*
┃
┃  ◈ 𝐒ᴛꫝᴛᴜs : *${status}*
┃  ◈ 𝐀ᴄᴛɪᴏɴ : *${action}*
┃
┃  📌 Blocks members from posting
┃     WhatsApp group statuses.
┃
┃  💡 Reply to a group status
┃     to delete it.
┃
┣━━━━━━━━━━━━━━━━━━━━
┃  📖 *𝐔sꫝɢᴇ*
┃
┃  ➤ .antigroupstatus on
┃  ➤ .antigroupstatus off
┃  ➤ .antigroupstatus set delete
┃  ➤ .antigroupstatus set kick
┃  ➤ .antigroupstatus get
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
                );
            }

            const opt = args[0].toLowerCase();

            // ON
            if (opt === 'on') {
                if (database.getGroupSettings(extra.from).antigroupstatus) {
                    return replyWithCard(
                        `╭━━〔 🛡️ 𝐀ɴᴛɪ 𝐆ʀᴏᴜᴘ 𝐒ᴛꫝᴛᴜs 〕━━╮
┃
┃  ⚠️ *𝐀ʟʀᴇꫝᴅʏ 𝐄ɴꫝʙʟᴇᴅ*
┃
┃  Anti Group Status is already ON.
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
                    );
                }

                database.updateGroupSettings(extra.from, {
                    antigroupstatus: true
                });

                return replyWithCard(
                    `╭━━〔 🛡️ 𝐀ɴᴛɪ 𝐆ʀᴏᴜᴘ 𝐒ᴛꫝᴛᴜs 〕━━╮
┃
┃  ✅ *𝐒ᴜᴄᴄᴇssꜰᴜʟʟʏ 𝐄ɴꫝʙʟᴇᴅ*
┃
┃  Anti Group Status has been
┃  turned ON successfully.
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
                );
            }

            // OFF
            if (opt === 'off') {
                database.updateGroupSettings(extra.from, {
                    antigroupstatus: false
                });

                return replyWithCard(
                    `╭━━〔 🛡️ 𝐀ɴᴛɪ 𝐆ʀᴏᴜᴘ 𝐒ᴛꫝᴛᴜs 〕━━╮
┃
┃  🔴 *𝐒ᴜᴄᴄᴇssꜰᴜʟʟʏ 𝐃ɪsꫝʙʟᴇᴅ*
┃
┃  Anti Group Status has been
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
┃  📌 *𝐔sꫝɢᴇ*
┃
┃  .antigroupstatus set delete
┃  .antigroupstatus set kick
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
                    antigroupstatusAction: setAction,
                    antigroupstatus: true
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
                const status = settings.antigroupstatus ? 'ON' : 'OFF';
                const action = settings.antigroupstatusAction || 'delete';

                return replyWithCard(
                    `╭━━〔 ⚙️ 𝐆ʀᴏᴜᴘ 𝐒ᴛꫝᴛᴜs 𝐂ᴏɴꜰɪɢ 〕━━╮
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
┃  Use .antigroupstatus
┃  to view available commands.
┃
╰━━━━━━━━━━━━━━━━━━━━╯`
            );

        } catch (error) {
            await extra.reply(`❌ Error: ${error.message}`);
        }
    }
};
