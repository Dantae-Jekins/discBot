import { Client, Collection, Events, GatewayIntentBits, EmbedBuilder, AttachmentBuilder} from 'discord.js';
import { fileURLToPath } from 'url';
import * as path from 'path';
import fs from 'fs';

/// Specific client Class
class Jekins extends Client {
    constructor(options, data, cmd_files, cmd_folder, img_folder) {
        super(options);
        this.data = data;
        this.cmd_files = cmd_files;
        this.cmd_folder = cmd_folder;
        this.img_folder = img_folder;

        /// Command related structs
        
        //haunt
        const haunt_folder = path.join(img_folder, "haunt");
        const haunt_files = fs.readdirSync(haunt_folder);
        const imgs = []

        for(const img of haunt_files) {
            imgs.push(path.join(haunt_folder, img));
        }

        this.haunt = {target: null, timer: 0, images: imgs, cron: null, server: null}
    }
}


/// Setup client
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const img_folder = path.join(__dirname, "images");
const cmd_folder = path.join(__dirname, "commands");
const cmd_files = await fs.readdirSync(cmd_folder);
var data;

await new Promise((resolve, reject) => {
    fs.readFile('./jsons/data.json', 'utf-8', (err, file) => {
        if (err) 
            reject(err);
        resolve(JSON.parse(file));
    }); 

}).then( ret => {
    if(ret instanceof Error)
        throw ret
    
    data = ret;
    }
);

const client = new Jekins(
    {intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers
    ]}
    , data, cmd_files, cmd_folder, img_folder
);

client.commands = new Collection();


/// Client events and commands
// Startup
client.once(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user.tag}`);
});

// Interaction
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);
    
    if (!command) return;

	try {
		await command.execute(interaction);
        console.log(`[INTERACTION] ${interaction.commandName} call`)
	} catch (error) {
		console.error(error);
	}
});

// Message
client.on('messageCreate', async(message) => {
    if (client.data.guilds.includes(message.guildId)){
        if (message.author == client.haunt.target) {
            if (client.haunt.timer <= 0) {

                client.haunt.timer = Math.random()*8 + 2;
                const random = (arr) => arr[Math.floor(Math.random() * arr.length)];
                const random_image = random(client.haunt.images);
                const file = new AttachmentBuilder(random_image);
                var reply = await message.channel.send({files: [file]});
                setTimeout( () => {
                    reply.delete()
                }, 1000);

            } else {
                client.haunt.timer -= 1;
            }
        }
    }
});

export default client;



