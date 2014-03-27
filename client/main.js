// Posts = new Meteor.Collection('posts');

Template.posts.entries = function(){
	var entries = Posts.find();
	console.log('hai!')
	return entries;
};

Template.post.helpers({
	avatarsrc: function() {
		return this.avatar || 'http://www.fashionally.com/images/default_profile_pic.jpg'
	}
})

// highlight all links and make them clickable with target="_blank"

// highlight #hashtagged strings and make them clickable

function highlightHashtags() {
  var elems = document.getElementsByClassName('show'),
  match, m, pattern = /\s*(#\w*)/gi, text, t;

  for(var i=0; i < elems.length; i++){
    var matches = [];
    text = elems[i].textContent; // get the original text

    if(text.indexOf("#") !== -1) {   

      // in many cases there will be more than one hashtagged word in a block of text 
      while ( (match = pattern.exec(text)) ) {
        matches.push(match[0]);
      }

      // loop throught all the matches identified above and replace them with a bold colored text
      for(var j=0; j < matches.length; j++) {
        m = matches[j];
        t = "<b class='hashtag'>"+m+"</b>";
        replace = new RegExp("\\s*("+m+")", 'gi');
        // console.log(replace)
        text = text.replace(replace, t);
      }
      elems[i].innerHTML = text;
    }
  }
}