---
title: Integrating Google reCaptcha v2 into a Salesforce Lightning Component
subtitle: 
date: "2019-06-12T22:12:03.284Z"
description: 
---

## What is Google reCAPTCHA?

[Google reCAPTCHA](https://developers.google.com/recaptcha/intro) is a service that protects your website from spam and abuse. It uses a risk analysis engine and adaptive challenges to keep automated software from engaging in abusive activities on your site. You'll often find them hanging around contact forms or protecting post comments.xx

Google reCAPTCHA is currently available in two different versions; the v2 flavor which displays a challenge widget on the page for the user to complete and v3 which does away with the familiar "I'm not a robot" check. It instead returns a score without user friction (for example, when the page loads).

With v2, you'll receive a token after the user interacts with the challenge widget and with v3, the token is generated when the page loads making the process hands off for the user (or bot, as it were).

In this post, I'll cover v2. In a future post, I'll go over how to integrate v3.

## What we want to accomplish

There are a few different examples online on how to achieve a v2 integration. In particular, [Miguel Duarte's post](http://www.rightitservices.com/resource-hub/item/1319-google-recaptcha-v2-in-salesforce-custom-lightning-component) was very helpful and it got me pretty far with my own solution.

But there are some additional things I needed to handle that weren't covered:

1. I needed to allow for a dynamic site key to be passed into the component. ie. not hardcoded.

2. I needed to check if the reCaptcha widget was completed or not on the frontend before we allowed the user to submit the form.

3. In addition to checking that we received a token on the frontend, I also needed to handle server side validation of that token against a secret key. This is to safeguard against HTTP client request forgery.

## Some Visualforce Page Background Info

It all starts with a Visualforce page. Using a Visualforce page is the only way to load a 3rd party script in this case (ie. the Google reCaptcha script) because we can't include JS sources into Lightning Components from an external server. Salesforce wants us to add it as a static resource instead.

There are a few reasons  why we wouldn't want to add a 3rd party script as a static resource though. It's because either a) the script is getting updated often and by tucking it away as a static resource, we won't have access to those updates without manually doing it ourselves, or b) the script requires that it's being served from their own servers (as a security feature on their part).

By using a Visualforce page, we can load our script through an iFrame and dynamically control its behavior within the form component without compromising on either of those requirements. So that's where we'll start.

## 1. Create a Visualforce page

The first step will be to create a Visualforce page.

**Required Salesforce settings**

There are a lot of super secret Salesforce settings that'll trip you up as a developer and these two got me pretty hard so don't skip them (they're worth ~3 hours of my life trying to figure them out).

After you create a new Visualforce page:

1. [Add profiles to have access to the Visualforce page](https://help.salesforce.com/articleView?id=pages_security_page_def.htm&type=5) you created for the reCaptcha.

2. (Community) Make the reCaptcha Visualforce page available to the community: `All Communities > Workspaces > Admin > Pages > Go to Force.com > Site Visualforce Pages > Edit `

Without completing these steps, Salesforce will block access to the Visualforce page and the reCaptcha widget won't load.

## The Visualforce page

Here is an example of my Visualforce page:

`gist:jamigibbs/41532bfd1533c843ab6ba7df8ea9da38`

There's a lot going on so a few things to point out:

You'll notice that we've setup a couple of variables that will eventually reference the `sitekey` and `hostUrl` value. The site key is what you'll receive from Google when you register for reCaptcha (along with a secret key) and here we're going to assign that value from a component setting to the iFrame.
  
The `hostUrl` will be what you've passed in as your approved host as an additional layer of security. This will allow us to only act on messages received from an approved host.

`gist:jamigibbs/a6830df4318e08680aca2a1500597740`

The `onloadCallback` function will be executed when the Google script is loaded allowing for the widget to render on the page.

Within that callback, you'll notice another callback; `grecaptchaRenderCallback`. Whenever the user has completed their reCaptcha challenge, it's that function that will get called. In this situation, we're using it to post a message to the component to let it know that the challenge was completed. This will help us with the 2nd requirement I listed previously:

> 2. We needed to check if the reCaptcha widget was completed or not on the frontend before we allowed the user to submit the form.

Next we need to add the actual script into the page header and pass the site key:

`gist:jamigibbs/70050c6fde78efc4c1e2ec1e571a41fb`

We're listening for a message event coming from our component named `CAPTCHA-SITEKEY` (you can name these events whatever you like. Just make sure you're referencing the same names on each end of the event.) and it's this event type that will contain the site key and hostUrl that we've set within the component settings.

The reason we're loading the script manually into the header like this is because we have to wait for the component to render the iframe before we can send it the api key. If we don't do that, then the script will load before we can pass it the key and then then reCaptcha widget will fail because of a race condition.

---

This last part is simply sending back to the component a flag to let us know if a token is available or not. A token will be available if the reCaptcha form has been completed.

`gist:jamigibbs/7ffda1db5abeb56744a827793a47f48b`


## 2. Add an iframe to the Lightning Component

Below is a simple form example with two input fields for Name and Email. The form also includes a submit button, an error message element, and below that is the iframe we're going to use to display the reCaptcha widget:

`gist:jamigibbs/28cf7e014b7cb88190c84c58b9330980`

The important thing to mention here is that the iframe src must match the path and name to your Visualforce page: `/apex/VFrecaptchaPage`. 

If you're loading the page in a community with a custom namespace, you must append that community name to the src. For example `/mycommunityname/apex/VFrecaptchaPage`.

## 3. Create the Renderer file in the component

This is another place that we diverge from other examples online. You don't normally need a renderer file for your lighting component but it's useful if you need to interact with the DOM tree after the framework has inserted all of its DOM elements (the `afterRender` lifecycle). 

In our situation, we want to pass the site key to the reCaptcha script only after the iframe is available (and loaded). Otherwise we'll find that the script will fire before it has access to the key:

`gist:jamigibbs/a8f5416718ac320fe3c970c0150216d9`

We're getting a reference to the iframe element and posting a message to it once it's loaded. The event message will include our dynamic site key which is set in the component attribute settings in this example (although there are other ways you can store and retrieve a key like in custom metadata. Do whatever makes the most sense for your project).

## 4. Add an event listener to the component's controller

In the component's controller, we'll need to add an event listener when the component initializes. 
The `init` method is the perfect place to add those:

`gist:jamigibbs/643b5da7bfa1073fcd11cfaa738d5d47`

The controller is also a great place to add a method to handle the submit click event and I've added it above as `submitForm`. When the user clicks submit, we want to make sure that:

1. The form is valid.
2. The reCaptcha has completed.

We check that the reCaptcha was completed by posting a message to the iframe with `alohaCallingCAPTCHA` where it'll respond back with the results of the token.

## 5. Add a verification callout method to the component's helper file

Once we have a token available, we'll need to pass that to our Apex controller where a server side check will happen against the secret key that Google provided us when we registered.

You'll see this being called in the controller above in line 38 after we've collected a token:

```
helper.doRecaptchaVerification(component, event, helper, token);
```

The results of this check will be a boolean value and this will tell us if we should allow the user to continue submitting the form or if we should display an error message instead. 

Our helper method is just a standard Apex call and it looks something like this where `c.verifyResponse` is the controller method that will be making the server side verification:

`gist:jamigibbs/82063f603647d59d607efb34ee9312be`

## 6. Server side verification

The last step is to create an Apex method that will take the token generated on the frontend and check it against the secret key. In the example above, this is called `c.verifyResponse`. The result of this check should be a success boolean that we can respond to on the frontend.

If we get a successful verification, we can allow the form to be submitted. If we get an unsuccessful verification, we can display an error message and deny the user from submitting the form.

For more information on verifying the user's response from the backend, see the [Server Side Validation](https://developers.google.com/recaptcha/docs/verify) docs.

## Conclusion

Thanks for reading! Hopefully this example will help others who have fallen into the same traps I did. You'll likely need to make adjustments based on your project like making a proper check against a host url and setting api key attributes but this should be a great start for your next reCaptcha integrated form component.

Stay tuned for a couple of follow-up posts as well including: 

[ ] - How to integrate reCapatcha v3 into a Lightning Component.

[ ] - reCaptcha v2 & v3 as Lightning Web Components.

### Other Helpful Resources

- [Google reCAPTCHA developer documentation](https://developers.google.com/recaptcha/intro)
- [Communicating between Lightning Components and Visualforce Pages](https://developer.salesforce.com/blogs/developer-relations/2017/01/lightning-visualforce-communication.html)
- [window.postMessage() API documentation](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)