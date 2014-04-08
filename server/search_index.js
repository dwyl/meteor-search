var SEARCH_INDEX = "post_search_index";
var SEARCH_KEYWORDS = "math",
    _db, _sr, _posts, _postsCount; // global DB/Collection handles 

var MongoClient = Meteor.require('mongodb').MongoClient;

MongoClient.connect('mongodb://127.0.0.1:27017/meteor', function(err, db) {
  if(err) throw err;
  _db       = db; // make database handle available to Meteor.methods
  _posts    = db.collection('posts');
  _postsCount = db.collection('postsCount');
  _sr       = db.collection('search_results');
}) // end MongoClient

// 
Meteor.methods({
  search: function (keywords, callback){
    console.log("- - - > SEARCHING for ",keywords, " < - - - ");
    _db.command({text:"posts" , search: keywords }, function(err, res){ 
      if(err) console.log(err);

      var record = {};
      record.keywords = keywords;
      record.last_updated = new Date();
      record.posts = [];

      if (res && res.results && res.results.length > 0){
        console.log("EXAMPLE:",res.results[0]);

        for(var i in res.results){
          // console.log(i, res.results[i].score, res.results[i].obj._id);
          record.posts.push({
            "_id":res.results[i].obj._id.toString(), 
            "score":res.results[i].score
          });
        }

        // check if an SR record already exists for this keyword
        _sr.findOne({"keywords":keywords}, function(err, items) {
          if(err) console.log(err);
          if(items && items._id){
            console.log("Existing search results: ",items.posts.length);
            record._id = items._id;
            // upsert the results record
            _sr.update(record, { upsert: true }, function(err,info){
              if(err) console.log(err);
              // console.log("INFO",info);
            });
          } else {
            // insert new search results record
            _sr.insert(record, function(err,info){
              if(err) console.log(err);
              console.log("INFO",info);
            });
          }

        }) // end findOne (search results lookup for keywords)
      } else { // no search results
        console.log('no results');
        _sr.insert(record, function(err,info){
          if(err) console.log(err);
          console.log("INFO",info);
        });
      }
      if (typeof callback !== 'undefined') {
        callback();
      }
    }); // end command (search)
  },

  createIndex: function(collection) {
    collection.indexInformation(function(err, index) { // all indexes on posts collection
      // console.dir(index);
      // console.log(typeof index)
      if(typeof index[SEARCH_INDEX] === 'undefined'){
        // create index
        collection.ensureIndex( { text: 'text' }, {
              name: SEARCH_INDEX,
              background:true
          }, function(err, info){
          if(err) throw err;
          // console.dir(info);
        });
      }
    });
  },

  getPostCount: function() {
    var count = 9
    console.log("SERVER",count);
    return count;
  }
});