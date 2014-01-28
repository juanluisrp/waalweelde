(function($) {
$.template('urdLegend',
'<div class="urd-legend  ui-widget-content"></div>');

$.template('urdLegendImage', 
'<div class="urd-legend-title">${title}</div><img src="${url}"/>');


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
     widget.element.find('.urd-legend').empty().append($.tmpl('urdLegendImage',{url:url, title: layer.label}));
    
  },
  _destroy: function() {
  }
});
})(jQuery);