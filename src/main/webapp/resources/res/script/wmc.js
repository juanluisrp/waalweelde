
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
						alert("U dient minimaal een titel voor deze kaart int e vullen");
						return;
					}
					
					var format = new OpenLayers.Format.WMC({'layerOptions': {buffer: 0}});
					
					if ($("input[name='location']:checked").val()=="local"){
						
						$.ajax({
							url : liveurl + "/proxy",
							method : 'POST',
							data : {
								content : format.write(client.kaart1)
							}
						}).done(function(e) {
							location = liveurl+"/proxy?fileName=" + e; 
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
									$( "#saveMap" ).html("Themakaart succesvol opgeslagen");
								},
								error:function(data,error,status){ alert("Het opslaan van de themakaart is helaas mislukt "+error+" "+status); }
							});
					}
			}
		}]
	}).show();
	
}

function loadMap(map){

	//put a local temp wmc here
	//map = "http://localhost:99/waalweelde/resources/res/wmc.xml";
	
	
	
	$.ajax({url:map,
		datatype:"xml", 
		success: function(data){
			var format = new OpenLayers.Format.WMC({'layerOptions': {buffer: 0}});
			if(merge) {
                try {
                    map = format.read(text, {map: client.kaart1});
                } catch(err) {
                   
                }
            } else {
                client.kaart1.destroy();//might not be good, better to remove all layers (except backgrounds)
                try {
                    
                    var mapOptions = {};
                    map = format.read(text, {map: mapOptions});
                    map.addControl(new OpenLayers.Control.LayerSwitcher());
                } catch(err) {
                   
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