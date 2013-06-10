(function($) {
var layerElementTmpl = $(
'<script type="text/html" id="template"> \
    <img data-src="authorPicture" data-alt="author" data-link-wrap="authorPicture"/>\
    <div class="post-container"> \
        <div data-content="author"></div> \
        <div data-content="date"></div> \
        <div data-content="post" data-format="sameCaseFormatter" data-format-template="upper"></div> \
    </div> \
</script>'
);

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
    widget.loadTemplate(layerElementTmpl);
  },
  _destroy: function() {
  }
  
});
})(jQuery);