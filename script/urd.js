(function($) {
$.URD = $.URD || {};

$.URD.Client = function(element, options) {
  var self = this;
  this.element =element;
  if(options){
    if(!options.maxResolution&&options.maxExtent&&options.projection){
        options.maxResolution = (options.maxExtent[2]-options.maxExtent[0])/256;
  }}
  this.options = $.extend({}, new $.fn.urd.defaults.map(), options);
  this.element = element;
  
  this.olMapOptions = $.extend({}, this.options);
  delete this.olMapOptions.layers;
  delete this.olMapOptions.maxExtent;
  delete this.olMapOptions.zoomToMaxExtent;
  delete this.olMapOptions.center;
  
  this.maxExtent = this.options.maxExtent;
  this.olMapOptions.maxExtent = new OpenLayers.Bounds(
  this.maxExtent[0],this.maxExtent[1],this.maxExtent[2],this.maxExtent[3]);


  this.projection = this.options.projection;
  this.displayProjection = this.options.displayProjection;

  OpenLayers.IMAGE_RELOAD_ATTEMPTS = 3;
  OpenLayers.Util.onImageLoadErrorColor = "transparent";
  
  
  this.kaart1 = new OpenLayers.Map('map1-map', this.olMapOptions);;
  this.kaart2 = new OpenLayers.Map('map2-map', this.olMapOptions);;
  //OpenLayers doesn't want to return a maxExtent when there is no baselayer
  //set (eg on an empty map, so we create a fake baselayer
  this.kaart1.addLayer(new OpenLayers.Layer('fake', {isBaseLayer: true}));
  this.kaart2.addLayer(new OpenLayers.Layer('fake1', {isBaseLayer: true}));

  // Keep IDs of vector layer for select feature control
    this.vectorLayers = [];
    this.selectFeatureControl = null;
  
  
  /* this bit should be more dynamic*/
  /* var matrixIds2 = new Array(26);
  for (var i=0; i<26; ++i) {
  matrixIds2[i] = 'EPSG:28992'+':' + i;
  }        
  var matrixIds3 = new Array(26);
  for (var i=0; i<10; ++i) {
  matrixIds3[i] = '0' + i;
  }  
  for (var i=10; i<26; ++i) {
  matrixIds3[i] = '' + i;
  }
  var brt = new OpenLayers.Layer.WMTS({
  layertype: 'WMTS',
  name: 'BRT Achtergrondkaart (WMTS)',
  url: 'http://geodata.nationaalgeoregister.nl/wmts/',
  layer: 'brtachtergrondkaart',
  style: null,
  matrixSet: "EPSG:28992",
  matrixIds:  matrixIds2,
  visibility: true,
  attribution: '(c) OSM & Kadaster',
  format: "image/png8"
  })      
  var brt2 = new OpenLayers.Layer.WMTS({
  layertype: 'WMTS',
  name: 'BRT Achtergrondkaart (WMTS)',
  url: 'http://geodata.nationaalgeoregister.nl/wmts/',
  layer: 'brtachtergrondkaart',
  style: null,
  matrixSet: "EPSG:28992",
  matrixIds:  matrixIds2,
  visibility: true,
  attribution: '(c) OSM & Kadaster',
  format: "image/png8"
  }) 

  this.kaart1.addLayer(brt);
  this.kaart2.addLayer(brt2);

  this.kaart1.zoomToMaxExtent();
  this.kaart2.zoomToMaxExtent();*/
  this.idCounter = 0;
  this.layersList = {};
  this.events = $({});

  this.handlers = {
    // Triggers the jQuery events, after the OpenLayers events
    // happened without any further processing
    simple: function(data) {
      this.trigger(data.type);
    }
  };
  
  element.data('urd', this);
  if (this.options.layers!==undefined) {
    this.layers(this.options.layers);
    // You can only go to some location if there were layers added
    if (this.options.center!==undefined) {
      this.center(this.options.center);
    }
  };
  
  this.move1Listener = function(e) {
    var center  = client.kaart1.getCenter();
    var zoom = client.kaart1.getZoom();
    client.kaart2.setCenter(center);
    client.kaart2.zoomTo(zoom);
  }
  this.move2Listener = function(e) {
    var center  = client.kaart2.getCenter();
    var zoom = client.kaart2.getZoom(); 
    client.kaart1.setCenter(center);
    client.kaart1.zoomTo(zoom);
  }
  this.kaart1.events.on({"move":this.move1Listener});
  this.kaart2.events.on({"moveend":this.move2Listener});
   /*until here that is */
  
    

  
};
$.URD.Client.prototype = {
  layers: function(options) {
        //var o = $.extend({}, options);
        var self = this;
        switch(arguments.length) {
        case 0:
            return this._allLayers();
        case 1:
            if (!$.isArray(options)) {
                return this._addLayer(options);
            }
            else {
                return $.map(options, function(layer) {
                    return self._addLayer(layer);
                }).reverse();
            }
            break;
        default:
            throw('wrong argument number');
        }
    },
    // Returns all layers as an array, sorted by there order in the map. First
    // element in the array is the topmost layer
    _allLayers: function() {
        var layers = [];
        $.each(this.layersList, function(id, layer) {
            var item = [layer.position(), layer];
            layers.push(item);
        });
        var sorted = layers.sort( function compare(a, b) {
            return a[0] - b[0];
        });
        var result = $.map(sorted, function(item) {
            return item[1];
        });
        return result.reverse();
    },
    _addLayer: function(options) {
        var id = this._createId();
        var layer = new $.URD.Layer(this, id, options);
        // NOTE vmx 20120305: Not sure if this is a good idea, or if it would
        //     be better to include `options` with the preaddlayer event
        /*if (this._triggerReturn('preaddlayer', [layer])===false) {
            return false;
        }*/
        this.kaart1.addLayer(layer.olLayer);
        this.kaart2.addLayer(layer.olLayer.clone());
        
        this.layersList[id] = layer;
        if (layer.isVector) {
            this.vectorLayers.push(id);
        }


        layer.trigger('addlayer');
        return layer;
    },
    // Creates a new unique ID for a layer
    _createId: function() {
        return 'urd_' + this.idCounter++;
    },
    _removeLayer: function(id) {
        var layer = this.layersList[id];
        if (this._triggerReturn('preremovelayer', [layer])===false) {
            return false;
        }

        // remove id from vectorlayer if it is there list
        this.vectorLayers = $.grep(this.vectorLayers, function(elem) {
            return elem != id;
        });
        this._updateSelectFeatureControl(this.vectorLayers);
        this.kaart1.removeLayer(layer.olLayer);
        //TODO: dit gaat vast niet werken
        this.kaart2.removeLayer(layer.olLayer);
        
        // XXX vmx: shouldn't the layer be destroyed() properly?
        delete this.layersList[id];

        layer.trigger('removelayer');
        return this;
    },
    center: function (options) {
        var position;
        var mapProjection = this.projection;
        // Determine source projection
        var sourceProjection = null;
        var zoom;
        var box;
        if(options && options.projection) {
            sourceProjection = options.projection;
        } else {
            var displayProjection = this.displayProjection;
            if(!displayProjection) {
                // source == target
                sourceProjection = 'EPSG:4326';
            } else {
                sourceProjection = displayProjection;
            }
        }

        // Get the current position
        if (arguments.length===0) {
            position = this.kaart1.getCenter();
            zoom = this.kaart1.getZoom();
            box = this.kaart1.getExtent();

            if (mapProjection != sourceProjection) {
                position.transform(mapProjection, sourceProjection);
            }
            box.transform(mapProjection,sourceProjection);
            box = box!==null ? box.toArray() : [];
            return {
                position: [position.lon, position.lat],
                zoom: this.kaart1.getZoom(),
                box: box
            };
        }

        // Zoom to the extent of the box
        if (options.box!==undefined) {
            box = new OpenLayers.Bounds(
                options.box[0], options.box[1],options.box[2], options.box[3]);
            if (mapProjection != sourceProjection) {
                box.transform(sourceProjection,mapProjection);
            }
            this.kaart1.zoomToExtent(box);
            this.kaart2.zoomToExtent(box);

        }
        // Only zoom is given
        else if (options.position===undefined) {
            this.kaart1.zoomTo(options.zoom);
            this.kaart2.zoomTo(options.zoom);
        }
        // Position is given, zoom maybe as well
        else {
            position = new OpenLayers.LonLat(options.position[0],
                                             options.position[1]);
            if (mapProjection != sourceProjection) {
                position.transform(sourceProjection, mapProjection);
            }
            // options.zoom might be undefined, so we are good to
            // pass it on
            this.kaart1.setCenter(position, options.zoom);
            this.kaart2.setCenter(position, options.zoom);
        }
    },
    bind: function(types, data, fn) {
        var self = this;

        // A map of event/handle pairs, wrap each of them
        if(arguments.length===1) {
            var wrapped = {};
            $.each(types, function(type, fn) {
                wrapped[type] = function() {
                    return fn.apply(self, arguments);
                };
            });
            this.events.bind.apply(this.events, [wrapped]);
        }
        else {
            var args = [types];
            // Only callback given, but no data (types, fn), hence
            // `data` is the function
            if(arguments.length===2) {
                fn = data;
            }
            else {
                if (!$.isFunction(fn)) {
                    throw('bind: you might have a typo in the function name');
                }
                // Callback and data given (types, data, fn), hence include
                // the data in the argument list
                args.push(data);
            }

            args.push(function() {
                return fn.apply(self, arguments);
            });

            this.events.bind.apply(this.events, args);
        }
        return this;
    },
    trigger: function() {
        // There is no point in using trigger() insted of triggerHandler(), as
        // we don't fire native events
        this.events.triggerHandler.apply(this.events, arguments);
        return this;
    },
    // Basically a trigger that returns the return value of the last listener
    _triggerReturn: function() {
        return this.events.triggerHandler.apply(this.events, arguments);
    },
    destroy: function() {
        this.kaart1.destroy();
        this.kaart2.destroy();
        this.element.removeData('urd');
    }
};

$.URD.Layer = function(map, id, options) {

    var self = this;
    // apply default options that are not specific to a layer

    this.id = id;
    this.label = options.label || this.id;
    // a reference to the map object is needed as it stores e.g. the list
    // of all layers (and we need to keep track of it, if we delete a
    // layer)
    this.map = map;

    // true if this layer is a vector layer
    this.isVector = false;

    // to bind and trigger jQuery events
    this.events = $({});

    this.handlers = {
        // Triggers the jQuery events, after the OpenLayers events
        // happened without any further processing
        simple: function(data) {
            this.trigger(data.type);
        },
        // All OpenLayers events that are triggered by user interaction,
        // like clicking somewhere or selecting a feature, need to be
        // handled in a special way. Those OpenLayers events will then be
        // triggered by MapQuery as well
        // In case of the "featureselected" event, this means that the
        // logic of handling the event is completely within the event
        // handler. When ".select()" on a feature is called, it will just
        // trigger the OpenLayers "featureselected" event, whose handler
        // will then trigger the corresponding jQuery event.
        includeFeature: function(data) {
            var feature = new $.URD.Feature(this, {olFeature:
                                                        data.feature});
            this.trigger(data.type, [feature]);
        },
        prependLayer: function(data) {
            this.trigger('layer' + data.type);
        }
    };


    // create the actual layer based on the options
    // Returns layer and final options for the layer (for later re-use,
    // e.g. zoomToMaxExtent).
    var res = $.URD.Layer.types[options.type.toLowerCase()].call(
        this, options);
    this.olLayer = res.layer;
    this.options = res.options;

    // Some good documentation for the events is needed. Here is a short
    // description on how the current events compare to the OpenLayer
    // events on the layer:
    // - added, remove: not needed, there's addlayer and removelayer
    // - visibilitychanged: not needed, there's the changelayer event
    // - move, moveend: not needed as you get them from the map, not the layer
    // - loadstart, loadend: renamed to layerloadstart, layerloadend
    this.olLayer.events.on({
        scope: this,
        loadstart: this.handlers.prependLayer,
        loadend: this.handlers.prependLayer,
        featureselected: this.handlers.includeFeature,
        featureunselected: this.handlers.includeFeature,
        featureremoved: this.handlers.includeFeature
    });

    // To be able to retreive the MapQuery layer, when we only have the
    // OpenLayers layer available. For example on the layeradded event.
    // NOTE vmx 2012-02-26: Any nicer solution is welcome
    this.olLayer.mapQueryId = this.id;
};

$.URD.Layer.prototype = {
    down: function(delta) {
        delta = delta || 1;
        var pos = this.position();
        pos = pos - delta;
        if (pos<0) {pos = 0;}
        this.position(pos);
        return this;
    },
    // NOTE vmx: this would be pretty cool, but it's not easily possible
    // you could use $.each($.geojq.layer())) instead, this is for pure
    // convenience.
    each: function () {},

    remove: function() {
        // remove references to this layer that are stored in the
        // map object
        return this.map._removeLayer(this.id);
    },
    position: function(pos) {
        if (pos===undefined) {
            return this.map.kaart1.getLayerIndex(this.olLayer)-1;
        }
        else {
            this.map.kaart1.setLayerIndex(this.olLayer, pos+1);
            this.map.kaart2.setLayerIndex(this.olLayer, pos+1);
            this.trigger('changelayer', ['position']);
            return this;
        }
    },
    up: function(delta) {
        delta = delta || 1;
        var pos = this.position();
        pos = pos + delta;
        this.position(pos);
        return this;
    },
    visible: function(vis) {
        if (vis===undefined) {
            return this.olLayer.getVisibility();
        }
        else {
            this.olLayer.setVisibility(vis);
            this.trigger('changelayer', ['visibility']);
            return this;
        }
    },
    opacity: function(opac) {
        if (opac===undefined) {
            // this.olLayer.opacity can be null if never
            // set so return the visibility
            var value = this.olLayer.opacity ?
            this.olLayer.opacity : this.olLayer.getVisibility();
            return value;
        }
        else {
            this.olLayer.setOpacity(opac);
            this.trigger('changelayer', ['opacity']);
            return this;
        }
    },
    bind: function() {
        // Use the same bind function as for the map
        this.map.bind.apply(this, arguments);
        return this;
    },
    trigger: function() {
        var args = Array.prototype.slice.call(arguments);
        this.events.triggerHandler.apply(this.events, args);

        this._addLayerToArgs(args);

        this.map.events.triggerHandler.apply(this.map.events, args);
        return this;
    },
    // Basically a trigger that returns the return value of the last listener
    _triggerReturn: function() {
        var args = Array.prototype.slice.call(arguments);
        var ret = this.events.triggerHandler.apply(this.events, args);
        if (ret !== undefined) {
            return ret;
        }

        this._addLayerToArgs(args);
        return this.events.triggerHandler.apply(this.map.events, args);
    },
    // every event gets the layer passed in

    // Adds the current layer to the event arguments, so that it is included
    // in the event on the map
    _addLayerToArgs: function(args) {
        // Add layer for the map event
        if (args.length===1) {
            args.push([this]);
        }
        else {
            args[1].unshift(this);
        }
    }
};

$.fn.urd = function(options) {
    return this.each(function() {
        var instance = $.data(this, 'urd');
        if (!instance) {
            $.data(this, 'urd', new $.URD.Client($(this), options));
        }
    });
};
$.extend($.URD.Layer, {
    types: {
        
        wmts: function(options) {
            var o = $.extend(true, {}, $.fn.urd.defaults.layer.all,
                    $.fn.urd.defaults.layer.wmts);            
            $.extend(true, o, options);
            // use by default all options that were passed in for the final
            // openlayers layer consrtuctor
            var params = $.extend(true, {}, o);
            return {
                layer: new OpenLayers.Layer.WMTS(params),
                options: o
            };
        }
    },
    layer: {
      
    }
});
$.fn.urd.defaults = {
  map: function() {
    return {
      extent: [-13650159, 4534735, -13609227, 4554724],
      projection: "EPSG:28992",
      units: "m",
      resolutions: [3440.64, 1720.32, 860.16, 430.08, 215.04, 107.52, 53.76,
					26.88, 13.44, 6.72, 3.36, 1.68, 0.84, 0.42, 0.21],
      maxExtent: [-285401.92,22598.08,595401.9199999999,903401.9199999999]
    }
  },
    layer: {
        all: {
            isBaseLayer: false,

        },
        wmts: {
            extent: [-13650159, 4534735, -13609227, 4554724],
      projection: "EPSG:28992",
      units: "m",
      resolutions: [3440.64, 1720.32, 860.16, 430.08, 215.04, 107.52, 53.76,
					26.88, 13.44, 6.72, 3.36, 1.68, 0.84, 0.42, 0.21],
      maxExtent: [-285401.92,22598.08,595401.9199999999,903401.9199999999]
        }
    }
};
$.URD.util = {};
// http://blog.stevenlevithan.com/archives/parseuri (2010-12-18)
// parseUri 1.2.2
// (c) Steven Levithan <stevenlevithan.com>
// MIT License
// Edited to include the colon in the protocol, just like it is
// with window.location.protocol
$.URD.util.parseUri = function (str) {
    var o = $.URD.util.parseUri.options,
        m = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
        uri = {},
        i = 14;

    while (i--) {uri[o.key[i]] = m[i] || "";}

    uri[o.q.name] = {};
    uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
        if ($1) {uri[o.q.name][$1] = $2;}
    });

    return uri;
};
$.URD.util.parseUri.options = {
    strictMode: false,
    key: ["source", "protocol", "authority", "userInfo", "user",
            "password", "host", "port", "relative", "path", "directory",
            "file", "query", "anchor"],
    q: {
        name: "queryKey",
        parser: /(?:^|&)([^&=]*)=?([^&]*)/g
    },
    parser: {
        strict: /^(?:([^:\/?#]+:))?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
        loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+:))?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
        }
};
// Checks whether a URL conforms to the same origin policy or not
$.URD.util.sameOrigin = function(url) {
    var parsed = $.URD.util.parseUri(url);
    parsed.protocol = parsed.protocol || 'file:';
    parsed.port = parsed.port || "80";

    var current = {
        domain: document.domain,
        port: window.location.port,
        protocol: window.location.protocol
    };
    current.port = current.port || "80";

    return parsed.protocol===current.protocol &&
        parsed.port===current.port &&
        // the current domain is a suffix of the parsed domain
        parsed.host.match(current.domain + '$')!==null;
};
})(jQuery);