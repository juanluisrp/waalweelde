$(document).ready(function() {
var half = ($(document).width() - 230 ) /2;

/* bind panel resize event to map resize function*/
var eastResize = function(e,element) {
  kaart1.updateSize();
  kaart2.updateSize();
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



});