
var olmap1, olmap2, layerManager;
function initialise(){

 olmap1 = app1.mapPanel.map;
olmap2 = app2.mapPanel.map;

olmap1.events.on({"move":move1Listener});
olmap2.events.on({"moveend":move2Listener});
 // afterrender(funtion(){ext.get(radio).attr(name,"new")
/*
app1.applyConfig({
  mapItems: [
        {
            xtype: "gx_zoomslider",
            vertical: true,
            height: 100
        }
    ],
    sources: {
        osm: {
            ptype: "gxp_osmsource"
        }
    },
    map: {
        id: "map1",
        region: "center",
        projection: "EPSG:900913",
        units: "m",
        numZoomLevels: 21,
        maxResolution: 156543.03390625,
        maxExtent: [
            -20037508.34, -20037508.34,
            20037508.34, 20037508.34
        ],
        extent: [-13650159, 4534735, -13609227, 4554724],
        layers: [{
            source: "osm"
        }],
        allOverlays: true
    },tools: [{
            ptype: "gxp_layermanager",
            id: "lm1",
            outputConfig: {
                id: "tree",
                title: "Layers",
                tbar: []  // we will add buttons to "tree.bbar" later
            },
            outputTarget: "westPanel"
        }]
  });
  app2.applyConfig({
  mapItems: [
        {
            xtype: "gx_zoomslider",
            vertical: true,
            height: 100
        }
    ],
    sources: {
        osm2: {
            ptype: "gxp_osmsource"
        }
    },
    map: {
        id: "map2",
        region: "center",
        projection: "EPSG:900913",
        units: "m",
        numZoomLevels: 21,
        maxResolution: 156543.03390625,
        maxExtent: [
            -20037508.34, -20037508.34,
            20037508.34, 20037508.34
        ],
        extent: [-13650159, 4534735, -13609227, 4554724],
        layers: [{
            source: "osm2"
        }],
        allOverlays: true
    },tools: [{
            ptype: "gxp_layermanager",
            id: "lm2",
            outputConfig: {
                id: "tree2",
                title: "Layers 2",
                tbar: []  // we will add buttons to "tree.bbar" later
            },
            outputTarget: "westPanel"
        }]
  });*/
}

function  move1Listener(e) {
 var center  = olmap1.getCenter();
 var zoom = olmap1.getZoom();
 //olmap2.events.un({"move":move2Listener});
 olmap2.setCenter(center);
 olmap2.zoomTo(zoom);
 //olmap2.events.on({"move":move2Listener});
}
function  move2Listener(e) {
 var center  = olmap2.getCenter();
 var zoom = olmap2.getZoom(); 
 olmap1.setCenter(center);
 olmap1.zoomTo(zoom);
}