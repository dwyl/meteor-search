Meteor.subscribe('search_results', this.keywords);
Meteor.subscribe('posts');
Meteor.subscribe('all_results');


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
	link = "/search/", 
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
  	return Posts.find({_id:{"$in":this.post_ids}},{sort: {time: -1}});
	}
});
