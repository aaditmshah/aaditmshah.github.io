---
layout: post
title: Why Prototypal Inheritance Matters
categories: [tutorial, object-oriented, functional]
tags: [JavaScript, Prototypal Inheritance]
---
Five days ago I wrote [Standardizing Harmony Classes](/standardizing-harmony-classes "Aadit M Shah | Standardizing Harmony Classes"). It showed how to simulate classes in current JavaScript implementations and how [ECMAScript Harmony classes](http://wiki.ecmascript.org/doku.php?id=strawman:maximally_minimal_classes "strawman:maximally_minimal_classes [ES Wiki]") are just syntactic sugar for the same. My programming style has evolved since then, thanks to [Om Shankar](http://geekyogi.tumblr.com/ "Geek Yogi") and the awesome members of the [JavaScript Room](http://rlemon.github.io/so-chat-javascript-rules/ "Javascript: Unofficial Room Rules"); and like [Douglas Crockford](http://www.crockford.com/ "Douglas Crockford's Wrrrld Wide Web") did [back in 2006](http://javascript.crockford.com/prototypal.html "Prototypal Inheritance"), I too have learned to fully embrace prototypalism.

You see JavaScript is a multi-paradigm programming language. It has both object-oriented and functional features, which means that you can write programs using both these styles. However these two paradigms don't mix well. For example it's [not possible](http://stackoverflow.com/q/1606797/783743 "javascript - Use of .apply() with 'new' operator. Is this possible? - Stack Overflow") to use `new` (a classical object-oriented feature) with `apply` (a functional feature). Prototypal inheritance is used to bridge this gap.

__Contents__

1. [The Problem with Classical Inheritance](#the_problem_with_classical_inheritance)
2. [Stop Using the new Keyword](#stop_using_the_new_keyword)
3. [Understanding Prototypal Inheritance](#understanding_prototypal_inheritance)
   1. [Ex Nihilo Object Creation](#ex_nihilo_object_creation)
   2. [Cloning an Existing Object](#cloning_an_existing_object)
   3. [Extending a Newly Created Object](#extending_a_newly_created_object)
   4. [Constructors vs Prototypes](#constructors_vs_prototypes)
   5. [Combining Object Creation and Extension](#combining_object_creation_and_extension)
   6. [Two Methods of Prototypal Inheritance](#two_methods_of_prototypal_inheritance)
      1. [Delegation or Differential Inheritance](#delegation_or_differential_inheritance)
      2. [Cloning or Concatenative Inheritance](#cloning_or_concatenative_inheritance)
   7. [Inheriting from Multiple Prototypes](#inheriting_from_multiple_prototypes)
   8. [Blueprints for Mixins](#blueprints_for_mixins)
   9. [Fixing the instanceof Operator](#fixing_the_instanceof_operator)
   10. [Propagating Changes to Prototypes](#propagating_changes_to_prototypes)
4. [Conclusion](#conclusion)
5. [Related Articles](#related_articles)

## The Problem with Classical Inheritance ##

Most JavaScript programmers will tell you that classical inheritance is bad. However only a handful of them really know why. The truth is that classical inheritance is not bad. Python has classical inheritance and it's a great programming language. Nevertheless classical inheritance is not suitable for JavaScript. Python got classes right. They are simply [factory functions](http://ericleads.com/2013/01/javascript-constructor-functions-vs-factory-functions/ "JavaScript Constructor Functions vs Factory Functions «  Eric Elliott – JavaScript Architect (A JavaScript Blog)"). In JavaScript however any function can be used as a constructor.

The problem with JavaScript is that since any function can be used as a constructor we need to distinguish a normal function call from a constructor function call; and this is achieved using the `new` keyword. However, this breaks functional features in JavaScript since `new` is a keyword, not a function. Hence functional features can't be used in conjunction with object instantiation.

{% highlight javascript linenos %}
function Person(firstname, lastname) {
    this.firstname = firstname;
    this.lastname = lastname;
}
{% endhighlight %}

Consider the above program. You can create an instance of the function `Person` by calling it, with the function call preceded by the `new` keyword:

{% highlight javascript %}
var author = new Person("Aadit", "Shah");
{% endhighlight %}

However there's no way to `apply` an array of arguments to the constructor function:

{% highlight javascript %}
var author = new Person.apply(null, ["Aadit", "Shah"]); // error
{% endhighlight %}

Nevertheless, if `new` was a function then it would be possible:

{% highlight javascript %}
var author = Person.new.apply(Person, ["Aadit", "Shah"]);
{% endhighlight %}

Fortunately since JavaScript has prototypal inheritance it's possible to implement `new` as a function:

{% highlight javascript linenos %}
Function.prototype.new = function () {
    function functor() { return constructor.apply(this, args); }
    var args = Array.prototype.slice.call(arguments);
    functor.prototype = this.prototype;
    var constructor = this;
    return new functor;
};
{% endhighlight %}

This is not possible in languages like Java in which objects can only be created by instantiating classes using the `new` keyword.

The following table lists the advantages of prototypal inheritance over classical inheritance:

<table>
    <tr>
        <th>Classical Inheritance</th>
        <th>Prototypal Inheritance</th>
    </tr>
    <tr>
        <td>Classes are immutable. You can't modify or add new methods to them at runtime.</td>
        <td>Prototypes are flexible. They may be either mutable or immutable.</td>
    </tr>
    <tr>
        <td>Classes may or may not support multiple inheritance.</td>
        <td>Objects can inherit from multiple prototypes.</td>
    </tr>
    <tr>
        <td>It's verbose and complicated. You have abstract classes, final classes, interfaces, etc.</td>
        <td>It's simple. You only have objects and extending objects is the only operation required.</td>
    </tr>
</table>

## Stop Using the new Keyword ##

By now you must know why I believe that the `new` keyword is bad - you can't use it in conjunction with functional features. However that's no reason to stop using it. The `new` keyword has [legitimate uses](http://stackoverflow.com/a/383503/783743 "Is JavaScript 's “new” Keyword Considered Harmful? - Stack Overflow"). Nevertheless I still advise you to stop using it. The `new` keyword masks [true prototypal inheritance](http://stackoverflow.com/a/6375254/783743 "Is JavaScript 's “new” Keyword Considered Harmful (Part 2)? - Stack Overflow") in JavaScript, making it look more like classical inheritance. As [Raynos](http://stackoverflow.com/users/419970/raynos "User Raynos - Stack Overflow") states:

> `new` is a remnant of the days where JavaScript accepted a Java like syntax for gaining "popularity".

JavaScript is a prototypal language with its roots in [Self](http://selflanguage.org/ "Welcome to Self — Self - the power of simplicity"). However, for marketing purposes [Brendan Eich](https://brendaneich.com/ "Brendan Eich") was keen to push it as [Java's little brother](http://dailyjs.com/2010/05/24/history-of-javascript-1/ "DailyJS: History of JavaScript: Part 1"):

> And we were pushing it as a little brother to Java, as a complementary language like Visual Basic was to C++ in Microsoft’s language families at the time.

This design decision however caused `new` problems ([see what I did there?](http://cdn.superbwallpapers.com/wallpapers/meme/i-see-what-you-did-there-9138-400x250.jpg "I see what you did there.")). When people see the `new` keyword in JavaScript they think about classes, and then when it comes inheritance they [get](http://stackoverflow.com/a/15461601/783743 "javascript - Inheritence of variable properties - Stack Overflow") [stumped](http://stackoverflow.com/a/8096017/783743 "JavaScript inheritance and the constructor property - Stack Overflow"). As Douglas Crockford [stated](http://javascript.crockford.com/prototypal.html "Prototypal Inheritance"):

> This indirection was intended to make the language seem more familiar to classically trained programmers, but failed to do that, as we can see from the very low opinion Java programmers have of JavaScript. JavaScript's constructor pattern did not appeal to the classical crowd. It also obscured JavaScript's true prototypal nature. As a result, there are very few programmers who know how to use the language effectively.

Hence I advise you to stop using the `new` keyword. JavaScript has a much more powerful prototypal system underneath its classical object-oriented cruft. However most programmers never see this and hence remain in the dark.

## Understanding Prototypal Inheritance ##

[Prototypal inheritance](http://en.wikipedia.org/wiki/Prototype-based_programming "Prototype-based programming - Wikipedia, the free encyclopedia") is simple. In prototypal languages you only have objects. No classes. There are two ways to create new objects - [_ex nihilo_](http://en.wikipedia.org/wiki/Ex_nihilo "Ex nihilo - Wikipedia, the free encyclopedia") ("out of nothing") object creation or through cloning an existing object. In JavaScript the [`Object.create`](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/create "Object.create - JavaScript | MDN") function ([discovered](http://javascript.crockford.com/prototypal.html "Prototypal Inheritance") by Douglas Crockford) is used to create new objects. Newly created objects are then extended with new properties.

### Ex Nihilo Object Creation ###

The `Object.create` function in JavaScript is used to create objects ex nihilo as follows:

{% highlight javascript %}
var object = Object.create(null);
{% endhighlight %}

In the above example the newly created `object` has no prototype. It's a clone of `null`.

### Cloning an Existing Object ###

The `Object.create` function can also be used to clone an existing object as follows:

{% highlight javascript linenos %}
var rectangle = {
    area: function () {
        return this.width * this.height;
    }
};

var rect = Object.create(rectangle);
{% endhighlight %}

In the above example `rect` inherits the `area` function from `rectangle`. Also notice that `rectangle` is an object literal. An object literal is a succinct way of creating a clone of `Object.prototype` and extending it with new properties. It's equivalent to:

{% highlight javascript linenos %}
var rectangle = Object.create(Object.prototype);

rectangle.area = function () {
    return this.width * this.height;
};
{% endhighlight %}

### Extending a Newly Created Object ###

In the above example we cloned the `rectangle` object and called it `rect`, but before we may use the `area` function of `rect` we need to extend it with `width` and `height` properties as follows:

{% highlight javascript linenos %}
rect.width = 5;
rect.height = 10;
alert(rect.area());
{% endhighlight %}

However this is a very clumsy way to create a clone of an object and extend it with new properties. We need to manually define `width` and `height` on every clone of `rectangle`. It would be nice to have a function create a clone of `rectangle` and extend it with `width` and `height` properties for us. Sounds familiar? It is. I'm talking about a constructor function. Let's call this function `create` and define it on the `rectangle` object itself:

{% highlight javascript linenos %}
var rectangle = {
    create: function (width, height) {
        var self = Object.create(this);
        self.height = height;
        self.width = width;
        return self;
    },
    area: function () {
        return this.width * this.height;
    }
};

var rect = rectangle.create(5, 10);

alert(rect.area());
{% endhighlight %}

### Constructors vs Prototypes ###

Wait a moment. This looks a lot like the normal constructor pattern in JavaScript:

{% highlight javascript linenos %}
function Rectangle(width, height) {
    this.height = height;
    this.width = width;
}

Rectangle.prototype.area = function () {
    return this.width * this.height;
};

var rect = new Rectangle(5, 10);

alert(rect.area());
{% endhighlight %}

Yes, indeed it is. In order to make JavaScript look more like Java the prototypal pattern was inverted to yield the constructor pattern. Hence every function in JavaScript has a `prototype` object and can be used as a constructor. The `new` keyword allows us to use a function as a constructor. In addition it clones the `prototype` of the constructor and binds it to the `this` pointer of the constructor, returning `this` if no other object is returned.

Both the prototypal pattern and the constructor pattern are [equivalent](http://stackoverflow.com/a/8096017/783743 "JavaScript inheritance and the constructor property - Stack Overflow"). Hence you may wonder why anybody would bother using the prototypal pattern over the constructor pattern. After all the constructor pattern is more succinct than the prototypal pattern. Nevertheless the prototypal pattern has many advantages over the constructor pattern, enlisted in the following table:

<table>
    <tr>
        <th>Constructor Pattern</th>
        <th>Prototypal Pattern</th>
    </tr>
    <tr>
        <td>Functional features can't be used in conjunction with the <code>new</code> keyword.</td>
        <td>Functional features can be used in conjunction with <code>create</code>.</td>
    </tr>
    <tr>
        <td>Forgetting to use <code>new</code> leads to unexpected bugs and global variables.</td>
        <td>Since <code>create</code> is a function the program will always work as expected.</td>
    </tr>
    <tr>
        <td>Prototypal inheritance is unnecessarily complicated and <a href="http://stackoverflow.com/a/15461601/783743" title="javascript - Inheritence of variable properties - Stack Overflow">confusing</a>.</td>
        <td>Prototypal inheritance is simple and easy to understand.</td>
    </tr>
</table>

The last point may need some explanation. The underlying idea is that prototypal inheritance using constructors is more complicated than prototypal inheritance using prototypes. Let's consider prototypal inheritance using prototypes first:

{% highlight javascript linenos %}
var square = Object.create(rectangle);

square.create = function (side) {
    return rectangle.create.call(this, side, side);
};

var sq = square.create(5);

alert(sq.area());
{% endhighlight %}

It's easy to understand what's happening here. First we create a clone of `rectangle` and call it `square`. Next we override the `create` function of `square` with a new `create` function. Finally we `call` the `create` function of `rectangle` from the new `create` function and `return` the object is returns. In constrast prototypal inheritance using constructors looks like this:

{% highlight javascript linenos %}
function Square() {
    Rectangle.call(this, side, side);
}

Square.prototype = Object.create(Rectangle.prototype);

Square.prototype.constructor = Square;

var sq = square.create(5);

alert(sq.area());
{% endhighlight %}

Sure, the constructor function becomes simpler. However it becomes very difficult to explain prototypal inheritance to a person who knows nothing about it. It becomes even more difficult to explain it to a person who knows classical inheritance.

When using the prototypal pattern it becomes obvious that one object inherits from another object. When using the constructor pattern this is not so obvious because you tend to think in terms of constructors inheriting from other constructors.

### Combining Object Creation and Extension ###

In the previous example we created a clone of `rectangle` and called it `square`. Then we extended it with a new `create` property, overriding the `create` function inherited from `rectangle`. It would be nice to combine these two operations into one, just like object literals are used to create clones of `Object.prototype` and extend it with new properties. This operation, called `extend`, can be implemented as a function:

{% highlight javascript linenos %}
Object.prototype.extend = function (extension) {
    var hasOwnProperty = Object.hasOwnProperty;
    var object = Object.create(this);

    for (var property in extension)
        if (hasOwnProperty.call(extension, property) ||
            typeof object[property] === "undefined")
                object[property] = extension[property];

    return object;
};
{% endhighlight %}

Using the above `extend` function we can rewrite the code for `square` as follows:

{% highlight javascript linenos %}
var square = rectangle.extend({
    create: function (side) {
        return rectangle.create.call(this, side, side);
    }
});

var sq = square.create(5);

alert(sq.area());
{% endhighlight %}

The `extend` function is the only operation required for prototypal inheritance. It's a superset of the `Object.create` function and hence it can be used for both object creation and extension, making `Object.create` obsolete. Hence we can rewrite the code for `rectangle` using `extend` as follows, making the `create` function more structured like the [module pattern](http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html "JavaScript Module Pattern: In-Depth"):

{% highlight javascript linenos %}
var rectangle = {
    create: function (width, height) {
        return this.extend({
            height: height,
            width: width
        });
    },
    area: function () {
        return this.width * this.height;
    }
};

var rect = rectangle.create(5, 10);

alert(rect.area());
{% endhighlight %}

### Two Methods of Prototypal Inheritance ###

Some of you may have noticed that the object returned by the `extend` function actually inherits properties from two objects, and not one - the object being extended and the object extending it. In addition the way in which properties are inherited from these two objects is also different. In the first case we inherit properties via delegation. In the second case we inherit properties via concatenation.

#### Delegation or Differential Inheritance ####

Most JavaScript programmers are [familiar](http://stackoverflow.com/a/572996/783743 "dynamic languages - How does JavaScript .prototype work? - Stack Overflow") [with](https://developer.mozilla.org/en-US/docs/JavaScript/Guide/Inheritance_and_the_prototype_chain "Inheritance and the prototype chain - JavaScript | MDN") [differential](https://en.wikipedia.org/wiki/Differential_inheritance "Differential inheritance - Wikipedia, the free encyclopedia") [inheritance](http://en.wikipedia.org/wiki/Prototype-based_programming#Delegation "Prototype-based programming - Wikipedia, the free encyclopedia"). To quote from Wikipedia:

> It operates on the principle that most objects are derived from other, more general objects, and only differ in a few small aspects; while usually maintaining a list of pointers internally to other objects which the object differs from.

Prototypal inheritance in JavaScript is based on differential inheritance. Every object in JavaScript has an internal pointer, called `[[proto]]`, which points to the prototype of that object. The `[[proto]]` property of objects created [_ex nihilo_](http://en.wikipedia.org/wiki/Ex_nihilo "Ex nihilo - Wikipedia, the free encyclopedia") point to `null`. This forms a chain of objects linked via the internal `[[proto]]` property (hence called a prototype chain), which ends in `null`.

When you try to access a property of an object the JavaScript engine first searches for that property on the object itself. If it cannot find the property on the object then it delegates the property access to the prototype of the object. In this way the property access traverses up the prototype chain until the property is found (in which case it's returned) or the chain ends in `null` (in which case `undefined` is returned).

{% highlight javascript linenos %}
function get(object, property) {
    if (!Object.hasOwnProperty.call(object, property)) {
        var prototype = Object.getPrototypeOf(object);
        if (prototype) return get(prototype, property);
    } else return object[property];
}
{% endhighlight %}

If the [member operators](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Operators/Member_Operators "Member Operators - JavaScript | MDN") in JavaScript were functions they would be implemented as shown in the program above. It shows how property access is delegated to the `prototype` of an object if it's not found the object itself.

#### Cloning or Concatenative Inheritance ####

Most JavaScript programmers would argue that copying the properties of one object to another is not truly a form of inheritance because any modifications to the original object are not reflected on the clone. Five days ago I would have agreed. Now however I believe that [concatenation](http://en.wikipedia.org/wiki/Prototype-based_programming#Concatenation "Prototype-based programming - Wikipedia, the free encyclopedia") is a true form of prototypal inheritance. Modifications to the original object can be propagated to its copies to achieve true prototypal inheritance.

Concatenation and delegation both have their advantages and disadvantages. They are listed in the following table:

<table>
    <tr>
        <th>Delegation</th>
        <th>Concatenation</th>
    </tr>
    <tr>
        <td>Any changes to the prototype are automatically reflected on all its clones.</td>
        <td>Any changes to the prototype need to be propagated to all its clones.</td>
    </tr>
    <tr>
        <td>Property access is slower because it may need to traverse up the prototype chain.</td>
        <td>Property access is faster because inherited properties are copied.</td>
    </tr>
    <tr>
        <td>Objects may only delegate to a single prototype in JavaScript.</td>
        <td>Objects may copy properties from any number of prototypes.</td>
    </tr>
</table>

### Inheriting from Multiple Prototypes ###

The last point in the above table tells us that objects can inherit from multiple prototypes via concatenation. This is an important feature because it proves that prototypal inheritance is more powerful than classical inheritance in Java and as powerful as classical inheritance in C++. To implement multiple inheritance in the prototypal pattern you only need to modify the `extend` function to copy the properties of multiple prototypes:

{% highlight javascript linenos %}
Object.prototype.extend = function () {
    var hasOwnProperty = Object.hasOwnProperty;
    var object = Object.create(this);
    var length = arguments.length;
    var index = length;

    while (index) {
        var extension = arguments[length - (index--)];

        for (var property in extension)
            if (hasOwnProperty.call(extension, property) ||
                typeof object[property] === "undefined")
                    object[property] = extension[property];
    }


    return object;
};
{% endhighlight %}

Multiple inheritance is useful as it promotes modularity and code reusability. Objects inherit from one prototype via delegation and from the rest via concatenation. For example say you have a prototype for an event emitter as follows:

{% highlight javascript linenos %}
var eventEmitter = {
    on: function (event, listener) {
        if (typeof this[event] !== "undefined")
            this[event].push(listener);
        else this[event] = [listener];
    },
    emit: function (event) {
        if (typeof this[event] !== "undefined") {
            var listeners = this[event];
            var length = listeners.length, index = length;
            var args = Array.prototype.slice.call(arguments, 1);

            while (index) {
                var listener = listeners[length - (index--)];
                listener.apply(this, args);
            }
        }
    }
};
{% endhighlight %}

Now you want `square` to behave like an event emitter. Since `square` already inherits from `rectangle` via delegation it must inherit from `eventEmitter` via concatenation. This change is very simple to implement using the `extend` function as follows:

{% highlight javascript linenos %}
var square = rectangle.extend(eventEmitter, {
    create: function (side) {
        return rectangle.create.call(this, side, side);
    },
    resize: function (newSize) {
        var oldSize = this.width;
        this.width = this.height = newSize;
        this.emit("resize", oldSize, newSize);
    }
});

var sq = square.create(5);

sq.on("resize", function (oldSize, newSize) {
    alert("sq resized from " + oldSize + " to " + newSize + ".");
});

sq.resize(10);

alert(sq.area());
{% endhighlight %}

It's impossible to implement the above program in Java since it doesn't support multiple inheritance. Instead you would either have to create a separate `EventEmitter` class or use an `EventEmitter` interface and implement the `on` and `emit` functions separately for each class that implements it. Of course you wouldn't encounter this problem in C++ but as we all know [Java](http://steve-yegge.blogspot.in/2006/03/execution-in-kingdom-of-nouns.html "Stevey's Blog Rants: Execution in the Kingdom of Nouns") [sucks](http://tech.jonathangardner.net/wiki/Why_Java_Sucks "Why Java Sucks - Jonathan Gardner's Tech Wiki").

### Blueprints for Mixins ###

In the previous example you must have noticed that the `eventEmitter` prototype didn't have a `create` function. This is because you shouldn't be able to directly create an `eventEmitter` object. Instead `eventEmitter` is used as a prototype for other prototypes. Such prototypes are called [mixins](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#mixinpatternjavascript "Learning JavaScript Design Patterns"). They are the prototypal equivalent of [abstract classes](http://en.wikipedia.org/wiki/Abstract_type "Abstract type - Wikipedia, the free encyclopedia"). Mixins are used to extend the behavior of objects by providing a set of reusable functions.

Sometimes however mixins require [private state](http://javascript.crockford.com/private.html "Private Members in JavaScript"). For example the `eventEmitter` mixin would be more secure if it stored its event listeners in a private variable instead of on the `this` object. However mixins have no `create` function to encapsulate private state. Hence we create "blueprints" of mixins to create [closures](http://stackoverflow.com/a/12931785/783743 "scope - JavaScript closures vs. anonymous functions - Stack Overflow"). Blueprints may look like constructor functions but they are not meant to be used as constructors. For example:

{% highlight javascript linenos %}
function eventEmitter() {
    var events = Object.create(null);

    this.on = function (event, listener) {
        if (typeof events[event] !== "undefined")
            events[event].push(listener);
        else events[event] = [listener];
    };

    this.emit = function (event) {
        if (typeof events[event] !== "undefined") {
            var listeners = events[event];
            var length = listeners.length, index = length;
            var args = Array.prototype.slice.call(arguments, 1);

            while (index) {
                var listener = listeners[length - (index--)];
                listener.apply(this, args);
            }
        }
    };
}
{% endhighlight %}

A blueprint is used to extend an object via concatenation after it's created. [Eric Elliot](http://ericleads.com/ "JavaScript Applications, Web Architecture, Viral Marketing, Social Applications «  Eric Elliott – JavaScript Architect (A JavaScript Blog)") calls them [closure prototypes](http://ericleads.com/2013/02/fluent-javascript-three-different-kinds-of-prototypal-oo/ "Fluent JavaScript – Three Different Kinds of Prototypal OO «  Eric Elliott – JavaScript Architect (A JavaScript Blog)"). The code for `square` would be written as follows if we used the blueprint version of `eventEmitter` instead:

{% highlight javascript linenos %}
var square = rectangle.extend({
    create: function (side) {
        var self = rectangle.create.call(this, side, side);
        eventEmitter.call(self);
        return self;
    },
    resize: function (newSize) {
        var oldSize = this.width;
        this.width = this.height = newSize;
        this.emit("resize", oldSize, newSize);
    }
});

var sq = square.create(5);

sq.on("resize", function (oldSize, newSize) {
    alert("sq resized from " + oldSize + " to " + newSize + ".");
});

sq.resize(10);

alert(sq.area());
{% endhighlight %}

Blueprints are unique to JavaScript. They are a powerful feature. However they have their own disadvantages. The following table compares the advantages and disadvantages of mixins and blueprints:

<table>
    <tr>
        <th>Mixins</th>
        <th>Blueprints</th>
    </tr>
    <tr>
        <td>They are used to extend prototypes of objects. Hence objects share the same blueprint functions.</td>
        <td>They are used to extend newly created objects. Hence every object has its own set of blueprint functions.</td>
    </tr>
    <tr>
        <td>No private state due to lack of an encapsulating function.</td>
        <td>They are functions, and hence they encapsulate private state.</td>
    </tr>
    <tr>
        <td>They are static prototypes and can't be customized.</td>
        <td>They can be passed arguments to customize the object.</td>
    </tr>
</table>

### Fixing the instanceof Operator ###

Many JavaScript programmers would argue that using the prototypal pattern for inheritance is against the spirit of the language. They favor the constructor pattern because they believe that objects created using constructors are actual "instances", since the `instanceof` operator yields `true`. However, this [argument is moot](http://stackoverflow.com/a/8096017/783743 "JavaScript inheritance and the constructor property - Stack Overflow") because the `instanceof` operator can be [implemented in JavaScript](https://developer.mozilla.org/en-US/docs/JavaScript/Guide/Details_of_the_Object_Model#Determining_instance_relationships "Details of the object model - JavaScript | MDN") as follows:

{% highlight javascript linenos %}
Object.prototype.instanceof = function (prototype) {
    var object = this;

    do {
        if (object === prototype) return true;
        var object = Object.getPrototypeOf(object);
    } while (object);

    return false;
};
{% endhighlight %}

The `instanceof` function can now be used to test whether an object inherits from a prototype via delegation. For example:

{% highlight javascript %}
sq.instanceof(square);
{% endhighlight %}

However it's not possible to determine whether an object inherits from a prototype via concatenation as instance relationship information is lost. To solve this problem we save the references of all the clones of a prototype on the prototype itself, and use this information to determine whether an object is an instance of a prototype. This can be done by modifying the `extend` function as follows:

{% highlight javascript linenos %}
Object.prototype.extend = function () {
    var hasOwnProperty = Object.hasOwnProperty;
    var object = Object.create(this);
    var length = arguments.length;
    var index = length;

    while (index) {
        var extension = arguments[length - (index--)];

        for (var property in extension)
            if (property !== "clones" &&
                hasOwnProperty.call(extension, property) ||
                typeof object[property] === "undefined")
                    object[property] = extension[property];

        if (hasOwnProperty.call(extension, "clones"))
            extension.clones.unshift(object);
        else extension.clones = [object];
    }

    return object;
};
{% endhighlight %}

Objects that inherit from prototypes via concatenation form a tree of clones which starts from the root object and proceeds down to the leaf objects. A clone chain is a single path from the root object to a leaf object and it's similar to a reverse prototype chain. We use this information to determine whether an object inherits from a prototype via concatenation as follows:

{% highlight javascript linenos %}
Object.prototype.instanceof = function (prototype) {
    if (Object.hasOwnProperty.call(prototype, "clones"))
        var clones = prototype.clones;
    var object = this;

    do {
        if (object === prototype ||
            clones && clones.indexOf(object) >= 0)
                return true;

        var object = Object.getPrototypeOf(object);
    } while (object);

    return false;
};
{% endhighlight %}

The `instanceof` function can now be used to test whether an object inherits from a prototype via concatenation. For example:

{% highlight javascript %}
sq.instanceof(eventEmitter);
{% endhighlight %}

In the above program the `instanceof` function will return `true` if we use the mixin version of `eventEmitter`. However it will return `false` if we use the blueprint version of `eventEmitter`. To solve this problem we create a `blueprint` function which takes a blueprint as an argument, adds the `clones` property to it and returns a new blueprint which records its clones:

{% highlight javascript linenos %}
function blueprint(f) {
    var g = function () {
        f.apply(this, arguments);
        g.clones.unshift(this);
    };

    g.clones = [];

    return g;
};

var eventEmitter = blueprint(function () {
    var events = Object.create(null);

    this.on = function (event, listener) {
        if (typeof events[event] !== "undefined")
            events[event].push(listener);
        else events[event] = [listener];
    };

    this.emit = function (event) {
        if (typeof events[event] !== "undefined") {
            var listeners = events[event];
            var length = listeners.length, index = length;
            var args = Array.prototype.slice.call(arguments, 1);

            while (index) {
                var listener = listeners[length - (index--)];
                listener.apply(this, args);
            }
        }
    };
});
{% endhighlight %}

### Propagating Changes to Prototypes ###

The `clones` property in the previous example serves a dual purpose. It's used to determine whether an object inherits from a prototype via concatenation, and it's used to propagate changes made to a prototype to all its clones. The main advantage of prototypal inheritance over classical inheritance is that you can modify a prototype after it's created. To enable clones to inherit modifications made to a prototype we create a function called `define`:

{% highlight javascript linenos %}
Object.prototype.define = function (property, value) {
    this[property] = value;

    if (Object.hasOwnProperty.call(this, "clones")) {
        var clones = this.clones;
        var length = clones.length;

        while (length) {
            var clone = clones[--length];
            if (typeof clone[property] === "undefined")
                clone.define(property, value);
        }
    }
};
{% endhighlight %}

Now we can make modifications to a prototype and the changes will be reflected in all the clones. For example we can create an alias `addEventListener` for the `on` function of the `eventEmitter` mixin:

{% highlight javascript linenos %}
var square = rectangle.extend(eventEmitter, {
    create: function (side) {
        return rectangle.create.call(this, side, side);
    },
    resize: function (newSize) {
        var oldSize = this.width;
        this.width = this.height = newSize;
        this.emit("resize", oldSize, newSize);
    }
});

var sq = square.create(5);

eventEmitter.define("addEventListener", eventEmitter.on);

sq.addEventListener("resize", function (oldSize, newSize) {
    alert("sq resized from " + oldSize + " to " + newSize + ".");
});

sq.resize(10);

alert(sq.area());
{% endhighlight %}

Blueprints need some special attention. Although changes made to blueprints will be propagated to its clones, yet new clones of blueprints will not reflect these changes. Fortunately the solution to this problem is simple. We only need to make a minor modification to the `blueprint` function as follows, and any changes made to a blueprint created by `blueprint` will be reflected in all its clones.

{% highlight javascript linenos %}
function blueprint(f) {
    var g = function () {
        f.apply(this, arguments);
        g.clones.unshift(this);

        var hasOwnProperty = Object.hasOwnProperty;

        for (var property in g)
            if (property !== "clones" &&
                hasOwnProperty.call(g, property))
                    this[property] = g[property];
    };

    g.clones = [];

    return g;
};
{% endhighlight %}

## Conclusion ##

Congratulations. If you read through this entire blog post and understood what I wrote then you now know about prototypal inheritance and why it matters. Thank you for bearing with me. I sincerely hope this blog post was helpful to you. Prototypal inheritance is powerful and deserves more credit than it's given. However most people never see this because prototypal inheritance in JavaScript is masked by the constructor pattern.

## Related Articles ##

1. [Prototypal Inheritance in JavaScript](http://javascript.crockford.com/prototypal.html "Prototypal Inheritance")
2. [JavaScript inheritance and the constructor property](http://stackoverflow.com/a/8096017/783743 "JavaScript inheritance and the constructor property - Stack Overflow")
3. [Use of .apply() with 'new' operator. Is this possible?](http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible "javascript - Use of .apply() with 'new' operator. Is this possible? - Stack Overflow")
4. [Is JavaScript 's “new” Keyword Considered Harmful?](http://stackoverflow.com/questions/383402/is-javascript-s-new-keyword-considered-harmful "Is JavaScript 's “new” Keyword Considered Harmful? - Stack Overflow")
5. [Is JavaScript 's “new” Keyword Considered Harmful (Part 2)?](http://stackoverflow.com/questions/6374809/is-javascript-s-new-keyword-considered-harmful-part-2 "Is JavaScript 's “new” Keyword Considered Harmful (Part 2)? - Stack Overflow")
6. [Stop Using Constructor Functions in JavaScript](http://ericleads.com/2012/09/stop-using-constructor-functions-in-javascript/ "Stop Using Constructor Functions in JavaScript «  Eric Elliott – JavaScript Architect (A JavaScript Blog)")
7. [JavaScript Constructor Functions vs Factory Functions](http://ericleads.com/2013/01/javascript-constructor-functions-vs-factory-functions/ "JavaScript Constructor Functions vs Factory Functions «  Eric Elliott – JavaScript Architect (A JavaScript Blog)")
8. [Fluent JavaScript – Three Different Kinds of Prototypal OO](http://ericleads.com/2013/02/fluent-javascript-three-different-kinds-of-prototypal-oo/ "Fluent JavaScript – Three Different Kinds of Prototypal OO «  Eric Elliott – JavaScript Architect (A JavaScript Blog)")
9. [Details of the object model](https://developer.mozilla.org/en-US/docs/JavaScript/Guide/Details_of_the_Object_Model#Determining_instance_relationships "Details of the object model - JavaScript | MDN")
10. [Prototype-based programming](http://en.wikipedia.org/wiki/Prototype-based_programming "Prototype-based programming - Wikipedia, the free encyclopedia")
