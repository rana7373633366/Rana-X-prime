/**
 * Ping Command - Contact Preview + Profile Picture + Random Status
 */

module.exports = {
    name: 'ping',
    aliases: ['p'],
    category: 'general',
    description: 'Check bot response time',
    usage: '.ping',

    async execute(sock, msg, args, extra) {
        try {
            const start = Date.now();

            // Random emojis
            const emojis = [
                '🐚', '🏓', '⚡', '🔥', '💥', '🌸', '🌷', '🌹',
                '🦋', '💗', '💖', '💘', '❤️', '🩵', '💙', '💜',
                '🖤', '🤍', '💛', '🧡', '💚', '🥀', '🌺', '🌻',
                '🌙', '⭐', '🌟', '✨', '☄️', '🍁', '🍂', '🌿',
                '🍀', '🫶', '😎', '😈', '👑', '🤴', '😇', '🥰',
                '😍', '😘', '😉', '🤭', '😂', '🤣', '😜', '🤪',
                '👀', '💫', '🎭', '🎀', '🎵', '🎶', '🚀', '💎',
                '🔱', '☠️', '👻', '😺', '🐼', '🐯', '🦁', '🐺'
            ];

            const emoji =
                emojis[Math.floor(Math.random() * emojis.length)];

            // Random Status
            const statuses = [
                '⎯꯭᪵🦋꯭ ⃪😂 পিং দেখেই ভয় পাইছো নাকি? বট কিন্তু জেগেই আছে!',
                '⎯꯭᪵🦋꯭ ⃪😴 বট ঘুমাচ্ছিল, পিং দিয়ে ঘুম ভাঙাইলা!',
                '⎯꯭᪵🦋꯭ ⃪🐸 পিং তো দিলাম, এখন ভাড়া দিবা কই?',
                '⎯꯭᪵🦋꯭ ⃪🤣 এত তাড়াতাড়ি Pong? বটের প্রেমে পড়ছো নাকি!',
                '⎯꯭᪵🦋꯭ ⃪🐢 স্পিড কম না, তোমার WiFi-ই লজ্জায় ধীর!',
                '⎯꯭᪵🦋꯭ ⃪🗿 বট অন, ব্রেইন অফ!',
                '⎯꯭᪵🦋꯭ ⃪😎 পিং চেক করলা, এখন একটা চা খাওয়াও!',
                '⎯꯭᪵🦋꯭ ⃪🤭 বটের গতি দেখে প্রেমে পড়লে কিন্তু দায়ী আমি না!',
                '⎯꯭᪵🦋꯭ ⃪🫠 Ping দিলা কেন? বটের সাথে কথা বলতে ইচ্ছা করছে নাকি?',
                '⎯꯭᪵🦋꯭ ⃪🐼 বটের Ping ঠিক আছে, তোমার মাথার Ping কেমন?',
                '⎯꯭᪵🦋꯭ ⃪🔥 Ping Low, Mood High!',
                '⎯꯭᪵🦋꯭ ⃪😂 এত দ্রুত Pong দিলাম, বিল কিন্তু আলাদা!',
                '⎯꯭᪵🦋꯭ ⃪😹 বট দৌড়ায় 5G-তে, তুমি এখনো 2G-তে!',
                '⎯꯭᪵🦋꯭ ⃪🫡 Boss, Ping ঠিক আছে—এখন আদেশ দিন!',
                '⎯꯭᪵🦋꯭ ⃪🥴 Ping মাপতে এসে নিজের ধৈর্য হারাইও না!',
                '⎯꯭᪵🦋꯭ ⃪👑 Pong হাজির—এখন রাজত্ব চলবে!',
                '⎯꯭᪵🦋꯭ ⃪🦋 বটের স্পিড দেখো, বাতাসও হার মানবে!',
                '⎯꯭᪵🦋꯭ ⃪💀 এত কম Ping দেখে সন্দেহ হচ্ছে... বটটা আসল তো?',
                '⎯꯭᪵🦋꯭ ⃪🤣 নেট স্লো হলেও বটের Attitude কিন্তু Fast!',
                '⎯꯭᪵🦋꯭ ⃪😈 Pong চলে আসছে—এবার গ্রুপে শান্তি থাকবে না!'
            ];

            const status =
                statuses[Math.floor(Math.random() * statuses.length)];

            // React to ping
            await sock.sendMessage(extra.from, {
                react: {
                    text: '⚡',
                    key: msg.key
                }
            });

            // Calculate ping
            const responseTime = Date.now() - start;

            // Bot ID
            const botNumber = sock.user.id
                .split(':')[0]
                .split('@')[0];

            const botJid = `${botNumber}@s.whatsapp.net`;

            // Contact name
            const contactName =
                '⎯͢^᪲𝐒ʜꫝʜɪɴ 𝐑ꫝɴꫝ𐙚';

            // vCard
            const vcard = [
                'BEGIN:VCARD',
                'VERSION:3.0',
                `FN:${contactName}`,
                `N:${contactName};;;;`,
                `TEL;type=CELL;type=VOICE;waid=${botNumber}:+${botNumber}`,
                'END:VCARD'
            ].join('\n');

            /*
             * Hidden quoted contact
             */
            const quotedContact = {
                key: {
                    remoteJid: extra.from,
                    fromMe: true,
                    id: `PING-CONTACT-${Date.now()}`,
                    participant: botJid
                },

                message: {
                    contactMessage: {
                        displayName: contactName,
                        vcard: vcard
                    }
                }
            };

            // ONE visible message only
            await sock.sendMessage(
                extra.from,
                {
                    text:
                        `*${emoji} ᎮoŇᎶ: ${responseTime} ๓Ş*\n\n` +
                        `${status}\n\n` +
                        `-•━ Ξ ⤹•𝐒ʜꫝʜɪɴ 𝐑ꫝɴꫝ 𓂃ꜛ⸙`,

                    contextInfo: {
                        stanzaId: `XRANA-${Date.now()}`,
                        participant: botJid,
                        remoteJid: extra.from,

                        // Hidden contact preview
                        quotedMessage:
                            quotedContact.message
                    }
                }
            );

        } catch (error) {
            console.error('Ping Error:', error);

            await extra.reply(
                `❌ Error: ${error.message}`
            );
        }
    }
};

 
