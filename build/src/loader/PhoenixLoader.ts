namespace com.sideplay.loader {
    export class PhoenixLoader {
        //================================================================================
        // Singleton/Statics:
        //================================================================================
        public static instance: PhoenixLoader = null;

        //================================================================================
        // Customisable Class Params:
        //================================================================================

        //================================================================================
        // Non-Customisable Class Params:
        //================================================================================

        //================================================================================
        // Constructor:
        //================================================================================

        /**
         * Creates an instance of PhoenixLoader.
         * @memberof PhoenixLoader
         */
        public constructor() {
            if (PhoenixLoader.instance == null) {
                PhoenixLoader.instance = loader.phoenix = this;
            } else {
                throw new Error("Cannot make 2 PhoenixLoaders. Please use loader.PhoenixLoader.instance or loader.phoenix instead.");
            }
        }

        //================================================================================
        // Public Functions:
        //================================================================================

        /**
         * Scour manifest for all assets needed to load and begin loading process.
         * @param {Function} onUpdate
         * @param {Function} onComplete
         * @param {Function} [onError=() => {}]
         * @memberof PhoenixLoader
         */
        public load(onUpdate: Function, onComplete: Function, onError: Function = () => {}) {
            // Grab all spritesheets and add to cache.
            // Loads in all Spritesheets
            for (var key in loader.SPRITESHEETS) {
                if (loader.SPRITESHEETS.hasOwnProperty(key)) {
                    this._attachSpritesheet(key, key + "-data");
                }
            }

            for (var key in loader.IMAGES) {
                if (loader.IMAGES.hasOwnProperty(key)) {
                    this._attachImage(key);
                }
            }

            for (var key in loader.BITMAP_FONTS) {
                if (loader.BITMAP_FONTS.hasOwnProperty(key)) {
                    this._attachBitmapFont(key, key + "-data");
                }
            }

            for (var key in loader.JSON) {
                if (loader.JSON.hasOwnProperty(key)) {
                    this._attachJson(key);
                }
            }

            for (var key in loader.AUDIOSPRITE) {
                if (loader.AUDIOSPRITE.hasOwnProperty(key)) {
                    this._attachJson(key + "AudioData");
                }
            }

            for (var key in loader.SPINE) {
                if (loader.SPINE.hasOwnProperty(key)) {
                    // this._attachSpine(key);
                    this._attachJson(key);
                    this._attachJson(key + "Atlas");
                }
            }

            // Kill camelot loader before continuing..
            com.camelot.core.IWG.ame("killloader");

            onComplete();
        }

        //================================================================================
        // Private Functions:
        //================================================================================

        /**
         * Attaches a loaded phoenix spritesheet to the pixi cache.
         * @private
         * @param {string} imageID
         * @param {string} jsonID
         * @memberof PhoenixLoader
         */
        private _attachSpritesheet(imageID: string, jsonID: string): void {
            let myBaseTexture = new PIXI.BaseTexture(com.camelot.core.iwgLoadQ.getResult(imageID));
            let textures = {};
            let resolution = myBaseTexture.resolution;
            let sourceScale = myBaseTexture.sourceScale;
            let frames = com.camelot.core.iwgLoadQ.getResult(jsonID).frames;
            let frameKeys = Object.keys(frames);
            let frameIndex = 0;

            // go over all frames...
            while (frameIndex < frameKeys.length) {
                const i = frameKeys[frameIndex];
                const rect = frames[i].frame;

                if (rect) {
                    let frame,
                        trim = null;
                    // Origin rectangle
                    const orig = new PIXI.Rectangle(0, 0, Math.floor(frames[i].sourceSize.w * sourceScale) / resolution, Math.floor(frames[i].sourceSize.h * sourceScale) / resolution);

                    // Rotated rectangle
                    if (frames[i].rotated) {
                        frame = new PIXI.Rectangle(Math.floor(rect.x * sourceScale) / resolution, Math.floor(rect.y * sourceScale) / resolution, Math.floor(rect.h * sourceScale) / resolution, Math.floor(rect.w * sourceScale) / resolution);
                    } else {
                        frame = new PIXI.Rectangle(Math.floor(rect.x * sourceScale) / resolution, Math.floor(rect.y * sourceScale) / resolution, Math.floor(rect.w * sourceScale) / resolution, Math.floor(rect.h * sourceScale) / resolution);
                    }

                    // Trimmed rectangle
                    if (frames[i].trimmed) {
                        trim = new PIXI.Rectangle(Math.floor(frames[i].spriteSourceSize.x * sourceScale) / resolution, Math.floor(frames[i].spriteSourceSize.y * sourceScale) / resolution, Math.floor(rect.w * sourceScale) / resolution, Math.floor(rect.h * sourceScale) / resolution);
                    }

                    // Generate textures.
                    textures[i] = new PIXI.Texture(myBaseTexture, frame, orig, trim, frames[i].rotated ? 2 : 0);

                    // Add texture to global cache.
                    PIXI.Texture.addToCache(textures[i], i);
                }
                frameIndex++;
            }
        }

        /**
         * Attaches a loaded phoenix image to the pixi cache.
         * @private
         * @param {string} imageID
         * @memberof PhoenixLoader
         */
        private _attachImage(imageID: string): void {
            let myBaseTexture = new PIXI.BaseTexture(com.camelot.core.iwgLoadQ.getResult(imageID));
            let texture = new PIXI.Texture(myBaseTexture);
            PIXI.Texture.addToCache(texture, imageID);
        }

        /**
         * Attaches a loaded phoenix spritesheet to the pixi cache.
         * @private
         * @param {string} fontID
         * @param {string} xmlID
         * @memberof PhoenixLoader
         */
        private _attachBitmapFont(fontID: string, xmlID: string): void {
            let myBaseTexture = new PIXI.BaseTexture(com.camelot.core.iwgLoadQ.getResult(fontID));
            let texture = new PIXI.Texture(myBaseTexture);
            PIXI.extras.BitmapText.registerFont(com.camelot.core.iwgLoadQ.getResult(xmlID), texture);
        }

        /**
         * Attaches a json to the pixi resources.
         * @private
         * @param {string} jsonID
         * @memberof PhoenixLoader
         */
        private _attachJson(jsonID: string): void {
            if (PIXI.loader.resources[jsonID] == undefined) {
                (<any>PIXI.loader.resources[jsonID]) = {
                    name: jsonID,
                    crossOrigin: true,
                    type: "json",
                    extension: "json",
                    data: com.camelot.core.iwgLoadQ.getResult(jsonID),
                    _flags: null
                };
            } else {
                console.warn("Cant attach json with id " + jsonID + " because that key already exists :s");
            }
        }

        /**
         * Attaches spine objects.
         * @private
         * @param {string} spineName
         * @memberof PhoenixLoader
         */
        private _attachSpine(spineName: string): void {
            if (PIXI.loader.resources[spineName] == undefined) {
                // Creates the spineData object.
                let spineData;

                let spineID: string;

                // Finds the ID of the current spine!
                Object.keys(camelot.core.iwgLoadQ._loadItemsById).forEach(key => {
                    let id = camelot.core.iwgLoadQ._loadItemsById[key].id;
                    if (id.indexOf(spineName) != -1 && id.indexOf("-spineJson") != -1) {
                        if (spineID == null) {
                            spineID = camelot.core.iwgLoadQ._loadItemsById[key].id.split("-")[1];
                        } else {
                            console.warn("Found 2 ID's for ", spineID + " !!  BAD !!!");
                        }
                    }
                });

                // Finds all images for the current spine!
                let spineImgs: string[] = [];
                let spineNames: string[] = [];

                Object.keys(camelot.core.iwgLoadQ._loadItemsById).forEach(key => {
                    let id = camelot.core.iwgLoadQ._loadItemsById[key].id;
                    if (id.indexOf("-" + spineID + "-png") != -1) {
                        let splitter = camelot.core.iwgLoadQ._loadItemsById[key].id.split("-");
                        spineImgs.push(splitter[0] + "-" + spineID + "-png");
                        spineNames.push(splitter[0]);
                        this._attachImage(splitter[0] + "-" + spineID + "-png");
                    }
                });

                let jsonID = spineName + "-" + spineID + "-spineJson";
                let atlasID = spineName + "-" + spineID + "-atlas";

                // Generates the spine!
                let spineAtlas = new PIXI.spine.core.TextureAtlas(camelot.core.iwgLoadQ.getResult(atlasID), (line, callback) => {
                    let index = spineNames.indexOf(line.split(".")[0]);
                    callback(PIXI.Texture.fromFrame(spineImgs[index]).baseTexture);
                });

                // Attatches animation..? D:
                let spineJsonParser = new PIXI.spine.core.SkeletonJson(new PIXI.spine.core.AtlasAttachmentLoader(spineAtlas));
                let skeletonData = spineJsonParser.readSkeletonData(camelot.core.iwgLoadQ.getResult(jsonID));

                // Adds the spine object to the resources queue.. :D
                (<any>PIXI.loader.resources[spineName]) = {
                    name: spineName,
                    crossOrigin: true,
                    type: "spine",
                    extension: "json",
                    spineData: skeletonData,
                    _flags: null
                };
            } else {
                console.warn("Cant attach spine with id " + spineName + " because that key already exists :3");
            }
        }
    }

    // Reference
    export var phoenix: PhoenixLoader = null;
}
