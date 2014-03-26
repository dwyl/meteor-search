Meteor.publish("actsUpdated", function (bounds) {
  if (!bounds) return null;
  var acts = Acts.find({
    lat: { $gte: bounds.minLat, $lte: bounds.maxLat },
    lng: { $gte: bounds.minLong, $lte: bounds.maxLong }
  });
  return acts;
});

var twitter = Meteor.require('twitter'),
	util = Meteor.require('util'),
	twit = new twitter({
    consumer_key: 'wyir0dDuntZkbXF0jQps8w',
    consumer_secret: 'hrWA0pEoGGD9DiJf1tanhkgYOCNwFL7yN6L8QCc3Nc',
    access_token_key: '2389016353-maPa5ax7R3VcXnFBROMb8HPEwJsO64So62dAHnK',
    access_token_secret: 'iKuvsT3tZd0Mk8ACUCfi6KzeN3Fvbr5EnyzDyHIlUgrrA'
});

function removePostsOlderThan(date) {
  Acts.remove({
    lastTouched: { $lt: date }
  });
}

var words = "need help";

Meteor.startup(function () {
	Acts.remove({});

  var insertTweet = Meteor.bindEnvironment(function(tweet) {
    tweet.lastTouched = new Date().getTime();
    Acts.insert(tweet);
  });

	function getTweets(callback){
		twit.stream("statuses/filter", {
		                track: words, 'lang':'en'
		            }, function(stream) {
		    stream.on('data', function(data) {
		    	if(data.geo !== null ){
		    		console.log(data.geo, data.text);
            var latitude = data.geo.coordinates[0];
            var longitude = data.geo.coordinates[1];
		    		tweet = {};
		    		tweet.description = data.text;
            tweet.lat = latitude;
            tweet.lng = longitude;
            tweet.id  = Number(data.id);
            if ((latitude > 51 && latitude < 52) && (longitude > -1 && longitude < 1)) {
              insertTweet(tweet);
            }
          } else {
          	console.log(data.geo, " [no geo] ", data.text);
          }
		    });
		});
	}

  Meteor.setInterval(function() {
    removePostsOlderThan(new Date()-DateHelper.hour);
  },DateHelper.hour);

	getTweets(function(){
		console.log('done');
	});
});
