nokia.Settings.set("app_id", "vJ4GPRGkA6Y4gAooPKyX");
nokia.Settings.set("app_code", "cLUJSYAcqBDoP3OM1n-Kyw");

var initMap = function(areaUpdatedCallback) {

    var map = initializeMap();
    initializeWithGPSLocation(map);
    initMarkers(map,areaUpdatedCallback);


    window.search = function(a) {
        searchAddress(a,function(coords) {
            zoomTo(map,coords);
        });
    }


}