import { BattlePlayer } from "../sim/battle-stream";
import { ObjectReadWriteStream } from "../lib/streams";
import { User, Channel } from "discord.js";
import { DiscordChannel } from "./state";
import { Dex } from "../sim/dex";

const separator = "========================================\n";

function getActivePokemon(pokemonList: any) {
	for (const pokemon of pokemonList) {
		if (pokemon.active) {
			return pokemon;
		}
	}
	throw "No active Pokemon found!";
}

function getTeamInfo(pokemonList: any) {
	let info = "";
	for (const pokemon of pokemonList) {
		if (info.length !== 0) {
			info += "\n";
		}
		else {
			info += separator;
			info += "Team Roster:\n";
		}
		console.dir(pokemon);
		info += pokemon.details;
	}
	return info;
}

function getPokemonInfo(pokemon: any) {
	let info = separator;
	info += "Active Pokemon:\n";
	info += pokemon.details + "\n";
	info += "HP: " + pokemon.condition + "\n";
	info += "Ability: " + Dex.getAbility(pokemon.ability).name + "\n";
	info += "Item: " + Dex.getItem(pokemon.item).name + "\n";
	return info;
}

function getMovesInfo(moves: any) {
	let info = "";
	// assume 1v1 battle for now
	let i = 1;
	for (const move of moves) {
		if (info.length !== 0) {
			info += "\n";
		}
		else {
			info += separator;
			info += "Moves (p!move <number> to select a move):\n";
		}
		info += `${i}: ${move.move} (PP: ${move.pp})${move.disabled ? ' (Disabled)' : ''}`;
		i++;
	}
	return info;
}

export class DiscordPlayer extends BattlePlayer {

	private target: {send: (msg: any) => void};

	constructor(playerStream: ObjectReadWriteStream<string>, private channel: DiscordChannel, private user: User) {
		super(playerStream, true);
		this.target = this.channel;
	}

	receiveRequest(request: any): void {
		console.log("Incoming request:");
		console.dir(request);
		if (request.wait) {
			// do nothing
		}
		else if (request.forceSwitch) {

		}
		else if (request.active) {
			const pokemonInfo = getPokemonInfo(getActivePokemon(request.side.pokemon));
			this.target.send(pokemonInfo);
			const moveInfo = getMovesInfo(request.active[0].moves);
			this.target.send(moveInfo);
		}
		else if (request.teamPreview) {
			const info = getTeamInfo(request.side.pokemon);
			this.target.send(info);
			this.choose('default');
		}
		else {
			console.log('Unknown request type!');
		}
	}
}