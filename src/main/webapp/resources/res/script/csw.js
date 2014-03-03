
$(document).ready(function() {

$("#mdSuggest").autocomplete({  
				//define callback to format results  
				source: function(request, response){  
								$.ajax({
									url: proxyurl+gnserver+"/main.search.suggest?field=any" + amp() + "q="+request.term,
									dataType: "json",
									success: function(data) {
										//map the data into a response that will be understood by the autocomplete widget
										response($.map(data[1], function(item) {
											return {label: item,value: item}
										}));

									}}
								);
							},
						//start looking at 3 characters because mysql's limit is 4
						minLength: 3,
						//when you have selected something
						select: function(event, ui) {
							this.close
						},
						open: function() {
							$(this).removeClass("ui-corner-all").addClass("ui-corner-top");
						},
						close: function() {
							$(this).removeClass("ui-corner-top").addClass("ui-corner-all");
						}
				});
				
				
$("#mdQuery").click(function(event) {
	getMDResults(0);
});	 

});

function getMDResults(page){
	result=[];
	var vl = $("#mdSuggest").val();
	if (typeof(vl)=='undefined') vl="";
	tp = $("input[name='doctype']:checked").val();
	if (!tp) tp="";
	//if map=software, can not add dynamic
	if (tp!="software") tp= tp + amp() + "dynamic=true"
	//dynamic = true only results in datasets having a wms link
	$.ajax({	type:"GET", 
				url:proxyurl+gnserver+"q?fast=index" + amp() + "from="+(1+page*25) + amp() + "to="+((25+page*25))+ amp() + "any="+vl+"*"  + amp() + "type="+tp, 
				datatype:"xml", 
				success: function(data){
					
						console.log($.parseXML(data));
					
						//For each record
						$(data).find("metadata").each(function(){
							var md = {wmslinks:[],title:"",oms:"",image:"",bounds:[],contact:""};
							md.wmslinks = [];
							md.wmclinks = [];
							// Check if link is defined
							$(this).find("link").each(function(){
								console.log($(this).text());
								wmslink = splitLink($(this).text());
								if (wmslink.isWMS) md.wmslinks.push(wmslink);
								if (wmslink.isWMC) md.wmclinks.push(wmslink);
								return false;
							});
							//Check if record has WMS url and layername defined >if so: create entry in table
							md.title=$(this).find("title").text();
							md.oms=$(this).find("abstract").text();
							md.bounds = $(this).find("geoBox").text().split("|");
							md.contact = $(this).find("responsibleParty").text().split("|")[2];
							if (displayThumb){
							md.image="resources/res/style/img/no_thumbnail.png";
							try{//check all images, get the first valid one
								$(this).find("img").each(function(){
									if (ValidUrl($(this).text().split("|")[1])){
										md.img=$(this).text().split("|")[1];
										return false;
									}
								});
							} catch(err){}
							}
							result.push(md);
						});
					
		
					if (result.length==0){
						
						$( "#mdResults" ).html("Geen resultaten").dialog({autoOpen: true});
						
					} else {
					
						//now push the data to listview
						var output ="";
						$(result).each(function(){
							
							output +="<div class='mdBox'>";
							output +="<div style=\"float:left\"><img src='"+this.image+"' class='mdImage' /></div>";
							output +="<div style=\"margin-left:135px\"><p><span class='mdTitle'>"+this.title+"</span><br/>";
							if (this.oms) output +=""+this.oms.substring(0,270) + "<br/>";
							
							if (this.wmclinks.length > 0) {
								output+="<button style=\"float:right\" onclick=\"loadMap('"+this.wmclinks[0].url+"');\">Open themakaart</button>";
							}
							
							//todo: onderscheid maken tussen 1 laag en meerdere lagen, meerdere lagen als split button
							if (this.wmslinks.length == 1) {
								output+="<button style=\"float:right\" onclick=\"$.URD.addWMS('"+this.wmslinks[0].url+"','"+this.wmslinks[0].layerName+"','"+this.wmslinks[0].layerTitle+"');\">Voeg toe aan kaart</button>";
							} else if (this.wmslinks.length > 1) {
								output+="<select style=\"float:right\" id=\"svLayers\" onchange=\"$.URD.addWMS('"+this.wmslinks[0].url+"',$('#svLayers').val(),$('#svLayers option:selected').text())\">";
								$(this.wmslinks).each(function(){ 
										if (this.layerTitle=="") this.layerTitle = this.layerName;
										output+="<option value='"+this.layerName+"'>"+(this.layerTitle||this.layerName)+"</option>";
								});
								output+="</select>";
							}
							
							if (this.wmclinks.length == 1) {
								output+="<button style=\"float:right\" onclick=\"loadMap('"+this.wmclinks[0].url+"');\">Voeg toe aan kaart</button>";
							} else if (this.wmclinks.length > 1) {
								output+="<select style=\"float:right\" id=\"wmcLayers\" onchange=\"loadMap($('#wmcLayers option:selected').value())\">";
								$(this.wmclinks).each(function(){ 
										if (this.layerTitle=="") this.layerTitle = this.layerName;
										output+="<option value='"+this.url+"'>"+(this.layerTitle||this.layerName)+"</option>";
								});
								output+="</select>";
							}
							
							if (this.contact) output+="<span class='mdContact'>"+this.contact+"</span> ";
				
							output +="</p></div><div style=\"clear:both\"></div>";
						});
	
				
			
						$( "#mdResults" ).html(output).dialog({
							autoOpen: true,
							height: 500,
							width: 750,
							modal: true,
							buttons:  [
								{text:"Vorige",click: function(){ getMDResults(page-1); }, disabled: (page==0) },
								{text:"Volgende",click: function(){ getMDResults(page+1); } }	
							]
						});
					}

				}, 
				error: function(){
					$( "#mdResults" ).html("Fout tijdens ophalen gegevens...").dialog({autoOpen: true});
				}
	
		});				
};					


function splitLink(linkNode){
	var data=linkNode.split("|");
	var result={};
	if(data&&data.length==4){
	try{ 
		var wmsString = data[3];
		if (wmsString.toUpperCase().indexOf("OGC:WMS")>-1) result.isWMS=true; else result.isWMS = false; 
	} catch(err){result.isWMS=false;console.log(err);}
	try{ 
		var wmcString = data[3];
		if (wmcString.toUpperCase().indexOf("OGC:WMC")>-1||wmcString.toUpperCase().indexOf("OGC.WMC")>-1) result.isWMC=true; else result.isWMC = false; 
	} catch(err){result.isWMC=false;console.log(err);}
	try{result.url= data[2];}catch(err){result.title="";}
	try{result.layerName=data[0];} catch(err){result.layerName="";}
	try{result.layerTitle=data[1];}catch(err){result.layerTitle="";}
	}
	return result;
}

function ValidUrl(str) {
  if(str.indexOf("http://")==0 || str.indexOf("https://")==0) {
    return true;
  } else {
    return false;
  }
}

function setButtons() {
	$( ".mdBtn" ).button().next().button({
		text: false,
		icons: { primary: "ui-icon-triangle-1-s" }
	}).click(function() {
			var menu = $( this ).parent().next().show().position({
			my: "right top",
			at: "right bottom",
			of: this
		});
		$( document ).one( "click", function() {
			menu.hide();
		});
		return false;
	}).parent().buttonset().next().hide().menu()
}
