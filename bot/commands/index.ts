import { start } from './start'
import { Message } from 'discord.js';
import { State } from '../state';
import { Environment } from '../environment';

const commands = [start];

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