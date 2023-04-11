import { SlashCommandBuilder } from "@discordjs/builders";
import client from "../client.js";
import cron from 'node-cron';

export default{
	data: new SlashCommandBuilder()
		.setName('haunt')
		.setDescription('Assombra o feibetife')
		.addMentionableOption(option => 
			option.setName('alvo')
			.setDescription("O nome para assombar")),

	async execute(interaction) {
		if (interaction.options == undefined)  {
			await interaction.reply({content:"Who am i supposed to haunt?", ephemeral: true});
			return;
		}
        const target = interaction.options.getUser('alvo');
		if (target.bot) {
			await interaction.reply({content:"I can't haunt bots.", ephemeral: true});
			return;
		}
		client.haunt.target = target;
		client.haunt.timer = Math.random() * 8 + 2;
		
		if (client.haunt.cron != null) {
			client.haunt.cron.stop();
			client.haunt.cron = null;
		}
		
		client.haunt.channel = interaction.channel;
		client.haunt.cron = cron.schedule('*/5 * * * *', () => {
			const delay = Math.floor(Math.random() * (30000) + 30000)
			setTimeout(async () => {
				var mssg = client.haunt.channel.send(`<@${client.haunt.target.id}>`);
				(await mssg).delete();
			}, delay);
		});

		await interaction.reply({content:`Target set to ${target}.`, ephemeral: true});
	}
}