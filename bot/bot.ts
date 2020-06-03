import * as discord from 'discord.js'
import { token } from '../auth.json'
import { BattleStream, getPlayerStreams } from '../sim/battle-stream'
import { Dex } from '../sim/dex'
import { runCommand } from './commands';
import { State } from './state';
import { Environment } from './environment';

const prefix = "b!";

const env = new Environment();

const bot = new discord.Client();

bot.login(token);

bot.on("ready", () => {
	console.log("Logged in as: " + bot.user.username + " - (" + bot.user.id + ")");
	console.log("Hello world from bot.");
});

function echo(msg: discord.Message, arr: string[]) {
	msg.reply(arr.join(" "));
}

bot.on("message", (msg) => {
	if (msg.author.bot) {
		// Ignore bot messages
		return;
	}
	if (msg.content.startsWith(prefix)) {
		const args = msg.content.substring(prefix.length).split(/ +/);
		const name = args.shift();
		console.log("Incoming command: " + msg.content);
		runCommand(name, msg, args, env);
	}
});
