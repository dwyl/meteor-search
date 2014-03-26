Deps.autorun(function() {
  Meteor.subscribe("actsUpdated", Session.get("bounds"));
});

var map = Map();

Acts.find().observe({
  added: map.addPin,
  removed: map.removePin,
  changed: map.updatePin
});

Template.hello.greeting = function () {
  return "Welcome to raok.";
};

Template.map.rendered = function() {
  map.init();
};

