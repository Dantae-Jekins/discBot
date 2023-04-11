import client from './client.js';
import * as path from 'path';

for (const cmd of client.cmd_files) {
    const cmd_path = path.join(client.cmd_folder, cmd);
    let command = await import(cmd_path);
    command = command.default;
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        console.log(`[REGISTER] Command added: ${command.data.name}`)
    }
    
    else console.log(`[WARNING] Invalid command file : ${cmd}`);
    
}

client.login(client.data.token);
client.data.token = undefined;