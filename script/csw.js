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
			output +="<div style=\"border-bottom:1px #ccc solid\">";
			output +="<div style=\"float:left\"><img src='"+this.image+"' style=\"width:120px;\"/></div>";
			output +="<div style=\"margin-left:125px\"><p><b>"+this.title+"</b><br/>";
			if (this.oms) output +=""+this.oms.substring(0,270); + "<br/>";
			if (this.contact) output+="<i>"+this.contact+"</i> ";
			var bnds = "[]";
			try {
				bnds = "[["+this.bounds[1]+","+this.bounds[0]+"],["+this.bounds[3]+","+this.bounds[2]+"]]";
			} catch(exp){}
			$(this.wmslinks).each(function(){ 
				if (this.url != "" && this.layerName != "") {
					if (this.layerTitle=="") this.layerTitle = this.layerName;
					
					output +="<input type=\"button\" data-role=\"button\" onclick=\"add2map('"+this.url+"','"+this.layerName+"','"+this.layerTitle+"',"+bnds+");\" value=\"Add "+this.layerName+" to map\" style=\"float:right\"/>";
				}
			})
			output +="</p></div>";
		});
console.log(output);
		$( "#mdResults" ).html(output).dialog({
			autoOpen: true,
			height: 500,
			width: 750,
			modal: true
		});
	}
	});				
	});					
});



function add2map(url,name,title,bounds){
	alert('add2map '+ title);
	return;
	if (name==""){
		alert('no layername');
		return false;
	}
	var tmp = L.tileLayer.wms(url,{
		layers: name,
		format: 'image/png',
		transparent: true,    
		opacity: 0.7       
	});
	tmp.addTo(map);
	layerControl.addOverlay(tmp,title);	

	if (bounds.length!=0) map.setView(new L.LatLngBounds(bounds[0],bounds[1]).getCenter(),map.getZoom());

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
