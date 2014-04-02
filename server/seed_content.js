var KEYWORDS = "learned, learnt, homework, science, math, maths, physics, chemistry"; // add keywords separated by spaces.
// KEYWORDS = "great idea";
// KEYWORDS = "katie, justin, kim, beyonce, 1DWorld, OMG, FML, news, breaking";
var POST_COUNT = 10000;

/*************************************/
// Posts = new Meteor.Collection("posts");

Meteor.publish("posts", function () {
  return Posts.find({}, {sort: {time: -1}, limit:25});
});

Meteor.publish("search_posts", function (post_ids) {
  // console.log("PUBLISH", post_ids)
  if(post_ids.length > 0){
    return Posts.find({_id:{"$in":post_ids}});
  } else {
    return Posts.find({}, {sort: {time: -1}, limit:25});
  }
  
});

Meteor.publish("search_results", function (keywords) {
  // console.log("s_r",keywords)
  return Search_results.find({"keywords":keywords});
});

Meteor.publish("all_results", function (){
  return Search_results.find({});
});
/*
Meteor.publish("results", function(keywords) {
  console.log("KEYWORDS", keywords)
  var post_ids = [],
    sr = Search_results.find({"keywords":keywords}).fetch();
  console.log('SR',sr);
  if(sr.posts && sr.posts.length > 0 ){

    for(var i in sr.posts){
      post_ids.push(sr.posts[i]._id);
    }
    console.log("SERVER Result Count", post_ids.length);
  }
  var posts = Posts.find({_id:{"$in":post_ids}}).fetch();
  // console.log(posts);
  return Posts.find({_id:{"$in":post_ids}});
});
*/



var twitter = Meteor.require('twitter'),
	util = Meteor.require('util'),
	twit = new twitter({
    consumer_key: 'wyir0dDuntZkbXF0jQps8w',
    consumer_secret: 'hrWA0pEoGGD9DiJf1tanhkgYOCNwFL7yN6L8QCc3Nc',
    access_token_key: '2389016353-maPa5ax7R3VcXnFBROMb8HPEwJsO64So62dAHnK',
    access_token_secret: 'iKuvsT3tZd0Mk8ACUCfi6KzeN3Fvbr5EnyzDyHIlUgrrA'
});

Meteor.startup(function () {

  var insertTweet = Meteor.bindEnvironment(function(tweet) {
    Posts.insert(tweet);
  });

	function getTweets(callback){
		twit.stream("statuses/filter", {
		  track: KEYWORDS, 'lang':'en'
		  }, function(stream) {
		    stream.on('data', function(data) {
  		    var tweet = {};
	    		tweet.text = data.text;
          tweet.time = new Date(Date.parse(data.created_at));
          tweet.avatar = data.user && data.user.profile_image_url || '';

          if(data.entities && data.entities.media && data.entities.media[0].media_url){ // extract images where available:
            // console.log(data.entities.media[0].media_url);    
            tweet.img = data.entities.media[0].media_url;
           
          }
          if(data.retweeted_status && parseInt(data.retweeted_status.retweet_count, 10) > 0){
          	// console.log(data)
          }
          // console.log(data.lang)
          // if(data.lang === 'en') { // && tweet.img) {
		    	if(tweet.text.indexOf("#") !== -1) {   
            insertTweet(tweet);        
          }	
          // }

        	// console.log(data.retweeted_status); // full tweet
		    });
		});
	}

	// getTweets(function(){
	// 	console.log('done');
	// });
});
