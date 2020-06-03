import { BattlePlayer } from "../sim/battle-stream";
import { ObjectReadWriteStream } from "../lib/streams";

export class DiscordPlayer extends BattlePlayer {

	constructor(playerStream: ObjectReadWriteStream<string>) {
		super(playerStream, true);
	}

	receiveRequest(request: any): void {
		console.log("Incoming request:");
		console.log(request);
		if (request.wait) {
			// do nothing
		}
		else if (request.forceSwitch) {

		}
		else if (request.active) {

		}
		else {

		}
	}
}