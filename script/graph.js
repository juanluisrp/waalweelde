(function($) {
$.template('urdGraphTree',
'<div class="urd-graphtree  ui-widget-content"></div>');

$.template('urdGraphElement',
'<div class="urd-graphelement"><button class="ui-button ui-state-default ui-button-icon-only" role="button" aria-disabled="false" title="toggle grafiek"><span class="ui-button-icon-primary ui-icon ui-icon-bullet"  ></span><span class="ui-button-text">open</span></button>${title}</div>');

$.template('urdGraphPopup',
'<div class="urd-graphpopup" id="${id}"><svg></svg></div>');

$.widget("urd.urdGraphs", {
  options: {
    urd: undefined,
    xkey: 'location'
  },
  _create: function(){
    var urd;
    var self = this;
    var element = this.element;
    var lmElement = $.tmpl('urdGraphTree').appendTo(element); 
    urd = $(this.options.urd).data('urd');
    //TODO: hier moet dus aan de hand van de model run grafieken worden gegenereerd ofzo
       
    this._createWaterGraph({url:'Definitief Ontwerp_results_1D.csv', widget: lmElement});
  },
  _createWaterGraph: function(options) {
    var widget = options.widget;
    var title= 'Relatieve waterstand';
    var button = $.tmpl('urdGraphElement', {title: title}).appendTo(widget);
    
    var id = "urdGraph-" + new Date().getTime();
   
   var html = $.tmpl('urdGraphPopup', {id: id});
    
    var dialog =  $('<div id="btn-'+id+'"></div>').html(html).dialog({title: title});
     widget.delegate('.urd-graphelement', 'click', function() {
            $(this).find('.ui-icon').toggleClass('ui-icon-bullet').toggleClass('ui-icon-radio-on');
            dialog.dialog('isOpen')?dialog.dialog('close'):dialog.dialog('open')
           
            return false;
        });
    var url = options.url;
    var color = d3.scale.category10();
    var meetpunten;
    d3.csv(url, function(error,data) {
      color.domain(d3.keys(data[0]).filter(function(key) { return key !== ('location'); }));   

     data.forEach(function(d) {
        d.location = parseFloat(d.location);
      });      
      meetpunten = color.domain().map(function(name) {
        return {
          key: name,
          values: data.map(function(d) {
            return {x: d.location, y: +d[name]};
          })
        };
      });
     
    
    nv.addGraph(function(){
      var chart = nv.models.lineChart();
      chart.xAxis;
      
      chart.yAxis;
      
      d3.select('#'+id+' svg')
        .datum(meetpunten)
        .call(chart);
       nv.utils.windowResize(function() { d3.select('#'+id+' svg').call(chart) });
    });
    
     });
   
  }
  
});
})(jQuery);