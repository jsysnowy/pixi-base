/*
* -= Spine.ts: =-
* - Generates, adds, and manages Spine related animations and files.

* - Changelog:
* - 08/06/18 - Created. [Snowy]
* - 11/06/18 - generateTextureAtlas uses the .atlas file now for more efficient and accurate results. [Snowy]
* -=-
*/

namespace com.sideplay.core {
    export class Spine extends PIXI.Container {
        //================================================================================
        // Customisable Params:
        //================================================================================

        //================================================================================
        // Non-Customisable Params::
        //================================================================================
        // - Data:
        private _coreSpineID: string;
        private _spineData: any;
        private _spineAtlas: any;
        private _updateFunction: any;

        // - Spine object itself:
        private _spineObject: PIXI.spine.Spine;

        // - Current state:
        private _curPlayingAnims: {};
        private _curLooping: boolean;

        //================================================================================
        // Get/Set:
        //================================================================================

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

        //================================================================================
        // Constructor:
        //================================================================================

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

            // Sets the spines ID, this corresponds to loadedAssets spine ID.
            this._coreSpineID = id;

            // Generate the spine object herE:
            this._spineObject = this._generateSpineObj();

            // Make sure this spineObject is tied to our gameloop:
            this._spineObject.autoUpdate = false;

            // Updates the spine obj
            this._updateFunction = dT => {
                this._onUpdate(dT);
            };
            core.game.addUpdateFunction(this._updateFunction);

            // Attach spineObject to this container.
            this.addChild(this._spineObject);
        }

        //================================================================================
        // Public Functions:
        //================================================================================
        /**
         * Super also removes the updateFunc.
         * @override
         * @memberof Spine
         */
        public destroy(): void {
            core.game.removeUpdateFunction(this._updateFunction);
            this._spineObject.destroy();
            super.destroy();
        }

        //================================================================================
        // Private Functions:
        //================================================================================

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
         * Function called on spine generation, this will attach all neccasery assets to the spine object, and generate the spine.
         * @private
         * @returns {PIXI.spine.Spine}
         * @memberof Spine
         */
        private _generateSpineObj(): PIXI.spine.Spine {
            // Grabs the spineData and spineAtlas files from the loaded resources:
            this._spineData = JSON.parse(PIXI.loader.resources[this._coreSpineID].data);
            this._spineAtlas = PIXI.loader.resources[this._coreSpineID + "Atlas"].data;

            // These store our textures for the spine atlas:
            let spineAtlas = new PIXI.spine.core.TextureAtlas();
            let allTex = {};

            // This code scours the spineData file we have loaded to grab all required textures from our textureCache:
            // It stores these textures in "allTex" object with the correct names, and is the passed into spineAtlas
            // to assign our spine object with all of the needed textures:

            // Split our atlas file into newlines.
            let testObj: string[] = this._spineAtlas.split("\n");
            // Loop over each line
            testObj.forEach(item => {
                // Regex out any special characters
                item = item.replace(/[^a-zA-Z0-9_-]/g, "");
                // Check if this item exists in textureCache..
                if (Object.keys(PIXI.utils.TextureCache).indexOf(item) > -1) {
                    // Make sure this texture doesn't already exist before adding it:
                    if (allTex[item] == null) {
                        // Attach our texture to allTex object, using correct name:
                        let tex = PIXI.Texture.fromFrame(item);
                        allTex[item] = tex;
                    }
                }
            });

            // Attach these textures to our spineAtlas created earlier:
            spineAtlas.addTextureHash(allTex, true);

            // Generate our spineData using the spineAtlas.
            let ap = new PIXI.spine.core.AtlasAttachmentLoader(spineAtlas);
            let sjp = new PIXI.spine.core.SkeletonJson(ap);
            let sd = sjp.readSkeletonData(this._spineData);

            // Return a new spine object using the generated spineData:
            return new PIXI.spine.Spine(sd);
        }
    }
}
