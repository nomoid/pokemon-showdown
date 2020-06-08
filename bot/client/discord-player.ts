import { BattlePlayer } from "../../sim/battle-stream";
import { ObjectReadWriteStream } from "../../lib/streams";
import { User, Channel } from "discord.js";
import { DiscordChannel } from "../state";
import { Dex } from "../../sim/dex";
import { ClientState } from "./client-state";
import { TargetType } from "./target";

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

	private clientState: ClientState;
	private target: TargetType; 

	constructor(playerStream: ObjectReadWriteStream<string>, private channel: DiscordChannel, private user: User) {
		super(playerStream, true);
		this.target = this.channel;
		this.clientState = new ClientState(this.target);
	}

	receiveCommand(cmd: string, args: string[]): void {
		switch (cmd) {
			case 'player': {
				this.clientState.addSide(args[0], args[1], parseInt(args[2]), parseInt(args[3]));
				break;
			}
			case 'poke': {
				let hasItem = false;
				if (args[2] === 'item') {
					hasItem = true;
				}
				this.clientState.addPokemon(args[0], args[1], hasItem);
				break;
			}
			case 'teamsize': {
				this.clientState.setTeamSize(args[0], parseInt(args[1]));
				break;
			}
			case 'gametype': {
				this.clientState.gameType = args[0];
				break;
			}
			case 'gen': {
				this.clientState.gen = parseInt(args[0]);
				break;
			}
			case 'tier': {
				this.clientState.tier = args[0];
				break;
			}
			case 'rated': {
				this.clientState.rated = true;
				if (args.length > 0) {
					this.clientState.ratedMsg = args[0];
				}
				break;
			}
			case 'rule': {
				this.clientState.rules.push(args[0]);
				break;
			}
			case 'clearpoke': {
				this.clientState.teamPreview = true;
				break;
			}
			case 'start': {
				// ignore
				break;
			}
			case 'turn': {
				this.clientState.turn = parseInt(args[0]);
				this.processRequest(this.clientState.recentRequest);
				break;
			}
			case 'win': {
				this.clientState.gameOver(args[0]);
				break;
			}
			case 'tie': {
				this.clientState.gameOver(null);
				break;
			}
			case 'upkeep': {
				// ignore
				break;
			}
			case 'move': {
				// ignore animations for now
				const pokemon = args[0];
				const move = args[1];
				const target = args[2];
				let miss = false;
				if (args.length > 3 && args[3] === 'miss') {
					miss = true;
				}
				this.clientState.makeMove(pokemon, move, target, miss);
				break;
			}
			case 'switch': {
				const pokemon = args[0];
				const details = args[1];
				const hpStatus = args[2];
				this.clientState.makeSwitch(pokemon, details, hpStatus, 'switch');
				break;
			}
			case 'drag': {
				const pokemon = args[0];
				const details = args[1];
				const hpStatus = args[2];
				this.clientState.makeSwitch(pokemon, details, hpStatus, 'drag');
				break;
			}
			case 'detailschange': {
				const pokemon = args[0];
				const details = args[1];
				const hpStatus = args[2];
				this.clientState.makeSwitch(pokemon, details, hpStatus, 'detailschange');
				break;
			}
			case '-formechange': {
				const pokemon = args[0];
				const details = args[1];
				const hpStatus = args[2];
				this.clientState.makeSwitch(pokemon, details, hpStatus, 'formechange');
				break;
			}
			case 'replace': {
				const pokemon = args[0];
				const details = args[1];
				const hpStatus = args[2];
				this.clientState.makeSwitch(pokemon, details, hpStatus, 'replace');
				break;
			}
			case 'swap': {
				// only for multi battles, unimplemented
				break;
			}
			case 'cant': {
				const pokemon = args[0];
				const reason = args[1];
				let move = null;
				if (args.length > 2) {
					move = args[2];
				}
				this.clientState.cannot(pokemon, reason, move);
				break;
			}
			case 'faint': {
				const pokemon = args[0];
				this.clientState.faint(pokemon);
				break;
			}
			default: {
				if (cmd.startsWith("-")) {
					// TODO implement minor actions
					this.target.send("Minor action: " + cmd + "|" + args.join("|"));
				}
				else {
					this.target.send("Invalid command: " + cmd);
				}
			}
		}
	}

	receiveRequest(request: any): void {
		this.clientState.recentRequest = request;
	}

	processRequest(request: any): void {
		console.log("Incoming request:");
		console.dir(request);
		if (request.wait) {
			// do nothing
		}
		else if (request.forceSwitch) {
			this.target.send("You are forced to switch! (p!switch <number> to swap to a given pokemon):\n");
			const info = getTeamInfo(request.side.pokemon);
			this.target.send(info);
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

	public chooseMove(move: string) {
		this.choose('move ' + move);
	}

	public chooseSwitch(pokemon: string) {
		this.choose('switch ' + pokemon);
	}
}