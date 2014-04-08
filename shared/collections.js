// Our content. 
Posts = new Meteor.Collection("posts");
// We store the results in a meteor collection to make the SERP reactive
// (when new results exist for your query, the page updates automagically!)
Search_results = new Meteor.Collection('search_results');

// Had trouble doing a Posts.find().count() so decided to just create collection!
// if you can get Posts.find().count() working, let me know fork/pull-req 
PostsCount = new Meteor.Collection('postsCount');