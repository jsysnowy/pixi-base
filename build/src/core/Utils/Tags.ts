namespace com.sideplay.core {
    export class Tags {
        // Class Field
        public static instance: Tags = null;

        // Object
        private _tagsStorage: Object = null;

        /**
         * @name constructor
         * @description Creates an instance of Tags.
         * @memberof Tags
         */
        public constructor() {
            if (Tags.instance === null) {
                Tags.instance = core.tags = this;
                this._tagsStorage = {};
            } else {
                console.error("Cannot make multiple Tags. Please use GameObjects.instance or core.gameObjects instead.");
            }
        }

        /**
         * @name add
         * @description Adds all passed in tag parameters to the passed in gameObject.
         * @param {*} gameObject
         * @param {...string[]} tags
         * @returns {boolean}
         * @memberof Tags
         */
        public add(gameObject: any, ...tags: string[]): boolean {
            // Makes sure operation completes sucessfully
            var complete: boolean = false;

            // Loop over every passed in tag.
            for (let i = 0; i < tags.length; i++) {
                // If the tag already exists...
                if (this._tagsStorage[tags[i]] != undefined) {
                    // Attatch gameObject to this tag group.
                    this._tagsStorage[tags[i]].push(gameObject);
                    complete = true;
                } else {
                    // Create a new array to store all objects with this tag.
                    this._tagsStorage[tags[i]] = [];
                    this._tagsStorage[tags[i]].push(gameObject);
                    complete = true;
                }
            }

            // Return false if no tags
            return complete;
        }

        /**
         * @name get
         * @description Returns an array of all objects with the given tag.
         * @param {(string | string[])} tag
         * @param {string} andOrNot
         * @returns {any[]}
         * @memberof Tags
         */
        public get(tag: string | string[], andOrNot: string = "or"): any[] {
            // case change
            andOrNot = andOrNot.toLowerCase();

            // single string to array conversion
            var tagArr: string[] = [];
            if (typeof tag == "string") {
                tagArr.push(tag);
            } else {
                tagArr = tag;
            }

            // Init return array
            var returnArray = [];

            // Switch logic
            switch (andOrNot) {
                case "and": {
                    // Case and will only return objects with ALL tags.
                    for (let i = 0; i < tagArr.length; i++) {
                        if (this._tagsStorage[tagArr[i]] != null) {
                            // First add all objects with the current tag.
                            returnArray.push(...this._tagsStorage[tagArr[i]]);

                            // Culling process only happens after 2 tag arrays are added.
                            if (i != 0) {
                                // Holding array for successful candidates of logic.
                                var storageArray = [];
                                // Slowly cull through returnArray...
                                while (returnArray.length != 0) {
                                    // Pull out index 0 of the array.
                                    var cur = returnArray.shift();
                                    // Loop through all other existing candidates
                                    for (let r = 0; r < returnArray.length; r++) {
                                        // If it exists again, it shared all previous tags!
                                        if (cur == returnArray[r]) {
                                            // Store successful candidate!
                                            storageArray.push(cur);
                                        }
                                    }
                                }
                                // ~Flip storageArray to new returnArray...
                                returnArray = storageArray;
                            }
                        }
                    }
                    break;
                }
                case "not":
                    {
                        // Case not will return any gameobjects without any of the given tags.

                        // Loop through all tags not to include
                        for (let i = 0; i < tagArr.length; i++) {
                            var foundTag = false;
                        }
                    }
                    break;
                case "or":
                default: {
                    // Or is the default tag, and returns objects with any 1 of the passed in tags.
                    for (let i = 0; i < tagArr.length; i++) {
                        if (this._tagsStorage[tagArr[i]] != null) {
                            returnArray.push(...this._tagsStorage[tagArr[i]]);
                        }
                    }
                }
            }

            // Return filled array
            return returnArray;
        }

        /**
         * @name remove
         * @description Removes a tag from a specific gameObject.
         * @param {*} gameObject
         * @param {...string[]} tags
         * @returns {boolean}
         * @memberof Tags
         */
        public remove(gameObject: any, ...tagsToRemove: string[]): boolean {
            // Stores if a tag was removed.
            let tagRemoved = false;

            // Go through each tag you wanna remove and remove em.
            tagsToRemove.forEach(tag => {
                if (this._tagsStorage[tag] != null) {
                    let oL = this._tagsStorage[tag].length;
                    this._tagsStorage[tag] = helper.arrays.removeAllInstanceOf(gameObject, this._tagsStorage[tag]);
                    if (this._tagsStorage[tag].length != oL) {
                        tagRemoved = true;
                    }
                }
            });

            // Return if a tag was removed or not.
            return tagRemoved;
        }
    }

    // Reference
    export var tags: Tags = null;
}
