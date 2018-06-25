namespace com.sideplay.helper.arrays {
	/**
	 * @name switchGroupKeepingPosition
	 * @description Switches an object to a new group but keeps its current position.
	 * @export
	 * @param {*} obj
	 * @param {*} newGroup
	 */
	export function switchGroupKeepingPosition(obj: PIXI.Container, newGroup: PIXI.Container): void {
		// Get obj global
		var xGlobalObj = 0;
		var yGlobalObj = 0;
		var inception = obj;
		while (inception != null) {
			xGlobalObj += inception.position.x;
			yGlobalObj += inception.position.y;
			inception = inception.parent;
		}

		// Get grp global
		var xGlobalGrp = 0;
		var yGlobalGrp = 0;
		inception = newGroup;
		while (inception != null) {
			xGlobalGrp += inception.position.x;
			yGlobalGrp += inception.position.y;
			inception = inception.parent;
		}

		// Calculate difference
		var newPosX = xGlobalObj - xGlobalGrp;
		var newPosY = yGlobalObj - yGlobalGrp;

		// Set object to new group in correct position.
		newGroup.addChild(obj);
		obj.position.set(newPosX, newPosY);
	}
}
