# Meteor Search

## WHY

People want to find content. Good ***search is essential***.

## What

Full-text search. Using ***Native*** MongoDB Commands.

Example app:

![Searchr screens](http://i.imgur.com/hoTv9Yx.png)


## How

### Step 1 - *Get* "*Real*" MongoDB

By default, Meteor starts up its own instance of MongoDB, this does not have
full-text indexing/search, so you need to ***go native***.

If you don't already have a "Real" installation of MongoDB on your system,
install it with **HomeBrew**:

```
brew update
brew install mongodb
```

If you're not using Mac ...

- Linux: http://docs.mongodb.org/manual/tutorial/install-mongodb-on-linux/
- Windows? *ouch*... http://www.geekyprojects.com/tutorials/how-to-use-virtualbox-tutorial/

#### Startup MongoDB with textSearchEnabled=true

In a terminal/console window startup up your mongod databse with the following command:

```
mongod --dbpath ~/code/meteor-search/.meteor/local/db --setParameter textSearchEnabled=true
```
**Notes**: 
- **--dbpath** speficies where your data is. Your data directory will be different, 
my project is at **~/code/meteor-search** (replace for what ever yours is)
- **--setParameter** lets you enable full-text search at run time. (you can do this in a 
config file if you prefer see: http://docs.mongodb.org/manual/reference/configuration-options/)


> Confirm its working by visiting: http://localhost:28017/ (in your browser)

![MongoDB Running Locally](http://i.imgur.com/EyKEe6l.png)

**More info** on enabling text search: http://docs.mongodb.org/manual/tutorial/enable-text-search/

#### Start Meteor with the "Real" MongoDB

```
MONGO_URL="mongodb://localhost:27017/meteor" meteor
```

If the app starts up ok, its ***game on***! <br />
(otherwise *submit a bug* to this repo and I will wil try to assist you!)

### Step 2 - Get (Test) Content 

#### Seed Content (From Twitter Streaming API)

When you boot this app it will access the Twitter Streaming API and fetch 
thousands of tweets for you to search through (*locally*).
(leave it running for a few minutes and you will get 10k posts. 
Or a few hours if you want hundreds of thousands to stress test search)

If you want ***LOTS*** of content very quickly, change the KEYWORD to **news**.

If you want ***INSANE*** amounts of (*noisy*) data 
(to symulate *volume*), use:
```
var KEYWORDS = "katie, justin, kim, beyonce, miley, Obama, 1DWorld, OMG, FML, breaking, news";
```

### Step 3 - Index the Text (in MongoDB)

Once you have some content you need to ensure that MongoDB is indexing it.

Thankfully this is quite *easy* with MongoDB's **ensureIndex** method.
In our case we are simply going to index the post's **body** field:

```
db.posts.ensureIndex( { body: "text" },{ background:true } );
```

![RoboMongo Showing Search Index Run](http://i.imgur.com/gSUQliP.png)

> There's a **startup** script that does this automatically for you at: **server/indexes.js**

Depending on how much data you have already inserted, this may take some time...
I had 92k posts (tweets) in my DB when I ran it and it took less than 10 seconds!

More detail on **ensureIndex**: 

- http://docs.mongodb.org/manual/core/index-text/
- http://docs.mongodb.org/manual/reference/method/db.collection.ensureIndex/


#### Query to Search for a Keyword

```
db.posts.runCommand( "text", { search: "paypal" } )
```

While this works fine in RoboMongo:

![RoboMongo Search Results](http://i.imgur.com/KYW2jYc.png)


Meteor does not support the **runCommand** method:

![Meteor Hates runCommand](http://i.imgur.com/x62G6N4.png)

So ... 

>> http://stackoverflow.com/questions/17159626/implementing-mongodb-2-4s-full-text-search-in-a-meteor-app/18258688#18258688


### Step 4 - Highlighting Hashtags (Clickable)

I wrote a simple regular expression to turn hashtagged keywords into links.

```javascript
// highlight #hashtagged strings and make them clickable
function highlight(text) {
	var hashtagPattern = /\s*(#\w*)/gi, 
	link = "find/", 
	m, match, matches = [], t, url ='';

	// initial check for hashtag in text
	if(text.indexOf("#") !== -1) {   

      // find all #keywords (strings that have been hash-tagged)
      while ( (match = hashtagPattern.exec(text)) ) {
        matches.push(match[0]);
      }

      // replace any #keywords with <a href="/search/keywords">#keywords</a>
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
```

Or as a handlebars template helper method:

```
// place this code in your main.js or inside an Meteor.isClient check
Handlebars.registerHelper('highlight', function(text) {
  var hashtagPattern = /\s*(#\w*)/gi, 
    link = "/search/", 
    m, match, matches = [], t, url ='';

  // initial check for hashtag in text
  if(text.indexOf("#") !== -1) {   

      // find all #keywords (that have hashtags)
      while ( (match = hashtagPattern.exec(text)) ) {
        matches.push(match[0]);
      }

      // replace any #keywords with <a href="/search/keywords">#keywords</a>
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
});
```

**Note**: the *link pattern* is *hard-coded* `/search/:keywords` and method is not 
chainable so *far from perfect*! Will tidy up in next itteration.


## Notes

### Setting Up Full Text Search on MongoHQ

MongoHQ does **not** have (full) text indexing **enabled by default**. 

![MongoHQ Shows Error When Creating Index](https://pbs.twimg.com/media/BkUH5CrCIAAcfRx.png "MongoHQ Error")

But they were quick to help me when I asked for it: 
https://twitter.com/nelsonic/statuses/451758108285489152 

![MongoHQ Enables Text Search](http://i.imgur.com/AlUvCQw.png "Text Search Enabled")

You will need to set up your indexes *manually* with a command <br />
(either in your Mongo Client - We use RoboMongo - or the Web Interface)

![MongoHQ Showing Text Index on Posts.body](http://i.imgur.com/cHIzS4B.png "MongoHQ Full Text Index")

Once that is set up you are good to go. 

### Searching Through Your Posts

In RoboMongo (or what ever MongoDB Client of your choice) use the following
command to search through your collection (on the field(s) you specified as searchable)

```
db.COLLECTION.runCommand( "text", { search: "KEYWORDS" } );
// e.g:
db.posts.runCommand( "text", { search: "learn" } );
```

![RoboMongo Shows Results of runCommand](http://i.imgur.com/FLjDGl3.png "Search Query Results")


### Iron Router

This project uses Iron Router for url routing. <br />
If you are not familiar with it 
(you *should* be if you're serious about using Meteor), read:

- Tutorial: http://www.manuel-schoebel.com/blog/iron-router-tutorial
- Docs: https://github.com/EventedMind/iron-router
- [Discover Meteor](https://www.discovermeteor.com/) Uses Iron Router extensively. 
Read it for a good step-by-step intro.
- Advanced: https://properapp.com/meteor/advanced-routing-in-meteor-navigation-state-w/#.Uz8BIS9dVX4

```
mrt add iron-router
```
See the **routes.js** file for more detail on how I've wired this up to
accept request in the form: `http://yoursite.com/search/:keywords`

### Research

- MeteorPedia Full-text Search: http://www.meteorpedia.com/read/Fulltext_search
- Using Elastic Search with MongoDB: https://github.com/matteodem/meteor-easy-search
- Meteor (MongoDB) Full-text search: http://stackoverflow.com/questions/14567856/full-text-search-with-meteor-js-and-mongodb (non-answer!)
- Lunr JS "Simple" full-text search in your browser: http://lunrjs.com/ 
(but our data is in MongoDB so not much use...)

