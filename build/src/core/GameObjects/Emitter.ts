namespace com.sideplay.core {
    export class Emitter extends PIXI.Container {
        //================================================================================
        // Customisable Class Params:
        //================================================================================

        //================================================================================
        // Non-Customisable Class Params:
        //================================================================================
        /* Emitter Object */
        public emitter: PIXI.particles.Emitter = null;

        /* Emitter parameters*/
        private _emitterParent: PIXI.Container = null;
        private _particlesArr: string[] | string = null;
        private _emitterObj: object = null;

        /** Emitter/GameLoop Tie-in */
        private _updateFunction: (dt) => void = null;
        private _emitterDestroyer: TweenMax = null;

        //================================================================================
        // Constructor:
        //================================================================================
        /**
         * Creates an instance of Emitter.
         * @param {PIXI.Container} parent
         * @param {string[]} particles
         * @param {Object} config
         * @memberof Emitter
         */
        public constructor(parent: PIXI.Container, particles: string[] | string, config: object) {
            super();

            this._emitterParent = parent;
            this._particlesArr = particles;
            this._emitterObj = config;

            this.emitter = new PIXI.particles.Emitter(this, particles, config);
            parent.addChild(this);
        }

        //================================================================================
        // Public Functions:
        //================================================================================

        /**
         * This emitter starts emitting!
         * @param {boolean} [reset=false]
         * @memberof Emitter
         */
        public start(reset: boolean = false): void {
            // Resets deltaTime if needed.
            if (reset === true) {
                this.emitter.resetPositionTracking();
            }

            this._updateFunction = (deltaTime: number) => {
                this.emitter.update(deltaTime);
            };

            TweenMax.delayedCall((this.emitter.emitterLifetime + this.emitter.maxLifetime) / TweenMax.globalTimeScale(), this.destroy, null, this);

            core.game.addUpdateFunction(this._updateFunction);
            this.emitter.emit = true;
        }

        /**
         * This emitter stops emitting!
         * @param {boolean} [reset=false]
         * @memberof Emitter
         */
        public stop(reset: boolean = false): void {
            // Resets deltaTime if needed.
            if (reset === true) {
                this.emitter.resetPositionTracking();
            }
            TweenMax.killDelayedCallsTo(this.destroy);
            core.game.removeUpdateFunction(this._updateFunction);
            this.emitter.emit = false;
        }

        /**
         * Destroys and removes all references from this emitter.
         * @override
         * @memberof Emitter
         */
        public destroy(): void {
            this.stop();
            this.emitter.destroy();
            super.destroy();
        }
    }
}
