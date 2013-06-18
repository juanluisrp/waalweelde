var kaart1, kaart2;
$(document).ready(function(){
var options = {
        extent: [-13650159, 4534735, -13609227, 4554724],
        projection: "EPSG:28992",
        units: "m",
        resolutions: [3440.64, 1720.32, 860.16, 430.08, 215.04, 107.52, 53.76,
					26.88, 13.44, 6.72, 3.36, 1.68, 0.84, 0.42, 0.21],
        maxExtent: new OpenLayers.Bounds(-285401.92,22598.08,595401.9199999999,903401.9199999999)
}
var matrixIds2 = new Array(26);
	    for (var i=0; i<26; ++i) {
	        matrixIds2[i] = 'EPSG:28992'+':' + i;
	    }        
var matrixIds3 = new Array(26);
	    for (var i=0; i<10; ++i) {
	        matrixIds3[i] = '0' + i;
	    }  for (var i=10; i<26; ++i) {
	        matrixIds3[i] = '' + i;
	    }
var brt = new OpenLayers.Layer.WMTS(
{
        layertype: 'WMTS',
        name: 'BRT Achtergrondkaart (WMTS)',
        url: 'http://geodata.nationaalgeoregister.nl/wmts/',
        layer: 'brtachtergrondkaart',
        style: null,
        matrixSet: "EPSG:28992",
        matrixIds:  matrixIds2,
        visibility: true,
        attribution: '(c) OSM & Kadaster',
        format: "image/png8"
    }
  )      
  var brt2 = new OpenLayers.Layer.WMTS(
{
        layertype: 'WMTS',
        name: 'BRT Achtergrondkaart (WMTS)',
        url: 'http://geodata.nationaalgeoregister.nl/wmts/',
        layer: 'brtachtergrondkaart',
        style: null,
        matrixSet: "EPSG:28992",
        matrixIds:  matrixIds2,
        visibility: true,
        attribution: '(c) OSM & Kadaster',
        format: "image/png8"
    }
  ) 
kaart1 = new OpenLayers.Map('map1-map', options);
kaart2 = new OpenLayers.Map('map2-map', options);
kaart1.zoomTo(2);
kaart1.addLayer(brt);
kaart2.addLayer(brt2);
kaart1.zoomToMaxExtent();
kaart2.zoomToMaxExtent();
kaart1.events.on({"move":move1Listener});
kaart2.events.on({"moveend":move2Listener});

function  move1Listener(e) {
 var center  = kaart1.getCenter();
 var zoom = kaart1.getZoom();
 //olmap2.events.un({"move":move2Listener});
 kaart2.setCenter(center);
 kaart2.zoomTo(zoom);
 //olmap2.events.on({"move":move2Listener});
}
function  move2Listener(e) {
 var center  = kaart2.getCenter();
 var zoom = kaart2.getZoom(); 
 kaart1.setCenter(center);
 kaart1.zoomTo(zoom);
}
});