
var merge = true;


$(document).ready(function() {
	
	$("#mdSave").click(function(event) {
		saveMap(0);
	});		 

	//if wmc loaded via url, load it
	var wmc = getURLParameter("wmc");
	if(wmc){
		loadMap(wmc);
	}
	
});

function saveMap(){
	
	//todo: when creating empty values, when editting existing map, introduce values
	$("#mapTitel").val("");
	$("#mapAbstract").val("");
	$("#mapKeywords").val("");
	$("#mapPurpose").val("");
	
	$( "#saveMap" ).dialog({
		autoOpen: true,
		height: 500,
		width: 750,
		modal: true,
		buttons:  [{
				text:"Opslaan",click: function(){ 
					
					
					
					if ($("#mapTitel").val()==""){	
						alert("U dient minimaal een titel voor deze kaart in te vullen");
						return;
					}
					
					var format = new OpenLayers.Format.WMC({'layerOptions': {buffer: 0}});
					
					if ($("input[name='location']:checked").val()=="local"){
						
						$.ajax({
							url : liveurl + "/proxy",
							type : 'POST',
							data : {
								content : format.write(client.kaart1)
							}
						}).done(function(e) {
							location = liveurl+"/proxy?fileName=" + e; 
						}).fail(function(e) {
							alert("Het opslaan van de themakaart is helaas mislukt.");
						});
						
					} else {
			
							bnds = client.kaart1.getExtent().toBBOX().split(",");
							
							$.ajax({	
								type:"POST",
								data:{
									title:$("#mapTitel").val(),
									description:$("#mapAbstract").val(),
									purpose:$("#mapPurpose").val(),
									west:bnds[0],
									south:bnds[1],
									east:bnds[2],
									north:bnds[3],
									map:format.write(client.kaart1) 
								},
								url:liveurl+"/metadata/create/domap", 
								datatype:"xml", 
								success: function(data){
									
									console.log(data);
									
									if (data.indexOf("<title>Login Page</title>") > -1 ) {
										
										$( "#saveMap" ).html("U bent niet ingelogd of uw sessie is verlopen. Log opnieuw in in het portaal en sla opnieuw op.");
									} else {
										$( "#saveMap" ).html("Themakaart succesvol opgeslagen");
										
									}
									
									
								},
								error:function(data,error,status){ alert("Het opslaan van de themakaart is helaas mislukt "+error+" "+status); }
							});
					}
			}
		}]
	}).show();
	
}

function resetMap(){
	$(client._allLayers()).each(function(){
			skiplayers = ["Vegetatielegger","Natuurbeheerplan","Ecotopenkaart","Natura 2000","Waterkeringen"];
			if (this.olLayer.type=="wms" && skiplayers.indexOf(this.olLayer.label)==-1){
				client._removeLayer(this.id);
			}
			});
		}

function loadMap(map,ttl){

	if (!ttl||ttl=="") ttl="";
	
	//put a local temp wmc here
	//map = "http://localhost:99/waalweelde/resources/res/wmc.xml";
	
	$("#mapTitle").html(ttl);
	
	$.ajax({url:proxyurl+escape(map),
		datatype:"xml", 
		success: function(data){
			var format = new OpenLayers.Format.WMC({'layerOptions': {buffer: 0}});
			if(merge) {
                try {
                	//remove all layers (except bg) to prevent duplicates
                	//$(client.kaart1.layers).each(function(j,i){ if (j>1) this.destroy(); });
                	map = format.read(data);             	
                	$(map.layersContext).each( 
                			function (){ 
                				
                				resetMap();
                				
                				//if (this.type == "wms") { -- type is always wms, wmts is not available in wmc, later for ows_context
                					var hasLayer = false;
                					//todo: a layer can be added multiple times, each with a different style for example
                					//todo: opacity is not used
                					var lyrs = this.name;
                					var server = this.url;
                					var lbl = this.title;
                					var vis = this.visibility;
                					//check if layer already exists in map
                					$(client.kaart1.layers).each(function(){		
                						if (this.layers == lyrs && this.url == server){ 
                							hasLayer = true;
                						}
                					});
                					//todo: add a param for visisbility
                					if (!hasLayer) $.URD.addWMS(server,lyrs,lbl,vis);
                					//}
                				});
                	
                	client.kaart1.zoomToExtent(map.bounds);		
                	
                	
                } catch(err) {
                	alert("Helaas was het niet mogelijk de kaart te openen, controleer of het document valide is: " + err.message);
                }
            } else {
                client.kaart1.destroy();//might not be good, better to remove all layers (except backgrounds)
                try {
                    
                    var mapOptions = {};
                    map = format.read(text, {map: mapOptions});
                    map.addControl(new OpenLayers.Control.LayerSwitcher());
                } catch(err) {
                	alert("Helaas was het niet mogelijk de kaart te openen, controleer aub of het document valide is: " + err.message);
                }
            }
			//todo:set title
			//todo for each layer, manage it's presence in toc, maybe need a capabilities
		},
		error:function(data,error,status){ alert("Het ophalen van de themakaart is helaas mislukt "+error+" "+status); }
	})
	
}



function transformToAssocArray( prmstr ) {
  var params = {};
  var prmarr = prmstr.split("&");
  for ( var i = 0; i < prmarr.length; i++) {
      var tmparr = prmarr[i].split("=");
      params[tmparr[0]] = tmparr[1];
  }
  return params;
}