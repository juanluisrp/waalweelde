(function($, URD) {
$.extend( $.fn.urd.defaults.layer.all, {
    opacityChoice: {
        opacity:1
        }
});
//possible error messages to display in the legend

$.extend(URD.Layer.prototype, {
/**
###**layer**.`opacityChoice([options])`
_version added 0.1_
####**Description**: get/set the opacity of a layer

**options** opacity:opacity the opacity of a layer

The `.opacityChoice()` function allows us select a opacity

 */
    //get/set the opacityChoice object
    opacityChoice: function(options) {
	
		var opcty = this.options.opacityChoice.opacity*100;
		
		//present a popup where a user can select a opacity
		$( "#opacitySlider" ).slider({min:0,max:100,value:opcty,step:1});
		$("#wmsSelectOpacity").dialog({
		 width:"600px",
		 buttons: [
			{
			text: "OK",
			id:"btOpacitySubmit",
			click: function( event, ui ) {}
			}
			]
		});		
	}
});

})(jQuery, $.URD);

