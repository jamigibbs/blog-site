---
title: "Getting User Profile Images From a Feed Item SOQL Query"
subtitle:
date: "2020-05-21T01:12:03.284Z"
description: 
---

I found myself building a custom feed item list that required displaying the user's profile image from the Chatter feed. This seemed like an easy task because normally you can get the profile image by querying on a User lookup. But of course sometimes the things that you think will be easy turn out to be much more complicated.

My first attempts looked like this. First trying to access it from the `Parent` field:

`gist:jamigibbs/ac0307c1a7ec07c1b97a024e81cd3eaa`

Next trying to access it from `InsertedBy` lookup:

`gist:jamigibbs/814218e572aa8d7f6d9c0e737e63ecf1`

All of these fail with an error saying that it "Didn't understand relationship" to the image. :thinking:

### Polymorphic Fields

What I learned is that FeedItem could contain [polymorphic fields](https://developer.salesforce.com/docs/atlas.en-us.soql_sosl.meta/soql_sosl/sforce_api_calls_soql_relationships_and_polymorph_keys.htm) which means that it could potentially be one of several different types of objects and we would need to handle the SOQL query differently based on the object we wanted to reference.

As of API version 46.0, you can use the `TYPEOF` expression in SOQL to control which field type you want to query in a polymorphic relationship. After reviewing [using TYPEOF](https://developer.salesforce.com/docs/atlas.en-us.soql_sosl.meta/soql_sosl/sforce_api_calls_soql_relationships_and_polymorph_keys.htm#soql_relationships_using_typeof_title), I updated my query to only lookup the user profile image when `InsertedBy` is type `User` like this:

`gist:jamigibbs/c43830c3b77fd42de58108c4ee1f53c4`

And it worked! Now I finally have a list of feed items that include the user's profile image. Hopefully that will help someone else who's running into the same issue. :thumbsup: