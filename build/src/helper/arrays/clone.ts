namespace com.sideplay.helper.arrays {
	/**
	 * @name clone
	 * @description Takes an array, and clones it..?
	 * @export
	 * @template T
	 * @param {T[]} arrayIn
	 * @returns {T[]}
	 */
	export function clone<T>(arrayIn: T[]): T[] {
		var clonedArray = [];
		arrayIn.forEach(thing => {
			clonedArray.push(thing);
		});
		return clonedArray;
	}
}
