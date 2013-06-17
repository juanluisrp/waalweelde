(function($, URD) {
$.extend( $.fn.urd.defaults.layer.all, {
    extent: {
        
        }
});
/**
  usage: 
  layer.extent() to get the layer-extent, defaults to maxExtent of the map
  layer.extent({bbox:[minx,miny,maxx,maxy]}) sets the layer-extent
*/

$.extend(URD.Layer.prototype, {
    //get/set the extent object
    extent: function(options) {
        //get the layer extent
        if (arguments.length===0) {
            this.options.extent = this._getExtent();
            return this.options.extent;
        }
        //set the layer extent
        if (options.extent!==undefined&&options.extent.box!==undefined) {            
            this.options.extent = options.extent;
            return this.options.extent;
        }
    },
   
    _getExtent: function(){
        var maxExtent={};
        if(this.options.extent.box) {
          maxExtent = this.options.extent;
        }
        else {
          maxExtent.box = this.options.maxExtent;
        }
        return maxExtent;
    }
    
});

})(jQuery, $.URD);