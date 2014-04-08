Meteor.publish("postsCount", function (){
  return PostsCount.find({}, {sort: {time: -1}, limit:1});
})

Meteor.publish("posts", function () {
  return Posts.find({}, {sort: {time: -1}, limit:25});
});

Meteor.publish("search_posts", function (post_ids) {
  // console.log("PUBLISH", post_ids.length)
  if(post_ids.length > 0){
    return Posts.find({_id:{"$in":post_ids}},{sort: {time: -1}});
  } else {
    return Posts.find({}, {sort: {time: -1}, limit:25});
  }
});

Meteor.publish("search_results", function (keywords) {
  console.log("s_r",keywords)
  return Search_results.find({"keywords":keywords});
});

Meteor.publish("all_results", function (){
  return Search_results.find({});
});