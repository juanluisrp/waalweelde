var client;
$(document).ready(function() {
var half = ($(document).width() - 230 ) /2;

/* bind panel resize event to map resize function*/
var eastResize = function(e,element) {
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
   }
}

$('body').layout( layout_options );
$('#center').layout( map_options );
 
var matrixIds = new Array(26);
  for (var i=0; i<26; ++i) {
    matrixIds[i] = 'EPSG:28992'+':' + i;
}     
client = $('#layertree').urd({center: {zoom: 5,position: [5,52]
  },
  layers:[{
     type: 'wmts',
     name: 'BRT Achtergrondkaart (WMTS)',
     url: 'http://geodata.nationaalgeoregister.nl/wmts/',
     layer: 'brtachtergrondkaart',
     style: null,
     matrixSet: "EPSG:28992",
     matrixIds:  matrixIds,
     visibility: true,
     attribution: '(c) OSM & Kadaster',
     format: "image/png8"
  }]
}).data('urd');

});