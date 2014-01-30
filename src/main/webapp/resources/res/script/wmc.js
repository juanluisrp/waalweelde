


$(document).ready(function() {
	
	$("#mdSave").click(function(event) {
		saveMap(0);
	});		 

});

function saveMap(){
	
	
	
	$( "#saveMap" ).dialog({
		autoOpen: true,
		height: 500,
		width: 750,
		modal: true,
		buttons:  [{
				text:"Save",click: function(){ 
					var format = new OpenLayers.Format.WMC({'layerOptions': {buffer: 0}});
					console.log(format.write(client.kaart1));
					$.ajax({	
						type:"POST",
						data:{
							title:$("#mapTitle").val(),
							desc:$("#mapAbstract").val(),
							keywords:$("#mapKeywords").val(),
							purpose:$("#mapPurpose").val(),
							bounds:client.kaart1.getExtent().toString(),
							map:format.write(client.kaart1) 
						},
						url:liveurl+"/metadata/create/domap", 
						datatype:"xml", 
						success: function(data){
							$( "#saveMap" ).html("Themakaart succesvol opgeslagen");
						}
				});
			}
			}
		]
	}).show();
	
}