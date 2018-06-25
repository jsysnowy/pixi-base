namespace com.sideplay.helper.tools {
	/**
	 * Stores the different types of queue.
	 * @export
	 * @enum {number}
	 */
	export enum QueueType {
		firstInFirstOut,
		firstInLastOut,
		random
	}

	export class Queue {
		/**
		 * Stores the type of queue this is.
		 */
		private _queueType: QueueType = null;

		/**
		 * Stores the actual functions in the current queue.
		 */
		private _queue: (() => any)[] = null;
		private _queueParams: any[][] = null;

		/**
		 * Stores the current item being investigated in the queue.
		 */
		private _curItem: (...any) => any = null;

		/**
		 * Stores the maximum available size of the queue.  Cannot have more than this added.
		 */
		private _mS: number = -1;

		/**
		 * Stores whether or not the queue is full.
		 */
		private _isFull: boolean = false;

		/**
		 * Stores a function which is called if a space is made in the queue.
		 */
		private _onSpace: () => any = null;

		/**
		 * Stores a function which is called if the queue becomes full.
		 */
		private _onFull: () => any = null;

		/**
		 * Stores a function which is called if the queue completely empties.
		 */
		private _onEmpty: () => any = null;

		/**
		 * Stores whether or not the queue is currently active.
		 */
		private _queueActive: boolean = false;

		/**
		 * @name Queue
		 * @description Creates a new instance off Queue
		 * @memberof Queue
		 */
		public constructor(maxSize: number = -1, type: QueueType = QueueType.firstInFirstOut) {
			// Initialises this queue.
			this._queue = [];
			this._queueParams = [];

			// Sets user defined vars.
			this._mS = maxSize;
			this._queueType = type;
		}

		/**
		 * @name setOnSpace
		 * @description Called when a free space is created in the queue.
		 * @memberof Queue
		 */
		public setOnSpace(onSpace: () => any): void {
			this._onSpace = onSpace;
		}

		/**
		 * @name setOnFull
		 * @description Called when the queue completely fills up.
		 * @memberof Queue
		 */
		public setOnFull(onFull: () => any): void {
			this._onFull = onFull;
		}

		/**
		 * @name setOnEmpty
		 * @description Called when the queues length is 0.
		 * @memberof Queue
		 */
		public setOnEmpty(onEmpty: () => any): void {
			this._onEmpty = onEmpty;
		}

		/**
		 * @name addItem
		 * @description Adds an item to the queue.
		 * @param {()=>any} item
		 * @returns {boolean}
		 * @memberof Queue
		 */
		public addItem(item:any, ...params:any[]): boolean {
			// Check to make sure if the queue is empty.
			if (this._queue.length >= this._mS && this._mS != -1) {
				if (config.settings.developerMode) {
					console.warn('[Queue.ts] Couldnt add item to queue as it was full!');
				}
				return false;
			} else {
				// Push the item into the queue
				this._queue.push(item);
				this._queueParams.push(params);

				// If the queue is now full...
				if (this._queue.length == this._mS) {
					// Set isFull param
					this._isFull = true;

					// ...Call the _onFull function if it exists.
					if (this._onFull != null) {
						this._onFull();
					}
				}

				// If queue isn't active, fire the queue updater.
				if (!this._queueActive) {
					this._queueUpdate();
				}
			}
		}

		/**
		 * @name done
		 * @description Call once a running function in the queue is finished.
		 * @memberof Queue
		 */
		public done(): void {
			// Make sure queue was active!
			if (!this._queueActive) {
				// how are you done when you arent active..
				return;
			}

			// Remove curItem
			this._curItem = null;

			// De-activate queue
			this._queueActive = false;

			// Call next queueUpdate
			this._queueUpdate();
		}

		/**
		 * @name _queueUpdate
		 * @description Called when the queue needs to update the
		 * @private
		 * @memberof Queue
		 */
		private _queueUpdate(): void {
			// If queue is active ... no updating!
			if (this._queueActive) {
				if (config.settings.developerMode) {
					console.log('[Queue.ts] Queue tried to update - but it was already active.');
				}
				return;
			}

			// Check there is no current item.
			if (this._curItem != null) {
				if (config.settings.developerMode) {
					console.log('[Queue.ts] Queue tried to update - but there is a curItem stored.. so it didnt');
				}
				return;
			}

			// Check the queue isn't empty.
			if (this._queue.length == 0) {
				if (config.settings.developerMode) {
					console.log('[Queue.ts] Queue is now empty!');
				}

				// Call onEmpty if it exists!
				if (this._onEmpty != null) {
					this._onEmpty();
				}

				// Finished update
				return;
			}

			// If queue update reaches here, queue needs to be locked.
			this._queueActive = true;
			var param:any[] = [];
			// Grab next value depending on type!
			// First in first out will pull the lowest index of the array and call it,
			if (this._queueType == QueueType.firstInFirstOut) {
				// Shift from front of array
				this._curItem = this._queue.shift();
				param = this._queueParams.shift();
			} else if (this._queueType == QueueType.firstInLastOut) {
				// Pop from end of array.
				this._curItem = this._queue.pop();
				param = this._queueParams.pop();
			} else if (this._queueType == QueueType.random) {
				// Pick a random element from the queue!
				var rnd:number = core.random.integer({min:0,max:this._queue.length-1});
				this._curItem = this._queue[rnd];
				param = this._queueParams[rnd];

				// Remove this element from the queue
				this._queue.splice(this._queue.indexOf(this._curItem), 1);
				this._queueParams.splice(this._queueParams.indexOf(param), 1);
			}

			// If the queue was full - it probably isnt now .. so THERES A SPACE!
			if (this._isFull) {
				// Yay space
				this._isFull = false;

				// Call onSpace if it exists
				if (this._onSpace != null) {
					this._onSpace();
				}
			}

			// Call curItem!
			this._curItem(param);
		}
	}
}
