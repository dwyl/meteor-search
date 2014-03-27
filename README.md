# Meteor Search

## WHY

People want to find stuff.

## What

Full-text search.


## How

### "Real" MongoDB

If you don't already have a "Real" installation of MongoDB on your system,
install it with **Brew**:

```
brew update
brew install mongodb
```

If you're not using Mac ...

- Linux: http://docs.mongodb.org/manual/tutorial/install-mongodb-on-linux/
- Windows? *ouch*... http://www.geekyprojects.com/tutorials/how-to-use-virtualbox-tutorial/



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

Thankfully this is quite easy with MongoDB's **ensureIndex** method.
In our case we are simply going to index the post's **text** field:

```
db.posts.ensureIndex( { text: "text" } );
```

#### Query to Search for a Keyword



- **ensureIndex**: http://docs.mongodb.org/manual/core/index-text/

### Step 2 - Highlighting Hashtags

I wrote a simple regular expression to turn hashtagged keywords into links.
the link pattern is hard-coded and method is not chainable so *far from perfect*!
Will tidy up in next itteration.




### Iron Router

```
mrt add iron-router
```



## Research

- 
- Meteor (MongoDB) Full-text search: http://stackoverflow.com/questions/14567856/full-text-search-with-meteor-js-and-mongodb (non-answer!)
- Lunr JS "Simple" full-text search in your browser: http://lunrjs.com/ 
(but our data is in MongoDB so not much use...)

