 
 Ext.onReady(function() {
 
  var ltree = new Ext.Container({
  applyTo: 'layertree',
  id:"ltreec"
 })
 
 app2 = new gxp.Viewer({
    id:"viewer2",
    portalConfig: {id: "viewer2", xtype: "panel", split:true, width: "50%", region: "east", title: "kaart 2", collapsible: true,              collapseMode: "mini"},
    portalItems: ["map2"],
    mapItems: [
        {
            xtype: "gx_zoomslider",
            vertical: true,
            height: 100
        }
    ],
    sources: {
        brt: {
            ptype: "gxp_olsource"
        }
    },
    map: {
    
        id: "map2",
        region: "center",
         projection: "EPSG:28992",
        units: "m",
        resolutions: [3440.64, 1720.32, 860.16, 430.08, 215.04, 107.52, 53.76,
					26.88, 13.44, 6.72, 3.36, 1.68, 0.84, 0.42, 0.21],
        maxExtent: [-285401.92,22598.08,595401.9199999999,903401.9199999999],
        layers: [{
            source: "brt",
            type: "OpenLayers.Layer.WMTS",
            args: [{name: 'BRT Achtergrondkaart (WMTS)',
        url: 'http://geodata.nationaalgeoregister.nl/wmts/',
        layer: 'brtachtergrondkaart',
        style: null,
        matrixSet: "EPSG:28992",
        matrixIds:  matrixIds2,
        visibility: true,
        attribution: '(c) OSM & Kadaster',
        format: "image/png8"}]
        }],
        allOverlays: true
    },
    tools: [{
            
            outputTarget: 'ltreec',
            ptype: "gxp_layermanager",
            id: "lm2",
            outputConfig: {
                id: "tree2",
                title: "Kaartlagen kaart 2",
                tbar: []  // we will add buttons to "tree.bbar" later
            }
        }],
    listeners: {
        portalReady: createViewport
    }
    

});
 
});