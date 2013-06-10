(function($) {
$.template('urdLayerTree',
'<div class="urd-layertree  ui-widget-content"></div>');

$.template('urdLayer',
'<div class="urd-layer" id="urd-layertree-element-${id}"> \
<div class="mq-urd-layertree-element-header"> \
<input type="checkbox" class="urd-layermanager-element-vischeckbox 1" id="${id}-visibility-1" {{if visible}}checked="${visible}"{{/if}} />\
<input type="checkbox" class="urd-layermanager-element-vischeckbox 2" id="${id}-visibility-2" {{if visible2}}checked="${visible2}"{{/if}} />\
${name}  \
</div> \
</div>');


$.widget("urd.urdLayerTree", {
  options: {
    urd: undefined
  },
  _create: function(){
    var urd;
    var self = this;
    var element = this.element;
    var lmElement = $.tmpl('urdLayerTree').appendTo(element);
    //get the mapquery object
    urd = $(this.options.urd).data('urd');
    $.each(urd.layers().reverse(), function(){
      self._layerAdded(lmElement, this);
    });
    
    element.delegate('.urd-layermanager-element-vischeckbox',
            'change',function() {
            var checkbox = $(this);
            var element = checkbox.parents('.urd-layer');
            var layer = element.data('layer');
            var self = element.data('self');
            var kaart1 = checkbox.hasClass('1');
            var visible;
            if (kaart1) {
              visible = [checkbox.is(':checked'),layer.visible()[1]];
            }
            else {
              visible = [layer.visible()[0],checkbox.is(':checked')];
            }
            layer.visible(visible);
         });
     urd.bind("addlayer",
            {widget:self,control:lmElement},
            self._onLayerAdd);
  },
  _onLayerAdd: function(evt, layer) {
        evt.data.widget._layerAdded(evt.data.control,layer);
    },
  _layerAdded: function(widget, layer) {
    var self = this;    
    $.tmpl('urdLayer',{
      id: layer.id,
      position: layer.position(),
      visible: layer.visible()[0],
      visible2: layer.visible()[1],      
      name:layer.label
    }).data('layer', layer)
      .data('self',self)
      .prependTo(widget);
  },
  _destroy: function() {
  }
  
});
})(jQuery);