/*
* -= SoundManager.ts: =-
* - Manages all sound played through the game.
* - Sideplay core framework file.

* - Changelog:
* - 14/4/18 - Changelog added. <Snowy>
* - 14/4/18 - Updated vis listener to use Listeners.ts. <Snowy>
* - 14/4/18 - audioExistsInCache now correctly return a value, instead of always returning false. <Snowy>
* - 14/4/18 - Listeners on page now try to resume howler.ctx if it exists. Will help with audio unlocking issue. <Snowy>
* - 14/4/18 - howler will mute globally when paused. <Snowy>
* - 14/4/18 - howler context resumed when visibility is regained. <Snowy>
* - 14/8/18 - _playQueuedSounds updated to not restart single instance sounds <Snowy>
* - 15/8/18 - Updated formatting and moved to Managers namespace <Snowy>
* -=-
*/

namespace com.sideplay.core.Managers {
    //#region SoundChannel instance.
    /**
     * Stores structure of a SoundChannel used inside SoundManager.
     * @interface iSoundChannel
     */
    interface iSoundChannel {
        volume: number;
        muted: boolean;
        vismuted: boolean;
        paused: boolean;
        queuedPlayingSounds: string[];
        queuedLoopingSounds: string[];
        playingSound: Howl[];
        playingSoundName: string[];
        playingSoundID: number[];
    }
    //#endregion

    //#region SoundManager Class.
    /**
     * @name SoundManager
     * @description SoundManager controls and manages the playback of sounds within the game.
     * @export
     * @class SoundManager
     */
    export class SoundManager {
        //#region Class Properties.
        //#region Singleton
        /**
         * Stores the singleton instance of this class.
         * @static
         * @type {SoundManager}
         * @memberof SoundManager
         */
        public static instance: SoundManager = null;
        //#endregion

        //#region Private properties.
        /**
         * Stores the soundplayer, which handles actual audio playback depending on which audio library is used.
         * @private
         * @type {SoundPlayer}
         * @memberof SoundManager
         */
        private _soundPlayer: SoundPlayer;

        /**
         * Object used as dictionary, which stores all created sound channels.
         * @private
         * @type {Object}
         * @memberof SoundManager
         */
        private _channelsObj: Object;

        /**
         * Stores the name/id whatever .. of the thirdparty library currently used to play audio.
         * @private
         * @type {string}
         * @memberof SoundManager
         */
        private _thirdPartyAudioLib: string;

        /**
         * Stores whether or not the current used audioContext is locked.
         * @private
         * @type {boolean}
         * @memberof SoundManager
         */
        private _isContextLocked: boolean;

        /**
         * If the contextUpdateFunction is in use or not.
         * @private
         * @type {boolean}
         * @memberof SoundManager
         */
        private _contextUpdateFunctionLock: boolean;

        /**
         * Whether or not SoundManager is using an audiosprite to play audio.
         * @private
         * @type {boolean}
         * @memberof SoundManager
         */
        private _usingAudioSprite: boolean;

        /**
         * Stores the ID of the audiosprite being used.
         * @private
         * @type {string}
         * @memberof SoundManager
         */
        private _audiospriteID: string;

        /**
         * Toggle on wherher or not SoundManager should attempt to play audio on Internet Explorer.
         * @private
         * @type {boolean}
         * @memberof SoundManager
         */
        private _msieNoAudio: boolean;

        /**
         * Stores the master volume control for the entire game.
         * @private
         * @type {number}
         * @memberof SoundManager
         */
        private _masterVolume: number = 1;

        /**
         * Stores whether or not the SoundManager is currently muted.
         * @private
         * @type {boolean}
         * @memberof SoundManager
         */
        private _muted: boolean = false;

        /**
         * Stores whether or not the SoundManager is currently paused.
         * @private
         * @type {boolean}
         * @memberof SoundManager
         */
        private _paused: boolean;
        //#endregion
        //#endregion

        //#region Get/Sets.
        /**
         * Returns audioContext used by this manager.
         * @readonly
         * @memberof SoundManager
         */
        public get context(): AudioContext {
            if (this._thirdPartyAudioLib == "howler") {
                return Howler.ctx;
            } else if (this._thirdPartyAudioLib == "soundjs") {
                return createjs.WebAudioPlugin.context;
            } else {
                return null;
            }
        }

        /**
         * Return current state of _contextLocked.
         * @readonly
         * @type {boolean}
         * @memberof SoundManager
         */
        public get contextLocked(): boolean {
            this._checkIfAudioContextIsLocked();
            return this._isContextLocked;
        }
        //#endregion

        //#region Constructor.
        /**
         * Creates an instance of SoundManager.
         * @memberof SoundManager
         */
        public constructor() {
            if (SoundManager.instance == null) {
                // Create singleton instance.
                SoundManager.instance = core.sound = this;

                // Set class properties from configuration.
                this._usingAudioSprite = config.settings.useAudioSprite;
                this._audiospriteID = config.settings.audioSpriteKey;
                this._contextUpdateFunctionLock = false;

                // Set ThirdPartyLib based on loaderType.
                if (config.settings.loaderType == "pixi") {
                    this._thirdPartyAudioLib = "howler";
                } else if (config.settings.loaderType == "phoenix") {
                    this._thirdPartyAudioLib = "soundjs";
                } else {
                    console.warn("No defined audio handler for loaderType:", config.settings.loaderType);
                    this._thirdPartyAudioLib = "none";
                }

                // Check for MSIE config settings.
                if (bowser.msie && config.settings.noAudioOnIE) {
                    this._msieNoAudio = true;
                }

                // Create SoundPlayer
                this._soundPlayer = new SoundPlayer(this._thirdPartyAudioLib, this._usingAudioSprite, this._audiospriteID);

                // Init obj storing channel stuff..
                this._channelsObj = {};

                this._addPageListeners();
            } else {
                console.error("Cannot make multiple instance of SoundManager. Please us core.SoundManager.instance or core.sound instead");
            }
        }

        //#endregion

        /**
         * Adds page listeners to mute/unmute the Sounds in the game.
         * @private
         * @memberof SoundManager
         */
        private _addPageListeners(): void {
            // howler ctx will try resume on interaction if it exists.
            listeners.add(Listeners.interaction, () => {
                // Resume context:
                if (this.context != null) {
                    this.context.resume();
                }

                // Await for context to be resumed, then play queued sounds:
                this._awaitContextResumed(() => {
                    this._playQueuedSounds();
                });
            });

            listeners.add(Listeners.focusGained, () => {
                // Resume context:
                if (this.context != null) {
                    this.context.resume();
                }

                // Await for context to be resumed, then play queued sounds:
                this._awaitContextResumed(() => {
                    this._playQueuedSounds();
                });
            });

            // visibilitychange will mute the audio when the game isn't visible.
            listeners.add(Listeners.visibilityChange, () => {
                if (listeners.isVisible) {
                    // Resume context:
                    if (this.context != null) {
                        this.context.resume();
                    }

                    // Await for context to be resumed, then play queued sounds:
                    this._awaitContextResumed(() => {
                        this._playQueuedSounds();
                    });

                    // Unmute:
                    this._unmute(null, "vis");
                } else {
                    // Mute:
                    this._mute(null, "vis");
                }
            });
        }

        /**
         * Tells a sound to play, can give a string to play on a certain channel if needed.
         * @param {string} name
         * @param {string} [channel="default"]
         * @returns {number}
         * @memberof SoundManager
         */
        public play(name: string, channel: string = "default"): number {
            // Stop playing audio on MSIE
            if (this._msieNoAudio) {
                return;
            }

            // Error checking that the sound exists.
            if (!this._checkSoundExistsInCache(name)) {
                if (config.settings.developerMode) {
                    console.error(
                        '[SoundManager.ts]._checkSoundExistsInCache("' +
                            name +
                            '") returned false when trying to locate audio.  Check to make sure this sound exists!'
                    );
                }
                return;
            }

            // If the user defined channel isn't present, then it creates a new one.
            if (this._channelsObj[channel] == undefined) {
                this._initialiseNewChannel(channel);
            }

            // Make sure audioContext isn't suspended, if it is, sound is captured until unlocked.
            if (this._captureSoundTriggerWhenSuspended(name, channel, false)) {
                return;
            }

            if (this._muted || this._channelsObj[channel].muted) {
                // If using audiosrite!
                if (this._usingAudioSprite) {
                    if (this._soundPlayer.cullAudioOnMute(name, channel)) {
                        return;
                    }
                }
            }

            // Play the audio using soundPlayer!
            let instance = this._soundPlayer.play(name);

            // Sounds volume gets set!
            if ((<iSoundChannel>this._channelsObj[channel]).muted) {
                this._soundPlayer.setVolume(instance.sound, instance.id, 0);
            } else {
                this._soundPlayer.setVolume(instance.sound, instance.id, (<iSoundChannel>this._channelsObj[channel]).volume);
            }

            // Pushes sound into playing sounds on this channel.
            (<iSoundChannel>this._channelsObj[channel]).playingSound.push(instance.sound);
            (<iSoundChannel>this._channelsObj[channel]).playingSoundName.push(name);
            (<iSoundChannel>this._channelsObj[channel]).playingSoundID.push(instance.id);

            // Adds event listener onto the sound so when it's finish it removes itself from channel.
            this._soundPlayer.setOnFinished(instance.sound, instance.id, () => {
                helper.arrays.removeFirstInstanceOf(instance.sound, (<iSoundChannel>this._channelsObj[channel]).playingSound);
                helper.arrays.removeFirstInstanceOf(instance.id, (<iSoundChannel>this._channelsObj[channel]).playingSoundID);
                helper.arrays.removeFirstInstanceOf(name, (<iSoundChannel>this._channelsObj[channel]).playingSoundName);
            });

            return instance.id;
        }

        /**
         * Tells a sound to start looping, can give a string to play on a certain channel if needed.
         * @param {string} name
         * @param {string} [channel="default"]
         * @returns {number}
         * @memberof SoundManager
         */
        public loop(name: string, channel: string = "default"): number {
            // Stop playing audio on MSIE
            if (this._msieNoAudio) {
                return;
            }

            this._checkIfAudioContextIsLocked();

            // Error checking that the sound exists.
            if (!this._checkSoundExistsInCache(name)) {
                if (config.settings.developerMode) {
                    console.error(
                        "[SoundManager.ts]._checkSoundExistsInCache(" +
                            name +
                            ") returned false when trying to locate audio.  Check to make sure this sound exists!"
                    );
                }
                return;
            }

            // If the user defined channel isn't present, then it creates a new one.
            if (this._channelsObj[channel] == undefined) {
                this._initialiseNewChannel(channel);
            }

            // Make sure audioContext isn't suspended, if it is, sound is captured until unlocked.
            if (this._captureSoundTriggerWhenSuspended(name, channel, true)) {
                return;
            }

            // Play the audio using soundPlayer!
            let instance = this._soundPlayer.loop(name);

            // Sounds volume gets set!
            if ((<iSoundChannel>this._channelsObj[channel]).muted) {
                this._soundPlayer.setVolume(instance.sound, instance.id, 0);
            } else {
                this._soundPlayer.setVolume(instance.sound, instance.id, (<iSoundChannel>this._channelsObj[channel]).volume);
            }

            // Pushes sound into playing sounds on this channel.
            (<iSoundChannel>this._channelsObj[channel]).playingSound.push(instance.sound);
            (<iSoundChannel>this._channelsObj[channel]).playingSoundName.push(name);
            (<iSoundChannel>this._channelsObj[channel]).playingSoundID.push(instance.id);

            return instance.id;
        }

        /**
         * Tells a sound to stop if it is playing, can give a string to only stop on a certain channel, if not
         * all sounds on all channels with the name will stop.
         * @param {string} name
         * @param {string} [channel]
         * @memberof SoundManager
         */
        public stop(nameOrID: string | number, channel?: string): void {
            // Stop playing audio on MSIE
            if (this._msieNoAudio) {
                return;
            }

            // If an ID is passed, the sound with the given ID will be stopped, else .. any sounds with the name will stop.
            if (typeof nameOrID == "string") {
                // Loop through all channels.
                for (var key in this._channelsObj) {
                    if (this._channelsObj.hasOwnProperty(key)) {
                        if (key == channel || channel == undefined) {
                            // Loop through all names of playing sounds.
                            for (let i = 0; i < (<iSoundChannel>this._channelsObj[key]).playingSoundName.length; i++) {
                                if ((<iSoundChannel>this._channelsObj[key]).playingSoundName[i] == nameOrID) {
                                    this._soundPlayer.stop(
                                        this._channelsObj[key].playingSound[i],
                                        this._channelsObj[key].playingSoundID[i]
                                    );
                                    (<iSoundChannel>this._channelsObj[key]).playingSound.splice(i, 1);
                                    (<iSoundChannel>this._channelsObj[key]).playingSoundID.splice(i, 1);
                                    (<iSoundChannel>this._channelsObj[key]).playingSoundName.splice(i, 1);
                                    i--;
                                }
                            }
                        }
                    }
                }
            } else {
                // Loop through all channels.
                for (var key in this._channelsObj) {
                    if (this._channelsObj.hasOwnProperty(key)) {
                        if (key == channel || channel == undefined) {
                            // Loop through all names of playing sounds.
                            for (let i = 0; i < (<iSoundChannel>this._channelsObj[key]).playingSound.length; i++) {
                                (<iSoundChannel>this._channelsObj[key]).playingSound[i].stop(nameOrID);
                                (<iSoundChannel>this._channelsObj[key]).playingSound.splice(i, 1);
                                (<iSoundChannel>this._channelsObj[key]).playingSoundID.splice(i, 1);
                                (<iSoundChannel>this._channelsObj[key]).playingSoundName.splice(i, 1);
                                i--;
                            }
                        }
                    }
                }
            }
        }

        /**
         * Changes the volume of the game. Can affect only a certain channel if you pass in a channel id.
         * @param {number} vol
         * @param {string} [channel="default"]
         * @param {number} [time=0]
         * @memberof SoundManager
         */
        public volume(vol: number, channel: string = "default", time: number = 0): void {
            // Stop playing audio on MSIE
            if (this._msieNoAudio) {
                return;
            }

            // IF channel doesn't exist, make it!
            if (this._channelsObj[channel] == undefined) {
                this._initialiseNewChannel(channel);
            }

            // Set the channels volume, and all sounds in it!
            for (var key in this._channelsObj) {
                if (this._channelsObj.hasOwnProperty(key)) {
                    if (key == channel || channel == null) {
                        // Sets channels volume
                        (<iSoundChannel>this._channelsObj[key]).volume = vol;

                        // Checks to see if audio is currently muted.  If it is - then mutedMod is set to 0, this means audio wont restart again if it was muted...
                        let mutedMod = 1;
                        if (this._muted) {
                            mutedMod = 0;
                        }

                        // Loop through all names of playing sounds.
                        for (let i = 0; i < (<iSoundChannel>this._channelsObj[key]).playingSound.length; i++) {
                            // Sets this sounds volume to be whatever the new volume is, times by muted sound modifier.
                            this._soundPlayer.setVolume(
                                this._channelsObj[key].playingSound[i],
                                this._channelsObj[key].playingSoundID[i],
                                vol * mutedMod
                            );
                        }
                    }
                }
            }
        }

        /**
         * Mutes sounds, add a channel ID to only mute that channel.
         * @param {string} [channel]
         * @memberof SoundManager
         */
        public mute(channel?: string): void {
            // Stop playing audio on MSIE
            if (this._msieNoAudio) {
                return;
            }

            // If no channel was passed, ALL audio will be muted.
            if (channel == undefined) {
                this._muted = true;
            }

            this._mute(channel);
        }

        /**
         * Unmutes sounds, add a channel ID to only unmute that channel.
         * @param {string} [channel]
         * @memberof SoundManager
         */
        public unmute(channel?: string): void {
            // Stop playing audio on MSIE
            if (this._msieNoAudio) {
                return;
            }

            // If no channel was passed, ALL audio will be muted.
            if (channel == undefined) {
                this._muted = false;
            }
            this._unmute(channel);
        }

        /**
         * Pauses all audio.
         * @memberof SoundManager
         */
        public pause(): void {
            // Stop playing audio on MSIE
            if (this._msieNoAudio) {
                return;
            }

            if (this._paused) {
                return;
            }
            this._paused = true;

            for (var key in this._channelsObj) {
                if (this._channelsObj.hasOwnProperty(key)) {
                    (<iSoundChannel>this._channelsObj[key]).paused = true;

                    // Loop through all names of playing sounds.
                    for (let i = 0; i < (<iSoundChannel>this._channelsObj[key]).playingSound.length; i++) {
                        this._soundPlayer.pause(this._channelsObj[key].playingSound[i], this._channelsObj[key].playingSoundID[i]);
                    }
                }
            }

            // Mute howler globally if it exists.
            if (this._thirdPartyAudioLib == "howler") {
                Howler.mute(false);
            }
        }

        /**
         * Unpauses all audio.
         * @memberof SoundManager
         */
        public unpause(): void {
            // Stop playing audio on MSIE
            if (this._msieNoAudio) {
                return;
            }

            if (!this._paused) {
                return;
            }
            this._paused = false;

            for (var key in this._channelsObj) {
                if (this._channelsObj.hasOwnProperty(key)) {
                    (<iSoundChannel>this._channelsObj[key]).paused = false;
                    // Loop through all names of playing sounds.
                    for (let i = 0; i < (<iSoundChannel>this._channelsObj[key]).playingSound.length; i++) {
                        this._soundPlayer.unpause(this._channelsObj[key].playingSound[i], this._channelsObj[key].playingSoundID[i]);
                    }
                }
            }

            // Un-mute howler globally if it exists.
            if (this._thirdPartyAudioLib == "howler") {
                Howler.mute(false);
            }
        }

        /**
         * Creates a new channel with the passed in ID.
         * @private
         * @param {string} id
         * @memberof SoundManager
         */
        private _initialiseNewChannel(id: string): void {
            this._channelsObj[id] = {
                volume: this._masterVolume,
                muted: this._muted,
                vismuted: false,
                paused: this._paused,
                queuedPlayingSounds: [],
                queuedLoopingSounds: [],
                playingSound: [],
                playingSoundID: [],
                playingSoundName: []
            } as iSoundChannel;
        }

        /**
         * Check if context is locked or not:
         * @private
         * @memberof SoundManager
         */
        private _checkIfAudioContextIsLocked(): boolean {
            // Finds context differently if it's locked or not....
            if (this.context == null) {
                // Context can't be locked if it doesn't exist...?
                return false;
            } else {
                if (this.context.state == "running") {
                    this._isContextLocked = false;
                } else {
                    this._isContextLocked = true;
                }
                return this._isContextLocked;
            }
        }

        /**
         * Checks if the audio is suspended when this sound is being told to play!
         * @private
         * @param {string} name
         * @param {string} channel
         * @param {boolean} isLoop
         * @returns {boolean}
         * @memberof SoundManager
         */
        private _captureSoundTriggerWhenSuspended(name: string, channel: string, isLoop: boolean): boolean {
            // If context is locked, then the audio is captured here instead:
            if (this.contextLocked) {
                if (isLoop) {
                    this._channelsObj[channel].queuedLoopingSounds.push(name);
                } else {
                    this._channelsObj[channel].queuedPlayingSounds.push(name);
                }
                return true;
            } else {
                return false;
            }
        }

        /**
         * Function called if audiocontext was suspended and we are awaiting it to become unlocked.
         * @private
         * @param {() => any} onAudioContextResumed
         * @memberof SoundManager
         */
        private _awaitContextResumed(onAudioContextResumed: () => any): void {
            // Make sure it isn't locked
            if (this._contextUpdateFunctionLock) {
                return;
            }

            // Set lock:
            this._contextUpdateFunctionLock = true;

            // This function calls every frame until context is unlocked:
            const contextCheckerFunc = () => {
                // If audio context is not locked, then we can resume sounds:
                if (!this._checkIfAudioContextIsLocked()) {
                    // Stop updating:
                    core.game.removeUpdateFunction(contextCheckerFunc);

                    // Remove lock:
                    this._contextUpdateFunctionLock = false;

                    //console.error("Context is resumed! Playing audio! :) ");

                    // Call function passed:
                    onAudioContextResumed();
                } else {
                    //console.error("Context was locked... :( ");
                }
            };

            // Add function to game updates.
            core.game.addUpdateFunction(contextCheckerFunc);
        }

        /**
         * Loop over all queued sounds and start them:
         * @private
         * @memberof SoundManager
         */
        private _playQueuedSounds(): void {
            Object.keys(this._channelsObj).forEach(key => {
                // All non-looping:
                for (let i = 0; i < (this._channelsObj[key] as iSoundChannel).queuedPlayingSounds.length; i++) {
                    //this.play((this._channelsObj[key] as iSoundChannel).queuedPlayingSounds[i], key);
                }
                (this._channelsObj[key] as iSoundChannel).queuedPlayingSounds = [];

                // All looping:
                for (let i = 0; i < (this._channelsObj[key] as iSoundChannel).queuedLoopingSounds.length; i++) {
                    console.log("?!??!");
                    this.loop((this._channelsObj[key] as iSoundChannel).queuedLoopingSounds[i], key);
                }
                (this._channelsObj[key] as iSoundChannel).queuedLoopingSounds = [];
            });
        }

        /**
         * Checks if the sound being attempted to play exists before it's attempted to play.
         * @private
         * @param {string} name
         * @returns {boolean}
         * @memberof SoundManager
         */
        private _checkSoundExistsInCache(name: string): boolean {
            // TODO: non-audiosprited sounds.

            // Checks if game is using the PIXI loader ...
            if (config.settings.loaderType == "pixi") {
                // Checks if the game is using audioSprites to play audio
                if (this._usingAudioSprite) {
                    // Check to make sure audioSprite exists!
                    if (PIXI.loader.resources[this._audiospriteID + "AudioData"] == undefined) {
                        return false;
                    }

                    // Grabs audioSprite data from pixi cache.
                    let aSD = PIXI.loader.resources[this._audiospriteID + "AudioData"].data.sprite;
                    let found = false;

                    // Check to make sure aSD is defined
                    if (aSD == undefined) {
                        return false;
                    }

                    // Loops over each key in the audioSprite data
                    Object.keys(aSD).forEach(key => {
                        // If key matches name - this sound exists! Return true!
                        if (key == name) {
                            found = true;
                        }
                    });

                    // If sound wasn't found.. throw error and return before atempting to play.
                    return found;
                } else {
                    // The game is NOT using audioSprites...
                    let found = false;

                    // Loop over keys of all audio loaded in loader.Audio ...
                    Object.keys(loader.AUDIO).forEach(key => {
                        // If key matches name - this sound exists! Return true!
                        if (key == name) {
                            found = true;
                        }
                    });

                    // If sound wasn't found.. throw error and return before atempting to play.
                    return found;
                }
            } else {
                // TODO: Camelot UK support.
                return true;
            }
        }

        /**
         * Logic to mute sounds in a channel / global.
         * @private
         * @param {string} [channel]
         * @memberof SoundManager
         */
        private _mute(channel?: string, type: string = "user"): void {
            // Loop over all channels.. if channel is defined only do it for that channel.
            for (var key in this._channelsObj) {
                if (this._channelsObj.hasOwnProperty(key)) {
                    if (key == channel || channel == null) {
                        // Mutes this channel
                        if (type == "vis") {
                            (<iSoundChannel>this._channelsObj[key]).vismuted = true;
                            // Loop through all names of playing sounds.
                            for (let i = 0; i < (<iSoundChannel>this._channelsObj[key]).playingSound.length; i++) {
                                this._soundPlayer.setVolume(
                                    this._channelsObj[key].playingSound[i],
                                    this._channelsObj[key].playingSoundID[i],
                                    0
                                );
                            }
                        } else {
                            (<iSoundChannel>this._channelsObj[key]).muted = true;
                            // Loop through all names of playing sounds.
                            for (let i = 0; i < (<iSoundChannel>this._channelsObj[key]).playingSound.length; i++) {
                                this._soundPlayer.setVolume(
                                    this._channelsObj[key].playingSound[i],
                                    this._channelsObj[key].playingSoundID[i],
                                    0
                                );
                            }
                        }
                    }
                }
            }
        }

        /**
         * Logic to unmute sounds in a channel / global.
         * @private
         * @param {string} [channel]
         * @memberof SoundManager
         */
        private _unmute(channel?: string, type: string = "user"): void {
            // Loop over all channels.. if channel is defined only do it for that channel.
            for (var key in this._channelsObj) {
                if (this._channelsObj.hasOwnProperty(key)) {
                    if (key == channel || channel == null) {
                        // Mutes this channel
                        if (type == "vis") {
                            (<iSoundChannel>this._channelsObj[key]).vismuted = false;
                        } else {
                            (<iSoundChannel>this._channelsObj[key]).muted = false;
                        }

                        if (
                            (<iSoundChannel>this._channelsObj[key]).vismuted == false &&
                            (<iSoundChannel>this._channelsObj[key]).muted == false
                        ) {
                            // Loop through all names of playing sounds.
                            for (let i = 0; i < (<iSoundChannel>this._channelsObj[key]).playingSound.length; i++) {
                                this._soundPlayer.setVolume(
                                    this._channelsObj[key].playingSound[i],
                                    this._channelsObj[key].playingSoundID[i],
                                    (<iSoundChannel>this._channelsObj[key]).volume
                                );
                            }
                        }
                    }
                }
            }
        }
    }
    //#endregion

    // #region SoundPlayer
    // - This is used to actually play a sound, it has two modes using either Howl or soundjs depending on what is present.
    class SoundPlayer {
        // Class Field
        private _type: string = null;
        private _usingAudioSprite: boolean = null;
        private _audiospriteID: string = null;

        /**
         * Creates an instance of SoundPlayer.
         * @memberof SoundPlayer
         */
        public constructor(type: string, usingAudioSprite: boolean, audiospriteID: string) {
            // Define certain type of audio play:
            this._type = type;

            // Set definitions:
            this._usingAudioSprite = usingAudioSprite;
            this._audiospriteID = audiospriteID;
        }

        /**
         * Plays the sound on the desired player.
         * @param {string} name
         * @param {Function} onComplete
         * @returns {*}
         * @memberof SoundPlayer
         */
        public play(name: string): { sound: any; id: any } {
            if (this._type == "howler") {
                if (this._usingAudioSprite) {
                    let sound = <Howl>loader.AUDIOSPRITE[this._audiospriteID];
                    let id = sound.play(name);
                    return { sound: sound, id: id };
                } else {
                    let sound = <Howl>loader.AUDIO[name];
                    let id = sound.play();
                    return { sound: sound, id: id };
                }
            } else if (this._type == "soundjs") {
                if (this._usingAudioSprite) {
                    let sound = createjs.Sound.play(this._audiospriteID, this._generateAudioSpriteSoundClip(name));
                    return { sound: sound, id: name };
                } else {
                    let sound = createjs.Sound.play(name);
                    return { sound: sound, id: name };
                }
            } else {
                console.warn("No loaded methods of playing music.");
            }
        }

        /**
         * Passed in sound/id will loop.
         * @param {string} name
         * @returns {{ sound: any; id: any }}
         * @memberof SoundPlayer
         */
        public loop(name: string): { sound: any; id: any } {
            if (this._type == "howler") {
                if (this._usingAudioSprite) {
                    let sound = <Howl>loader.AUDIOSPRITE[this._audiospriteID];
                    let id = sound.play(name);
                    sound.loop(true, id);
                    return { sound: sound, id: id };
                } else {
                    let sound = <Howl>loader.AUDIO[name];
                    let id = sound.play();
                    sound.loop(true, id);
                    return { sound: sound, id: id };
                }
            } else if (this._type == "soundjs") {
                if (this._usingAudioSprite) {
                    let sound = createjs.Sound.play(this._audiospriteID, this._generateAudioSpriteSoundClip(name));
                    sound.loop = -1;
                    return { sound: sound, id: name };
                } else {
                    let sound = createjs.Sound.play(name);
                    sound.loop = -1;
                    return { sound: sound, id: name };
                }
            } else {
                console.warn("No loaded methods of playing music.");
            }
        }

        /**
         * Sets a function called when a sound finished playing.
         * @param {Function} onFinish
         * @memberof SoundPlayer
         */
        public setOnFinished(sound: any, id: any, onFinish: any): void {
            if (this._type == "howler") {
                (<Howl>sound).on("end", onFinish, id);
            } else if (this._type == "soundjs") {
                (<createjs.AbstractSoundInstance>sound).on("complete", onFinish);
            } else {
                console.warn("No loaded methods of playing music.");
            }
        }

        public stop(sound: any, id: any): any {
            if (this._type == "howler") {
                (<Howl>sound).stop(id);
            } else if (this._type == "soundjs") {
                (<createjs.AbstractSoundInstance>sound).stop();
            } else {
                console.warn("No loaded methods of playing music.");
            }
        }

        public pause(sound: any, id: any): any {
            if (this._type == "howler") {
                (<Howl>sound).pause(id);
            } else if (this._type == "soundjs") {
                (<createjs.AbstractSoundInstance>sound).paused = true;
            } else {
                console.warn("No loaded methods of playing music.");
            }
        }

        public unpause(sound: any, id: any): any {
            if (this._type == "howler") {
                (<Howl>sound).play(id);
            } else if (this._type == "soundjs") {
                console.log("Unpausing:", sound, id);
                (<createjs.AbstractSoundInstance>sound).paused = false;
            } else {
                console.warn("No loaded methods of playing music.");
            }
        }

        public setVolume(sound: any, id: any, volume: number): void {
            if (this._type == "howler") {
                (<Howl>sound).volume(volume, id);
            } else if (this._type == "soundjs") {
                (<createjs.AbstractSoundInstance>sound).volume = volume;
            } else {
                console.warn("No loaded methods of playing music.");
            }
        }

        /**
         * @name cullAudioOnMute
         * @description If the audio is a certain length, and its muted, then it doesn't play. REEEP.
         * @param {string} name
         * @param {string} [channel="default"]
         * @returns {boolean}
         * @memberof SoundPlayer
         */
        public cullAudioOnMute(name: string, channel: string = "default"): boolean {
            if (this._type == "howler") {
                // Works out sounds duration.
                var duration = -1;
                if (this._usingAudioSprite) {
                    let duration = loader.AUDIOSPRITE[this._audiospriteID]._sprite[name][1];
                } else {
                    let duration = loader.AUDIO[name]._duration;
                }

                if (duration < 1000) {
                    return true;
                } else {
                    return false;
                }
            } else if (this._type == "soundjs") {
                let duration = this._generateAudioSpriteSoundClip(name).duration;
                if (duration < 1000) {
                    return true;
                } else {
                    return false;
                }
            } else {
                console.warn("No loaded methods of playing music.");
            }
            return true;
        }

        /**
         * @name _generateAudioSpriteSoundClip
         * @description If using soundjs, this will create the sound instance for soundJS using the audioData Json...
         * @private
         * @memberof SoundPlayer
         */
        private _generateAudioSpriteSoundClip(key: string): createjs.PlayPropsConfig {
            let jsonObj = PIXI.loader.resources[this._audiospriteID + "AudioData"].data;
            let ppc = new createjs.PlayPropsConfig().set({
                loop: 0,
                delay: 0,
                offset: 0,
                interrupt: createjs.Sound.INTERRUPT_ANY,
                startTime: jsonObj.sprite[key][0],
                duration: jsonObj.sprite[key][1]
            });

            return ppc;
        }
    }
    //#endregion
}
