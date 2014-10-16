(function (root, factory) {
    if (typeof define === 'function' && define.amd) define([], factory);
    else if (typeof exports === 'object') module.exports = factory();
    else root.Inverse = factory();
})(this, function () {
    'use strict';
    
    var Inverse = function() {
        this._boundCallbacks = {};
        this._singletonCallbacks = {};
        this._instantiatedSingletons = {};
        this._registeredObjects = {};
    };
    
    Inverse.prototype.make = function(name) {
        if (this._registeredObjects.hasOwnProperty(name)) {
            return this._registeredObjects[name];
        }
        
        var args = Array.prototype.slice.call(arguments, 1);
        
        if (this._singletonCallbacks.hasOwnProperty(name)) {
            if (!this._instantiatedSingletons.hasOwnProperty(name)) {
                this._instantiatedSingletons[name] = this._singletonCallbacks[name].apply(this, args);
            }
            
            return this._instantiatedSingletons[name];
        }
        
        if (this._boundCallbacks.hasOwnProperty(name)) {
            return this._boundCallbacks[name].apply(this, args);
        }
        
        return null;
    };
    
    Inverse.prototype.bind = function(name, callback) {
        this._boundCallbacks[name] = callback;
    };
    
    Inverse.prototype.singleton = function(name, callback) {
        this._singletonCallbacks[name] = callback;
    };
    
    Inverse.prototype.register = function(name, object) {
        this._registeredObjects[name] = object;
    };
    
    return Inverse;
});
