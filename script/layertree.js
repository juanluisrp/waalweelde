(function($) {
$.template('urdLayerTree',
'<div class="urd-layertree  ui-widget-content"></div>');

$.template('urdLayer',
'<div class="urd-layer" id="urd-layertree-element-${id}"> \
<div class="urd-layertree-element-header"> \
<input type="checkbox" title="Verander zichtbaarheid van deze laag op de linker kaart" class="urd-layermanager-element-vischeckbox 1" id="${id}-visibility-1" {{if visible}}checked="${visible}"{{/if}} />\
<input type="checkbox" title="Verander zichtbaarheid van deze laag op de rechter kaart" class="urd-layermanager-element-vischeckbox 2" id="${id}-visibility-2" {{if visible2}}checked="${visible2}"{{/if}} />\
<span title="klik om de legenda te tonen, sleep om de laag-volgorde op de kaarten te veranderen" class="urd-layertree-element-name">${name}</span>\
</div> \
<div class="urd-layertree-layer-remove "><span title="klik om deze laag van de kaarten te verwijderen" class="urd-layer-verwijder hidden">verwijder</span></div>\
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
    
    lmElement.sortable({
            axis:'y',
            handle: '.urd-layertree-element-header',
            update: function(event, ui) {
                var layerNodes = ui.item.siblings().andSelf();
                var num = layerNodes.length-1;
                layerNodes.each(function(i) {
                    var layer = $(this).data('layer');
                    var pos = num-i;
                    layer.position(pos);
                });
            }
        });
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
    element.delegate('span.urd-layertree-element-name',
            'click',function() {
            var element = $(this).parents('.urd-layer');
            var layer = element.data('layer');
            var self = element.data('self');
            var urd = $(self.options.urd).data('urd');
            urd.trigger('updateLegend',layer);
            
    });
    element.delegate('.urd-layer',
            'mouseover',function() {
            $(this).find('.urd-layer-verwijder').removeClass('hidden');
    });
    element.delegate('.urd-layer',
            'mouseout',function() {
           // var element = $(this).parents('.urd-layer');
            $(this).find('.urd-layer-verwijder').addClass('hidden');
    });
    element.delegate('.urd-layer-verwijder',
            'click',function() {
            var element = $(this).parents('.urd-layer');
            var layer = element.data('layer');
            layer.remove();
    });
   
   
     urd.bind("addlayer",
            {widget:self,control:lmElement},
            self._onLayerAdd);
     urd.bind("removelayer",
            {widget:self,control:lmElement},
            self._onLayerRemove);
                   
  },
  _onLayerAdd: function(evt, layer) {
        evt.data.widget._layerAdded(evt.data.control,layer);
    },
  _onLayerRemove: function(evt, layer) {
        evt.data.widget._layerRemoved(evt.data.control,layer.id);
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
  _layerRemoved: function(widget, id) {
        var control = $("#urd-layertree-element-"+id);
        control.fadeOut(function() {
            $(this).remove();
        });
    },
  _destroy: function() {
  }
  
});
})(jQuery);