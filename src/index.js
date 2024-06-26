const dotenv = require('dotenv');
dotenv.config();

const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents:
        [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMessageReactions,
        ]
});

const COOLDOWN_TIME = 20 * 60 * 1000;
let lastExecuted = 0;

client.on('messageCreate', async message => {
    if (message.content.startsWith('!chamada')) {

        const now = Date.now();

        if (now - lastExecuted < COOLDOWN_TIME) {
            const timeLeft = (COOLDOWN_TIME - (now - lastExecuted)) / 1000;
            return message.reply(`Você deve esperar mais ${Math.ceil(timeLeft / 60)} minutos antes de usar este comando novamente.`);
        }
        lastExecuted = now;

        const voiceChannel = message.member.voice.channel;
        const targetChannel = message.guild.afkChannel;

        if (!voiceChannel || !targetChannel) {
            return message.channel.send('Um ou mais canais especificados não foram encontrados.');
        }

        const members = voiceChannel.members;

        if (members.size === 0) {
            return message.channel.send('Ninguém está no canal de voz.');
        }

        const mentionList = members.map(member => member.toString()).join(', ');
        const alertMessage = await message.channel.send(`Atenção: ${mentionList}! CHAMADA! Reaja a esta mensagem em 20 segundos ou vai cair na malha fina.`);

        try {
            await alertMessage.react('✅');

            const filter = (reaction, user) => {
                return reaction.emoji.name === '✅' && !user.bot;
            };

            alertMessage.awaitReactions({ filter, time: 20000 })
                .then((reactions) => {
                    const reactedUsers = reactions.get('✅')?.users.cache.filter(user => !user.bot).keys();
                    const reactedUsersArray = Array.from(reactedUsers);

                    members.forEach(member => {
                        if (!reactedUsersArray.includes(member.id)) {
                            member.voice.setChannel(targetChannel).catch(console.error);
                        }
                    });
                   message.channel.send('Muxos foram movidos! Mais atenção da próxima vex.');
                });
        } catch (error) {
            console.error(error);
            message.channel.send('Houve um erro ao processar as reações.');
        }
    }
});

client.login(process.env.DISCORD_TOKEN);
