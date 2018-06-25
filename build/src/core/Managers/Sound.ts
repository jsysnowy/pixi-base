/*
* -= Sound.ts: =-
* - Manages all sound played through the game.
* - Sideplay core framework file.

* - Changelog:
* - 14/4/18 - Changelog added. [Snowy]
* - 14/4/18 - Updated vis listener to use Listeners.ts. [Snowy]
* - 14/4/18 - audioExistsInCache now correctly return a value, instead of always returning false. [Snowy]
* - 14/4/18 - Listeners on page now try to resume Howler.ctx if it exists. Will help with audio unlocking issue. [Snowy]
* - 14/4/18 - Howler will mute globally when paused. [Snowy]
* - 14/4/18 - Howler context resumed when visibility is regained. [Snowy]
* -=-
*/

namespace com.sideplay.core {
    // Interface stores channel settings.
    interface iSoundChannel {
        volume: number;
        muted: boolean;
        vismuted: boolean;
        paused: boolean;
        playingSound: Howl[];
        playingSoundName: string[];
        playingSoundID: number[];
    }

    /**
     * @name Sound
     * @description Sound controls and manages the playback of sounds within the game.
     * @export
     * @class Sound
     */
    export class Sound {
        /**
         * Static singleton instance
         */
        public static instance: Sound = null;

        /**
         * Stores the SoundPlayer
         * */
        private _soundPlayer: SoundPlayer = null;

        /**
         * Stores all channels
         * */
        private _channelsObj: Object = null;

        /**
         * Audiosprite settings
         * */
        private _usingAudioSprite: boolean = null;
        private _audiospriteID: string = "";
        private _msieNoAudio: boolean = null;

        /**
         * Volumes
         * */
        private _startingVolume: number = 1;
        private _maxVolume: number = 1;

        /**
         * Muting
         * */
        private _muted: boolean = false;

        /**
         * Pausing
         * */
        private _paused: boolean = false;

        /**
         * @name constructor
         * @description Creates an instance of Sound.
         * @memberof Sound
         */
        public constructor() {
            if (Sound.instance == null) {
                // Init singleton
                Sound.instance = core.sound = this;

                this._usingAudioSprite = config.settings.useAudioSprite;

                this._audiospriteID = config.settings.audioSpriteKey;

                // Check for MSIE config settings.
                if (bowser.msie && config.settings.noAudioOnIE) {
                    this._msieNoAudio = true;
                }

                // Create SoundPlayer
                this._soundPlayer = new SoundPlayer(this._usingAudioSprite, this._audiospriteID);

                // Init obj storing channel stuff..
                this._channelsObj = {};

                this._addPageListeners();
            } else {
                console.error("Cannot make multiple instance of Sound. Please us core.Sound.instance or core.sound instead");
            }
        }

        /**
         * @name _addPageListeners
         * @description Adds page listeners to mute/unmute the Sounds in the game.
         * @private
         * @memberof Sound
         */
        private _addPageListeners(): void {
            // Howler ctx will try resume on interaction if it exists.
            if (config.settings.loaderType == "pixi") {
                listeners.add(Listeners.interaction, () => {
                    if (config.settings.loaderType == "pixi") {
                        if (Howler.ctx != null) {
                            Howler.ctx.resume();
                        }
                    } else {
                        if (createjs.WebAudioSoundInstance.context != null) {
                            createjs.WebAudioSoundInstance.context.resume();
                        }
                    }
                });
            }

            // visibilitychange will mute the audio when the game isn't visible.
            listeners.add(Listeners.visibilityChange, () => {
                if (listeners.isVisible) {
                    if (config.settings.loaderType == "pixi") {
                        if (Howler.ctx != null) {
                            Howler.ctx.resume();
                        }
                    } else {
                        if (createjs.WebAudioSoundInstance.context != null) {
                            createjs.WebAudioSoundInstance.context.resume();
                        }
                    }
                    this._unmute(null, "vis");
                } else {
                    this._mute(null, "vis");
                }
            });
        }

        /**
         * @name play
         * @description Tells a sound to play, can give a string to play on a certain channel if needed.
         * @param {string} name
         * @param {string} [channel="default"]
         * @returns {number}
         * @memberof Sound
         */
        public play(name: string, channel: string = "default"): number {
            // Stop playing audio on MSIE
            if (this._msieNoAudio) {
                return;
            }

            // Error checking that the sound exists.
            if (!this._checkSoundExistsInCache(name)) {
                if (config.settings.developerMode) {
                    console.error('[Sound.ts]._checkSoundExistsInCache("' + name + '") returned false when trying to locate audio.  Check to make sure this sound exists!');
                }
                return;
            }

            // If the user defined channel isn't present, then it creates a new one.
            if (this._channelsObj[channel] == undefined) {
                this._initialiseNewChannel(channel);
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
         * @name loop
         * @description Tells a sound to start looping, can give a string to play on a certain channel if needed.
         * @param {string} name
         * @param {string} [channel="default"]
         * @returns {number}
         * @memberof Sound
         */
        public loop(name: string, channel: string = "default"): number {
            // Stop playing audio on MSIE
            if (this._msieNoAudio) {
                return;
            }

            // Error checking that the sound exists.
            if (!this._checkSoundExistsInCache(name)) {
                if (config.settings.developerMode) {
                    console.error("[Sound.ts]._checkSoundExistsInCache(" + name + ") returned false when trying to locate audio.  Check to make sure this sound exists!");
                }
                return;
            }

            // If the user defined channel isn't present, then it creates a new one.
            if (this._channelsObj[channel] == undefined) {
                this._initialiseNewChannel(channel);
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
         * @name stop
         * @description Tells a sound to stop if it is playing, can give a string to only stop on a certain channel, if not
         *              all sounds on all channels with the name will stop.
         * @param {string} name
         * @param {string} [channel]
         * @memberof Sound
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
                                    this._soundPlayer.stop(this._channelsObj[key].playingSound[i], this._channelsObj[key].playingSoundID[i]);
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
         * @name volume
         * @description Changes the volume of the game. Can affect only a certain channel if you pass in a channel id.
         * @param {number} vol
         * @param {string} [channel="default"]
         * @param {number} [time=0]
         * @memberof Sound
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
                            this._soundPlayer.setVolume(this._channelsObj[key].playingSound[i], this._channelsObj[key].playingSoundID[i], vol * mutedMod);
                        }
                    }
                }
            }
        }

        /**
         * @name mute
         * @description Mutes sounds, add a channel ID to only mute that channel.
         * @param {string} [channel]
         * @memberof Sound
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
         * @name unmute
         * @description Unmutes sounds, add a channel ID to only unmute that channel.
         * @param {string} [channel]
         * @memberof Sound
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
         * @name pause
         * @description Pauses all audio.
         * @memberof Sound
         */
        public pause(): void {
            // Stop playing audio on MSIE
            if (this._msieNoAudio) {
                return;
            }

            for (var key in this._channelsObj) {
                if (this._channelsObj.hasOwnProperty(key)) {
                    (<iSoundChannel>this._channelsObj[key]).paused = true;

                    // Loop through all names of playing sounds.
                    for (let i = 0; i < (<iSoundChannel>this._channelsObj[key]).playingSound.length; i++) {
                        this._soundPlayer.pause(this._channelsObj[key].playingSound[i], this._channelsObj[key].playingSoundID[i]);
                    }
                }
            }

            // Mute Howler globally if it exists.
            if (config.settings.loaderType == "pixi") {
                Howler.mute(true);
            }
        }

        /**
         * @name unpause
         * @description Unpauses all audio.
         * @memberof Sound
         */
        public unpause(): void {
            // Stop playing audio on MSIE
            if (this._msieNoAudio) {
                return;
            }

            for (var key in this._channelsObj) {
                if (this._channelsObj.hasOwnProperty(key)) {
                    (<iSoundChannel>this._channelsObj[key]).paused = false;
                    // Loop through all names of playing sounds.
                    for (let i = 0; i < (<iSoundChannel>this._channelsObj[key]).playingSound.length; i++) {
                        this._soundPlayer.unpause(this._channelsObj[key].playingSound[i], this._channelsObj[key].playingSoundID[i]);
                    }
                }
            }

            // Un-mute Howler globally if it exists.
            if (config.settings.loaderType == "pixi") {
                Howler.mute(false);
            }
        }

        /**
         * @name _initialiseNewChannel
         * @description Creates a new channel with the passed in ID.
         * @private
         * @param {string} id
         * @memberof Sound
         */
        private _initialiseNewChannel(id: string): void {
            this._channelsObj[id] = {
                volume: this._startingVolume,
                muted: this._muted,
                vismuted: false,
                paused: this._paused,
                playingSound: [],
                playingSoundID: [],
                playingSoundName: []
            };
        }

        /**
         * @name _checkSoundExistsInCache
         * @description Checks if the sound being attempted to play exists before it's attempted to play.
         * @private
         * @param {string} name
         * @returns {boolean}
         * @memberof Sound
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
         * @name _mute
         * @description Logic to mute sounds in a channel / global.
         * @private
         * @param {string} [channel]
         * @memberof Sound
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
                                this._soundPlayer.setVolume(this._channelsObj[key].playingSound[i], this._channelsObj[key].playingSoundID[i], 0);
                            }
                        } else {
                            (<iSoundChannel>this._channelsObj[key]).muted = true;
                            // Loop through all names of playing sounds.
                            for (let i = 0; i < (<iSoundChannel>this._channelsObj[key]).playingSound.length; i++) {
                                this._soundPlayer.setVolume(this._channelsObj[key].playingSound[i], this._channelsObj[key].playingSoundID[i], 0);
                            }
                        }
                    }
                }
            }
        }

        /**
         * @name unmute
         * @description Logic to unmute sounds in a channel / global.
         * @private
         * @param {string} [channel]
         * @memberof Sound
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

                        if ((<iSoundChannel>this._channelsObj[key]).vismuted == false && (<iSoundChannel>this._channelsObj[key]).muted == false) {
                            // Loop through all names of playing sounds.
                            for (let i = 0; i < (<iSoundChannel>this._channelsObj[key]).playingSound.length; i++) {
                                this._soundPlayer.setVolume(this._channelsObj[key].playingSound[i], this._channelsObj[key].playingSoundID[i], (<iSoundChannel>this._channelsObj[key]).volume);
                            }
                        }
                    }
                }
            }
        }
    }

    // Reference
    export var sound: Sound = null;

    // SoundPlayer - This is used to actually play a sound, it has two modes using either Howl or SoundJS depending on what is present.
    class SoundPlayer {
        // Class Field
        private _type: string = null;
        private _usingAudioSprite: boolean = null;
        private _audiospriteID: string = null;

        /**
         * Creates an instance of SoundPlayer.
         * @memberof SoundPlayer
         */
        public constructor(usingAudioSprite: boolean, audiospriteID: string) {
            // Define certain type of audio play:
            if ((<any>window).Howl != undefined) {
                this._type = "Howler";
                Howler;
            } else if (createjs.Sound != undefined) {
                this._type = "SoundJS";
            } else {
                console.warn("No loaded methods of playing music.");
            }

            // Set definitions:
            this._usingAudioSprite = usingAudioSprite;
            this._audiospriteID = audiospriteID;
        }

        /**
         * @name play
         * @description Plays the sound on the desired player.
         * @param {string} name
         * @param {Function} onComplete
         * @returns {*}
         * @memberof SoundPlayer
         */
        public play(name: string): { sound: any; id: any } {
            if (this._type == "Howler") {
                if (this._usingAudioSprite) {
                    let sound = <Howl>loader.AUDIOSPRITE[this._audiospriteID];
                    let id = sound.play(name);
                    return { sound: sound, id: id };
                } else {
                    let sound = <Howl>loader.AUDIO[name];
                    let id = sound.play();
                    return { sound: sound, id: id };
                }
            } else if (this._type == "SoundJS") {
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
         * @name setOnFinished
         * @description Sets a function alled when a sound finished playing.
         * @param {Function} onFinish
         * @memberof SoundPlayer
         */
        public setOnFinished(sound: any, id: any, onFinish: any): void {
            if (this._type == "Howler") {
                (<Howl>sound).on("end", onFinish, id);
            } else if (this._type == "SoundJS") {
                (<createjs.AbstractSoundInstance>sound).on("complete", onFinish);
            } else {
                console.warn("No loaded methods of playing music.");
            }
        }

        public loop(name: string): { sound: any; id: any } {
            if (this._type == "Howler") {
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
            } else if (this._type == "SoundJS") {
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

        public stop(sound: any, id: any): any {
            if (this._type == "Howler") {
                (<Howl>sound).stop(id);
            } else if (this._type == "SoundJS") {
                (<createjs.AbstractSoundInstance>sound).stop();
            } else {
                console.warn("No loaded methods of playing music.");
            }
        }

        public pause(sound: any, id: any): any {
            if (this._type == "Howler") {
                (<Howl>sound).pause(id);
            } else if (this._type == "SoundJS") {
                (<createjs.AbstractSoundInstance>sound).paused = true;
            } else {
                console.warn("No loaded methods of playing music.");
            }
        }

        public unpause(sound: any, id: any): any {
            if (this._type == "Howler") {
                (<Howl>sound).play(id);
            } else if (this._type == "SoundJS") {
                (<createjs.AbstractSoundInstance>sound).paused = false;
            } else {
                console.warn("No loaded methods of playing music.");
            }
        }

        public setVolume(sound: any, id: any, volume: number): void {
            if (this._type == "Howler") {
                (<Howl>sound).volume(volume, id);
            } else if (this._type == "SoundJS") {
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
            if (this._type == "Howler") {
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
            } else if (this._type == "SoundJS") {
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
         * @description If using SoundJS, this will create the sound instance for soundJS using the audioData Json...
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
}
