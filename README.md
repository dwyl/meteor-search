# Meteor Search

## WHY

People want to find stuff.

## What

Full-text search.


## How

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

### Step 2 - Highlighting Hashtags





### Iron Router

```
mrt add iron-router
```


### MongoDB 




