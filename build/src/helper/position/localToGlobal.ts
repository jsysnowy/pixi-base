namespace com.sideplay.helper.position {
	/**
	 * @name localToGlobal
	 * @description Takes an object, returns a PIXI.Point containing this objects native global position.
	 * @export
	 * @param {PIXI.Container} obj
	 * @returns {PIXI.Point}
	 */
	export function localToGlobal(obj: PIXI.Container): PIXI.Point {
		// Get obj global.
		var xGlobalObj = 0;
		var yGlobalObj = 0;
		var inception = obj;
		while (inception != null) {
			xGlobalObj += inception.position.x;
			yGlobalObj += inception.position.y;
			inception = inception.parent;
		}

		// Return generated X and Y values.
		return new PIXI.Point(xGlobalObj, yGlobalObj);
	}
}
