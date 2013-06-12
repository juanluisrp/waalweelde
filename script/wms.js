
OpenLayers.ProxyHost="proxy.php?url=";


$.URD = $.URD || {};

$.URD.addWMS = function (server,layer,title) {


var format = new OpenLayers.Format.WMSCapabilities({versiom:"1.3.0"});

OpenLayers.Request.GET({
    url: server,
    params: {
        SERVICE: "WMS",
        VERSION: "1.3.0", //should check for availability of 1.3.0 also?
        REQUEST: "GetCapabilities"
    },
    success: function(request) {
        var doc = request.responseXML;
        if (!doc || !doc.documentElement) {
            doc = request.responseText;
        }
        var capabilities = format.read(doc);
		
		var matchedLayer = "";

		
			var layerNames = [];
			//does the layer exist
			$(capabilities.capability.layers).each(function(){
				if (this.name==layer || (this.name.indexOf(":")>0 && this.name.split(":")[1]==layer)) {
					 var lyrOpts = {
					 type:"wms",
					 url: capabilities.service.href||server, 
					 layers: this.name, 
					 title: this.title, 
					 styles:this.styles,
					 legend: {url:this.styles[0].legend.href,title:this.styles[0].legend.title},
					 queryable:this.queryable,
					 metadataURLs: this.metadataURLs,
					 formats: this.formats,
					 bounds:this.bounds,
					 attribution: this.attribution
					}
					client.layers(lyrOpts);
					matchedLayer = this.name;
					layerNames.push(this.name);
				}
			})
		
		if (matchedLayer=="") {
		
			alert("Layer '"+layer+"' not in  "+layerNames.join(",")+".");
			//here open a panel to let the user select a layer from the list
			//note that layer can contain a comma separated list of layers
		
		};

		
    },
    failure: function() {
        alert("Trouble getting capabilities doc");
        OpenLayers.Console.error.apply(OpenLayers.Console, arguments);
    }
});
}

   