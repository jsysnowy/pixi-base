namespace com.sideplay.core {
    export enum DisplayScaleMode {
        ABSOLUTE, // no scaling at all
        FIT, // Letterboxing
        FILL, // Stretch to max x,y possible to fit
        STRETCH, // Scales x and y indepently to fit the parent
        TRUE_RESPONSIVE,
        EXPAND,
        EXPAND_X,
        EXPAND_Y
    }

    interface scaleAnchor {
        x: number;
        y: number;
        set: (x_, y_) => any;
    }

    export class Group extends PIXI.Container {
        //================================================================================
        // Customisable Class Params:
        //================================================================================

        //================================================================================
        // Non-Customisable Class Params:
        //================================================================================
        private _displayScaleMode: DisplayScaleMode = null;
        private _isPausable: boolean = true;
        private _scaleAnchor: scaleAnchor = null;

        //================================================================================
        // Getters/Setters:
        //================================================================================

        /**
         * Get/Set the current value of {@link this._displayScaleMode}
         * @type {DisplayScaleMode}
         * @memberof Group
         */
        public get displayScaleMode(): DisplayScaleMode {
            return this._displayScaleMode;
        }

        /**
         * Get/Set the current value of {@link this._displayScaleMode}
         * @memberof Group
         */
        public set displayScaleMode(input: DisplayScaleMode) {
            this._displayScaleMode = input;
            core.scale.updateCanvasDimentions();
        }

        /**
         * Get/Set the current value of {@link this._scaleAnchor}
         * @type {scaleAnchor}
         * @memberof Group
         */
        public get scaleAnchor(): scaleAnchor {
            return this._scaleAnchor;
        }

        /**
         * Get/Set the current value of {@link this._scaleAnchor}
         * @memberof Group
         */
        public set scaleAnchor(input: scaleAnchor) {
            this._scaleAnchor = input;
            core.scale.updateCanvasDimentions();
        }

        /**
         * Get/Set the current value of {@link this._isPausable}
         * @type {boolean}
         * @memberof Group
         */
        public get isPausable(): boolean {
            return this._isPausable;
        }

        /**
         * Get/Set the current value of {@link this._isPausable}
         * @memberof Group
         */
        public set isPausable(input: boolean) {
            this._isPausable = input;
        }

        //================================================================================
        // Constructor:
        //================================================================================

        /**
         * Creates an instance of Group.
         * @param {DisplayScaleMode} [displayScaleMode]
         * @memberof Group
         */
        public constructor(displayScaleMode?: DisplayScaleMode) {
            super();
            displayScaleMode ? (this.displayScaleMode = displayScaleMode) : (this.displayScaleMode = DisplayScaleMode.ABSOLUTE);
            this._scaleAnchor = {
                x: 0.5,
                y: 0.5,
                set: (x_, y_) => {
                    this._scaleAnchor.x = x_;
                    this._scaleAnchor.y = y_;
                }
            }; // default to centre
            this.hookGroupToScale();
        }

        //================================================================================
        // Public Functions:
        //================================================================================

        /**
         * Overrides destroy to make sure this group is removed from scalemanager
         * @memberof Group
         */
        public destroy() {
            this.unhookGroupFromScale();
            super.destroy();
        }

        //================================================================================
        // Private Functions:
        //================================================================================

        /**
         * Attaches this Group to {@link core.Scale}, so it can manage this group's scale
         * @see {@link core.Scale} for more information
         * @memberof Group
         */
        private hookGroupToScale() {
            core.ScaleManager.instance.addGroup(this);
        }

        /**
         * Instructs {@link core.Scale} to stop managing this group's scale
         * @see {@link core.Scale} for more information
         * @memberof Group
         */
        private unhookGroupFromScale() {
            core.ScaleManager.instance.removeGroup(this);
        }
    }
}
