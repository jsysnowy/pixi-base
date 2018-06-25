namespace com.sideplay.core {
    export class GameObjects {
        //================================================================================
        // Singleton/Statics:
        //================================================================================
        public static instance: GameObjects = null;

        //================================================================================
        // Customisable Class Params:
        //================================================================================

        //================================================================================
        // Non-Customisable Class Params:
        //================================================================================
        private _gameObjectArray: Object = null;

        //================================================================================
        // Constructor:
        //================================================================================
        /**
         * @name constuctor
         * @description Creates an instance of GameObjects.
         * @memberof GameObjects
         */
        public constructor() {
            // Check singleton reference.
            if (GameObjects.instance == null) {
                // Log on start
                if (config.settings.developerMode) {
                    console.group("GameObjects.ts");
                    console.log("[GameObjects.ts].constructor() Initialising...");
                }

                // Initialise singleton
                GameObjects.instance = core.gameObjects = this;

                // Initialise object for storing game objects!
                this._gameObjectArray = {};

                // Log on end
                if (config.settings.developerMode) {
                    console.log("[GameObject.ts].constructor() GameObjects initialised successfully...");
                    console.groupEnd();
                }
            } else {
                // Error as singleton already exists!
                console.error("Cannot make multiple GameObjects. Please use GameObjects.instance or core.gameObjects instead.");
            }
        }

        //================================================================================
        // Public Functions:
        //================================================================================

        /**
         * Adds a game object to the global array.
         * @param {string} key
         * @param {*} object
         * @memberof GameObjects
         */
        public add(key: string, object: any): void {
            this._gameObjectArray[key] = object;
        }

        /**
         * Returns game object with the given key.
         * @param {string} key
         * @returns {PIXI.Container}
         * @memberof GameObjects
         */
        public get<T>(key: string): T {
            return this._gameObjectArray[key];
        }

        /**
         * Returns an array of all groups inside GameObjects - idk why? :D
         * @returns {PIXI.Container[]}
         * @memberof GameObjects
         */
        public getAllGroups(): PIXI.Container[] {
            var retArr = [];
            for (var key in this._gameObjectArray) {
                if (this._gameObjectArray.hasOwnProperty(key)) {
                    if (this._gameObjectArray[key] instanceof PIXI.Container) {
                        retArr.push(this._gameObjectArray[key]);
                    }
                }
            }
            return retArr;
        }

        //================================================================================
        // Private Functions:
        //================================================================================
    }

    // Reference
    export var gameObjects: GameObjects = null;
}
