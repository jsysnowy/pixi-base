namespace com.sideplay.loader {
    export class PIXILoader {
        //================================================================================
        // Singleton/Statics:
        //================================================================================

        //================================================================================
        // Customisable Class Params:
        //================================================================================

        //================================================================================
        // Non-Customisable Class Params:
        //================================================================================
        /* Internal variables */
        private _supportsAudioSprite: boolean = true;
        private _totalLoaded: number = 0;
        private _progress: number = 0;
        private _totalToLoad: number = 0;

        /* Callbacks */
        private _onProgress: Function = null;
        private _onComplete: Function = null;
        private _onError: Function = null;

        //================================================================================
        // Constructor:
        //================================================================================

        /**
         * Creates an instance of PIXILoader.
         * @param {Function} onUpdate
         * @param {Function} onComplete
         * @param {Function} [onError=()=>{}]
         * @memberof PIXILoader
         */
        public constructor() {}

        //================================================================================
        // Public Functions:
        //================================================================================

        /**
         * @name load
         * @description Tells the loader to start loading.
         * @memberof PIXILoader
         */
        public load(onProgress: Function, onComplete: Function, onError: Function = () => {}) {
            // Set callbacks
            this._onProgress = onProgress;
            this._onComplete = onComplete;
            this._onError = onError;

            // Loads in all Spritesheets
            for (var key in loader.SPRITESHEETS) {
                if (loader.SPRITESHEETS.hasOwnProperty(key)) {
                    PIXI.loader.add(key, loader.SPRITESHEETS[key]);
                }
            }

            // Loads in all Images
            for (var key in loader.IMAGES) {
                if (loader.IMAGES.hasOwnProperty(key)) {
                    PIXI.loader.add(key, loader.IMAGES[key]);
                }
            }

            for (var key in loader.AUDIOSPRITE) {
                if (loader.AUDIOSPRITE.hasOwnProperty(key)) {
                    PIXI.loader.add(key + "AudioData", loader.AUDIOSPRITE[key].replace(".mp3", ".json"));
                }
            }

            // Loads in all JSON
            for (var key in loader.JSON) {
                if (loader.JSON.hasOwnProperty(key)) {
                    PIXI.loader.add(key, loader.JSON[key]);
                }
            }

            // Loads in all Spine
            for (var key in loader.SPINE) {
                if (loader.SPINE.hasOwnProperty(key)) {
                    PIXI.loader.add(key, loader.SPINE[key]);
                    let spineAtlas = loader.SPINE[key].replace(".spine", ".atlas");
                    PIXI.loader.add(key + "Atlas", spineAtlas);
                }
            }

            // Loads in all Bitmap Fonts
            for (var key in loader.BITMAP_FONTS) {
                if (loader.BITMAP_FONTS.hasOwnProperty(key)) {
                    PIXI.loader.add(key, loader.BITMAP_FONTS[key]);
                    loader.BITMAP_FONTS[key] = key;
                }
            }

            // Works out how much stuff it needs to load
            this._totalToLoad = Object.keys(PIXI.loader.resources).length;
            if (this._supportsAudioSprite) {
                this._totalToLoad += Object.keys(loader.AUDIOSPRITE).length;
            } else {
                this._totalToLoad += Object.keys(loader.AUDIO).length;
            }

            if (this._totalToLoad == 0) {
                console.warn("Didn't find any assets to load.");
                this._onComplete();
            }

            PIXI.loader.load();
            PIXI.loader.onLoad.add(() => {
                // Has to recalculate the total to load incase it finds extra stuff...
                this._totalToLoad = Object.keys(PIXI.loader.resources).length;
                if (this._supportsAudioSprite) {
                    this._totalToLoad += Object.keys(loader.AUDIOSPRITE).length;
                } else {
                    this._totalToLoad += Object.keys(loader.AUDIO).length;
                }

                // Increments the totalLoaded stuff...
                this._totalLoaded++;
                this._progress = +((100 / this._totalToLoad) * this._totalLoaded).toFixed(2);
                this._onProgress(this._progress);
            });

            PIXI.loader.onComplete.add(() => {
                // load in all assets that rely on json being loaded AFTER json completes loading
                // Total loaded..
                var totalLoaded = 0;
                var totalToLoad = Object.keys(loader.AUDIOSPRITE).length + Object.keys(loader.AUDIO).length;
                var onAudioLoad = () => {
                    this._totalLoaded++;
                    this._progress = +((100 / this._totalToLoad) * this._totalLoaded).toFixed(2);
                    this._onProgress(this._progress);
                    totalLoaded++;
                    if (totalLoaded == totalToLoad) {
                        this._onComplete();
                    }
                };

                if (totalToLoad == 0) {
                    this._onComplete();
                }

                // Load all audio
                for (var key in loader.AUDIO) {
                    if (loader.AUDIO.hasOwnProperty(key)) {
                        // Generate filetypes.
                        var urls: any = [];
                        urls.push(loader.AUDIO[key] + ".ogg");
                        urls.push(loader.AUDIO[key] + ".mp3");

                        // Generate the sound.
                        loader.AUDIO[key] = new Howl({
                            src: urls
                        });

                        // Load complete callback.
                        loader.AUDIO[key].once("load", () => {
                            onAudioLoad();
                        });
                    }
                }

                // Loads in all Audiosprites
                for (var key in loader.AUDIOSPRITE) {
                    if (loader.AUDIOSPRITE.hasOwnProperty(key)) {
                        var data = PIXI.loader.resources[key + "AudioData"].data;

                        for (var i = 0; i < data.urls.length; i++) {
                            data.urls[i] = "./assets/audiosprite" + data.urls[i];
                        }

                        loader.AUDIOSPRITE[key] = new Howl({
                            src: data.urls,
                            sprite: data.sprite
                        });
                        loader.AUDIOSPRITE[key].once("load", () => {
                            onAudioLoad();
                        });
                    }
                }
            });
        }
    }

    // Reference
    export var pixi: PhoenixLoader = null;
}
