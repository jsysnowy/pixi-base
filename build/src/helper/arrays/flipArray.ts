namespace com.sideplay.helper.arrays {
	/**
	 * @name flipArray
	 * @description Takes an array in, reverses it and returns it. ex: [1,2,3,4,5] => [5,4,3,2,1].
	 * @export
	 * @template T
	 * @param {T[]} arrayIn
	 * @returns {T[]}
	 */
	export function flipArray<T>(arrayIn: T[]): T[] {
		var newArr = [];
		arrayIn.forEach(element => {
			newArr.unshift(element);
		});
		return newArr;
	}
}
