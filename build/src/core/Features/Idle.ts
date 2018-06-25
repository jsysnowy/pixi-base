namespace com.sideplay.core {
    // Stores Idle types to be used when making idles.
    export enum IdleTypes {
        SCALE,
        FRAMED,
        SHAKE,
        CUSTOM
    }

    // Stores logic for idles.
    export class Idle {
        //================================================================================
        // Singleton/Statics:
        //================================================================================
        public static instance: Idle = null;

        //================================================================================
        // Customisable Class Params:
        //================================================================================

        //================================================================================
        // Non-Customisable Class Params:
        //================================================================================
        private _idleStorage: {} = null;

        //================================================================================
        // Constructor:
        //================================================================================

        /**
         * Creates an instance of Idle.
         * @memberof Idle
         */
        public constructor() {
            if (Idle.instance === null) {
                // Store singleton
                Idle.instance = core.idle = this;

                // Creates storage for all idles.
                this._idleStorage = {};
            } else {
                throw new Error("Cannot make 2 factories. Please use core.Idle.instance or core.idle instead.");
            }
        }

        //================================================================================
        // Public Functions:
        //================================================================================

        /**
         * Creates a new Idle to be used in the game.
         * @param {string} name
         * @param {IdleTypes} type
         * @param {number} [magnitude=1.1]
         * @param {number} [timeout]
         * @param {number} [delay]
         * @param {number} [repeatDelay]
         * @returns {boolean}
         * @memberof Idle
         */
        public create(name: string, type: IdleTypes, time: number, magnitude: number = 1.1, timeout?: number, delay?: number, repeatDelay?: number, strict?: boolean): boolean {
            // Make sure name passed it isn't already a defined idle.
            if (this._idleStorage[name] != null) {
                console.warn("An idle animation with the passed in name: " + name + " already exists.\n" + "Please use core.idle.addTo(" + name + ", objectsToAdd) instead to use this");
                return false;
            }

            // Adds this idle to the idle storage.
            this._idleStorage[name] = {
                id: name,
                state: "inactive",
                objects: [],
                tags: [],
                time: time,
                mag: magnitude,
                type: type,
                onActive: [],
                onStart: [],
                onInterrupt: [],
                timeout: timeout | 0,
                delay: delay | 0,
                repeatDelay: repeatDelay | 0,
                strict: strict || false,
                pC: 1
            };

            return true;
        }

        /**
         * Attaches a framed animation to an idle which will play.
         * @param {string} name
         * @param {string} prefix
         * @param {number} startFrame
         * @param {number} endFrame
         * @param {string} suffix
         * @param {number} pad
         * @param {number} fps
         * @param {boolean} loop
         * @memberof Idle
         */
        public setFrames(name: string, prefix: string, startFrame: number, endFrame: number, suffix: string = "", pad: number = 0, fps: number = 24): boolean {
            // Error checking.
            if (this._idleStorage[name] == null) {
                console.warn("Tried to add to an idle with name: '" + name + "' but this doesn't exist.\n" + "Please use core.idle.create(" + name + ", ...params) first to make this idle!");
                return false;
            }

            // Set idle params.
            let idleObj = this._idleStorage[name];
            idleObj["frames"] = {
                prefix: prefix,
                startFrame: startFrame,
                endFrame: endFrame,
                suffix: suffix,
                pad: pad,
                fps: fps,
                loop: false
            };
        }

        /**
         * Adds any number of objects to a defined Idle.
         * @param {string} name
         * @param {(any[] | any)} objects
         * @returns {boolean}
         * @memberof Idle
         */
        public addTo(name: string, objects: any[] | any): boolean {
            // Error checking.
            if (this._idleStorage[name] == null) {
                console.warn("Tried to add to an idle with name: '" + name + "' but this doesn't exist.\n" + "Please use core.idle.create(" + name + ", ...params) first to make this idle!");
                return false;
            }

            // Pushes all passed in objects into this idle handler.
            (<any[]>this._idleStorage[name].objects).push(...objects);
        }

        /**
         * Adds tags to the define Idle. All objects with that tag will idle.
         * @param {string} name
         * @param {...string[]} tags
         * @returns {boolean}
         * @memberof Idle
         */
        public addTagsTo(name: string, ...tags: string[]): boolean {
            // Error checking
            if (this._idleStorage[name] == null) {
                console.warn("Tried to add to an idle with name: '" + name + "' but this doesn't exist.\n" + "Please use core.idle.create(" + name + ", ...params) first to make this idle!");
                return false;
            }

            // Pushes all passed in tag into this idle handler.
            (<any[]>this._idleStorage[name].tags).push(tags);
        }

        /**
         * Sets strict mode. ;)
         * @param {boolean} val
         * @returns {boolean}
         * @memberof Idle
         */
        public setStrictMode(name: string, val: boolean): boolean {
            if (this._idleStorage[name] == null) {
                console.warn("Tried to add to an idle with name: '" + name + "' but this doesn't exist.\n" + "Please use core.idle.create(" + name + ", ...params) first to make this idle!");
                return false;
            }

            this._idleStorage[name].pC = 1;
            this._idleStorage[name].strict = val;
            return this._idleStorage[name].strict;
        }

        /**
         * Tells an idle with given name to start idling.
         * @param {string} name
         * @returns {boolean}
         * @memberof Idle
         */
        public start(name: string): boolean {
            // Error checking
            if (this._idleStorage[name] == null) {
                console.warn("Tried to start an idle with name: '" + name + "' but this doesn't exist.\n" + "Please use core.idle.create(" + name + ", ...params) first to make this idle!");
                return false;
            }

            // Check if strict is enabled.
            if (this._idleStorage[name].strict) {
                this._idleStorage[name].pC--;
                if (this._idleStorage[name].pC == 0) {
                    this._idleStart(this._idleStorage[name]);
                } else {
                    console.warn("Idle start was cancelled because strict mode was enabled & pC == 0");
                }
            } else {
                this._idleStart(this._idleStorage[name]);
            }
        }

        /**
         * Tells an idle it just got interupted and the idle will stop until it is told to start again.
         * @param {string} name
         * @returns {boolean}
         * @memberof Idle
         */
        public interrupt(name: string): boolean {
            // Error checking
            if (this._idleStorage[name] == null) {
                console.warn("Tried to interrupt an idle with name: '" + name + "' but this doesn't exist.\n" + "Please use core.idle.create(" + name + ", ...params) first to make this idle!");
                return false;
            }

            // Check if strict is enabled.
            if (this._idleStorage[name].strict) {
                this._idleStorage[name].pC++;
                if (this._idleStorage[name].pC > 0) {
                    this._idleInterrupt(this._idleStorage[name]);
                } else {
                    console.warn("Idle interruption was cancelled because strict mode was enabled & pC > 0");
                }
            } else {
                this._idleInterrupt(this._idleStorage[name]);
            }
        }

        /**
         * Completely removes all references to the Idle with the given name.
         * @param {string} name
         * @returns {boolean}
         * @memberof Idle
         */
        public destroy(name: string): boolean {
            // Error checking
            if (this._idleStorage[name] == null) {
                console.warn("Tried to destroy an idle with name: '" + name + "' but this doesn't exist.\n" + "Please use core.idle.create(" + name + ", ...params) first to make this idle!");
                return false;
            }

            this._idleInterrupt(this._idleStorage[name]);
            this._idleStorage[name] = null;
        }

        /**
         * Add/Remove onActive functions for this idle!
         * @param {string} name
         * @returns {{add: (f: Function)=>any, remove: (f: Function)=>any, removeAll: Function }}
         * @memberof Idle
         */
        public onActive(name: string): { add: (f: Function) => any; remove: (f: Function) => any; removeAll: Function } {
            // Error checking
            if (this._idleStorage[name] == null) {
                console.warn("Tried to destroy an idle with name: '" + name + "' but this doesn't exist.\n" + "Please use core.idle.create(" + name + ", ...params) first to make this idle!");
                return null;
            }

            // Creates obj to return.
            let obj = {
                add: (f: Function) => {
                    this._idleStorage[name].onActive.push(f);
                },
                remove: (f: Function) => {
                    this._idleStorage[name].onActive.splice(this._idleStorage[name].indexOf(f));
                },
                removeAll: () => {
                    this._idleStart[name].onActive = [];
                }
            };

            // Return the object :p
            return obj;
        }

        /**
         * Add/Remove OnStart functions for this idle!
         * @param {string} name
         * @returns {{add: (f: Function)=>any, remove: (f: Function)=>any, removeAll: Function }}
         * @memberof Idle
         */
        public onStart(name: string): { add: (f: Function) => any; remove: (f: Function) => any; removeAll: Function } {
            // Error checking
            if (this._idleStorage[name] == null) {
                console.warn("Tried to destroy an idle with name: '" + name + "' but this doesn't exist.\n" + "Please use core.idle.create(" + name + ", ...params) first to make this idle!");
                return null;
            }

            // Creates obj to return.
            let obj = {
                add: (f: Function) => {
                    this._idleStorage[name].onStart.push(f);
                },
                remove: (f: Function) => {
                    this._idleStorage[name].onStart.splice(this._idleStorage[name].indexOf(f));
                },
                removeAll: () => {
                    this._idleStart[name].onStart = [];
                }
            };

            // Return the object :p
            return obj;
        }

        /**
         * Add/Remove onInterrupt functions for this idle!
         * @param {string} name
         * @returns {{add: (f: Function)=>any, remove: (f: Function)=>any, removeAll: Function }}
         * @memberof Idle
         */
        public onInterrupt(name: string): { add: (f: Function) => any; remove: (f: Function) => any; removeAll: Function } {
            // Error checking
            if (this._idleStorage[name] == null) {
                console.warn("Tried to destroy an idle with name: '" + name + "' but this doesn't exist.\n" + "Please use core.idle.create(" + name + ", ...params) first to make this idle!");
                return null;
            }

            // Creates obj to return.
            let obj = {
                add: (f: Function) => {
                    this._idleStorage[name].onInterrupt.push(f);
                },
                remove: (f: Function) => {
                    this._idleStorage[name].onInterrupt.splice(this._idleStorage[name].indexOf(f));
                },
                removeAll: () => {
                    this._idleStart[name].onInterrupt = [];
                }
            };

            // Return the object :p
            return obj;
        }

        /**
         * Check if an idle is known
         * @param {string} name
         * @returns {boolean} Whether the idle is known or not
         * @memberof Idle
         */
        public containsIdle(name: string): boolean {
            return this._idleStorage[name] != null;
        }

        /**
         * Updates an existing idle
         * @param {string} name
         * @param {number} [magnitude]
         * @param {number} [timeout]
         * @param {number} [delay]
         * @param {number} [repeatDelay]
         * @returns {boolean}
         * @memberof Idle
         */
        public updateIdle(name: string, time?: number, magnitude?: number, timeout?: number, delay?: number, repeatDelay?: number, strict?: boolean): void {
            if (this.containsIdle(name)) {
                if (time != null) {
                    this._idleStorage[name].time = time;
                }

                if (magnitude != null) {
                    this._idleStorage[name].mag = magnitude;
                }

                if (timeout != null) {
                    this._idleStorage[name].timeout = timeout;
                }

                if (delay != null) {
                    this._idleStorage[name].delay = delay;
                }

                if (repeatDelay != null) {
                    this._idleStorage[name].repeatDelay = repeatDelay;
                }

                if (strict != null) {
                    this._idleStorage[name].strict = strict;
                }

                this.interrupt(name);
                this.start(name);
            } else {
                console.warn("Attempted to update an idle that does not exist. Idle name:'", name, "'.");
            }
        }
        //================================================================================
        // Private Functions:
        //================================================================================

        /**
         * Logic for idles starting.
         * @private
         * @memberof Idle
         */
        private _idleStart(idleObj: any): void {
            // Gets all objects which are needed to tween...
            var allObjects = (<any[]>idleObj.objects).concat(core.tags.get(idleObj.tags));
            if (idleObj.type == IdleTypes.SCALE && idleObj.state != "active") {
                // Set state to active.
                idleObj.state = "active";
                idleObj.value = 0;

                // Call all active functions.
                idleObj.onActive.forEach(f => {
                    f();
                });

                // Play a pulse anim tween.
                this._pulseAnimation(allObjects, idleObj);
            } else if (idleObj.type == IdleTypes.FRAMED && idleObj.state != "active") {
                // Set state to active.
                idleObj.state = "active";
                idleObj.value = 0;

                // Call all active functions.
                idleObj.onActive.forEach(f => {
                    f();
                });

                // Play framed anim tween.
                this._framedAnimation(allObjects, idleObj);
            } else if (idleObj.type == IdleTypes.SHAKE && idleObj.state != "active") {
            } else if (idleObj.type == IdleTypes.SHAKE && idleObj.state != "active") {
            } else {
                // console.warn("Couldn't start your idle prompt.");
            }
        }

        /**
         * Logic for idles being interrupted.
         * @private
         * @memberof Idle
         */
        private _idleInterrupt(idleObj: any): void {
            var allObjects = (<any[]>idleObj.objects).concat(core.tags.get(idleObj.tags));
            if (idleObj.state == "active") {
                idleObj.timeline.restart(); //<- TY Carlo you're a godsend <3 <3
                idleObj.timeline.kill();
                idleObj.timeline = null;
                idleObj.state = "inactive";

                // Call all interrupt functions.
                idleObj.onInterrupt.forEach(f => {
                    f();
                });
            }
        }

        /**
         * Plays pulse animations on all objects.
         * @private
         * @param {any} objs
         * @param {any} idleObj
         * @memberof Idle
         */
        private _pulseAnimation(objs, idleObj): void {
            // Create timeline..
            idleObj["timeline"] = new TimelineMax();
            idleObj["timeline"].to(objs, idleObj.timeout, {
                // <- Initial timeout
            });

            idleObj["timeline"].to(objs, idleObj.repeatDelay == 0 ? idleObj.time * 2 : idleObj.time, {
                bezier: {
                    type: "hard",
                    values: [{ scaleX: idleObj.mag, scaleY: idleObj.mag }, { scaleX: 1, scaleY: 1 }]
                },
                delay: idleObj.delay,
                repeat: -1,
                repeatDelay: idleObj.repeatDelay,
                ease: Linear.easeNone,
                onStart: () => {
                    // Call all onStart functions.
                    idleObj.onStart.forEach(f => {
                        f();
                    });
                }
            });
        }

        /**
         * Plays framed animation on all objects.
         * @private
         * @param {any} objs
         * @param {any} idleObj
         * @memberof Idle
         */
        private _framedAnimation(objs, idleObj): void {
            if (idleObj.frames == null) {
                return;
            }
            var frames = idleObj.frames;
            idleObj["timeline"] = new TimelineMax();
            idleObj["timeline"].to(objs, idleObj.timeout, {
                // <- Initial timeout
            });
            idleObj["timeline"].to(objs, idleObj.time, {
                // <-Play anim..
                onStart: () => {
                    // Call all start functions.
                    idleObj.onStart.forEach(f => {
                        f();
                    });

                    // Add and play the anim.
                    objs.forEach(obj => {
                        var anim = core.factory.animation(frames.prefix, frames.startFrame, frames.endFrame, frames.suffix, frames.pad, frames.fps, false);
                        anim.animation.anchor.set(0.5, 0.5);
                        anim.animation.onComplete = () => {
                            core.game.removeUpdateFunction(anim["UF"]);
                            anim.destroy();
                        };
                        obj.addChild(anim);
                        anim.play();
                    });
                },
                onRepeat: () => {
                    objs.forEach(obj => {
                        var anim = core.factory.animation(frames.prefix, frames.startFrame, frames.endFrame, frames.suffix, frames.pad, frames.fps, false);
                        anim.animation.anchor.set(0.5, 0.5);
                        anim.animation.onComplete = () => {
                            core.game.removeUpdateFunction(anim["UF"]);
                            anim.destroy();
                        };
                        obj.addChild(anim);
                        anim.play();
                    });
                },
                repeat: -1,
                delay: idleObj.delay,
                repeatDelay: idleObj.repeatDelay
            });
        }

        private _shakeAnimation(): void {}

        private _customAnimation(): void {}
    }

    // Reference
    export var idle: core.Idle = null;
}
