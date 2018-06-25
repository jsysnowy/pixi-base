namespace com.sideplay.core {
    export class Factory {
        //================================================================================
        // Singleton/Static:
        //================================================================================
        public static instance: Factory = null;

        //================================================================================
        // Constructor:
        //================================================================================s

        /**
         * @name constructor
         * @description Creates an instance of Factory.
         * @memberof Factory
         */
        public constructor() {
            if (Factory.instance == null) {
                Factory.instance = core.factory = this;
            } else {
                throw new Error("Cannot make 2 factories. Please use core.Factory.instance or core.factory instead.");
            }
        }

        //================================================================================
        // Public Functions:
        //================================================================================

        // Groups, Sprites, Animations, Spine,

        /* Factory Contents:
        - [f00] - Animations    - Functions for creating various Animations.
        - [f01] - Emitters      - Functions for creating various Emitters.
        - [f02] - Groups        - Functions for creating various Groups.
        - [f03] - Spine         - Functions for creating various Spine objects.
        - [f04] - Sprites       - Functions for creating various Sprites.
        ==================*/

        // === [f00] Animations ===

        /**
         * Creates and returns a new animation to be used.
         * @param {string} prefix
         * @param {number} start
         * @param {number} end
         * @param {string} suffix
         * @param {number} pad
         * @param {number} [fps]
         * @param {boolean} [loop]
         * @returns {core.Animation}
         * @memberof Factory
         */
        public animation(prefix: string, start: number, end: number, suffix: string, pad: number, fps?: number, loop?: boolean): core.Animation {
            return new core.Animation(prefix, start, end, suffix, pad, fps, loop);
        }

        // === [f01] Emitters ===

        /**
         * Create and return a new core.Emitter.
         * @param {PIXI.Container} parent
         * @param {(string[] | string)} particles
         * @param {object} config
         * @returns {core.Emitter}
         * @memberof Factory
         */
        public emitter(parent: PIXI.Container, particles: string[] | string, config: object): core.Emitter {
            return new core.Emitter(parent, particles, config);
        }

        // === [f03] Sprites ===
        /**
         * @name sprite
         * @description Returns an vanilla instance of sprite with passed in parameters.
         * @param {number} x
         * @param {number} y
         * @param {string} textureID
         * @param {string} [frameName]
         * @returns {PIXI.Sprite}
         * @memberof Factory
         */
        public sprite(x: number, y: number, textureID: string, frameName?: string): PIXI.Sprite {
            // Stores sprite to return.
            let sprite: PIXI.Sprite = null;

            // Check if user is attempting to use a framename, if so the sprite is a spritesheet base.
            if (frameName != null) {
                // Set sprite to be a texture from framename.
                sprite = PIXI.Sprite.fromFrame(frameName);
                sprite.name = frameName;
            } else {
                // Check if the passed in textureID exists as a key inside the loader.
                if (Object.keys(loader.IMAGES).indexOf(textureID) != null) {
                    sprite = PIXI.Sprite.fromFrame(textureID);
                    sprite.name = textureID;
                } else {
                    sprite = PIXI.Sprite.fromImage(textureID);
                    sprite.name = textureID;
                }
            }

            // Sets passed in position
            sprite.position.set(x, y);

            // Return the created instance of PIXI.Sprite.
            return sprite;
        }

        /**
         * @name anchoredsprite
         * @description Returns a factory generated sprite with the anchorpoint already set to (0.5, 0.5).
         * @param {number} x
         * @param {number} y
         * @param {string} textureID
         * @param {string} [frameName]
         * @returns {PIXI.Sprite}
         * @memberof Factory
         */
        public anchoredsprite(x: number, y: number, textureID: string, frameName?: string): PIXI.Sprite {
            let sprite = factory.sprite(x, y, textureID, frameName);
            sprite.anchor.set(0.5, 0.5);
            return sprite;
        }

        /**
         * @name buttonsprite
         * @description Returns a button with basic mouseover/out and interactivity enabled.
         * @param x
         * @param y
         * @param textureID
         * @param frameName
         */
        public buttonsprite(x: number, y: number, textureID: string, frameName?: string): PIXI.Sprite {
            let sprite = factory.sprite(x, y, textureID, frameName);
            sprite.anchor.set(0.5, 0.5);
            sprite.interactive = true;
            sprite.on("mouseover", () => {
                sprite.scale.set(1.05, 1.05);
            });
            sprite.on("mouseout", () => {
                sprite.scale.set(1, 1);
            });
            return sprite;
        }

        /**
         * @name container
         * @description Returns a container with its position set.
         * @param x
         * @param y
         * @returns {PIXI.Container}
         * @memberof Factory
         */
        public container(x: number = 0, y: number = 0): PIXI.Container {
            let container = new PIXI.Container();
            container.position.set(x, y);
            return container;
        }
    }

    // Reference
    export var factory: Factory = null;
}
