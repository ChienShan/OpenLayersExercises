var tile = new ol.layer.Tile({
    source: new ol.source.OSM()
});

var view = new ol.View({
    center: ol.proj.fromLonLat([37.41, 8.82]),
    zoom: 4
});

//Initial the map
var map = new ol.Map({
    target: 'map',
    layers: [
        tile
    ],
    view: view
});

var pos = ol.proj.fromLonLat([16.3725, 48.208889]);

// Popup showing the position the user clicked
var popup = new ol.Overlay({
    element: document.getElementById('popup'),
});
map.addOverlay(popup);

//Hide the default menu and show the context menu
map.getViewport().addEventListener('contextmenu', function (e) {
    e.preventDefault();
    var coordinate = map.getEventCoordinate(e);
    openContextMenu(coordinate);
});

function openContextMenu(coordinate) {
    var element = popup.getElement();
    //var hdms = toStringHDMS(toLonLat(coordinate));

    $(element).popover('dispose');
    popup.setPosition(coordinate);
    $(element).popover({
        container: element,
        placement: 'right',
        animation: false,
        html: true,
        //content: '<p>The location you clicked was:</p><code>' + hdms + '</code>',
    });
    $(element).popover('show');
}

//Close the context menu
map.on('click', function(){
    popup.setPosition(undefined);
})