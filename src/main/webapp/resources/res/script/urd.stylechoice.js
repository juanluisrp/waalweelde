(function($, URD) {
$.extend( $.fn.urd.defaults.layer.all, {
    styleChoice: {
        style:""
        }
});
//possible error messages to display in the legend

$.extend(URD.Layer.prototype, {
/**
###**layer**.`STYLECHOICE([options])`
_version added 0.1_
####**Description**: get/set the STYLE of a layer

**options** styles:styles the styles of a layer


The `.STYLECHOICE()` function allows us select a style

 */
    //get/set the STYLECHOICE object
    styleChoice: function(options) {
	
	var selectedStyle = this.options.styleChoice.style;
	
	if (this.options.styles&&this.options.styles.length > 1){
		
		//check if layer has more then 1 style
		var cntnts = "<select id='styleSelector'>";
		$(this.options.styles).each(function (){
			cntnts+="<option value='"+this.name+ (this.name==selectedStyle?" selected":"") +"'>"+(this.title?this.title:this.name)+"</option>";
		});
		cntnts+="</select>";
		//present a popup where a user can select a style
		$("#wmsSelectStyle").html(cntnts).dialog({
		 width:"600px",
		 buttons: [
			{
			text: "OK",
			id:"btStyleSubmit",
			click: function( event, ui ) {}
			//click: function(a,b,c) {
			//set the legend to the selected style
			//todo: apply to map->layer->options
			//$("#styleSelector").val());
			//$( this ).dialog( "close" );
			//}
			}
			]
		});		
	} else {
		alert('Geen alternatieve tekenstijlen beschikbaar voor deze kaartlaag');
	}
	}
});

})(jQuery, $.URD);

