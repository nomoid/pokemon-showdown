import { TargetType } from "./target";

export class Pokemon {
	public details: string;
}

export class Side {
	public size: number;
	public pokemon: Array<Pokemon>;

	constructor(public name: string) {

	}
}

export class ClientState {

	public p1: Side;
	public p2: Side;
	public recentRequest: any; // request type
	public turn: number; // integer

	// game info
	public gameType: string;
	public gen: number;
	public tier: string;
	public rated: boolean = false;
	public ratedMsg: string;
	public rules: string[] = new Array();
	public teamPreview: boolean = false;

	public constructor(private target: TargetType) {

	}

	addSide(side: string, name: string, avatar: number, rating: number) {
		const sideObj = new Side(name);
		if (side === 'p1') {
			this.p1 = sideObj;
		}
		else if (side === 'p2') {
			this.p2 = sideObj;
		}
		else {
			throw "Illegal side: " + side;
		}
	}

	setTeamSize(side: string, size: number) {
		const sideObj = this.getSide(side);
		sideObj.size = size;
	}

	getSide(side: string): Side {
		if (side === 'p1') {
			return this.p1;
		}
		else if (side === 'p2') {
			return this.p2;
		}
		else {
			throw "Illegal side: " + side;
		}
	}

	addPokemon(side: string, details: string, item: boolean) {
		const sideObj = this.getSide(side);
		const poke = new Pokemon();
		poke.details = details;
		sideObj.pokemon.push(poke);
	}

	makeMove(pokemon: string, move: string, target: string, miss: boolean) {
		// TODO implement
	}

	makeSwitch(pokemon: string, details: string, hpStatus: string, switchCommand: string) {
		// TODO implement
	}

	cannot(pokemon: string, reason: string, move: string | null) {
		// TODO implement
	}

	faint(pokemon: string) {
		// TODO implement
	}

	gameOver(winner: string | null) {
		// TODO implement
	}
}