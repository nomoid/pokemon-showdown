import { BattleStream, getPlayerStreams, BattlePlayer } from '../sim/battle-stream'
import { Dex } from '../sim/dex'
import { RandomPlayerAI } from '../sim/tools/random-player-ai'
import { DiscordPlayer } from './discord-player';

// Represents the state of a single BattleCord match
export class State {

	private p1: BattlePlayer;
	private p2: BattlePlayer;

	constructor() {
		// do nothing
	}
	
	start(): void {
		const streams = getPlayerStreams(new BattleStream());

		const spec = {
			formatid: "gen7customgame",
		};
		const p1spec = {
			name: "Player",
			team: Dex.packTeam(Dex.generateTeam('gen7randombattle')),
		};
		const p2spec = {
			name: "Bot",
			team: Dex.packTeam(Dex.generateTeam('gen7randombattle')),
		};

		this.p1 = new RandomPlayerAI(streams.p1);
		this.p2 = new RandomPlayerAI(streams.p2);

		console.log("p1 is " + this.p1.constructor.name);
		console.log("p2 is " + this.p2.constructor.name);

		void this.p1.start();
		void this.p2.start();

		void (async () => {
			let chunk;
			// tslint:disable-next-line no-conditional-assignment
			while ((chunk = await streams.omniscient.read())) {
				console.log(chunk);
			}
		})();

		void streams.omniscient.write(`>start ${JSON.stringify(spec)}\n` +
		`>player p1 ${JSON.stringify(p1spec)}\n` +
		`>player p2 ${JSON.stringify(p2spec)}`);
	}
}