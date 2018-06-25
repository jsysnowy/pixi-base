namespace com.sideplay.core {
    export class Scale {
        // Static instance
        public static instance: Scale = null;

        // Internal variables
        public enabled: boolean = false;
        private _canvasElement: HTMLElement = null;
        private _gameArea: HTMLElement = null;
        private _renderer: any = null;
        private _container: PIXI.Container = null;
        private _groups: Group[] = null; // The groups that Scale is responsible for managing on resize
        private _curHeight: number = -1;
        private _curWidth: number = -1;

        // User defined params - HTML
        private _canvasID: string = null;
        private _divID: string = null;

        // User defined params - Desired values
        private _nativeHeight: number = -1;
        private _nativeWidth: number = -1;

        // User defined params - Page positioning
        private _verticallyAlign: boolean = false;
        private _horizontallyAlign: boolean = false;

        // User defined params - Scaling
        private _limitDesktopScaling: boolean = false;
        private _desktopMaxHeight: number = -1;
        private _desktopMinHeight: number = -1;
        private _desktopMaxWidth: number = -1;
        private _desktopMinWidth: number = -1;

        private _limitDeviceScaling: boolean = false;
        private _deviceMaxHeight: number = -1;
        private _deviceMinHeight: number = -1;
        private _deviceMaxWidth: number = -1;
        private _deviceMinWidth: number = -1;

        // User defined params - Responsiveness
        private _updateOnRaf: boolean = false;

        /**
         * @name            constructor
         * @description     Creates a new instance of Scale
         */
        public constructor(pixiRenderer: any, mainStage: PIXI.Container) {
            if (Scale.instance == null) {
                Scale.instance = core.scale = this;
                this._renderer = pixiRenderer;
                this._container = mainStage;
                this._groups = [];
            } else {
                console.error("Cannot make multiple ScaleManagers. Please use GameObjects.instance or core.gameObjects instead.");
            }
        }

        /**
         * @name            setCanvasByID
         * @description     Sets the targeted canvas by Scale to the canvas with the passed in ID.
         * @param           canvasID
         */
        public setCanvasByID(canvasID: string): boolean {
            // Sets canvas element if it exists.s
            if ((this._canvasElement = document.getElementById(canvasID)) != null) {
                this._canvasID = canvasID;
                return true;
            } else {
                //console.warn( "No element found with ID: " + canvasID );
                return false;
            }
        }

        /**
         * @name            setCanvas
         * @description     Sets the targeted canvas element to be the canvas passed through as a parameter.
         * @param           canvas
         */
        public setCanvas(canvas: HTMLElement): boolean {
            this._canvasElement = canvas;
            this._canvasID = canvas.id;
            return true;
        }

        /**
         * @name            setDivByID
         * @description     Sets the div storing the canvas to be the HTMLElement with the passed in ID.
         * @param           divID
         */
        public setDivByID(divID: string): boolean {
            // Sets scaling div element if it exists.s
            if ((this._gameArea = document.getElementById(divID)) != null) {
                this._divID = divID;
                return true;
            } else {
                //console.warn( "No element found with ID: " + divID );
                return false;
            }
        }

        /**
         * @name            setDiv
         * @description     Sets the div storing the canvas to be the HTMLElement passed in.
         * @param           div
         */
        public setDiv(div: HTMLElement): boolean {
            this._gameArea = div;
            this._divID = div.id;
            return true;
        }

        /**
         * @name            setNativeDimentions
         * @description     Sets the game areas native width and height to be used for scaling.
         * @param           widthValue
         * @param           heightValue
         */
        public setNativeDimentions(widthValue: number, heightValue: number): boolean {
            this._nativeHeight = heightValue;
            this._nativeWidth = widthValue;
            return true;
        }

        /**
         * @name            setNativeHeight
         * @description     Sets the native height of the games dimentions to be used for scaling.
         * @param           heightValue
         */
        public setNativeHeight(heightValue: number): number {
            this._nativeHeight = heightValue;
            return this._nativeHeight;
        }

        /**
         * @name            setNativeWidth
         * @description     Sets the native width of the games dimentions to be used for scaling.
         * @param           widthValue
         */
        public setNativeWidth(widthValue: number): number {
            this._nativeWidth = widthValue;
            return this._nativeWidth;
        }

        /**
         * @name            verticallyAlignOnPage
         * @description     The game will be vertically alligned in the center of the page.
         * @param           value
         */
        public verticallyAlignOnPage(value: boolean): boolean {
            this._verticallyAlign = value;
            return this._verticallyAlign;
        }

        /**
         * @name            horizontallyAlignOnPage
         * @description     The game will be horizontally alligned in the center of the page.
         * @param           value
         */
        public horizontallyAlignOnPage(value: boolean): boolean {
            this._horizontallyAlign = value;
            return this._horizontallyAlign;
        }

        /**
         * @name            setDesktopRestrictions
         * @description     Sets desktop mode to use/not use min and max values for its scaling.
         * @param           enabled
         * @param           maxWidth
         * @param           maxHeight
         * @param           minWidth
         * @param           minHeight
         */
        public setDesktopRestrictions(enabled: boolean, maxWidth?: number, maxHeight?: number, minWidth?: number, minHeight?: number): void {
            // Sets on/off var
            this._limitDesktopScaling = enabled;

            // Set up params which are passed.
            if (enabled) {
                if (maxWidth != null) {
                    this._desktopMaxWidth = maxWidth;
                } else {
                    this._desktopMaxWidth = -1;
                }
                if (maxHeight != null) {
                    this._desktopMaxHeight = maxHeight;
                } else {
                    this._desktopMaxHeight = -1;
                }
                if (minWidth != null) {
                    this._desktopMinWidth = minWidth;
                } else {
                    this._desktopMinWidth = -1;
                }
                if (minHeight != null) {
                    this._desktopMinHeight = minHeight;
                } else {
                    this._desktopMinHeight = -1;
                }
            } else {
                this._desktopMaxHeight = this._desktopMaxWidth = this._desktopMinHeight = this._desktopMinWidth = -1;
            }
        }

        /**
         * @name            setDesktopMaxHeight
         * @description     Sets the maximum height allowed on desktop, only if desktop restrictions are enabled.
         * @param           heightValue
         */
        public setDesktopMaxHeight(heightValue: number): boolean {
            if (this._limitDesktopScaling) {
                this._desktopMaxHeight = heightValue;
                return true;
            } else {
                return false;
            }
        }

        /**
         * @name            setDesktopMaxWidth
         * @description     Sets the maximum width allowed on desktop, only if desktop restrictions are enabled.
         * @param           widthValue
         */
        public setDesktopMaxWidth(widthValue: number): boolean {
            if (this._limitDesktopScaling) {
                this._desktopMaxWidth = widthValue;
                return true;
            } else {
                return false;
            }
        }

        /**
         * @name            setDesktopMinHeight
         * @description     Sets the minimum height allowed on desktop, only if desktop restrictions are enabled.
         * @param           heightValue
         */
        public setDesktopMinHeight(heightValue: number): boolean {
            if (this._limitDesktopScaling) {
                this._desktopMinHeight = heightValue;
                return true;
            } else {
                return false;
            }
        }

        /**
         * @name            setDesktopMinWidth
         * @description     Sets the minimum width allowed on desktop, only if desktop restrictions are enabled.
         * @param           widthValue
         */
        public setDesktopMinWidth(widthValue: number): boolean {
            if (this._limitDesktopScaling) {
                this._desktopMinWidth = widthValue;
                return true;
            } else {
                return false;
            }
        }

        /**
         * @name            setDeviceRestrictions
         * @description     Sets device mode to use/not use min and max values for its scaling.
         * @param           enabled
         * @param           maxWidth
         * @param           maxHeight
         * @param           minWidth
         * @param           minHeight
         */
        public setDeviceRestrictions(enabled: boolean, maxWidth?: number, maxHeight?: number, minWidth?: number, minHeight?: number): void {
            // Sets on/off var
            this._limitDeviceScaling = enabled;

            // Set up params which are passed.
            if (enabled) {
                if (maxWidth != null) {
                    this._deviceMaxWidth = maxWidth;
                } else {
                    this._deviceMaxWidth = -1;
                }
                if (maxHeight != null) {
                    this._deviceMaxHeight = maxHeight;
                } else {
                    this._deviceMaxHeight = -1;
                }
                if (minWidth != null) {
                    this._deviceMinWidth = minWidth;
                } else {
                    this._deviceMinWidth = -1;
                }
                if (minHeight != null) {
                    this._deviceMaxHeight = minHeight;
                } else {
                    this._deviceMinHeight = -1;
                }
            } else {
                this._deviceMaxHeight = this._deviceMaxWidth = this._deviceMinHeight = this._deviceMinWidth = -1;
            }
        }

        /**
         * @name            setDeviceMaxHeight
         * @description     Sets the maximum height allowed on devices, only if device restrictions are enabled.
         * @param           heightValue
         */
        public setDeviceMaxHeight(heightValue: number): boolean {
            if (this._limitDeviceScaling) {
                this._deviceMaxHeight = heightValue;
                return true;
            } else {
                return false;
            }
        }

        /**
         * @name            setDeviceMaxWidth
         * @description     Sets the maximum width allowed on devices, only if device restrictions are enabled.
         * @param           widthValue
         */
        public setDeviceMaxWidth(widthValue: number): boolean {
            if (this._limitDeviceScaling) {
                this._deviceMaxWidth = widthValue;
                return true;
            } else {
                return false;
            }
        }

        /**
         * @name            setDeviceMinHeight
         * @description     Sets the minimum height allowed on devices, only if device restrictions are enabled.
         * @param           heightValue
         */
        public setDeviceMinHeight(heightValue: number): boolean {
            if (this._limitDeviceScaling) {
                this._deviceMinHeight = heightValue;
                return true;
            } else {
                return false;
            }
        }

        /**
         * @name            setDeviceMinWidth
         * @description     Sets the minimum width allowed on devices, only if device restrictions are enabled.
         * @param           widthValue
         */
        public setDeviceMinWidth(widthValue: number): boolean {
            if (this._limitDeviceScaling) {
                this._deviceMinWidth = widthValue;
                return true;
            } else {
                return false;
            }
        }

        /**
         * @name            enableRafUpdates
         * @description     If enabled, Scale will recalculate canvas dimentions every gametick.
         * @param           value
         */
        public enableRAFUpdates(value: boolean): boolean {
            this._updateOnRaf = value;
            return this._updateOnRaf;
        }

        /**
         * @name            init
         * @description     Scale will kick into effect and start controlling the canvas element.
         */
        public init(): void {
            // Preflight checks for initialisation
            if (this.enabled) {
                //console.warn("Scale is already running.");
                return;
            }
            if (this._gameArea == null) {
                //console.warn("Game storage div not defined.");
                return;
            }
            if (this._canvasElement == null) {
                //console.warn("Game canvas element not defined.");
                return;
            }
            if (this._nativeHeight <= 0) {
                //console.warn("Native height not set or less-than zero.");
                return;
            }
            if (this._nativeWidth <= 0) {
                //console.warn("Native width not set or less-than zero.");
                return;
            }

            // Preflight check completed. Enable Scale and add listeners.
            this.enabled = true;

            // window.addEventListener("touchstart", ()=>{
            //     this.updateCanvasDimentions()
            // });

            window.addEventListener("resize", () => {
                this.updateCanvasDimentions();
                TweenMax.delayedCall(0.1, () => {
                    this.updateCanvasDimentions();
                });
            });
            window.addEventListener("fullscreenchange", () => {
                this.updateCanvasDimentions();
                TweenMax.delayedCall(0.1, () => {
                    this.updateCanvasDimentions();
                });
            });
            // com.camelot.iwg.IWGEM.on(com.camelot.core.IWGEVENT.PAUSE, ()=>{
            //     this.updateCanvasDimentions();
            // });
            this.updateCanvasDimentions();
        }

        /**
         *
         * @name addGroup
         * @description Adds a {@link core.Group} to the list of groups to be administrated by this class
         * @memberof Scale
         */
        public addGroup(group: Group): void {
            this._groups.push(group);
        }

        /**
         *
         * @name removeGroup
         * @description Removes a {@link core.Group} from the list of groups to be administrated by this class
         * @memberof Scale
         */
        public removeGroup(group: Group): void {
            // TODO: Refactor to more efficient data type e.g. dictionary
            const index: number = this._groups.indexOf(group);
            if (index !== -1) {
                this._groups.splice(index, 1);
            }
        }

        /**
         * @name            updateCanvasDimentions
         * @description     The canvas dimentions will update to fit the current game area
         */
        public updateCanvasDimentions(): void {
            // TODO: Look at removing this
            // Reset the main stage container to 0,0 and scale 1,1 incase it previously was the mainGameContainer (default)
            this._container.position.set(0, 0);
            this._container.scale.set(1, 1);
            this._gameArea.style.top = "0";
            this._gameArea.style.left = "0";

            // If adaptive scaling is enabled, the availWidth/Height will adapt to window.
            if (config.settings.adaptiveScaling) {
                if (config.settings.loaderType == "pixi") {
                    config.settings.availWidth = window.innerWidth;
                    config.settings.availHeight = window.innerHeight;
                } else if (config.settings.loaderType == "phoenix") {
                    // Fix soft bars :
                    if (bowser.mobile) {
                        config.settings.availWidth = document.body.clientWidth;
                        config.settings.availHeight = window.innerHeight;
                    } else {
                        config.settings.availWidth = com.camelot.core.IWG.ame("get", "gameWidth");
                        config.settings.availHeight = com.camelot.core.IWG.ame("get", "gameHeight");
                    }

                    // Set IWGholder scale.
                    var IWGholder = document.getElementById("IWGholder");
                    IWGholder.style.width = config.settings.availWidth + "px";
                    IWGholder.style.height = config.settings.availHeight + "px";
                }
            }

            // alert("Width: " + config.settings.availWidth + "\nHeight: " + config.settings.availHeight );

            // DPI fix
            let canvas: any = this._renderer.view;
            let context: any = canvas.getContext("webgl");

            // Store dps and bsr.
            let dpi = devicePixelRatio || 1;
            let bsr = 1;

            // Calculate webgl bsr.
            if (context != null) {
                bsr = context.webkitBackingStorePixelRatio || context.mozBackingStorePixelRatio || context.msBackingStorePixelRatio || context.oBackingStorePixelRatio || context.backingStorePixelRatio || 1;
            }

            // Calc ratio and scale accordingly.
            let r = dpi / bsr;
            if (dpi != bsr) {
                // Resize renderer and style scale based on DPI..
                let oldW = config.settings.availWidth;
                let oldH = config.settings.availHeight;
                this._renderer.resize(oldW * r, oldH * r);
                this._renderer.view.style.width = oldW + "px";
                this._renderer.view.style.height = oldH + "px";
                this._container.scale.set(r, r);
            } else {
                // Resizes the canvas element to 100% available page space.
                this._renderer.view.style.width = config.settings.availWidth + "px";
                this._renderer.view.style.height = config.settings.availHeight + "px";
                this._container.scale.set(1, 1);
                this._renderer.view.style.width = config.settings.availWidth + "px";
                this._renderer.view.style.height = config.settings.availHeight + "px";
                this._renderer.resize(config.settings.availWidth, config.settings.availHeight);
            }

            // Works out the scale ratio required
            var canvasInformation = {};
            canvasInformation["curHeight"] = this._canvasElement.clientHeight;
            canvasInformation["curWidth"] = this._canvasElement.clientWidth;
            canvasInformation["availWidth"] = config.settings.availWidth;
            canvasInformation["availHeight"] = config.settings.availHeight;
            canvasInformation["ratioHeight"] = canvasInformation["availHeight"] / this._nativeHeight;
            canvasInformation["ratioWidth"] = canvasInformation["availWidth"] / this._nativeWidth;
            canvasInformation["minScale"] = Math.min(canvasInformation["ratioHeight"], canvasInformation["ratioWidth"]);

            this._groups.forEach(group => {
                this.handleDisplayScaleModes(group, group.displayScaleMode, canvasInformation);
            });
        }

        public handleDisplayScaleModes(group: Group, mode: DisplayScaleMode, canvasInformation: object): void {
            switch (mode) {
                case DisplayScaleMode.ABSOLUTE:
                    //this.absoluteScaleGroup(group, canvasInformation);
                    break;
                case DisplayScaleMode.FILL:
                    this.fillScaleGroup(group, canvasInformation);
                    break;
                case DisplayScaleMode.FIT:
                    this.fitScaleGroup(group, canvasInformation);
                    break;
                case DisplayScaleMode.STRETCH:
                    //@ts-checkthis.stretchScaleGroup(group, canvasInformation);
                    break;
                case DisplayScaleMode.TRUE_RESPONSIVE:
                    //this.true_ResponsiveScaleGroup(group, canvasInformation);
                    break;
                case DisplayScaleMode.EXPAND_X:
                    this.expandScaleGroup(group, canvasInformation, 1, 0);
                default:
                    // TODO: Throw error
                    break;
            }
        }

        /**
         *
         * @name fitScaleGroup
         * @description Applies {@link DisplayScaleGroup.FIT} to a {@link core.Group}
         * @memberof Scale
         */
        public fitScaleGroup(group: Group, canvasInformation: object): void {
            // Offset the position of the main game container so it sits centrally inside the parent stage
            var topOffset = -((this._nativeHeight * canvasInformation["minScale"] - canvasInformation["availHeight"]) * group.scaleAnchor.y);
            var leftOffset = -((this._nativeWidth * canvasInformation["minScale"] - canvasInformation["availWidth"]) * group.scaleAnchor.x);
            group.position.set(leftOffset, topOffset);
            group.scale.set(canvasInformation["minScale"], canvasInformation["minScale"]);
        }

        /**
         *
         * @name fitScaleGroup
         * @description Applies {@link DisplayScaleGroup.FIT} to a {@link core.Group}
         * @memberof Scale
         */
        public fillScaleGroup(group: Group, canvasInformation: object): void {
            // Get the max scale to scale UP the background so it fits in the entire window.
            var w = 1334;
            var h = 750;
            var msf = +Math.max((1 / w) * canvasInformation["availWidth"], (1 / h) * canvasInformation["availHeight"]).toFixed(3);

            var to = -((h * msf - canvasInformation["availHeight"]) * group.scaleAnchor.y).toFixed(3);
            var lo = -((w * msf - canvasInformation["availWidth"]) * group.scaleAnchor.x).toFixed(3);

            group.scale.set(msf, msf);
            group.position.set(lo, to);
        }

        /**
         *
         * @name expandScaleGroup
         * @description Applies {@link DisplayScaleGroup.EXPAND}, or {@link DisplayScaleGroup.EXPAND_X}, or {@link DisplayScaleGroup.EXPAND_Y}  to a {@link core.Group}
         * @memberof Scale
         */
        public expandScaleGroup(group: Group, canvasInformation: object, x: number, y: number): void {
            // Offset the position of the main game container so it sits centrally inside the parent stage
            let expandX = (1 / (config.settings.nativeWidth * canvasInformation["minScale"])) * canvasInformation["availWidth"] * x;
            let expandY = (1 / (config.settings.nativeHeight * canvasInformation["minScale"])) * canvasInformation["availHeight"] * y;

            let strength = 4;
            expandX += (expandX - 1) * strength;
            expandY += (expandY - 1) * strength;

            if (expandX < 1) {
                expandX = 1;
            }
            if (expandY < 1) {
                expandY = 1;
            }
            if (expandX > 2) {
                expandX = 2;
            }
            if (expandY > 2) {
                expandY = 2;
            }
            let maxExpand = Math.max(expandX, expandY);

            var topOffset = -((this._nativeHeight * canvasInformation["minScale"] * maxExpand - canvasInformation["availHeight"]) * group.scaleAnchor.y);
            var leftOffset = -((this._nativeWidth * canvasInformation["minScale"] * maxExpand - canvasInformation["availWidth"]) * group.scaleAnchor.x);

            group.position.set(leftOffset, topOffset);
            group.scale.set(canvasInformation["minScale"] * maxExpand, canvasInformation["minScale"] * maxExpand);
        }
    }

    // Reference
    export var scale: Scale = null;
}
