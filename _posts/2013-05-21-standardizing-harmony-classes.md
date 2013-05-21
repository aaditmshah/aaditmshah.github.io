---
layout: post
title: Standardizing Harmony Classes
categories: [proposal, specifications]
tags: [ECMAScript, Design pattern, Wadler's Law]
---
Prototypal Inheritance in JavaScript has always been a [puzzle](http://zeekat.nl/articles/constructors-considered-mildly-confusing.html "Constructors Considered Mildly Confusing") for most programmers. Especially for those who come from a classical inheritance background. The problem is that classes work out of the box. You don't need to manually set up `prototype` chains or worry about overriding the `constructor` property. Hence ECMAScript Harmony classes are a promising new feature.

Don't get me wrong. Like every other seasoned JavaScript programmer I love prototypal inheritance. Nevertheless I agree that it's difficult. I feel really stupid saying that because personally I find it dead simple. However, for a person who has only worked with classes, setting up prototype chains is a daunting task. I was lucky to have studied prototypal inheritance before classical inheritance.

This is what I imagine a programmer from a classical inheritance background might say about prototypal inheritance in JavaScript:

> JavaScript has no classes! Why? How am I supposed to create objects of a certain type? I don't want to manually create a new object literal for everything. A function can be used as a constructor! Shouldn't a constructor belong to a class? Everything must be inside the constructor! Wouldn't that make the constructor... big?
> 
> Why do I need to assign an instance of my base class - erm, constructor - to the `prototype` property of my derived constructor? Why is the `prototype` property so special? Why does inheritance have to be so complicated? Why does JavaScript have to be a ***** and use prototypes instead of classes like every other language does?

Indeed, why does JavaScript need prototypal inheritance anyway? Prototypes are commonly used for two purposes - to make one function inherit from another function, and to add new methods to all the instances of a function ([monkey patching](http://en.wikipedia.org/wiki/Monkey_patch "Monkey patch - Wikipedia, the free encyclopedia")). Prototypal inheritance failed JavaScript in the first case - else we wouldn't be asking for classes; and extending any `prototype` beside your own is considered bad practice.

Seriously, ask yourself - does JavaScript really need prototypes? Most of the time it doesn't. In fact more than 90% of the programs written in JavaScript are better off using classical inheritance. The rest of the programs do not need inheritance at all. Again I'm not criticizing prototypal inheritance. I'm simply saying that prototypal inheritance is usually not required.

That being said prototypal inheritance is an integral part of JavaScript. It's what makes everything work. You see JavaScript is both a functional and an object oriented programming language, and these two paradigms don't mix well. For [example](http://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible "javascript - Use of .apply() with 'new' operator. Is this possible? - Stack Overflow") you can't use `new` (an OOP concept) and `apply` (a functional concept) together. However since JavaScript has prototypal inheritance you can [workaround](http://stackoverflow.com/a/1608546/783743 "javascript - Use of .apply() with 'new' operator. Is this possible? - Stack Overflow") it. This would be impossible to accomplish if JavaScript only had classical inheritance. More on that later.

## Classical Inheritance in JavaScript ##

Wow. That was a long introduction. Are you still with me? Good. Alright, so now that we know why we need classes let's get into the nitty-gritty details. First things first - ECMAScript Harmony will have classes but it will still be a prototypal language. How? It's because you can simulate classical inheritance using prototypal inheritance. Hence classes will just be syntactic sugar for their prototypal equivalents.

Did you know that classical inheritance is actually a subset of prototypal inheritance? That's the reason you can simulate classical inheritance in JavaScript but you can't simulate prototypal inheritance in Java. It's also the reason programmers from a classical inheritance background find prototypal inheritance difficult, but programmers from a prototypal inheritance background find classical inheritance easy.

How do you simulate classical inheritance in JavaScript you ask? Take a look yourself ([original script](https://github.com/javascript/augment/blob/master/lib/augment.js "augment/lib/augment.js at master · javascript/augment")). It should take you just a minute to understand:

{% highlight javascript linenos %}
Function.prototype.augment = function (body) {
    var base = this.prototype;
    var prototype = Object.create(base);
    body.apply(prototype, Array.from(arguments, 1).concat(base));
    if (Object.ownPropertyOf(prototype, "constructor")) {
        var constructor = prototype.constructor;
        constructor.prototype = prototype;
        return constructor;
    } return prototype;
};
{% endhighlight %}

That's it. Classical inheritance in 8 lines of code. Don't believe me? Let's see some examples:

{% highlight javascript linenos %}
var Rectangle = Object.augment(function () {
    this.constructor = function (width, height) {
        this.height = height;
        this.width = width;
    };

    this.area = function () {
        return this.width * this.height;
    };
});
{% endhighlight %}

That looks a lot like a class doesn't it? In fact if you take away all the syntactic noise you'll be left with this:

{% highlight javascript linenos %}
class Rectangle {
    constructor(width, height) {
        this.height = height;
        this.width = width;
    }

    area() {
        return this.width * this.height;
    }
}
{% endhighlight %}

Here we omitted `extends Object` as a class extends `Object` by default. Let's see an example of inheritance using this pattern:

{% highlight javascript linenos %}
var Square = Rectangle.augment(function (base) {
    this.constructor = function (side) {
        base.constructor.call(this, side, side);
    };
});
{% endhighlight %}

Again, without the syntactic noise the above program would look like this:

{% highlight javascript linenos %}
class Square extends Rectangle {
    constructor(side) {
        super(side, side);
    }
}
{% endhighlight %}

The moral of the story is that JavaScript already has classical inheritance. You can use classical inheritance in JavaScript right now without having to wait for implementations to support classes. ECMAScript Harmony classes are just syntactic sugar for the above code. This syntactic sugar is called [maximally minimal classes](http://wiki.ecmascript.org/doku.php?id=strawman:maximally_minimal_classes "strawman:maximally_minimal_classes [ES Wiki]"). It's just a fancy name for the syntax of the class, so don't panic.

## ECMAScript Harmony Classes ##

Wadler's Law claims that:

> In any language design, the total time spent discussing a feature in this list is proportional to two raised to the power of its position.
> 
>     0. Semantics
>     1. Syntax
>     2. Lexical syntax
>     3. Lexical syntax of comments

According to this law, TC39 (the ECMAScript design committee) must have spent twice as much time discussing the syntax of classes in ECMAScript Harmony rather than its semantics. This is evident both in the history and the specifications of Harmony classes. Unfortunately since this law holds true we're left with a really nice syntax for classes but really bad semantics.

See, the original syntax for Harmony classes (simply called [classes](http://wiki.ecmascript.org/doku.php?id=harmony:classes "harmony:classes [ES Wiki]")) was considered too verbose. Hence they came up with a new syntax and called it [minimal classes](http://wiki.ecmascript.org/doku.php?id=strawman:minimal_classes "strawman:minimal_classes [ES Wiki]"). Being yet dissatisfied they simplified the syntax even further, calling it [maximally minimal classes](http://wiki.ecmascript.org/doku.php?id=strawman:maximally_minimal_classes "strawman:maximally_minimal_classes [ES Wiki]"). Fortunately they ran out of superlatives so I believe that this is the final syntax. Let's cross our fingers and pray it doesn't change.

Unfortunately they spent too much time deciding on the syntax of the language and too little time on the actual semantics. Hence although we have _maximally mimimal syntax_ yet we have _maximally inconsistent semantics_. Semantics is much more important than syntax. Ask any LISP programmer. JavaScript semantics is much more important because it must be backwards compatible and easy to read, write and understand.

## New Semantics for Maximally Minimal Classes ##

I believe the semantics for maximally mimimal classes are derived from [CoffeeScript](http://coffeescript.org/#classes "CoffeeScript"). That's disturbing. CoffeeScript is a nice designer language, but the JavaScript it generates is horrendous. No offense Jeremy but do generated classes really need to look like they do below. Personally I find this to be a very flaky solution, and reading so many underscores results in some serious brain-damage.

{% highlight javascript linenos %}
var Rectangle, Square,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) {
    for (var key in parent)
      if (__hasProp.call(parent, key))
        child[key] = parent[key];

    function ctor() {
      this.constructor = child;
    }

    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
    child.__super__ = parent.prototype;
    return child;
  };

Rectangle = (function() {
  function Rectangle(width, height) {
    this.width = width;
    this.height = height;
  }

  Rectangle.prototype.area = function() {
    return this.width * this.height;
  };

  return Rectangle;

})();

Square = (function(_super) {
  __extends(Square, _super);

  function Square(side) {
    Square.__super__.constructor.call(this, side, side);
  }

  return Square;

})(Rectangle);
{% endhighlight %}

I guess the `Rectangle` class is okay and the `Square` class can be better, but what's with the `__extends` function? Why are you copying the static properties of the `parent` class to the `child` class? What if I add a static property to the `parent` class after I create the `child` class? Isn't it reasonable to expect the `child` class to have the newly defined property? Why don't you use `Object.create`? Wouldn't it be better to return `__super__` from `__extends`? Here's a nice glitch:

{% highlight coffeescript linenos %}
class Rectangle
    constructor: (@width, @height) ->
    area: -> @width * @height

class Square extends Rectangle
    constructor: (side) -> super side, side
    @__super__ = null
{% endhighlight %}

Now it's reasonable to expect the above code to work but it doesn't. The reason is that the `super` keyword above translates to `Square.__super__` which I'm explicitly setting to `null`. CoffeeScript reserves `__hasProp` and `__extends`, but no such restriction is placed upon `__super__`. As a programmer however I should be allowed to use them all. That's a reasonable expectation.

This is what happens when the syntax of a language is given more importance than the semantics. ECMAScript Harmony is going down a similar path. To remedy this problem I propose we use a different semantics for maximally minimal classes. I propose we implement the [augment](https://github.com/javascript/augment "javascript/augment") method natively in every browser so that the translation of class syntax to semantics is simply a one-to-one mapping.

Ten practical advantages of using `augment` semantics over CoffeeScript semantics:

1. The resulting code is easier to read, write and understand.
2. The only function required is `Function.prototype.augment`.
3. No distinction between the constructor and other functions.
4. The `augment` method can also be used to create singletons.
5. The `augment` method can be used to implement the module pattern.
6. Easier to translate the class syntax to its equivalent semantics.
7. Every function is automatically collected on the `prototype` object.
8. No name clashes as the base class `prototype` can be given any name.
9. The `augment` method is [proven](http://jsperf.com/oop-benchmark/118 "JavaScript Object Oriented Libraries Benchmark · jsPerf") to be fast. Especially when implemented natively.
10. Fully backwards compatible via my own [augment](https://github.com/javascript/augment "javascript/augment") library.

## Conclusion ##

There are lots of classical JavaScript inheritance patterns out there - John Resig's [simple JavaScript inheritance](http://ejohn.org/blog/simple-javascript-inheritance/ "John Resig -   Simple JavaScript Inheritance") pattern, [JSFace](https://github.com/tnhu/jsface "tnhu/jsface"), [Classy](http://classy.pocoo.org/ "Classy Classes for JavaScript"), etc. However I believe `augment` trumps them all - perhaps not in features but definitely in design. It's small, simple, elegant and just what is required - nothing more and nothing less. All this wrapped up in a single function.

Perhaps semantics might be of little concern to you. Especially when the semantics of classes will be implemented natively. However backwards compatibility is important and `augment` allows for one-to-one mapping of Harmony classes to JavaScript that can be used today. In addition having a standard way to implement classical inheritance right now will definitely help people who're struggling with prototypal inheritance.

If you believe that `augment` should be implemented natively for the benefit of all then please comment to make a difference.
