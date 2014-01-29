var app1, app2;
var viewer;
var portalsReady = 0;
 
//WMTS uses TILEMATRIXes instead of Z, so we need to have an array of all the needed IDs  
//For PDOK/BRT:
var matrixIds2 = new Array(26);
	    for (var i=0; i<26; ++i) {
	        matrixIds2[i] = 'EPSG:28992'+':' + i;
	    }        
//WMTS uses TILEMATRIXes instead of Z, so we need to have an array of all the needed IDs
//For PDOK/luchtfoto:
      var matrixIds3 = new Array(26);
	    for (var i=0; i<10; ++i) {
	        matrixIds3[i] = '0' + i;
	    }  for (var i=10; i<26; ++i) {
	        matrixIds3[i] = '' + i;
	    }
		
function createViewport() {
    portalsReady++;
    if (portalsReady == 2) {
        viewer = new Ext.Viewport({
            layout:'border',
            items: [ 
            
              
              "viewer1"
            
            ]
        });
    
    initialise();
    }
}  