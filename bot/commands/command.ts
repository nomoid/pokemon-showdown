import { Message } from 'discord.js'
import { Environment } from '../environment';

export interface Command {
	readonly name: string;
	readonly description: string;
	readonly effect: (msg: Message, args: string[], env: Environment) => void; 
}