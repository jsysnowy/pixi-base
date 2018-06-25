/*
* -= Animation.ts: =-
* - Generates, adds, and manages Frame-based animations.

* - Changelog:
* - 11/06/18 - Created. [Snowy]
* -=-
*/

namespace com.sideplay.core {
    export class Animation extends PIXI.Container {
        //================================================================================
        // Non-Customisable Params:
        //================================================================================
        private _animSprite: PIXI.extras.AnimatedSprite;
        private _fps: number;
        private _loop: boolean;
        private _updateFunc: (dT) => any;
        private _paused: boolean;

        //================================================================================
        // Get/Sets:
        //================================================================================

        /**
         * Getter for the animation object attached to this wrapper.
         * @readonly
         * @type {PIXI.extras.AnimatedSprite}
         * @memberof Animation
         */
        public get animation(): PIXI.extras.AnimatedSprite {
            return this._animSprite;
        }

        /**
         * Returns fps of the animation.
         * @readonly
         * @type {number}
         * @memberof Animation
         */
        public get fps(): number {
            return this._fps;
        }

        /**
         * Returns whether or not this animation is looping.
         * @readonly
         * @type {boolean}
         * @memberof Animation
         */
        public get loop(): boolean {
            return this._loop;
        }

        /**
         * Returns current state of paused.
         * @readonly
         * @type {boolean}
         * @memberof Animation
         */
        public get paused(): boolean {
            return this._paused;
        }

        //================================================================================
        // Constructor:
        //================================================================================

        /**
         * Creates an instance of Animation.
         * @param {string} prefix
         * @param {number} start
         * @param {number} end
         * @param {string} suffix
         * @param {number} pad
         * @param {number} [fps]
         * @param {boolean} [loop]
         * @memberof Animation
         */
        public constructor(prefix: string, start: number, end: number, suffix: string, pad: number, fps?: number, loop?: boolean) {
            super();

            // Set params
            fps != null ? (this._fps = fps) : (fps = 24);
            loop != null ? (this._loop = false) : (loop = true);

            // Generate animSprite
            this._animSprite = this._generateAnimation(prefix, start, end, suffix, pad, this._fps, this._loop);
            this.addChild(this._animSprite);

            // Update function for the animation:
            this._updateFunc = dT => {
                this._onUpdate(dT);
            };
            core.game.addUpdateFunction(this._updateFunc);
        }

        //================================================================================
        // Public Functions:
        //================================================================================

        /**
         * Starts this animation playing.
         * @memberof Animation
         */
        public play(): void {
            this._animSprite.play();
        }

        /**
         * Stops this animation playing.
         * @memberof Animation
         */
        public stop(): void {
            this._animSprite.stop();
        }

        /**
         * Pauses this animation. (Disables updateFunction).
         * @memberof Animation
         */
        public pause(): void {
            this._paused = true;
        }

        /**
         * Resumes this animation. (Re-enables updateFunction).
         * @memberof Animation
         */
        public resume(): void {
            this._paused = false;
        }

        /**
         * Destroys this animation, and handles removing the updateFunction.
         * @override
         * @memberof Animation
         */
        public destroy(): void {
            core.game.removeUpdateFunction(this._updateFunc);
            this._animSprite.destroy();
            super.destroy();
        }

        //================================================================================
        // Private Functions:
        //================================================================================

        /**
         * Called every frame, handles the updateCycle for this animation.
         * @private
         * @memberof Animation
         */
        private _onUpdate(dT: number): void {
            //Make sure not paused and is playing.
            if (!this._paused) {
                if (this._animSprite.playing) {
                    // Hacky JS thing to update the animation ourselves.
                    (this._animSprite as any).update(dT * this._fps);
                }
            }
        }

        /**
         * Called via constructor to generate animation based on passed in params:
         * @private
         * @returns {PIXI.extras.AnimatedSprite}
         * @memberof Animation
         */
        private _generateAnimation(prefix: string, start: number, end: number, suffix: string, pad: number, fps: number, loop: boolean): PIXI.extras.AnimatedSprite {
            // Generate framenames.
            let frames = [];
            let i = start;

            while (i != end) {
                var num = i + "";
                var z = "0";
                num = num.length >= pad ? num : new Array(pad - num.length + 1).join(z) + num;
                var framename = prefix + num + suffix;
                frames.push(PIXI.Texture.fromFrame(framename));

                // Increment frame.
                if (start > end) {
                    i--;
                } else {
                    i++;
                }
            }
            // Create animation
            var animatedSprite = new PIXI.extras.AnimatedSprite(frames, false);
            animatedSprite.loop = loop;

            // Return
            return animatedSprite;
        }
    }
}
