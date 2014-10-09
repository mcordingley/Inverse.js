Inverse.js
==========

A dead-simple JavaScript IoC container in 48 lines. Yes, you read that right: 48 lines. The primary purpose of an Inversion of Control container is to serve as a location to place application-specific code that creates objects. It's a registry of factories, effectively. The other JavaScript solutions to this problem complicate the matter unnecessarily with their own formats for registering factory methods and pages of documentation. Getting up and running with them is a project in itself. It shouldn't be this way.

## API

To start out, create an instance of the container:

    var container = new Inverse();

Container instances are kept as objects, so you can either inject them as dependencies to other objects of yours or set one up in your application as a global, whichever works better for you.

### bind

With your container in hand, you can register a factory function with the `bind` function:

    container.bind(name, callback);
    
Just provide it with a name and the callback that you intend to use with it. When this callback is called, it will be provided the container instance as its first argument. This enables bound factory functions to then use the container to create their own dependencies.

### singleton

You can also register a factory function that will only ever be called once with the `singleton` function. Subsequent calls to make this object will return the object created with the first call. This is useful for things such as objects representing connections to third-party systems.

    container.singleton(name, callback);
    
The behavior is otherwise identical to `bind`.

### register

If you have already created the object or have had it created for you by third-party code, it can be registered directly with `register`. Like `singleton`, the same object instance will be returned each time the object is requested.

    container.register(name, object);

### make

With your factory functions in place, just call `make` to get your object:

    container.make(name);
