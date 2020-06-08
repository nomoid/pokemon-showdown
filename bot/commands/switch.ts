import { Command } from './command'
import { Message } from 'discord.js';
import { Environment } from '../environment';

const switchPokemon: Command = {
	name: 'switch',
	description: 'Switches to a different Pokemon in a game of Battlecord',
	effect: (msg: Message, args: string[], env: Environment): void => {
		const id = msg.author.id;
		const state = env.states.get(id);
		if (!state) {
			// No game exists for the player
			msg.reply("Cannot perform switch because you are not in a game!");
			return;
		}
		state.switchPokemon(msg.author, args.join(" "));
	} 
};

export {
	switchPokemon
};

