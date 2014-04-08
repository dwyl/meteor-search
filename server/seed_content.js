var KEYWORDS = "learned, learnt, homework, science, math, maths, physics, chemistry, grit"; // add keywords separated by spaces.
// KEYWORDS = "grit";
// KEYWORDS = "katie, justin, kim, beyonce, 1DWorld, OMG, FML, news, breaking";
var POST_COUNT = 10000;

var twitter = Meteor.require('twitter'),
	util = Meteor.require('util'),
	twit = new twitter({
    consumer_key: 'U8N2QzFu6Hv4BB3BjObIy9HDF',
    consumer_secret: 'rJWtj5NneVWmfT8STB7YN6IBkLreke9JoJhP3nIe0ffnBq91Xv',
    access_token_key: '2389016353-4tCDaVgRFkkNsWOj1sb6fZQ8s0bINqD5jJGmqRC',
    access_token_secret: 'OEFnemh9FlSkOX5YuNP46XsDh3EutbHiiKq6q8wV2Pwko'
});

Meteor.startup(function () {
  PostsCount.remove({}); // empty
  var insertTweet = Meteor.bindEnvironment(function(tweet) {
    Posts.insert(tweet);
  });

  var updatePostsCount = Meteor.bindEnvironment(function(){
    var count = Posts.find().count();
    console.log(count);
    // PostsCount.remove({});
    PostsCount.insert({"count":count, "time":new Date() });
  });

	function getTweets(callback){
    console.log("HAI!");
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
          // console.log(data.text);
		    	// if(tweet.text.indexOf("#") !== -1) {   
          insertTweet(tweet);  
          updatePostsCount();
          // }	

		    });
		});
	}

	getTweets(function(){
		console.log('done');
	});

});