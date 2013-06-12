
OpenLayers.ProxyHost="proxy.php?url=";

(function($) {
$.URD = $.URD || {};

$.URD.addWMS = function (server,layer,title) {


var format = new OpenLayers.Format.WMSCapabilities({versiom:"1.1.1"});

OpenLayers.Request.GET({
    url: server,
    params: {
        SERVICE: "WMS",
        VERSION: "1.1.1", //should check for availability of 1.3.0 also?
        REQUEST: "GetCapabilities"
    },
    success: function(request) {
        var doc = request.responseXML;
        if (!doc || !doc.documentElement) {
            doc = request.responseText;
        }
        var capabilities = format.read(doc);
		
        var OLlayer = format.createLayer(capabilities, {
            layer: layer,
            format: "image/png",
            opacity: 0.7,
            isBaseLayer: false
        });	
		
		if (typeof(OLlayer)=="undefined"){
			var layerNames = [];
			//does the layer exist
			$(capabilities.capability.layers).each(function(){
				layerNames.push(this.name);
			})
			alert("Layer '"+layer+"' not in  "+layerNames.join(",")+".");
			//here open a panel to let the user select a layer from the list
			//note that layer can contain a comma separated list of layers
		} else {
		
			map.addLayer(OLlayer);

		}
    },
    failure: function() {
        alert("Trouble getting capabilities doc");
        OpenLayers.Console.error.apply(OpenLayers.Console, arguments);
    }
});
}
})
   