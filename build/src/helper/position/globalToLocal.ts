namespace com.sideplay.helper.position {
    /**
     * @name globalToLocal
     * @description Gets local position of global point.
     * @export
     * @param {PIXI.Container} localContext
     * @param {(PIXI.Point | number)} globalPoint
     * @param {number} [y]
     * @returns {PIXI.Point}
     */
    export function globalToLocal(localContext: PIXI.Container, globalPoint: PIXI.Point | number, y?: number): PIXI.Point {
        var point: PIXI.Point;
        // Type parsing
        if (typeof globalPoint == "number") {
            point = new PIXI.Point(globalPoint, y);
        } else {
            point = globalPoint;
        }

        let globalLocalPos = helper.position.localToGlobal(localContext);

        // Calculate local position.
        var newX = point.x - globalLocalPos.x;
        var newY = point.y - globalLocalPos.y;

        return new PIXI.Point(newX, newY);
    }
}
