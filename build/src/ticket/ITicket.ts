/// <reference path="../../../typings/tsd.d.ts" />

namespace com.sideplay.ticket {
	export interface ITicket {
		tier: number;
		winner: number;
		prize: number;
		selectedSymbol: number;
		turns: number[];
		lines: {
			index: number;
			prize: number;
			symbols: number[];
		}[];
	}
}
