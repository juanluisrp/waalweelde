var gnserver = "http://www.nationaalgeoregister.nl/geonetwork/srv/dut/";	
var proxyurl = "proxy.php?url=";
var displayThumb = true;

$(document).ready(function() {

$("#mdSuggest").autocomplete({  
				//define callback to format results  
				source: function(request, response){  
								$.ajax({
									url: proxyurl+gnserver+"/main.search.suggest?field=any%26q="+request.term,
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
            
        			
	result=[];
	var vl = $("#mdSuggest").val();
	if (typeof(vl)=='undefined') vl="";

	$.ajax({	type:"GET", 
				url:proxyurl+gnserver+"q?fast=index%26from=1%26to=25%26any="+vl+"*%26dynamic=true", 
				datatype:"xml", 
				success: function(data){

		$(data).find("response").each(function(){

			//For each record
			$(this).find("metadata").each(function(){
				var md = {wmslinks:[],title:"",oms:"",image:"",bounds:[],contact:""};
				md.wmslinks = [];
				// Check if link is defined

				$(this).find("link").each(function(){
					wmslink = splitLink($(this).text());
					if (wmslink.isWMS) md.wmslinks.push(wmslink);
					return false;
				})
				//Check if record has WMS url and layername defined >if so: create entry in table
				md.title=$(this).find("title").text();
				md.oms=$(this).find("abstract").text();
				md.bounds = $(this).find("geoBox").text().split("|");
				md.contact = $(this).find("responsibleParty").text().split("|")[2];
				if (displayThumb){
				md.image="media/default_thumbnail.png"
				try{//check all images, get the first valid one
					$(this).find("image").each(function(){
						if (ValidUrl($(this).text().split("|")[1])){
							md.image=$(this).text().split("|")[1];
							return false;
						}
					});
				} catch(err){}
				}
				result.push(md);
			})
		})
		
		//now push the data to listview
		var output ="";
		$(result).each(function(){
			output +="<div class='mdBox'>";
			output +="<div style=\"float:left\"><img src='"+this.image+"' class='mdImage' /></div>";
			output +="<div style=\"margin-left:135px\"><p><span class='mdTitle'>"+this.title+"</span><br/>";
			if (this.oms) output +=""+this.oms.substring(0,270) + "<br/>";
			if (this.contact) output+="<span class='mdContact'>"+this.contact+"</span> ";
			var bnds = "[]";
			try {
				bnds = "[["+this.bounds[1]+","+this.bounds[0]+"],["+this.bounds[3]+","+this.bounds[2]+"]]";
			} catch(exp){}
			
			if (this.wmslinks.length > 0){
				output+="<div style=\"float:right\"><button class=\"mdBtn\" onclick=\"add2map('"+this.wmslinks[0].url+"','"+this.wmslinks[0].layerName+"','"+this.wmslinks[0].layerTitle+"',"+bnds+", client.kaart1);\">Voeg "+this.wmslinks[0].layerTitle+" toe aan kaart</button><button id=\"select\">Selecteer</button></div><ul>";
				$(this.wmslinks).each(function(){ 
					//if (this.url != "" && this.layerName != "") {
						if (this.layerTitle=="") this.layerTitle = this.layerName;
						output+="<li><a onclick=\"add2map('"+this.url+"','"+this.layerName+"','"+this.layerTitle+"',"+bnds+", client.kaart1);\" href=\"#\">"+this.layerTitle+" links</a></li>";
						output+="<li><a onclick=\"add2map('"+this.url+"','"+this.layerName+"','"+this.layerTitle+"',"+bnds+", client.kaart2);\" href=\"#\">"+this.layerTitle+" rechts</a></li>";
					//}
				})
				output+="</ul></div>";
			}
			output +="</p></div><div style=\"clear:both\"></div>";
		});

		$( "#mdResults" ).html(output).dialog({
			autoOpen: true,
			height: 500,
			width: 750,
			modal: true
		});
		setButtons();
	}
	});				
	});					
});

function add2map(url,name,title,bounds,map){
	
	client.layers({type:'wms', url: url, layers: name});
	
	//map.addLayer(new OpenLayers.Layer(title, {isBaseLayer:false,url:url,layers:name}));
	
	

	//if (bounds.length!=0) map.zoomToExtent(bounds,1);

}

function splitLink(linkNode){
	var data=linkNode.split("|");
	var result={}
	try{ 
		var wmsString = data[3];
		if (wmsString=="OGC:WMS") result.isWMS=true; else result.isWMS = false; 
	} catch(err){result.isWMS=false;}
	try{result.url= data[2];}catch(err){result.title="";}
	try{result.layerName=data[0];} catch(err){result.layerName="";}
	try{result.layerTitle=data[1];}catch(err){result.layerTitle="";}
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
