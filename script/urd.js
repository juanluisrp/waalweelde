(function($) {
$.URD = $.URD || {};

$.URD.Client = function(element, options) {
  var self = this;
  this.element =element;
  
  this.options = $.extend({}, new $.fn.urd.defaults.map(), options);
  this.olMapOptions = $.extend({}, this.options);
  
  this.kaart1 = new OpenLayers.Map('map1-map', this.olMapOptions);;
  this.kaart2 = new OpenLayers.Map('map2-map', this.olMapOptions);;
  var matrixIds2 = new Array(26);
    for (var i=0; i<26; ++i) {
        matrixIds2[i] = 'EPSG:28992'+':' + i;
    }        
  var matrixIds3 = new Array(26);
    for (var i=0; i<10; ++i) {
        matrixIds3[i] = '0' + i;
    }  
    for (var i=10; i<26; ++i) {
        matrixIds3[i] = '' + i;
    }
  var brt = new OpenLayers.Layer.WMTS({
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
  })      
  var brt2 = new OpenLayers.Layer.WMTS({
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
  }) 
  element.data('urd', this);
};

$.fn.urd = function(options) {
    return this.each(function() {
        var instance = $.data(this, 'urd');
        if (!instance) {
            $.data(this, 'urd', new $.URD.Client($(this), options));
        }
    });
};

$.fn.urd.defaults = {
  map: function() {
    return {
      extent: [-13650159, 4534735, -13609227, 4554724],
      projection: "EPSG:28992",
      units: "m",
      resolutions: [3440.64, 1720.32, 860.16, 430.08, 215.04, 107.52, 53.76,
					26.88, 13.44, 6.72, 3.36, 1.68, 0.84, 0.42, 0.21],
      maxExtent: new OpenLayers.Bounds(-285401.92,22598.08,595401.9199999999,903401.9199999999)
    }
  }
};
})(jQuery);