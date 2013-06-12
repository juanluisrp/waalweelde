(function($) {
$.template('urdLegend',
'<div class="urd-legend  ui-widget-content"></div>');

$.template('urdLegendImage', 
'<img src="${url}"/>');


$.widget("urd.urdLegend", {
  options: {
    urd: undefined
  },
  _create: function(){
    var urd;
    var self = this;
    var element = this.element;
    urd = $(this.options.urd).data('urd');
    $.tmpl('urdLegend').appendTo(element);
    urd.bind('updateLegend', {widget:self}, self._updateLegend);
  },
  _updateLegend: function(evt, layer) {
    var widget = evt.data.widget;
    var legend = layer.legend();
    var url = '';
    if (legend && legend.url) {
      url = legend.url;
    }
     widget.element.empty().append($.tmpl('urdLegendImage',{url:url}));
    
  },
  _destroy: function() {
  }
});
})(jQuery);