(function($) {
$.template('urdLayerTree',
'<div class="urd_layertree">layertree</div>');

$.template('urdLayer',
'<div class="urd_layer">${name}</div>');


$.widget("urd.urdLayerTree", {
  options: {
    urd: undefined
  },
  _create: function(){
    var map;
    var self = this;
    var element = this.element;

    //get the mapquery object
    urd = $(this.options.urd).data('urd');
    $.each(urd.layers().reverse(), function(){
      self._layerAdded(element, this);
    });
  
  },
  _layerAdded: function(widget, layer) {
    var self = this;
    var name = layer.olLayer.name;
    $.tmpl('urdLayer',{name:name}).appendTo(widget);
  },
  _destroy: function() {
  }
  
});
})(jQuery);