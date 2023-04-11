import { REST, Routes } from 'discord.js';
import client from "./client.js";
import * as path from 'path';

const commands = [];
for (const cmd of client.cmd_files) {
    const cmd_path = path.join(client.cmd_folder, cmd);
    let command = await import(cmd_path);
    command = command.default;
    if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
        console.log(`[DEPLOY] Command deployed: ${command.data.name}`)
    }
}

const rest = new REST({ version: '10'}).setToken(client.data.token);
(async () => {
	try {
		for (const guild of client.data.guilds) {
			const data = await rest.put(
				Routes.applicationGuildCommands(client.data.id, guild),
				{ body: commands },
			);
		}
	} catch (error) {
		console.error(error);
	}
})();
