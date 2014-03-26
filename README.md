# Random Acts Of Kindness

RAOK ("Are-Ay-Oh-Kay") lets you ***request help*** with any task 
and ***find people near you that need help***.

## WHY 

- Anyone should be able to **get help with** ***anything***.
- We want to **use a spare minute to help someone in need**.

## PAIN

> Veronika was moving house and could have used some help
> carying her heavy wardrobe up a flight of stairs.
> this would have a been a 5 min task for a strong person.

People have mini-tasks or "acts" they need help with all the time.
If we all had a way of sharing 

## WHAT 

A website (mobile friendly) that anyone can use to post/find tasks and request/give help.


## HOW

### Meteor

We built this app in [Meteor](https://www.meteor.com/) 
(good for *rapid prototyping* with "*full stack reactivity*")

If you are new to meteor, we suggest you look at (and *try*) one of the tutorials:
- Easiest "From Scratch" tutorial: https://www.openshift.com/blogs/day-15-meteor-building-a-web-app-from-scratch-in-meteor
- More tutorials (if you need them) https://www.meteor.com/learn-meteor

### Twitter API

We decided to use Twitter to determine if people are requesting help.
And if they have allowed twitter to plot their geolocaiton (Lat/Lon)

There are many twitter related node modules: 
https://nodejsmodules.org/tags/twitter

We just need a module that talks **Streaming API**.
**Twitter** by *desmondmorris* matches our needs:
- NPM: https://www.npmjs.org/package/twitter
- GitHub: https://github.com/desmondmorris/node-twitter
- Streaming API: https://dev.twitter.com/docs/streaming-apis/connecting

#### Useful Examples

- http://ikertxu.tumblr.com/post/56686134143/node-js-socket-io-and-the-twitter-streaming-api-in
