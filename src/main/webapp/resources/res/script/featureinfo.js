
var fi = function(map,lonlat){
	
	lyrs = findLayers(map);
	if (lyrs.length==0){ 
		$("#fipanel").html("Geen bevraagbare lagen gevonden");
		return;
		}
	url = lyrs[0].url;
	
	lyrsparam=[];
	
	$(lyrs).each(function(){lyrsparam.push(this.layers)});
	
	 var params = {
             REQUEST: "GetFeatureInfo",
             EXCEPTIONS: "application/vnd.ogc.se_xml",
             BBOX: map.getExtent().toBBOX(),
             SERVICE: "WMS",
             INFO_FORMAT: 'text/html',
             QUERY_LAYERS: lyrsparam.join(","),
             FEATURE_COUNT: 50,
             Layers: lyrsparam.join(","),
             WIDTH: map.size.w,
             HEIGHT: map.size.h,
             //styles: map.layers[0].params.STYLES, todo: if a single query is submitted per layer, here the proper style(s) should be added
             srs: lyrs[0].params.SRS};
         
         // handle the wms 1.3 vs wms 1.1 madness
         if(lyrs[0].params.VERSION == "1.3.0") {
             params.version = "1.3.0";
             params.j = parseInt(lonlat.x);
             params.i = parseInt(lonlat.y);
         } else {
             params.version = "1.1.1";
             params.x = parseInt(lonlat.x);
             params.y = parseInt(lonlat.y);
         }
            
         
         url = url.replace(/request/ig,"").replace(/version/ig,"").replace(/service/ig,"");
         
         OpenLayers.Request.GET({
        		 url:url,
        		 params:params,
        		 success:function(response){  
        			 
        			 resp = response.responseText;
        			 if (resp.indexOf("<body")>0){
        				 resp = resp.substring("<html>"+resp.indexOf("<body"));
        			 }
        			 
        			 if (resp=="" || $(resp).text().trim()==""){ //check if empty result
	        				 $("#fipanel").html("Geen resultaten"); 
	        			 } else {
	        				$("#fipanel").html(resp).dialog('open'); 
	        			 }
        			 } ,
        		 failure:function(response){ $("#fipanel").html("Error tijdens ophalen gegevens"); }
		});
};


 var findLayers = function(map) {

	 
	 
	 firstwmsurl="";
	 
        var candidates = map.layers;
        var layers = [];
        var layer, url;
        for(var i = candidates.length - 1; i >= 0; --i) {
        	
            layer = candidates[i];
            
            if(layer instanceof OpenLayers.Layer.WMS && layer.getVisibility()) {
                url = OpenLayers.Util.isArray(layer.url) ? layer.url[0] : layer.url;
                if (firstwmsurl=="" || url==firstwmsurl){//get first url, or join layers when from same server
                	firstwmsurl = url;
                	layers.push(layer);
                }
            }
        }
        return layers;
 };
 