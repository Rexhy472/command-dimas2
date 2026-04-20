const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  EmbedBuilder
} = require('discord.js');

// ===== CONFIG =====
const TOKEN = process.env.TOKEN;
const GUILD_ID = process.env.GUILD_ID;

const CLIENT_ID = 'ISI_CLIENT_ID_KAMU';
const OWNER_ID = 'ISI_ID_KAMU';

// ===== CLIENT =====
const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// ===== REGISTER COMMAND =====
const commands = [
  new SlashCommandBuilder()
    .setName('say')
    .setDescription('Kirim pesan biasa')
    .addStringOption(option =>
      option.setName('pesan')
        .setDescription('Isi pesan')
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName('sayembed')
    .setDescription('Kirim pesan embed')
    .addStringOption(option =>
      option.setName('judul')
        .setDescription('Judul embed')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('isi')
        .setDescription('Isi pesan')
        .setRequired(true)
    )
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  await rest.put(
    Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
    { body: commands }
  );
  console.log('Slash command ready');
})();

// ===== READY =====
client.on('ready', () => {
  console.log(`Login sebagai ${client.user.tag}`);
});

// ===== INTERACTION =====
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  // 🔒 cuma kamu yang bisa
  if (interaction.user.id !== OWNER_ID) {
    return interaction.reply({
      content: '❌ Tidak diizinkan',
      ephemeral: true
    });
  }

  // ===== /say =====
  if (interaction.commandName === 'say') {
    const text = interaction.options.getString('pesan');

    await interaction.reply({
      content: '✅ Terkirim',
      ephemeral: true
    });

    interaction.channel.send(text);
  }

  // ===== /sayembed =====
  if (interaction.commandName === 'sayembed') {
    const judul = interaction.options.getString('judul');
    const isi = interaction.options.getString('isi');

    const embed = new EmbedBuilder()
      .setTitle(judul)
      .setDescription(isi)
      .setColor('Blue')
      .setFooter({ text: 'Pengumuman' });

    await interaction.reply({
      content: '✅ Embed terkirim',
      ephemeral: true
    });

    interaction.channel.send({ embeds: [embed] });
  }
});

client.login(TOKEN);
