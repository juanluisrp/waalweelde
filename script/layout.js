var client;
$(document).ready(function() {
var half = ($(document).width() - 230 ) /2;

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
client = $('#center').urd({center: {zoom: 5,position: [5,52]
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
  }]
}).data('urd');
$('#layertree').urdLayerTree({urd:'#center'});
$('#legend').urdLegend({urd:'#center'});

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
});
