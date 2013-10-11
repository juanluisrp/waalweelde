var app;
Ext.onReady(function() {
    app = new gxp.Viewer({
        proxy: "/geoserver/rest/proxy?url=",
        portalConfig: {
                        renderTo: document.body,
            layout: "border",
            width: 650,
            height: 465,
            
            // by configuring items here, we don't need to configure portalItems
            // and save a wrapping container
            items: [{
              
                id: "centerpanel",
                region: "center",
                border: true,
                items: ["mymap"]
            },  {
                // container for the queryform
                id: "west",
                xtype: "container",
                layout: "fit",
                region: "west",
                width: 200
            }]
        },
        
        // configuration of all tool plugins for this application
        tools: [{
            ptype: "gxp_layertree",
            outputConfig: {
                id: "tree",
                border: true,
                tbar: [] // we will add buttons to "tree.bbar" later
            },
            outputTarget: "west"
        }, {
            ptype: "gxp_addlayers",
            actionTarget: "tree.tbar"
        }, {
            ptype: "gxp_removelayer",
            actionTarget: ["tree.tbar", "tree.contextMenu"]
        }, {
            ptype: "gxp_layerproperties",
            actionTarget: ["tree.tbar", "tree.contextMenu"]
        }, {
            ptype: "gxp_zoomtoextent",
            actionTarget: "map.tbar"
        }, {
            ptype: "gxp_zoom",
            actionTarget: "map.tbar"
        }, {
            ptype: "gxp_navigationhistory",
            actionTarget: "map.tbar"
        }, {
            ptype: "gxp_wmsgetfeatureinfo",
            outputConfig: {
                width: 400,
                height: 200
            },
            actionTarget: "map.tbar", // this is the default, could be omitted
            toggleGroup: "layertools"
        }, {
            ptype: "gxp_mapproperties",
            outputConfig: {
                title: 'Map properties'
            }
        },{
            // shared FeatureManager for feature editing, grid and querying
            ptype: "gxp_featuremanager",
            id: "featuremanager",
            maxFeatures: 20
        }
          ],
        
        // layer sources
        defaultSourceType: "gxp_wmssource",
        sources: {
            local: {
                url: "/cgi-bin/mapserv.exe?map=C:/ms4w/Apache/htdocs/projects/kwrtest/maps/kwrtest.map&service=WMS",
                version: "1.1.1"
            },  mapquest: {
                ptype: "gxp_mapquestsource"
            },
            ol: {
                ptype: "gxp_olsource"
            }
        },
        
        // map and layers
        map: {
            id: "mymap", // id needed to reference map in portalConfig above
            title: "Map",
            projection: "EPSG:28992",
            units: "m",
            maxExtent: [0,300000,300000,630000],
            center: [120000,450000],
            zoom: 3,
            layers: [{
                source: "ol",
                type: "OpenLayers.Layer",
                args: ["Blank"],
                visibility: false,
                group: "background"
            }, 
			{
                source: "mapquest",
                name: "Open Street Map",
                group: "background"
            }, 
			{
                source: "local",
                name: "testmp22",
                title: "States, USA - Population",
                queryable: true,
                bbox: [0,300000,300000,630000],
                selected: true
            }],
            items: [{
                xtype: "gx_zoomslider",
                vertical: true,
                height: 100
            }]
        }
    });
});
