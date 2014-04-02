# Meteor Search

## WHY

People want to find stuff.

## What

Full-text search.


## How

### *Get* "*Real*" MongoDB

If you don't already have a "Real" installation of MongoDB on your system,
install it with **Brew**:

```
brew update
brew install mongodb
```

If you're not using Mac ...

- Linux: http://docs.mongodb.org/manual/tutorial/install-mongodb-on-linux/
- Windows? *ouch*... http://www.geekyprojects.com/tutorials/how-to-use-virtualbox-tutorial/

### Startup MongoDB

```
mongod --bind_ip 127.0.0.1 --dbpath ~/code/meteor-search/.meteor/local/db --setParameter textSearchEnabled=true
```
**Note**: your data directory will be different, my project is at **~/code/meteor-search**
(sub for what ever yours is)


> Confirm its working by visiting: http://localhost:28017/ (in your browser)

![MongoDB Running Locally](http://i.imgur.com/EyKEe6l.png)

More info on enabling text search: http://docs.mongodb.org/manual/tutorial/enable-text-search/

### Start Meteor with the "Real" MongoDB

```
MONGO_URL="mongodb://localhost:27017/meteor" meteor
```

If the app starts up ok, you're in business!
(otherwise *submit a bug* to this repo and I will wil try to assist you!)


### Step 1 - Get Lots of Data

#### Seed Content

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

### Step 2 - Index the Text (in MongoDB)

Once you have some content you need to ensure that MongoDB is indexing it.

Thankfully this is quite *easy* with MongoDB's **ensureIndex** method.
In our case we are simply going to index the post's **text** field:

```
db.posts.ensureIndex( { text: "text" },{ background:true } );
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

While this works find in RoboMongo:

![RoboMongo Search Results](http://i.imgur.com/KYW2jYc.png)


Meteor does not support the **runCommand** method:

![Meteor Hates runCommand](http://i.imgur.com/x62G6N4.png)

So ... 

>> http://stackoverflow.com/questions/17159626/implementing-mongodb-2-4s-full-text-search-in-a-meteor-app/18258688#18258688



### Step 3 - Highlighting Hashtags

I wrote a simple regular expression to turn hashtagged keywords into links.

```javascript
// highlight #hashtagged strings and make them clickable
function highlight(text) {
	var hashtagPattern = /\s*(#\w*)/gi, 
	link = "find/", 
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
```

**Note**: the *link pattern* is *hard-coded* `find/:keyword` and method is not 
chainable so *far from perfect*! Will tidy up in next itteration.





### Iron Router

```
mrt add iron-router
```



## Research

- MeteorPedia Full-text Search: http://www.meteorpedia.com/read/Fulltext_search
- Using Elastic Search with MongoDB: https://github.com/matteodem/meteor-easy-search
- Meteor (MongoDB) Full-text search: http://stackoverflow.com/questions/14567856/full-text-search-with-meteor-js-and-mongodb (non-answer!)
- Lunr JS "Simple" full-text search in your browser: http://lunrjs.com/ 
(but our data is in MongoDB so not much use...)

