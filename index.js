const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  EmbedBuilder
} = require('discord.js');

// ===== ENV =====
const TOKEN = process.env.TOKEN;
const GUILD_ID = process.env.GUILD_ID;
const CLIENT_ID = process.env.CLIENT_ID;
const OWNER_ID = process.env.OWNER_ID;

// ===== CLIENT =====
const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

// ===== COMMAND =====
const commands = [

  new SlashCommandBuilder()
    .setName('say')
    .setDescription('Kirim pesan sebagai bot')
    .addStringOption(option =>
      option.setName('pesan')
        .setDescription('Isi pesan')
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName('sayembed')
    .setDescription('Kirim embed')
    .addStringOption(o =>
      o.setName('judul').setDescription('Judul').setRequired(true))
    .addStringOption(o =>
      o.setName('isi').setDescription('Isi pesan').setRequired(true))
    .addStringOption(o =>
      o.setName('warna').setDescription('Contoh: Blue / Red'))
].map(cmd => cmd.toJSON());

// ===== REGISTER =====
const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
  try {
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands }
    );
    console.log('Slash command ready');
  } catch (err) {
    console.error(err);
  }
})();

// ===== READY =====
client.on('ready', () => {
  console.log(`Login sebagai ${client.user.tag}`);
});

// ===== INTERACTION =====
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  // 🔒 hanya owner
  if (interaction.user.id !== OWNER_ID) {
    return interaction.reply({
      content: '❌ Tidak diizinkan',
      ephemeral: true
    });
  }

  // ===== /say =====
  if (interaction.commandName === 'say') {
    const text = interaction.options.getString('pesan');

    await interaction.reply({ content: '✅ Terkirim', ephemeral: true });
    interaction.channel.send(text);
  }

  // ===== /sayembed =====
  if (interaction.commandName === 'sayembed') {
    const judul = interaction.options.getString('judul');
    const isi = interaction.options.getString('isi');
    const warna = interaction.options.getString('warna') || 'Blue';

    const embed = new EmbedBuilder()
      .setTitle(judul)
      .setDescription(isi)
      .setColor(warna);

    await interaction.reply({ content: '✅ Embed terkirim', ephemeral: true });
    interaction.channel.send({ embeds: [embed] });
  }
});

client.login(TOKEN);
