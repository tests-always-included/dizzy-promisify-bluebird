'use strict';

var Bluebird;

Bluebird = require('bluebird');

/**
 * Plugin that extends Dizzy to provide promisified objects.  Modifies
 * DizzyProvider and patches its resolve() and resolveAsync() methods.
 *
 * @param {Dizzy} Dizzy
 */
module.exports = function(Dizzy) {
    var DizzyProvider, oldResolve, oldResolveAsync;

    Dizzy.BulkProvider.prototype.promisified = Dizzy.BulkProvider.prototype.chainMethod(
        'promisified'
    );
    DizzyProvider = Dizzy.DizzyProvider;
    oldResolve = DizzyProvider.prototype.resolve;
    oldResolveAsync = DizzyProvider.prototype.resolveAsync;

    /**
     * Enable or disable the promisifier.
     *
     * @param {boolean} [enable=true]
     * @return {this}
     */
    DizzyProvider.prototype.promisified = function(enable) {
        if (typeof enable === 'undefined') {
            enable = true;
        } else {
            enable = !!enable;
        }

        this.promisifiedResult = enable;

        return this;
    };

    /**
     * Patch the resolve function.
     *
     * @return {*}
     */
    DizzyProvider.prototype.resolve = function() {
        var value;

        value = oldResolve.call(this);

        if (this.promisifiedResult) {
            if (typeof value === 'function') {
                value = Bluebird.promisify(value);
            }

            value = Bluebird.promisifyAll(value);
        }

        return value;
    };

    /**
     * Patch the resolveAsync function.
     *
     * @return {Promise.<*>}
     */
    DizzyProvider.prototype.resolveAsync = function() {
        return oldResolveAsync.call(this).then(value => {
            if (this.promisifiedResult) {
                value = Bluebird.promisifyAll(value);
            }

            return value;
        });
    };
};
