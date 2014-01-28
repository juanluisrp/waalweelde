var client;
OpenLayers.Util.onImageLoadErrorColor = 'transparent';

$(document).ready(function() {
var half = ($(document).width() - 230 ) /2;

$( "#tabs" ).tabs();

/* bind panel resize event to map resize function*/
var eastResize = function() {
  client.kaart1.updateSize();
  client.kaart2.updateSize();
}

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
}

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
     style: null,
     matrixSet: "EPSG:28992",
     matrixIds:  matrixIds,
     visibility: true,
     attribution: '(c) OSM & Kadaster',
     format: "image/png8",
     legend: {url: 'http://kaart.pdok.nl/img/PDOK-logo.png'}
  },
  {"type":"wms","url":"http://ec2-54-228-203-57.eu-west-1.compute.amazonaws.com:6080/arcgis/services/urd_oost/MaptableMixer/MapServer/WmsServer?","desc":"A02_VegStruct_Rijnwaarden","layers":"2","label":"Vegetatie: 0 jaar","styles":[{"name":"default","title":"2","legend":{"width":"124","height":"112","format":"image/png","href":"http://ec2-54-228-203-57.eu-west-1.compute.amazonaws.com:6080/arcgis/services/urd_oost/MaptableMixer/MapServer/WmsServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=2"}}],"legend":{"url":"http://ec2-54-228-203-57.eu-west-1.compute.amazonaws.com:6080/arcgis/services/urd_oost/MaptableMixer/MapServer/WmsServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=2"},"queryable":true,"metadataURLs":[],"formats":["image/bmp","image/jpeg","image/tiff","image/png","image/png8","image/png24","image/png32","image/gif","image/svg+xml"],"extent":{"box":["5.989178","51.853822","6.103160","51.914010"]}},
  {"type":"wms","url":"http://ec2-54-228-203-57.eu-west-1.compute.amazonaws.com:6080/arcgis/services/urd_oost/MaptableMixer/MapServer/WmsServer?","desc":"A03_VegStruct_Rijnwaarden_5_jaar_geen_beheer","layers":"3","label":"Vegetatie: 5 jaar geen beheer","styles":[{"name":"default","title":"3","legend":{"width":"124","height":"112","format":"image/png","href":"http://ec2-54-228-203-57.eu-west-1.compute.amazonaws.com:6080/arcgis/services/urd_oost/MaptableMixer/MapServer/WmsServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=3"}}],"legend":{"url":"http://ec2-54-228-203-57.eu-west-1.compute.amazonaws.com:6080/arcgis/services/urd_oost/MaptableMixer/MapServer/WmsServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=3"},"queryable":true,"metadataURLs":[],"formats":["image/bmp","image/jpeg","image/tiff","image/png","image/png8","image/png24","image/png32","image/gif","image/svg+xml"],"extent":{"box":["5.989178","51.853822","6.103160","51.914010"]}},
  {"type":"wms","url":"http://ec2-54-228-203-57.eu-west-1.compute.amazonaws.com:6080/arcgis/services/urd_oost/MaptableMixer/MapServer/WmsServer?","desc":"A04_VegStruct_Rijnwaarden_5_jaar_extreem_beheer","layers":"4","label":"Vegetatie: 5 jaar extreem beheer","styles":[{"name":"default","title":"4","legend":{"width":"124","height":"112","format":"image/png","href":"http://ec2-54-228-203-57.eu-west-1.compute.amazonaws.com:6080/arcgis/services/urd_oost/MaptableMixer/MapServer/WmsServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=4"}}],"legend":{"url":"http://ec2-54-228-203-57.eu-west-1.compute.amazonaws.com:6080/arcgis/services/urd_oost/MaptableMixer/MapServer/WmsServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=4"},"queryable":true,"metadataURLs":[],"formats":["image/bmp","image/jpeg","image/tiff","image/png","image/png8","image/png24","image/png32","image/gif","image/svg+xml"],"extent":{"box":["5.989178","51.853822","6.103160","51.914010"]}},
  {"type":"wms","url":"http://ec2-54-228-203-57.eu-west-1.compute.amazonaws.com:6080/arcgis/services/urd_oost/Waterveiligheid/MapServer/WmsServer?","desc":"wsdif_5jgeen-huidig","layers":"1","label":"5 jaar geen beheer: Waterstand verschil","styles":[{"name":"default","title":"1","legend":{"width":"142","height":"80","format":"image/png","href":"http://ec2-54-228-203-57.eu-west-1.compute.amazonaws.com:6080/arcgis/services/urd_oost/Waterveiligheid/MapServer/WmsServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=1"}}],"legend":{"url":"http://ec2-54-228-203-57.eu-west-1.compute.amazonaws.com:6080/arcgis/services/urd_oost/Waterveiligheid/MapServer/WmsServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=1"},"queryable":true,"metadataURLs":[],"formats":["image/bmp","image/jpeg","image/tiff","image/png","image/png8","image/png24","image/png32","image/gif","image/svg+xml"],"extent":{"box":["5.832342","51.821566","6.229300","51.986842"]},visibility:0},
  {"type":"wms","url":"http://ec2-54-228-203-57.eu-west-1.compute.amazonaws.com:6080/arcgis/services/urd_oost/Waterveiligheid/MapServer/WmsServer?","desc":"wsdif_5jextreem-huidig","layers":"0","label":"5 jaar extreem beheer: Waterstand verschil","styles":[{"name":"default","title":"0","legend":{"width":"142","height":"80","format":"image/png","href":"http://ec2-54-228-203-57.eu-west-1.compute.amazonaws.com:6080/arcgis/services/urd_oost/Waterveiligheid/MapServer/WmsServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=0"}}],"legend":{"url":"http://ec2-54-228-203-57.eu-west-1.compute.amazonaws.com:6080/arcgis/services/urd_oost/Waterveiligheid/MapServer/WmsServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=0"},"queryable":true,"metadataURLs":[],"formats":["image/bmp","image/jpeg","image/tiff","image/png","image/png8","image/png24","image/png32","image/gif","image/svg+xml"],"extent":{"box":["5.832342","51.821566","6.229300","51.986842"]},visibility:0}
  
  
  /*,
  {
        type: 'wms',
		label: 'MaptableMixer (vlak)',
        url: 'http://ec2-54-228-203-57.eu-west-1.compute.amazonaws.com:6080/arcgis/services/urd_oost/MaptableMixer/MapServer/WMSServer?service=WMS',
        layers: '1',
		version:'1.3.0',
		extent:[175671.750000,307278.468750,178303.453125,318462.781250],
        style: null,
        visibility: true,
        //format: "image/png",
		legend: {url: 'http://ec2-54-228-203-57.eu-west-1.compute.amazonaws.com:6080/arcgis/services/urd_oost/MaptableMixer/MapServer/WmsServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=1'}
    },
{
        type: 'wms',
		version:"1.3.0",
		extent:[175671.750000,307278.468750,178303.453125,318462.781250],
        label: 'MaptableMixer (punt)',
        url: 'http://ec2-54-228-203-57.eu-west-1.compute.amazonaws.com:6080/arcgis/services/urd_oost/MaptableMixer/MapServer/WMSServer?service=WMS',
        layers: '0',
        style: null,
        visibility: false,
        //format: "image/png",
		legend: {url: 'http://ec2-54-228-203-57.eu-west-1.compute.amazonaws.com:6080/arcgis/services/urd_oost/MaptableMixer/MapServer/WmsServer?request=GetLegendGraphic%26version=1.3.0%26format=image/png%26layer=0'}
    }*/
  ]
}).data('urd');
$('#layertree').urdLayerTree({urd:'#center'});
$('#legend').urdLegend({urd:'#center'});
$('#grafiek').urdGraphs({urd:'#center'});

var kaart1move = function(e) {

  var lonlat = client.kaart1.getLonLatFromPixel(e.xy);
  var xy = client.kaart2.getPixelFromLonLat(lonlat);
  $('#pointer2').css({top: xy.y-4, left: xy.x-4})
}
var kaart2move = function(e) {

  var xy = client.kaart1.getPixelFromLonLat(client.kaart2.getLonLatFromPixel(e.xy));
  $('#pointer1').css({top: xy.y-4, left: xy.x-4})
}
client.kaart1.events.register('mousemove', {}, kaart1move);
client.kaart2.events.register('mousemove', {}, kaart2move);

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

});