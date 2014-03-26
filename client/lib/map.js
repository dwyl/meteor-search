Map = function() {

  var map = {};

  function getMapBounds() {
    var point = map.$el.getBounds(),
        bounds = {
          maxLat: point.getNorth(),
          minLong: point.getWest(),
          minLat: point.getSouth(),
          maxLong: point.getEast()
      };
    return bounds;
  }

  function findAndUpdateMarker(id, callback) {
    var i, postMarker;
    for (i = 0; i < map.postMarkers.length; i++) {
      postMarker = map.postMarkers[i];
      if (postMarker.id === id) {
        callback(i);
        break;
      }
    }
  }

  map.postMarkers = [];

  map.init = function() {
    map.$el = L.map('map').setView([0, 0], 1, { animate: true});
    map.$el.locate({setView: true, maxZoom: 9});
    Session.set('bounds', getMapBounds());

    map.$el.on('moveend', function() {
      map.$el.stopLocate();
      Session.set('bounds', getMapBounds());
    });

    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
      maxZoom: 18
    }).addTo(map.$el);
  };

  map.addPin = function(act) {
    var postMarker = L.marker([act.lat, act.lng]);
    map.$el.addLayer(postMarker);
    postMarker.bindPopup('<p>' + act.description + '</p><p><a href="https://twitter.com/intent/tweet?in_reply_to=' + act.id + '&hashtags=offertohelp">Offer to help</a></p><p><a href="https://twitter.com/intent/tweet?in_reply_to=' + act.id + '&hashtags=done">I did this</a></p>');
    map.postMarkers.push({ marker: postMarker, id: act._id });
  };


  map.updatePin = function(act) {
    var callback = function(index) {
      var postMarker = map.postMarkers[index];
      postMarker.marker.setLatLng(L.latLng(act.lat, act.lng));
      postMarker.marker.update();
    };
    findAndUpdateMarker(act._id, callback);
  };

  map.removePin = function(act) {
    var callback = function(index) {
      var postMarker = map.postMarkers[index];
      map.$el.removeLayer(postMarker.marker);
      map.postMarkers.splice(index, 1);
    };
    findAndUpdateMarker(act._id, callback);
  };

  return map;

};
