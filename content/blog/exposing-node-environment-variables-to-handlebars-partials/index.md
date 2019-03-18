---
title: Exposing Node Environment Variable to Handlebars Partials
subtitle: 
date: "2018-09-17T22:12:03.284Z"
description: 
---

The templating engine we use heavily in my work’s development team is [Handlebars](https://handlebarsjs.com/). Originally a fork of Mustache, Handlebars is fundamentally just a complier that takes in HTML and Handlebars expressions, compiles them to Javascript, and then inserts the resulting string into the relevant place on your HTML page.

Why bother using Handlebars if you can just write standard HTML then? I personally enjoy working with a templating engine because it allows me to create modular HTML that I can organize and reuse much easier. But more importantly, it decouples the logic (JavaScript) from HTML which can become difficult to read and manage so by using a logic-less templating engine like Handlebars, you can focus on just the HTML.

## The Challenge

An interesting scenario brought up in our development team was how we could conditionally display a Handlebars partial based on Node environment (production vs development). A scenario where this might be useful is when a partial displayed some kind of Google tracking or other production specific analytics. We wouldn’t need to load that functionality in our dev environment so it might make sense to only compile those partials in production.

There are different ways you could set your Node environment variable but generally this would happen when starting up the environment. For example:

```
"start-dev": "NODE_ENV='development' npm run dev",
"dev": "gulp && nodemon server.js",
```

One of the things I mentioned earlier about Handlebars is that it’s logic-less. This means that it doesn’t have any explicit control flow statements like `for` loops or `if` conditionals. But it does allow looping and conditionals using built-in helpers. Here’s a simple example of a conditional:

`gist:jamigibbs/5cdb4164e5f309ef21ffdd5afb34f777`

With that in mind, I started thinking about how we could pass our current Node environment variable (in our case either “production” or “development”) to a partial.

## A Solution

One of the major ways that Handlebars differs from it’s predecessor Mustache is that it allows us to write custom helper methods that we can use with our partials.

With a custom helper we can add any type of Javascript logic we’d like but in this case, all I wanted to do was return a boolean value that told us if we were currently in a production environment or not. Since we’ve already set our `NODE_ENV` key value at start-up, we could register this relatively simple helper function that checks the value of that value:

`gist:jamigibbs/58073b3741d0e8d4893376c6752ee0b5`

And applying our custom `prod` helper against the production only partial looked like this:

`gist:jamigibbs/8ca41dd53cf2d68d2a494e1f2ebeaf6b`

But an interesting thing happened when I tested this function. The `#if` conditional was not evaluating the returned value of the custom helper. It was always evaluating as `false`.

I theorized that either the values from our custom helper function weren’t returning as booleans, or, the built-in `#if` helper wasn’t evaluating the result of `prod` at all.

Testing the first theory, I created a second helper function to check the value’s `typeof` and confirmed it was outputting correctly:

`gist:jamigibbs/4494dfd6fca93e9f44af3f11642ff990`

For my second theory, I started experimenting with [subexpressions](http://handlebarsjs.com/expressions.html#subexpressions) who’s purpose is to pass the results of one helper function to another. Take for example, the following using two helper functions:

`gist:jamigibbs/1b22646133f38880919eb7d721cfbe6a`

`gist:jamigibbs/ed2ae72bab2364ded8964ebd2140a388`

And this results in a string:

```
Hello, Jami. How are you?
```

Ok, so not super obvious how that’s useful in our case. The documentation doesn’t explicitly say this but my hunch was that I could use my custom `prod` helper passed as a subexpression using the parenthesis `( )` syntax which would then be evaluated by the built-in `#if` helper as a boolean value. How did I know this? I really didn’t! It was just a hunch that I was dealing with two helper functions that needed to talk to each other. So I gave it a shot and updated my partial:

`gist:jamigibbs/72ad4c3479bb7ebda2955afb014682ad`

Now the conditional was evaluating the boolean value correctly! So when our Node environment variable is set to “production”, our view is rendering as:

```
Seen only in production
This is some example text
```

And when it’s set to something other than “production” it doesn’t render the partial which is exactly what we were trying to achieve.

## Conclusion

The biggest hurdle here was that it wasn’t obvious how built-in helpers, custom helpers, and subexpressions played together. The Handlebars documentation don’t explicitly talk about how to handle boolean values passed to built-in helpers and it took some experimenting to figure out how to make that possible in this situation.