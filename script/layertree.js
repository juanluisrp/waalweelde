(function($) {
$.template('urdLayerTree',
'<div class="urd-layertree  ui-widget-content"></div>');

$.template('urdLayer',
'<div class="urd-layer" id="urd-layertree-element-${id}"> \
<div class="urd-layertree-element-header hasmenu"> \
<input type="checkbox" title="Verander zichtbaarheid van deze laag op de linker kaart" class="urd-layermanager-element-vischeckbox 1" id="${id}-visibility-1" {{if visible}}checked="${visible}"{{/if}} />\
<input type="checkbox" title="Verander zichtbaarheid van deze laag op de rechter kaart" class="urd-layermanager-element-vischeckbox 2" id="${id}-visibility-2" {{if visible2}}checked="${visible2}"{{/if}} />\
<span title="rechts klik voor context opties, sleep om de laag-volgorde op de kaarten te veranderen" class="urd-layertree-element-name">${name}</span>\
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
	
	element.contextmenu({
		delegate: ".urd-layer",
		preventSelect: true,
		taphold: true,
		menu: [
			{title: "Zoom", cmd: "zoom", uiIcon: "ui-icon-zoom"},
			{title: "Remove", cmd: "remove", uiIcon: "ui-icon-delete"},
			{title: "Style", cmd: "style", uiIcon: "ui-icon-style" },
			{title: "Opacity", cmd: "opacity", uiIcon: "ui-icon-style" },
			{title: "Metadata", cmd: "metadata", uiIcon: "ui-icon-style" },
			{title: "Legenda", cmd: "legend", uiIcon: "ui-icon-style" }
			],
		select: function(event, ui) {
			var $target = ui.target;
			var element = $target.parents('.urd-layer');
			var layer = element.data('layer');
			var self = element.data('self');
			switch(ui.cmd){
			case "zoom":
				var urd = $(self.options.urd).data('urd');
				urd.center(layer.extent());
				//todo: maxExtent is now always set to bglayer
				break
			case "remove":
				layer.remove();
				break
			case "style":
				//open a dialog here and present available styles to choose from
				layer.styleChoice()
				$("#btStyleSubmit").on("click", function(e){
					//todo: move this somewhere
					layer.options.styleChoice.style = $("#styleSelector").val();
					layer.olLayer.mergeNewParams({styles:$("#styleSelector").val()});
					layer.olLayer2.mergeNewParams({styles:$("#styleSelector").val()});
					//todo: change the layer legend to the new style legend
					$("#wmsSelectStyle").dialog('close');
				})	
				break
			case "opacity":
				//open a dialog here and present an opacity slider
				//urd.trigger('updateOpacity',layer);
				break
			case "legend":
				var urd = $(self.options.urd).data('urd');
				urd.trigger('updateLegend',layer);
				break
			case "metadata":
				//open a dialog to present the metadata, if metadata url is available (else could present title/abstract)
				if (layer.olLayer.metadataURLs&&layer.olLayer.metadataURLs[0].href)
					new window('md',layer.olLayer.metadataURLs[0].href,'height=600,width=800');
				else
					alert(layer.options.label+". "+layer.options.desc);
				break
			}
		},
		beforeOpen: function(event, ui) {
			var $menu = ui.menu,
				$target = ui.target;
			$(document)
//				.contextmenu("replaceMenu", [{title: "aaa"}, {title: "bbb"}])
//				.contextmenu("setEntry", "copy", "Copy '" + $target.text() + "'")
//				.contextmenu("enableEntry", "paste", (CLIPBOARD !== ""));
			// Optionally return false, to prevent opening the menu now
		}
	});
	/* now in context menu
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
    }); */
   
   
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