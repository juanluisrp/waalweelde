
var wmsServer;

$.URD = $.URD || {};

$.URD.addWMS = function (server,layer,title) {

wmsServer = server;//todo: should be used by click event only, not global

var format = new OpenLayers.Format.WMSCapabilities({versiom:"1.3.0"});

OpenLayers.Request.GET({
    url: server,
    params: {
        SERVICE: "WMS", //should check for availability of 1.3.0 also?
        REQUEST: "GetCapabilities"
    },
    success: function(request) {
        var doc = request.responseXML;
        if (!doc || !doc.documentElement) {
            doc = request.responseText;
        }
        var capabilities = format.read(doc);
		
		var matchedLayer = "";

		if (typeof(capabilities.capability)=="undefined"){
			if (doc.indexOf("403")>0){
			alert("Excuses, u heeft onvoldoende rechten om te verbinden met "+server+".");
			return false;
			}
		
			alert("Excuses, er is een onbekende fout opgetreden bij het verbinden met "+server+".");
			return false;
		}
		
			var layerNames = [];
			//does the layer exist
			$(capabilities.capability.layers).each(function(){
				//als laag is de geselecteerde laag, of laag is geselecteerd maar dan zonder prefix, of er is maar 1 laag in service
				//todo: addwms should check if layer is already available in toc
				if (this.name==layer || (this.name.indexOf(":")>0 && this.name.split(":")[1]==layer) || capabilities.capability.layers.length == 1) {
					 var lyrOpts = {
					 type:"wms",
					 url: capabilities.capability.request.getmap.get.href||server, 
					 desc: this.abstract,
					 layers: this.name, 
					 label: this.title, 
					 styles: this.styles,
					 legend: {url:(this.styles[0]?this.styles[0].legend.href:""),title:(this.styles[0]?this.styles[0].legend.title:"")},
					 queryable:this.queryable,
					 metadataURLs: this.metadataURLs,
					 formats: this.formats,
					 extent:{box:this.llbbox},
					 attribution: this.attribution
					}
					client.layers(lyrOpts);
					matchedLayer = this.name;	
				}
				layerNames.push({name:this.name,title:this.title});
			})
		
		if (matchedLayer=="") {

			//here open a panel to let the user select a layer from the list
			//note that layer can contain a comma separated list of layers
			
			var html = "<select id='selLayer' multiple='true' size='6'>";
			$(layerNames).each(function(){
				html += "<option value="+this.name+">"+(this.title||this.name)+"</option>";
			});
			html+= "</select>";
		$( "#wmsSelectLayer" ).html(html).dialog({
			autoOpen: true,
			height: 500,
			width: 750,
			modal: true,
			buttons:[{
				text:"Voeg toe",
				id:"btLayersSubmit",
				click: function( event, ui ) {}
			}]
		});
		$("#btLayersSubmit").on("click", function(e){
			$('#selLayer option:selected').each(function(){
				$.URD.addWMS( wmsServer,$(this).val(),$(this).text());
			});
			$('#wmsSelectLayer').dialog( 'close');
		});
	};

		
    },
    failure: function(req) {
		alert("Trouble getting capabilities doc");
        OpenLayers.Console.error.apply(OpenLayers.Console, arguments);
    }
});

	

};

