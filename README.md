Inverse.js
==========

A dead-simple JavaScript IoC container in 50 lines. Yes, you read that right: 50 lines. The primary purpose of an Inversion of Control container is to serve as a location to place application-specific code that creates objects. It's a registry of factories, effectively. The other JavaScript solutions to this problem complicate the matter unnecessarily with their own formats for registering factory methods and pages of documentation. Getting up and running with them is a project in itself. It shouldn't be this way.

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

## Example

To get started, we'll need an instance of the IoC container:

    var container = new Inverse();

Good! Now, we have a container that can be used to register new bindings into. Next, I'm going to be an awful person and put this variable into the global namespace. In my imaginary world, I'm in the browser, so I'll do it as follows:

    window.container = container;

You probably want to be all fancy and inject this as a dependency into your objects that use it, but whatever. 

Suppose you're using some third-party web service, we'll call it ComplicAPI, that requires a few configuration options. Every time you need this connection to ComplicAPI, you'll need to grab the configuration settnigs for it and build it fresh. That means that the same block of code will exist in multiple places in your code base. That's not very dry! Instead, register that block of code into a singleton on your container:

    container.singleton('complicapi-snowflake', function() {
        return new ComplicAPI.Connection('user-dude', {
            aync: true,
            apiVersion: 5,
            logLevel: 'info',
            printMoogleToConsole: true
        });
    });

Now, every place that you need an instance of the ComplicAPI connection, instead of going through that rigamorale, just get it from the container.

    var connection = container.make('complicapi-connection');

As a bonus, you're using the same connection everywhere and you're only creating the connection when it's needed. Neat! What about more complicated objects that shouldn't be unique? That's not much harder. ComplicAPI has some objects that you use in your code, but they all need a reference to the connection. Unlike the connection, though, each instance is a special, unique snowflake. OK, then. Let's set up the binding for that new object type.

    container.bind('snowflake', function() {
        return new ComplicAPI.Snowflake(container.make('complicapi-connection'), {
            radius: 5
        });
    });

Now you can easily get all of the snowflakes that you want. You can have a ball with them!

    container.bind('snowball', function() {
        var flakes = [];
        
        for (var i = 0; i < 1000000; i++) {
            flakes.push(container.make('snowflake'));
        }
        
        return new ComplicAPI.Snowball(flakes);
    });
