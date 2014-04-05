// Our content. 
Posts = new Meteor.Collection("posts");
// Results from running searches duh
// The reason for storing the results in a meteor collection
// is to make the SERP reactive (when new results exist the page updates!)
Search_results = new Meteor.Collection('search_results');