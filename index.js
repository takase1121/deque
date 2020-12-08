/**
 * A dequeue. This dequeue does not auto shrink.
 * The user must explicitly call `tryShrink` to shrink it
 * to prevent memory wastage.
 */
class Deque {
    /**
     * 
     * @param {number} k The K factor.
     * When the size of underlying is larger than the size of the dequeue
     * by k times, a shrink operation is carried out.
     */
    constructor(k = 3) {
        this.k = k
        this.bottom = 0
        this.top = 0
        this.active = new CircularArray()
    }

    /**
     * Push an object at the front of the dequeue
     * @param {*} o 
     */
    push(o) {
        let size = this.bottom - this.top
        if (size > this.active.length - 1) {
            this.active = this.active.grow(b, t)
        }
        this.active.put(this.bottom, o)
        this.bottom++
    }

    /**
     * Shift an object from the end of the dequeue
     */
    shift() {
        let size = this.bottom - this.top
        if (size > 0) {
            let item = this.active.get(this.bottom)
            this.top++
            return item
        }
    }

    /**
     * Pop an object from the front of the dequeue
     */
    pop() {
        this.bottom--
        let size = this.bottom - this.top
        if (size < 0) {
            this.bottom = this.top
            return
        } else {
            let item = this.active.get(this.bottom)
            this.bottom++
            return item
        }
    }

    /**
     * Shrinks the underlying array if the size of underlying array is
     * larger than the size of dequeue by k times
     */
    tryShrink() {
        
        if (this.bottom-this.top < this.active.length/this.k) {
            this.active = this.active.shrink(this.bottom, this.top)
        }
    }
}

/**
 * This dequeue tries to auto-shrink on every pop operation.
 * This may not be efficient if you pop and push so often that the size
 * always jumps between the k factor.
 */
class PSDeque extends Deque {
    pop() {
        let item = this.pop()
        this.tryShrink()
        return item
    }
}

/**
 * This dequeue tries to auto-shrink by debouncing pop operation.
 * Every pop operation will start or reset a timer.
 * When the timer completes, a shrink operation is attempted.
 * The timeout value can be changed anytime so that one can fine tune
 * the timeout prevent shrinking when not needed.
 */
class TSDeque extends Deque {
    /**
     * Constructs a TSDeque
     * @param {*} k The K factor.
     * @param {*} timeout Timeout in miliseconds to debounce the shrink operation
     */
    constructor(k = 3, timeout = 5000) {
        super(k)
        this.timeoutMs = timeout
    }

    /**
     * Change the timeout in miliseconds
     */
    set timeout(timeout) {
        if (this.timeoutObj) clearTimeout(this.timeoutObj)
        this.timeoutMs = timeout
    }

    /**
     * Timeout in miliseconds
     */
    get timeout() {
        return this.timeoutMs
    }

    /**
     * Resets the timer. One can manually prevent shrinking for a period of time
     * by calling this
     */
    countDown() {
        if (this.timeoutObj) clearTimeout(this.timeoutObj)
        this.timeoutObj = setTimeout(() => this.tryShrink(), timeout)
    }

    /**
     * Stops the timer. Shrinking will not be carried out until subsequent calls
     * to `countDown` to restart the timer.
     */
    stop() {
        if (this.timeoutObj) clearTimeout(this.timeoutObj)
    }

    pop() {
        let item = this.pop()
        this.countDown()
        return item;
    }
}

/**
 * A supposedly circular array.
 * One day, a real circular array will be implemented.
 */
class CircularArray {
    constructor(initialLogSize, oldData) {
        this.logSize = initialLogSize
        this.length = 1 << this.logSize
        
        if (oldData) {
            const [oldSegment, bottom, top] = oldData
            this.segment = oldSegment.slice(bottom, top)
        } else {
            this.segment = []
        }
        // resize segment (theoritically)
        this.segment[this.size] = undefined
    }

    get(i) {
        return this.segment[i % this.length]
    }

    put(i, o) {
        this.segment[i % this.length] = o
    }

    grow(b, t) {
        return new CircularArray(this.logSize+1, [this.segment, b, t])
    }

    shrink(b, t) {
        return new CircularArray(this.logSize-1, [this.segment, b, t])
    }
}