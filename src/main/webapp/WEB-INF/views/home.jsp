<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ page session="false" %>

<!doctype html>
<html lang="nl">
 <head>
  <meta charset="utf-8">
  <title>Waalweelde - dashboard - Provincie Gelderland</title>
  <link href='//fonts.googleapis.com/css?family=Arimo:400,700,400italic,700italic' rel='stylesheet' type='text/css'>
 
  </head>
<body>



<div id="header" class="ui-layout-north"></div>
<div id="center" class="ui-layout-center">
<div id="toolbar" class="ui-layout-north" style="display:none">
    <!-- todo: button open kaart -->
    <button onclick="window.open('http://research.geodan.nl/sites/waalweelde/service/#zoom='+client.kaart1.zoom+'&lat='+client.kaart1.center.lat+'&lon='+client.kaart1.center.lon+'&layers=BTTT','vegmod','width=1000,height=830')" role="button" class="ui-button ui-widget ui-state-default ui-corner-all ui-panel-titlebar-minus toolbarButton" aria-disabled="false" title="Input voor vegetatiemodel" style="float:right">Vegetatiemodel</button>
    <a href="/" role="button" class="ui-button ui-widget ui-state-default ui-corner-all ui-panel-titlebar-minus toolbarButton" title="Terug naar Waalweelde portaal" aria-disabled="false" style="float:right">Sluiten</a> 
  	<button id="mdSave" role="button" class="ui-button ui-widget ui-state-default ui-corner-all ui-panel-titlebar-minus toolbarButton" title="Sla de huidige kaartconfiguratie op, zodat deze in de catalogus vindbaar wordt" aria-disabled="false" style="float:right">Opslaan</button> 
  	<div id="mapTitle" style="padding:8px"></div> 
  </div>
  <div id="map1" class="ui-layout-center">
    <!--<div class="panel-header">kaart 1</div>-->
    <div id="map1-map" class="map-panel"><span id="pointer1" class="map-pointer"></span></div>
  </div>
  <div id="map2" class="ui-layout-east">
    <!-- <div class="panel-header">kaart 2</div> -->
    <div id="map2-map" class="map-panel"><span id="pointer2" class="map-pointer"></span></div>
  </div>
 
<div class="ui-layout-south"></div>
</div>
<div class="ui-layout-west" style="display:none">
  <div id="layers">
  <div class="west-element"><div class="panel-header"><span class="ui-panel-title">Informatie bronnen</span>
    <button class="ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only ui-panel-titlebar-minus" role="button" aria-disabled="false" title="minify"><span class="ui-button-icon-primary ui-icon ui-icon-minus"></span><span class="ui-button-text">minify</span></button></div>



<div id="tabs" class="west-element-content" style="padding:none">
<ul>
<li><a href="#tabs-1">Catalogus</a></li>
<!-- <a href="#tabs-2">Extra</a></li> --><li>
</ul>

 
<div id="tabs-1">
	<div class="extra-content">
	<input type="text" id="mdSuggest" value="" style="width:160px"/>
	<button id="mdQuery" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only ui-panel-titlebar-minus" role="button" aria-disabled="false" title="zoek">
	<span class="ui-button-icon-primary ui-icon ui-icon-search"></span><span class="ui-button-text">zoek</span></button><br/>
	<div><!--   style="float:left">-->
	<i>Type</i><br/>
	<input type=radio id=doctype1 value=software name=doctype><label for="doctype1">Themakaart</label><br/>
	<input type=radio id=doctype2 value=dataset name=doctype><label for="doctype2">Dataset</label><br/>
	<input type=radio id=doctype3 value=any name=doctype><label for="doctype3">Allen</label>
	</div><!--<div>
	<i>Locatie</i><br/>
	<input type=radio id=loctype1 value=map name=loctype><label for="loctype1">Kaart</label><br/>
	<input type=radio id=loctype2 value=waalweelde name=loctype><label for="loctype2">Waalweelde</label><br/>
	<input type=radio id=loctype3 value=global name=loctype><label for="loctype3">Landelijk</label>
	</div>-->
	</div>
</div>
<!--  
<div id="tabs-2"> 
 <div class="extra-content">

  <div class="project-content ui-helper-clearfix" onclick="$.URD.addWMS('http://waalweelde.geocat.net/geoserver/wms')"><button  class="ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only " role="button" aria-disabled="false" title="Bekijk lagen"><span class="ui-button-icon-primary ui-icon ui-icon-carat-1-e"  ></span></button><span>Waterveiligheid </span>
<div class="project-layers"></div>
</div>
<div class="project-content ui-helper-clearfix" onclick="$.URD.addWMS('http://waalweelde.geocat.net/geoserver/wms')"><button  class="ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only " role="button" aria-disabled="false" title="Bekijk lagen"><span class="ui-button-icon-primary ui-icon ui-icon-carat-1-e"  ></span></button><span>Vegetatiestructuur</span>
<div class="project-layers"></div>
</div>
<div class="project-content ui-helper-clearfix" onclick="$.URD.addWMS('http://waalweelde.geocat.net/geoserver/wms')"><button  class="ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only " role="button" aria-disabled="false" title="Bekijk lagen"><span class="ui-button-icon-primary ui-icon ui-icon-carat-1-e" ></span></button><span>Natuur </span>
<div class="project-layers"></div>
</div>
</ul>
  </div>
  
  <div class="extra-content">
	Een specifieke WMS server:<br/>
<input type="text" id="tbWMS" style="width:160px" value="http://waalweelde.geocat.net/geoserver/wms"/>  <button id="addWMS" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only ui-panel-titlebar-minus" role="button" aria-disabled="false" title="verbind met de server"><span class="ui-button-icon-primary ui-icon ui-icon-transferthick-e-w"  onclick="$.URD.addWMS($('#tbWMS').val())"></span><span class="ui-button-text">verbind</span></button>

<br/>-->
	<div id="mdResults" title="Zoekresultaat"></div>
	<div id="wmsSelectLayer" title="Selecteer kaartlaag"></div>
<!-- </div>
</div>
</div>
-->
  </div>

    <div class="west-element"><div class="panel-header"><span class="ui-panel-title">Lagen </span>
    <button class="ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only ui-panel-titlebar-minus" role="button" aria-disabled="false" title="minify"><span class="ui-button-icon-primary ui-icon ui-icon-minus"></span><span class="ui-button-text">minify</span></button>
    </div>
    <div id="layertree" class="west-element-content">
    </div>
    </div>
    <div class="west-element">
    <div class="panel-header"><span class="ui-panel-title">Legenda </span>
    <button class="ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only ui-panel-titlebar-minus" role="button" aria-disabled="false" title="minify"><span class="ui-button-icon-primary ui-icon ui-icon-minus"></span><span class="ui-button-text">minify</span></button></div>
    <div id="legend"  class="west-element-content">
    </div>
    </div>
    <!--<div class="west-element">
    <div class="panel-header"><span class="ui-panel-title">Grafieken </span>
    <button class="ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only ui-panel-titlebar-minus" role="button" aria-disabled="false" title="minify"><span class="ui-button-icon-primary ui-icon ui-icon-minus"></span><span class="ui-button-text">minify</span></button></div>
    <div id="grafiek" class="west-element-content">
    </div>-->
    
  </div>
</div>




<div id="wmsSelectStyle" title="Selecteer een tekenstijl"></div>
<div id="wmsSelectOpacity" title="Wijzig het transparantie niveau"><div id="opacitySlider"></div></div>
<div id="saveMap" title="Themakaart opslaan" style="display:none">
Titel:<br/> <input type=text id="mapTitel" size="50"><span class="required">*</span><br/>
Omschrijving:</br>
<textarea rows="3" cols="60" id="mapAbstract"></textarea><br/>
Doel:<br/>
<textarea rows="3" cols="60" id="mapPurpose"></textarea><br/>

<input type="radio" id="local" value="local" name="location" checked="true"><label for="local">Lokaal</label>
<input type="radio" id="remote" value="remote" name="location"><label for="remote">Op de server</label>
</div>
<div title="Feature info" id="fipanel" style="display:none"></div>

  <!-- jquery 
  <script src="<c:url value="/resources/res/lib/jquery.js"/>"></script>-->
  <script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
  <script src="<c:url value="/resources/res/lib/jquery-ui.js"/>"></script>
  <link rel="stylesheet" type="text/css" href="<c:url value="/resources/res/style/jquery-ui-1.10.3.custom/css/custom-theme/jquery-ui-1.10.3.custom.css"/>" />

  <!--  jquery.layout from:  http://layout.jquery-dev.net/  -->
  <script type="text/javascript" src="<c:url value="/resources/res/lib/jquery.layout-latest.js"/>"></script>
	<script type="text/javascript" src="<c:url value="/resources/res/lib/taphold.js"/>"></script>
	<script type="text/javascript" src="<c:url value="/resources/res/lib/jquery.ui-contextmenu.min.js"/>"></script>
  
  <!--https://github.com/codepb/jquery-template-->
  <script src="<c:url value="/resources/res/lib/jquery.tmpl.js"/>"></script>

  <!-- openlayers -->
  <link rel="stylesheet" type="text/css" href="<c:url value="/resources/res/lib/openlayers/theme/default/style.css"/>" />


  <script type="text/javascript" src="<c:url value="/resources/res/lib/openlayers/lib/OpenLayers.js"/>"></script>
  
  <!-- custom styles -->  
  <link rel="stylesheet" type="text/css" href="<c:url value="/resources/res/style/client.css"/>" />
  
  <!-- custom scripts  -->  
  <script type="text/javascript" src="<c:url value="/resources/res/script/config.jsp"/>"></script>
  <script type="text/javascript" src="<c:url value="/resources/res/script/layout.js"/>"></script>
  <script type="text/javascript" src="<c:url value="/resources/res/script/urd.js"/>"></script>
  <script type="text/javascript" src="<c:url value="/resources/res/script/urd.legend.js"/>"></script>
  <script type="text/javascript" src="<c:url value="/resources/res/script/urd.stylechoice.js"/>"></script>
  <script type="text/javascript" src="<c:url value="/resources/res/script/opacity.js"/>"></script>
  <script type="text/javascript" src="<c:url value="/resources/res/script/urd.extent.js"/>"></script>
  <script type="text/javascript" src="<c:url value="/resources/res/script/legend.js"/>"></script>
  <script type="text/javascript" src="<c:url value="/resources/res/script/layertree.js"/>"></script>
  <script type="text/javascript" src="<c:url value="/resources/res/script/csw.js"/>"></script>
  <script type="text/javascript" src="<c:url value="/resources/res/script/wms.js"/>"></script>
  <script type="text/javascript" src="<c:url value="/resources/res/script/wmc.js"/>"></script>  
  <script type="text/javascript" src="<c:url value="/resources/res/script/featureinfo.js"/>"></script>  
<!--  
  <script type="text/javascript" src="<c:url value="/resources/res/script/graph.js"/>"></script> -->

  <script type="text/javascript" src="<c:url value="/resources/res/lib/proj4js/lib/proj4js-compressed.js"/>"></script> 
  <script>
  Proj4js.defs["EPSG:28992"] = "+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +no_defs";
  </script>

</body>
</html>  
