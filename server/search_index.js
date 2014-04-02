/*
Meteor.publish('results', function(searchText) {
    var doc = {};
    var ids = searchPosts(searchText);
    if (ids) {
        doc._id = {
            $in: ids
        };
    }
    return Posts.find(doc);
});
*/

Meteor.startup(function () {
    search_index_name = 'post_search_index'
 
    // console.dir(Meteor.posts);

    // Remove old indexes as you can only have one text index and if you add 
    // more fields to your index then you will need to recreate it.
    if(false) {
        Posts._dropIndex(search_index_name);
     
        Posts._ensureIndex({
            text: 'text',
        }, {
            name: search_index_name,
            background:true
        });
    }

    console.log(" - - - MongoDB SEARCH INDEX ", search_index_name, " CREATED - - -");
    console.log(process.env.MONGO_URL);
    // Meteor._RemoteCollectionDriver = new Meteor._RemoteCollectionDriver(process.env.MONGO_URL);
});

// Actual text search function
_searchPosts = function (searchText) {
    var Future = Npm.require('fibers/future');
    var future = new Future();
    MongoInternals.RemoteCollectionDriver.mongo.db.executeDbCommand({
        text: 'posts',
        search: searchText,
        project: {
          id: 1 // Only take the ids
        }
     }
     , function(error, results) {
        if (results && results.documents[0].ok === 1) {
            future.ret(results.documents[0].results);
        }
        else {
            future.ret('');
        }
    });
    return future.wait();
};
 
// Helper that extracts the ids from the search results
searchPosts = function (searchText) {
    if (searchText && searchText !== '') {
        var searchResults = _searchPosts(searchText);
        var ids = [];
        for (var i = 0; i < searchResults.length; i++) {
            ids.push(searchResults[i].obj._id);
        }
        return ids;
    }
};