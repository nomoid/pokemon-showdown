import { State } from "./state";

export class Environment {
	public states: Map<string, State> = new Map<string, State>();
}