---
title: Getting Sass Running Quickly In Your React + Webpack Project
subtitle: 
date: "2018-11-04T22:12:03.284Z"
description: 
---

There are a lot of resources that explain how to add Sass to a React project using Webpack but many of them are complicated, assume a particular file structure, or are maybe focusing too much on optimization from the start. I found myself going round-and-round a few of those resources and all I was really looking for was the easiest possible way to get Sass running in a quick side project I was working on.

There’s just a few simple steps:

1. **Install required NPM packages**

There are three packages you’ll need to install for us to compile our sass file(s):

`npm install style-loader css-loader sass-loader --save-dev`

2. **Add the scss rule to Webpack**

In your `webpack.config.js` file, add a module rule for compiling sass with the previously installed packages:

```
{
 test: /\.scss$/,
 use: [ 'style-loader', 'css-loader', 'sass-loader' ]
}
```

Your webpack config file might look a little different but here’s mine as an example. You can see that I’ve added a new scss test under the module key:

`gist:jamigibbs/5be58713efb2a2812f3a57eb4a24b4bb`

3. **Create your sass files and import them in components.**

In my situation, I just created a parent `styles` folder within my app and added a main scss file where I could put global styles:

`app/styles/main.scss`

Example app file structure:

```
.
├── client
|   └── index.js
├── public
├── script
├── server
├── styles
|   └── main.scss
├── package.json
└── webpack.config.js
```

For the global style, add your main scss stylesheet to the top of your project’s entry point. In my case, that was `client/index.js`. When we do this, those styles will get loaded down through the application components.

`import '..styles/main.scss'`

For individual components, create separate stylesheets and import it at the top of the component:

```
.
├── client
|   └── index.js
|   └── components
|       └── navbar.js
|       └── navbar.scss
├── public
├── script
├── server
├── styles
|   └── main.scss
├── package.json
└── webpack.config.js
```

`gist:jamigibbs/3c6a03ad8d514866eeec5d3c3271d137`

That’s it!

## Conclusion

Is there a more efficient way of doing this? Probably. Are there other opinions on how to structure your app or optimize the stylesheets? Likely. But if you’re just trying to put together a quick POC or have a fun side project you’re working on, these are three easy steps to get Sass, Webpack, and React working together quickly so you can keep moving forward with your project.