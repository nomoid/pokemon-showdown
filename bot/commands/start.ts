import { Command } from './command'
import { Message } from 'discord.js';
import { Environment } from '../environment';
import { State } from '../state';

const start: Command = {
	name: 'start',
	description: 'Starts a game of BattleCord.',
	effect: (msg: Message, args: string[], env: Environment): void => {
		const id = msg.author.id;
		const state = env.states[id];
		if (state) {
			// State already exists, cannot start
			msg.reply("Game already exists, cannot start game!");
			return;
		}
		const newState = new State();
		env.states[id] = newState;
		newState.start();
	} 
};

export {
	start
};
