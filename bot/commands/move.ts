import { Command } from './command'
import { Message } from 'discord.js';
import { Environment } from '../environment';

const move: Command = {
	name: 'move',
	description: 'Selects a move in a game of BattleCord.',
	effect: (msg: Message, args: string[], env: Environment): void => {
		const id = msg.author.id;
		const state = env.states.get(id);
		if (!state) {
			// No game exists for the player
			msg.reply("Cannot make move because you are not in a game!");
			return;
		}
		state.move(msg.author, args.join(" "));
	} 
};

export {
	move
};

