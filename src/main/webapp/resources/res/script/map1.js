
Ext.onReady(function() {

  app1 = new gxp.Viewer({
    portalConfig: {id: "viewer1", xtype: "panel", region: "center"},
     portalItems: [{
              xtype: "panel",
              id: "header",
              region: "north",        
              height: 85
            },{
              xtype: "panel",
              id: "westPanel",
              title: "Informatie bronnen",
              region: "west",
              width: 200,
              split: true,
              collapseMode: "mini",
              items: [
              {
                xtype: "panel",
                id: "layertree1"
              },
              {
                xtype: "panel",
                id:"layertree2",
                contentEl:'layertree'
              }
              ]
            },{ 
              xtype: "panel",
              region: "center",
              layout: "border",

               
              
              items: [{
                xtype: "toolbar",
                region:"north",
                height:25
              },
              
              "map1","viewer2",
              {
                xtype: "panel",
                region:"south",
                split:true,
                height:25
              }]
            }],
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
        },
        lucht: {
            ptype: "gxp_olsource"
        }
    },
    map: {
        title: 'kaart 1',
        split: true, 
        id: "map1",
        region: "center",
        projection: "EPSG:28992",
        units: "m",
        resolutions: [3440.64, 1720.32, 860.16, 430.08, 215.04, 107.52, 53.76,
					26.88, 13.44, 6.72, 3.36, 1.68, 0.84, 0.42, 0.21],
        maxExtent: [-285401.92,22598.08,595401.9199999999,903401.9199999999],
        layers: [{
            source: "brt" ,
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
        },{
          source: "lucht" ,
            type: "OpenLayers.Layer.WMTS",
            args: [{
        
        name: 'PDOK luchtfoto (WMTS)',
        url: 'http://geodata1.nationaalgeoregister.nl/luchtfoto/wmts?style=&',
        layer: 'luchtfoto',
        style: null,
        matrixSet: "nltilingschema",
        matrixIds:  matrixIds3,
        visibility: false,
        attribution: '(c) OSM & Kadaster',
        format: "image/jpeg"}]
        }]
    },
    tools: [{
            outputTarget: 'layertree1',
            ptype: "gxp_layermanager",
            id: "lm1",
            outputConfig: {
                id: "tree",
                title: "Kaartlagen kaart 1",
                tbar: []  // we will add buttons to "tree.bbar" later
            }
        }],
    listeners: {
        portalReady: createViewport
    }
});
  
  
});