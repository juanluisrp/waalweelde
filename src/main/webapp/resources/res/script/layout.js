var client;
OpenLayers.ProxyHost=proxyurl;

function amp(){
	if (proxyurl!="") return "%26";
	return "&";
}

//WMTS uses TILEMATRIXes instead of Z, so we need to have an array of all the needed IDs
//For PDOK/luchtfoto:
var matrixIds3 = new Array(26);
    for (var i=0; i<10; ++i) {
        matrixIds3[i] = '0' + i;
    }  for (var i=10; i<26; ++i) {
        matrixIds3[i] = '' + i;
    }
		

OpenLayers.Util.onImageLoadErrorColor = 'transparent';

$(document).ready(function() {
var half = ($(document).width() - 230 ) /2;

$( "#tabs" ).tabs();

/* bind panel resize event to map resize function*/
var eastResize = function() {
  client.kaart1.updateSize();
  client.kaart2.updateSize();
};

var layout_options = {
  defaults: {
      fxName:               "slide"
   ,  fxSpeed:               "slow"
   },
   north: {
    closable: false,
    resizable: false,
    size: 83,
    spacing_open : 0
   },
   west: {
    resizable: false,
    size: 230
   }
};

var map_options = {
 defaults: {
      fxName:               "slide"
   ,  fxSpeed:               "slow"
   },
   east: {
    size: half,
    onresize: eastResize,
    onopen: eastResize,
    onclose: eastResize
   },
   north: {
    closable: false,
    resizable: false,
    spacing_open : 0,
    size: 32
   },
   south: {
   initClosed: true,
   resizable: false,
   size: 230,
   fxName:               "slide"
   ,  fxSpeed:               "slow",
   onresize: eastResize,
   onopen: eastResize,
    onclose: eastResize
   }
};

$('body').layout( layout_options );
$('#center').layout( map_options );
 
var matrixIds = new Array(26);
  for (var i=0; i<26; ++i) {
    matrixIds[i] = 'EPSG:28992'+':' + i;
}     
client = $('#center').urd({center: {box: [5.989178,51.853822,6.103160,51.914010]
  },
  layers:[{
     type: 'wmts',
     label: 'BRT Achtergrondkaart',
     url: 'http://geodata.nationaalgeoregister.nl/wmts/',
     layer: 'brtachtergrondkaart',
     style: "",
     matrixSet: "EPSG:28992",
     matrixIds:  matrixIds,
     visibility: true,
     attribution: '(c) OSM & Kadaster',
     format: "image/png8",
     legend: {url: 'http://kaart.pdok.nl/img/PDOK-logo.png'}
  },
  {
      type: 'wmts',
      label: 'Luchtfoto 2009',
      url: 'http://geodata1.nationaalgeoregister.nl/luchtfoto/wmts',
      layer: 'luchtfoto',
      style: "",
      matrixSet: "nltilingschema",
      matrixIds:  matrixIds3,
      visibility: false,
      format: "image/jpeg",
      legend: {url: 'http://kaart.pdok.nl/img/PDOK-logo.png'}
  },
  {
      type: 'wmts',
      label: 'Vegetatielegger',
      url: 'http://168.63.99.2/arcgis/rest/services/Vegetatievlakken_plus/MapServer/WMTS?',
      layer: 'Vegetatievlakken_plus',
      style: "",
      matrixSet: "default028mm",
      matrixIds:  matrixIds3,
      visibility: false,
      format: "image/png",
      legend: {url: 'http://168.63.99.2/arcgis/rest/services/Vegetatievlakken_plus/MapServer/WMTS?request=getlegendgraphic&format=image/png&layer=Vegetatievlakken_plus'}
  },
  {
      type: 'wms',
      label: 'Ecotopenkaart',
      url: 'http://geodata.nationaalgeoregister.nl/ecotopen/ows?SERVICE=WMS&',
      layers: "cyclus_drie",
      style: "",
      visibility: false,
      format: "image/png",
      legend: {url: 'http://geodata.nationaalgeoregister.nl/ecotopen/ows?SERVICE=WMS&request=getlegendgraphic&format=image/png&layer=cyclus_drie'}
  },
  {
      type: 'wms',
      label: 'Natura 2000',
      url: 'http://geodata.nationaalgeoregister.nl/natura2000/wms?',
      layers: 'natura2000',
      style: "",
      visibility: false,
      format: "image/png",
      legend: {url: 'http://geodata.nationaalgeoregister.nl/natura2000/wms?layer=natura2000&request=getlegendgraphic&format=image/png'}
  },
  {
      type: 'wms',
      label: 'Natuurbeheerplan',
      url: 'http://ags.prvgld.nl/ArcGIS/services/pgr_2/MapServer/WMSServer?',
      layers: '8',
      style: "",
      visibility: false,
      format: "image/png",
      legend: {url: 'http://geoapp-pi.prvgld.nl/arcgisoutput/PGR_2_MapServer/wms/default8.png'}
  }
  
  ]
}).data('urd');
$('#layertree').urdLayerTree({urd:'#center'});
$('#legend').urdLegend({urd:'#center'});
//$('#grafiek').urdGraphs({urd:'#center'});

var kaart1move = function(e) {
  var lonlat = client.kaart1.getLonLatFromPixel(e.xy);
  var xy = client.kaart2.getPixelFromLonLat(lonlat);
  $('#pointer2').css({top: xy.y-4, left: xy.x-4});
};
var kaart2move = function(e) {

  var xy = client.kaart1.getPixelFromLonLat(client.kaart2.getLonLatFromPixel(e.xy));
  $('#pointer1').css({top: xy.y-4, left: xy.x-4});
};
client.kaart1.events.register('mousemove', {}, kaart1move);
client.kaart2.events.register('mousemove', {}, kaart2move);

var kaart1click = function(e) {
	//remove previous panels
	$("#fipanel").dialog().hide();
	//add panel: loading
	$("#fipanel").dialog({width:"auto",height:"auto",position:{my:"center center",at:"center center",of:"#map1-map"}}).html("Even geduld...").show();
	var lonlat = client.kaart1.getPixelFromLonLat(client.kaart1.getLonLatFromPixel(e.xy));
	//featureinfo request
	fi(client.kaart1,lonlat);
};

var kaart2click = function(e) {
	//remove previous panels
	$("#fipanel").hide();
	//add panel: loading
	$("#fipanel").dialog({width:"auto",height:"auto",position:{my:"center center",at:"center center",of:"#map2-map"}}).html("Even geduld...").show();
	var lonlat = client.kaart2.getPixelFromLonLat(client.kaart2.getLonLatFromPixel(e.xy));
	//featureinfo request
	fi(client.kaart2,lonlat);
};

client.kaart1.events.register('click', {}, kaart1click);
client.kaart2.events.register('click', {}, kaart2click);

/* west-menu harminonica logic*/
$('#layers').delegate('.ui-icon-minus','click',function(){
  var button = $(this);
  button.removeClass('ui-icon-minus').addClass('ui-icon-plus');
  $(this).parents('.west-element').find('.west-element-content').hide('blind');
});

$('#layers').delegate('.ui-icon-plus','click',function(){
  var button = $(this);
  button.removeClass('ui-icon-plus').addClass('ui-icon-minus');
  $(this).parents('.west-element').find('.west-element-content').show('blind');
});

//if layer added via url, load it
var wms = getURLParameter("wms");
var layer = getURLParameter("layer");
if (wms&&layer){
$.URD.addWMS(wms,layer,layer);
};

$("#layout").show();
});

var wmc = getURLParameter("wmc");
if (wmc){ 
	loadMap(map);
} else {
	$("#mapTitle").html("Waalweelde basis kaart");	
}

function getURLParameter(name) {
	return decodeURIComponent((new RegExp('[?|&]' + name + '='
	+ '([^&;]+?)(&|#|;|$)').exec(location.search) || [ , "" ])[1]
	.replace(/\+/g, '%20'))
	|| null;
	}; 
	
	
function drawResult(json){
	var geojson_format = new OpenLayers.Format.GeoJSON();
    var vegmod_layer = new OpenLayers.Layer.Vector(); 
    client.kaart1.addLayer(vegmod_layer);
    vector_layer.addFeatures(geojson_format.read(json));
}	
