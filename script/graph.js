(function($) {
$.template('urdGraphTree',
'<div class="urd-graphtree  ui-widget-content"></div>');

$.widget("urd.urdGraphs", {
  options: {
    urd: undefined,
    xkey: 'location'
  },
  _create: function(){
    var urd;
    var self = this;
    var element = this.element;
    this._createWaterGraph({url:'Definitief Ontwerp_results_1D.csv'});
  },
  _createWaterGraph: function(options) {
    var url = options.url;
    var color = d3.scale.category10();
    var width = 200;
    var height= 141;
    var x = d3.scale.linear().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);
    
    var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

    var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

    var line = d3.svg.line()
      .interpolate("basis")
      .x(function(d) {
      return x(d.lengte); 
      })
      .y(function(d) { return y(d.hoogte); });
      
    var svg = d3.select('#'+this.element.attr('id')).append("svg")
      .attr("width", width )
      .attr("height", height)
      .append("g");

    
    d3.csv(url, function(error,data) {
      color.domain(d3.keys(data[0]).filter(function(key) { return key !== ('location'); }));   

     data.forEach(function(d) {
        d.location = parseFloat(d.location);
      });      
      var meetpunten = color.domain().map(function(name) {
        return {
          name: name,
          values: data.map(function(d) {
            return {lengte: d.location, hoogte: +d[name]};
          })
        };
      });
   
   
   x.domain(d3.extent(data, function(d) { return d.location; }));

    y.domain([
      d3.min(meetpunten, function(c) { return d3.min(c.values, function(v) { return v.hoogte; }); }),
      d3.max(meetpunten, function(c) { return d3.max(c.values, function(v) { return v.hoogte; }); })
    ]);
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)

      
    var meetpunt = svg.selectAll(".meetpunt")
      .data(meetpunten)
      .enter().append("g")
      .attr("class", "meetpunt");

    meetpunt.append("path")
        .attr("class", "line")
        .attr("d", function(d) { return line(d.values); })
        .style("stroke", function(d) { return color(d.name); });

    
    meetpunt.append("text")
      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.lengte) + "," + y(d.value.hoogte) + ")"; })
      .attr("x", 3)
      .attr("dy", ".35em")
      .text(function(d) { return d.name; });
    });
  }
  
});
})(jQuery);