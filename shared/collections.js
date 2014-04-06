// Our content. 
Posts = new Meteor.Collection("posts");
// We store the results in a meteor collection to make the SERP reactive
// (when new results exist for your query, the page updates automagically!)
Search_results = new Meteor.Collection('search_results');