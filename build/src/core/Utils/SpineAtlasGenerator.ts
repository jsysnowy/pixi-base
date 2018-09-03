/*
* -= SpineAtlasGenerator.ts: =-
* - Loads and stores all Spine TextureAtlas files which are generated via loaded Spritesheet and Atlas files.

* - Changelog:
* - 23/7/18 - Created and logic implemented. [Snowy]
* -=-
*/

namespace com.sideplay.core.Utils {
    export class SpineAtlasGenerator {
        //================================================================================
        // Class Field:
        //================================================================================
        private _atlasStore: {};

        //================================================================================
        // Get/Set:
        //================================================================================

        /**
         * Return skeleton data for passed in id:
         * @param {string} id
         * @returns {PIXI.spine.core.SkeletonData}
         * @memberof SpineAtlasGenerator
         */
        public getSpineDataOfID(id: string): PIXI.spine.core.SkeletonData {
            if (this._atlasStore[id] != null) {
                return this._atlasStore[id].skeletonData;
            } else {
                console.warn("Skeleton data does not exist for id:", id);
                return null;
            }
        }

        //================================================================================
        // Constructor:
        //================================================================================

        /**
         * Creates an instance of SpineAtlasGenerator.
         * @memberof SpineAtlasGenerator
         */
        public constructor() {
            // Store reference:
            if (spineAtlasGenerator == null) {
                // Store reference
                spineAtlasGenerator = this;

                // Makes empty atlasStore.
                this._atlasStore = {};
            } else {
                throw new Error("Cannot make 2 SpineAtlasGenerators.");
            }
        }

        //================================================================================
        // Public Functions:
        //================================================================================

        /**
         * Goes over every loaded spine file and generates a spineAtlas for each:
         * @memberof SpineAtlasGenerator
         */
        public generateAllLoadedSpineAtlas(): void {
            this._generateAtlasFiles(Object.keys(loader.SPINE));
        }
        //================================================================================
        // Private Functions:
        //================================================================================

        /**
         * Generates a spine atlas with the passed in ID.
         * @private
         * @param {string} id
         * @memberof SpineAtlasGenerator
         */
        private _generateAtlasFiles(ids: string[]): void {
            // Generate search strings for each id:
            for (let i = 0; i < ids.length; i++) {
                // Create slot in _atlasStore
                this._atlasStore[ids[i]] = {};

                // Store spineData and spineAtlas:
                let spineData = JSON.parse(PIXI.loader.resources[ids[i]].data);
                let spineAtlasData = PIXI.loader.resources[ids[i] + "Atlas"].data;

                if (spineData == null || spineAtlasData == null) {
                    console.warn("Could not generate spine data for:", ids[i]);
                    continue;
                }

                // Generate textureAtlas:
                let allTex = {};
                let testObj: string[] = spineAtlasData.split("\n");
                testObj.forEach(item => {
                    item = item.replace(/[^a-zA-Z0-9_-]/g, "");
                    if (Object.keys(PIXI.utils.TextureCache).indexOf(item) > -1) {
                        // Make sure this texture doesn't already exist before adding it:
                        if (allTex[item] == null) {
                            // Attach our texture to allTex object, using correct name:
                            let tex = PIXI.Texture.fromFrame(item);
                            allTex[item] = tex;
                        }
                    }
                });

                // Store generates textureAtlas:
                let spineAtlas = new PIXI.spine.core.TextureAtlas();

                // Attach these textures to our spineAtlas created earlier:
                spineAtlas.addTextureHash(allTex, true);

                // Generate our spineData using the spineAtlas.
                let ap = new PIXI.spine.core.AtlasAttachmentLoader(spineAtlas);
                let sjp = new PIXI.spine.core.SkeletonJson(ap);
                let sd = sjp.readSkeletonData(spineData);

                // Store all data in our main object:
                this._atlasStore[ids[i]].spineData = spineData;
                this._atlasStore[ids[i]].spineAtlasData = spineAtlasData;
                this._atlasStore[ids[i]].spineAtlas = spineAtlas;
                this._atlasStore[ids[i]].skeletonData = sd;
            }
        }
    }

    export var spineAtlasGenerator: SpineAtlasGenerator = null;
}
