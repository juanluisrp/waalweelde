var client;

//csw settings
var gnserver = "http://waalweelde.geocat.net/geonetwork/srv/dut/";	
var proxyurl = "";
var displayThumb = true;

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
