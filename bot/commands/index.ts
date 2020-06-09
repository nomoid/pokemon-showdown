import { start } from './start'
import { Message } from 'discord.js';
import { Environment } from '../environment';
import { move } from './move';
import { switchPokemon } from './switch';

const commands = [start, move, switchPokemon];

export function runCommand(name: string, msg: Message, args: string[], env: Environment): void { 
	for (const command of commands) {
		if (command.name === name) {
			command.effect(msg, args, env);
			return;
		}
	}
	msg.reply("Invalid command: " + name);
	return;
}