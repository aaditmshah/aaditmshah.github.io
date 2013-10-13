---
layout: post
title: Abstracting out Functions
categories: [tutorial, abstraction, object-oriented, functional, polymorphism]
tags: [JavaScript, Rule of Three]
published: false
---
Last time I wrote about [prototypal inheritance in JavaScript](/why-prototypal-inheritance-matters "Aadit M Shah | Why Prototypal Inheritance Matters"). I explained that it's used to bridge the gap between object-oriented and functional programming. This time I'll demonstrate how to write code that leverages the benefits of both these programming paradigms effectively. I'll explain how to develop an intuition for recognizing patterns in JavaScript, and claim mastery over the language by abstracting them out.

Abstraction is the most important principle of programming. It's also the most difficult concept to master. Nevertheless there are hardly any tutorials on abstraction. Nobody teaches you how to recognize and abstract out patterns in your code. Programmers are expected to know how to do it. Most people believe that the intuition for abstracting out patterns is innate - something that you either lack, or possess. This is false.

__Contents__

1. [An Appetizer for Abstraction](#an_appetizer_for_abstraction)
2. [Generalization: From Concrete to Abstract](#generalization_from_concrete_to_abstract)
3. [The Ws of Abstraction](#the_ws_of_abstraction)
   1. [What to Abstract Out?](#what_to_abstract_out)
   2. [When to Abstract Out?](#when_to_abstract_out)
   3. [Why to Abstract Out?](#why_to_abstract_out)

## An Appetizer for Abstraction ##

I usually like to begin a topic by describing a problem, providing a crude solution to it and then refining the solution in incremental steps. However for this article I decided that it would be better to demonstrate the power of abstraction in the beginning, rather than allowing the reader to discover it by themselves towards the end. You have [Simon Oberhammer](https://github.com/oberhamsi "oberhamsi (Simon Oberhammer)") to [thank for that](https://twitter.com/obrhms/status/341090350934417408 "Twitter / obrhms: @zcombinator  it's good (the ..."). So let's start with somthing concrete:

{% highlight javascript %}
Array.prototype.slice.call(arguments);
{% endhighlight %}

The [`slice`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice "Array slice method - JavaScript | MDN") method is used to create a _one level deep_ copy of a slice of an array. The [`arguments`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions_and_function_scope/arguments "arguments - JavaScript | MDN") object of a function is like an array. However it's not a real array. Hence the `slice` method can be used to copy the elements of `arguments` and return a real array. This is accomplished by calling `slice` with its [`this`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this "this - JavaScript | MDN") pointer set to `arguments` using the method [`call`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call "Function.prototype.call - JavaScript | MDN") as shown above.

Copying a slice of an array or an array-like object is such a common operation that it would be nice to have an easier way to do so - `Array.prototype.slice.call` is too long. In addition it doesn't really tell the reader what it does. Hence we wrap it in a function, and use `call` and `apply` together to forward the arguments passed to the wrapper function to `slice`. This pattern is documented in the [JavaScript Garden](http://bonsaiden.github.io/JavaScript-Garden/ "JavaScript Garden") as a [fast, unbound wrapper](http://bonsaiden.github.io/JavaScript-Garden/#function.arguments "JavaScript Garden"):

{% highlight javascript linenos %}
function arrayFrom() {
    return Function.prototype.call.apply(
        Array.prototype.slice, arguments);
}

arrayFrom(arguments);
{% endhighlight %}

The `arrayFrom` function is equivalent to `Array.prototype.slice.call`, and it can be [proved rigorously](http://stackoverflow.com/a/13004493/783743 "call and apply in javascript - Stack Overflow"). The advantage of using `arrayFrom` is that it's less verbose and more descriptive. What's really interesting however is that this is not the best solution. [Eric Elliot](http://ericleads.com/ "JavaScript Applications, Web Architecture, Viral Marketing, Social Applications «  Eric Elliott – JavaScript Architect (A JavaScript Blog)") discovered a [better solution](http://ericleads.com/2011/06/dealing-with-array-like-objects-array-prototype-slice-call-shortcut/ "Dealing with Array-Like Objects – Array.prototype.slice.call shortcut «  Eric Elliott &#8211; JavaScript Architect (A JavaScript Blog)") back in 2011 by recognizing that unbound wrappers that use `call.apply` are equivalent to `call.bind`:

{% highlight javascript %}
var arrayFrom = Function.prototype.call.bind(Array.prototype.slice);
{% endhighlight %}

By binding `Array.prototype.slice` to the method `call` we made it easier to copy a slice of an array-like object. However that's not the end. The definition of the `arrayFrom` function has a pattern that can be abstracted out. Can you see it?

{% highlight javascript linenos %}
function callable(func) {
    return Function.prototype.call.bind(func);
}

var arrayFrom = callable(Array.prototype.slice);
{% endhighlight %}

From the above example we see that `arrayFrom` is actually a specific function belonging to a family of `callable` functions. Hence by recognizing the general pattern in the `arrayFrom` function we were able to abstract it out as the `callable` function. This function takes a function `func` as an argument and returns a function equivalent to `func.call`. Hence the name `callable`. As [Douglas Hofstadter](http://en.wikipedia.org/wiki/Douglas_Hofstadter "Douglas Hofstadter - Wikipedia, the free encyclopedia") stated in his [famous book](http://en.wikipedia.org/wiki/Gödel,_Escher,_Bach "Gödel, Escher, Bach - Wikipedia, the free encyclopedia"):

> The most specific event can serve as a general example of a class of events.

What's even more interesting is that the `callable` function also has a pattern that can be abstracted out. However it's a little more difficult to recognize. Can you see it? [Don't panic](http://best-diving.org/images/Diving-Medicine-Wall/panic%20in%20water.jpg "Don't Panic") if you can't. I'll show you how to develop an intuition to recognize patterns in your code.

{% highlight javascript %}
var callable = Function.prototype.bind.bind(Function.prototype.call);
{% endhighlight %}

Now can you see it? The `callable` function is actually just `call.bind`. Hence we define `callable` by binding `call` to `bind`. By doing so the pattern in `callable` becomes more apparent:

{% highlight javascript linenos %}
var bind = Function.prototype.bind;
var call = Function.prototype.call;
var bindable = bind.bind(bind);
var callable = bindable(call);
{% endhighlight %}

Just like `arrayFrom` is a specific function belonging to a family of `callable` functions, `callable` too is a specific function belonging to a family of `bindable` functions. The `bindable` function is actually just `bind.bind`. It takes a function `func` as an argument and returns a function equivalent to `func.bind`. Hence the name `bindable`. In fact `bindable` itself can be defined as `bindable(bind)`.

## Generalization: From Concrete to Abstract ##

Last year [Bret Victor](http://worrydream.com/ "Bret Victor, beast of burden") explained in his famous blog post about [learnable programming](http://worrydream.com/LearnableProgramming/ "Learnable Programming") that the environment should allow the learner to [create by abstracting](http://worrydream.com/LearnableProgramming/#abstract "Learnable Programming") (i.e. start concrete, then generalize). Humans best understand what they perceive. Hence abstract ideas are difficult to understand. Thus I want to demonstrate how to take a concrete idea and abstract out more general ideas from it.

Generalization is a common theme in functional languages like Haskell, because functions are the main tool for abstraction in a programmer's toolbox. Abstraction is about taking a concrete idea and deriving a more general idea from it. In terms of programming these general ideas are realized as functions. In this sense a function is a template which can be customized for specific use cases. For example, consider:

{% highlight javascript linenos %}
var primes = [2, 3, 5, 7];
for (var i = 0; i < primes.length; i++)
    console.log(Math.pow(2, primes[i]) - 1);
{% endhighlight %}

The above code iterates through the first four prime numbers and displays their corresponding [Mersenne prime](http://en.wikipedia.org/wiki/Mersenne_prime "Mersenne prime - Wikipedia, the free encyclopedia") numbers. This is a concrete example. We can abstract out more general functions from this code. I'll explain how to do so in logical steps.

{% highlight javascript linenos %}
var primes = [2, 3, 5, 7];

function func() {
    console.log(Math.pow(2, primes[i]) - 1);
}

for (var i = 0; i < primes.length; i++) func();
{% endhighlight %}

The first step is to wrap the part of the code you want to generalize in a function, and call it. A function is a template of a [general idea](http://www.youtube.com/watch?v=fmAWIDI4ZgY "General Knowledge - YouTube"). Hence wrapping your code in a function provides a visual representation of _how you think_ in order to abstract out patterns in your code.

{% highlight javascript linenos %}
var primes = [2, 3, 5, 7];

function func(prime) {
    console.log(Math.pow(2, prime) - 1);
}

for (var i = 0; i < primes.length; i++) func(primes[i]);
{% endhighlight %}

The next step is to make your function customizable. In order to do so you pick a variable within your function and make it an argument of the function instead. For example, in the above program we made the variable `primes[i]` an argument of `func`.

{% highlight javascript linenos %}
var primes = [2, 3, 5, 7];

function display(prime) {
    console.log(Math.pow(2, prime) - 1);
}

for (var i = 0; i < primes.length; i++) display(primes[i]);
{% endhighlight %}

Finally you rename your function and its arguments to something more suitable if necessary. In addition don't forget to change the variable names within the function itself. Congratulations. You just abstracted out a pattern in your code. Nevertheless the above code can be generalized even further. So let's repeat the above steps once more. First we wrap the part of the code we want to generalize in a function as follows:

{% highlight javascript linenos %}
function func() {
    var primes = [2, 3, 5, 7];

    function display(prime) {
        console.log(Math.pow(2, prime) - 1);
    }

    for (var i = 0; i < primes.length; i++) display(primes[i]);
}

func();
{% endhighlight %}

Next we make the function customizable by picking variables within the function and making them arguments of the function instead. For example, in the above program we'll make `primes` and `display` both arguments of `func` as shown below:

{% highlight javascript linenos %}
function func(primes, display) {
    for (var i = 0; i < primes.length; i++) display(primes[i]);
}

func([2, 3, 5, 7], function (prime) {
    console.log(Math.pow(2, prime) - 1);
});
{% endhighlight %}

Finally we rename the function and its arguments to something more suitable. Again, don't forget to change the variable names within the function itself. The function we just abstracted out is in fact the [`forEach`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach "Array.forEach - JavaScript | MDN") function (albeit a simpler version).

{% highlight javascript linenos %}
function forEach(array, callback) {
    for (var i = 0; i < array.length; i++) callback(array[i]);
}

forEach([2, 3, 5, 7], function (prime) {
    console.log(Math.pow(2, prime) - 1);
});
{% endhighlight %}

## The Ws of Abstraction ##

Now that you have a basic understanding of _how_ to abstract out functions let's get down to the [_what_, _when_ and _why_](https://en.wikipedia.org/wiki/Five_Ws "Five Ws - Wikipedia, the free encyclopedia") of abstraction. It seems a little silly for me to teach this topic simply because as human beings we constantly find patterns in everything - either consciously, subconsciously or unconsciously. Abstraction comes to us as naturally as breathing. We can not prevent ourselves from abstracting out patterns.

### What to Abstract Out? ###

When I talk about abstraction what do you envision yourself doing? What is it precisely that you're abstracting out? Until now I abstractly defined abstraction as the process of recognizing patterns and abstracting them out. 

### When to Abstract Out? ###

### Why to Abstract Out? ###