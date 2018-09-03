/*
* -= Container.ts: =-
* - Extended pixi container with tie-ins

* - Changelog:
* - 23/08/18 - Created. [Snowy]
* -=-
*/

namespace com.sideplay.core {
    export class Container extends PIXI.Container {
        //#region Constructor
        /**
         * Creates an instance of Container.
         * @param {number} [x]
         * @param {number} [y]
         * @param {string} [name]
         * @memberof Container
         */
        public constructor(x?: number, y?: number, name?: string) {
            super();

            x != undefined ? (this.x = x) : (this.x = 0);
            y != undefined ? (this.y = y) : (this.y = 0);
            name != undefined ? (this.name = name) : (this.name = "Unnamed container");
        }
        //#endregion
    }
}
