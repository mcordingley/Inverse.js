(function (root, factory) {
    if (typeof define === 'function' && define.amd) define(['exports'], factory);
    else if (typeof exports === 'object') factory(exports);
    else factory(root.Inverse = {});
})(this, function (exports) {
    'use strict';
    
    var Inverse = function() {
        this._boundCallbacks = {};
        this._singletonCallbacks = {};
        this._instantiatedSingletons = {};
        this._registeredObjects = {};
    };
    
    var proto = Inverse.prototype;
    
    proto.make = function(name) {
        if (this._registeredObjects.hasOwnProperty(name)) {
            return this._registeredObjects[name];
        }
        
        if (this._singletonCallbacks.hasOwnProperty(name)) {
            if (!this._instantiatedSingletons.hasOwnProperty(name)) {
                this._instantiatedSingletons[name] = this._singletonCallbacks[name](this);
            }
            
            return this._instantiatedSingletons[name];
        }
        
        if (this._boundCallbacks.hasOwnProperty(name)) {
            return this._boundCallbacks[name](this);
        }
        
        return null;
    };
    
    proto.bind = function(name, callback) {
        this._boundCallbacks[name] = callback;
    };
    
    proto.singleton = function(name, callback) {
        this._singletonCallbacks[name] = callback;
    };
    
    proto.register = function(name, object) {
        this._registeredObjects[name] = object;
    };
});
