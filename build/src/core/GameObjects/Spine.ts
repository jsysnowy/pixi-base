/*
* -= Spine.ts: =-
* - Generates, adds, and manages Spine related animations and files.

* - Changelog:
* - 08/06/18 - Created. [Snowy]
* - 22/8/18 - Tied in listeners automatically .. reformatted file.
* -=-
*/

namespace com.sideplay.core {
    export class Spine extends PIXI.Container {
        //#region Class Properties
        /**
         * Stores the function added to gameLoop update functions, which updates the spineObject by dT every frame.
         * @private
         * @type {*}
         * @memberof Spine
         */
        private _updateFunction: any;

        /**
         * Stores functions tied to onCompletes of this spine anim.
         * @private
         * @type {*}
         * @memberof Spine
         */
        private _listenerFunctions: any = {};

        /**
         * Stores spine object
         * @private
         * @type {PIXI.spine.Spine}
         * @memberof Spine
         */
        private _spineObject: PIXI.spine.Spine;
        //#endregion

        //#region Get/Sets.
        /**
         * Return the spine object for this instance of core.Spine.
         * @readonly
         * @type {PIXI.spine.Spine}
         * @memberof Spine
         */
        public get spineObject(): PIXI.spine.Spine {
            return this._spineObject;
        }

        /**
         * Return the skeleton for this instance of core.Spine.
         * @readonly
         * @type {PIXI.spine.core.SkeletonData}
         * @memberof Spine
         */
        public get skeleton(): PIXI.spine.core.Skeleton {
            return this._spineObject.skeleton;
        }

        /**
         * Returns the current state for this instance of core.Spine.
         * @readonly
         * @type {PIXI.spine.core.AnimationState}
         * @memberof Spine
         */
        public get state(): PIXI.spine.core.AnimationState {
            return this._spineObject.state;
        }

        /**
         * Returns the current stateData for this instance of core.Spine.
         * @readonly
         * @memberof Spine
         */
        public get stateData(): PIXI.spine.core.AnimationStateData {
            return this._spineObject.stateData;
        }
        //#endregion

        //#region Constructor.
        /**
         *Creates an instance of Spine.
         * @param {string} id
         * @param {string} [startAnimation]
         * @param {boolean} [loop]
         * @memberof Spine
         */
        public constructor(id: string, startAnimation?: string, loop?: boolean) {
            // Generate the PIXI.Container storing this spine anim.
            super();

            // Generate the spine object herE:
            this._spineObject = new PIXI.spine.Spine(core.Utils.spineAtlasGenerator.getSpineDataOfID(id));

            // Make sure this spineObject is tied to our gameloop:
            this._spineObject.autoUpdate = false;

            // Add listeners to the spineobject!
            this._listenerFunctions = {};
            this._addSpineListeners();

            // Updates the spine obj
            this._updateFunction = dT => {
                this._onUpdate(dT);
            };
            core.game.addUpdateFunction(this._updateFunction);

            // Attach spineObject to this container.
            this.addChild(this._spineObject);
        }
        //#endregion

        //#region Public functions
        /**
         * Set onAnimationComplete function!
         * @param {string} animName
         * @param {()=>any} onCompleteFunc
         * @param {boolean} once
         * @memberof Spine
         */
        public onAnimationComplete(animName: string, onCompleteFunc: () => any, once: boolean = false) {
            // Create array if it exists.
            if (this._listenerFunctions[animName] == null) {
                this._listenerFunctions[animName] = [];
            }

            // Create function with once self removal line:
            const pushedFunction = () => {
                if (once) {
                    (this._listenerFunctions[animName] as Array<any>).splice(this._listenerFunctions[animName].indexOf(pushedFunction), 1);
                }
                onCompleteFunc();
            };

            // Push function:
            this._listenerFunctions[animName].push(pushedFunction);
        }

        /**
         * Super also removes the updateFunc.
         * @memberof Spine
         */
        public destroy(): void {
            core.game.removeUpdateFunction(this._updateFunction);
            //this._spineObject.destroy();
            super.destroy();
        }
        //#endregion

        //#region Private functions
        /**
         * Called every frame, this makes sure our spine object is tied into the core game loop.
         * @private
         * @memberof Spine
         */
        private _onUpdate(dT: number): void {
            // Update based on deltaTime:
            this._spineObject.update(dT);
        }

        /**
         * Attaches spine listeners onto this spineObject.
         * @private
         * @memberof Spine
         */
        private _addSpineListeners(): void {
            // Listeners:
            this._spineObject.state.addListener({
                // Event called when animations are completed:
                complete: event => {
                    if (this._listenerFunctions[event.animation.name] != null) {
                        for (let i = 0; i < this._listenerFunctions[event.animation.name].length; i++) {
                            this._listenerFunctions[event.animation.name][i]();
                        }
                    }
                }
            });
        }
        //#endregion
    }
}
