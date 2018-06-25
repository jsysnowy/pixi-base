namespace com.sideplay.core {
	export class Random {
		public static instance: Random = null;
		private _chance: Chance.Chance = null;
		private _seed: string | number = null;

		constructor(seed?: string | number) {
			if (Random.instance == null) {
				Random.instance = this;

				this._chance = new Chance(seed);
				core.random = this._chance;
				this._seed = seed;
			} else {
				console.error('Cannot make multiple Random. Please use Random.instance or core.random instead.');
			}
		}

		public getChance(): Chance.Chance {
			return this._chance;
		}

		public reinitialiseChance(seed: string | number): void {
			this._chance = new Chance(seed);
			core.random = this._chance;
			this._seed = seed;
		}

		public getSeed(): string | number {
			return this._seed;
		}
	}

	export var random: Chance.Chance = chance;
}
