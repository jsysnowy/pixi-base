namespace com.sideplay.helper.arrays {
	/**
	 * @name removeLastInstanceOf
	 * @description Takes a thing to remove and an array, removes the last instance of the thing in the array then returns the array.
	 * @export
	 * @template T
	 * @param {T} thingToRemove
	 * @param {T[]} arrayOfThings
	 * @returns {T[]}
	 */
	export function removeLastInstanceOf<T>(thingToRemove: T, arrayOfThings: T[]): T[] {
		// Remove all instances of thing.
		for (let i = arrayOfThings.length - 1; i > 0; i--) {
			if (arrayOfThings[i] === thingToRemove) {
				arrayOfThings.splice(i, 1);
				return arrayOfThings;
			}
		}

		// Return the edited array
		return arrayOfThings;
	}
}
