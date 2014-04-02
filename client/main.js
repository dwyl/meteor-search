// Posts = new Meteor.Collection('posts');

Template.posts.entries = function(){
	var entries = Posts.find();
	// console.log('hai!')
	return entries;
};

Template.post.helpers({
	avatarsrc: function() {
		return this.avatar || 'http://www.fashionally.com/images/default_profile_pic.jpg';
	},
	highlightText: function() {
		return highlight(this.text);
	}
})




// highlight #hashtagged strings and make them clickable
function highlight(text) {
	var hashtagPattern = /\s*(#\w*)/gi, 
	link = "/find/", 
	m, match, matches = [], t, url ='';

	// initial check for hashtag in text
	if(text.indexOf("#") !== -1) {   

      // in many cases there will be more than one hashtagged word in a block of text 
      while ( (match = hashtagPattern.exec(text)) ) {
        matches.push(match[0]);
      }

      // loop throught all the matches identified above and replace them with a bold colored text
      for(var j=0; j < matches.length; j++) {
        m = matches[j].replace(/\s/g, "");
        // console.log('match',m);
        url = link+m;
        url = url.replace('#',"").toLowerCase(); // remove hashtag for lookup
        t = " <a class='hashtag' href='"+url+"'>"+m+"</a> "; // replace with
        replace = new RegExp("\\s*("+m+")", 'gi');

        text = text.replace(replace, t);
      }
    }
    return text;
}

// var post = "RT @BestProAdvice: Great idea http://t.co/KYZVyKWOdO #GreatIdea #this";
// console.log(highlight(post));

// >> later:
// highlight all links and make them clickable with target="_blank"

// Template.results.entries = function(){
// 	var entries = Posts.runCommand( "text", { search: "paypal" } );
// 	console.log('hai!')
// 	return entries;
// };

Meteor.subscribe('search_results', this.keywords);
Meteor.subscribe('posts');
Meteor.subscribe('all_results');


Template.results.helpers({
	avatarsrc: function() {
		return this.avatar || 'http://www.fashionally.com/images/default_profile_pic.jpg';
	},
	highlightText: function() {
		return highlight(this.text);
	},
	keywords: function() {
		return this.keywords;
	}, 
	results: function() {
		Meteor.subscribe('search_posts', this.post_ids);
  	return Posts.find({_id:{"$in":this.post_ids}});
	},
	that: function() {
		console.log("that!");
	}
	// posts: function() {
	//   console.log("K:",this.keywords);
 //  	  var sr = Search_results.findOne({"keywords":this.keywords});
 //  		console.log('SR',sr);
	//   if(sr.posts && sr.posts.length > 0 ){
	//     var post_ids = [];
	//     for(var i in sr.posts){
	//       post_ids.push(sr.posts[i]._id);
	//     }
	//     console.log("Result Count", post_ids.length);
	//   }
	//   return Posts.find({_id:{"$in":post_ids}})
	//   }
});

/**/
Template.results.go = function(){
	console.log("K:",this.keywords);
	console.log(this.results);
};
