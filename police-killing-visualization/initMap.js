var initMap = {
	draw: function(){
		//specify the dimensions for the map container. 
	var width = 600,
    	height = 400;

  var margin = {top: 30, right: 10, bottom: 10, left: 10};//draw parallel chart

//used to set the color range
  var highColor = "#ae017e",
      lowColor = "#fcc5c0";

//create a SVG element in the map container and give it some dimensions.
	var svg = d3.select('#map').append('svg')
  				.attr('width', width)
  				.attr('height', height);
  var map = svg.append('g')
          .style('stroke-width', '1.5px'); 

// set the tooltips for mouse hover
  var tooltip = d3.select("body")
                .append("div")
                .attr("class", "tooltip")
                .style("position", "absolute")
                .style("z-index", "10")
                .style("visibility", "hidden");

//A queue evaluates zero or more deferred asynchronous tasks with configurable concurrency
  d3.queue()
    .defer(d3.csv, 'police_killings.csv',navigate)
    .defer(d3.json, 'us.json')
    .defer(d3.json, 'us-states.json')
    .await(ready);

// We define a geographical projection and set the initial zoom to show the features.
  var projection = d3.geoAlbersUsa()
                    .scale(800)//adjust the size of the whole map
                    .translate([width/2, height/2]);

  var path = d3.geoPath()
               .projection(projection)
               .pointRadius(3.0);

//extract longitute and latitude
  function navigate(d) {
  d[0] = +d.longitude;
  d[1] = +d.latitude;
  d.arcs = {type: "MultiLineString", coordinates: []};
  return d;
  }


// execute after loading the csv, us.json ,us-states data, the parameters order must correspond to the defer order. This is the main function when drawing a map.
	function ready(error, deaths, topology, UStates) {
      if (error) return console.warn(error);

//convert csv data to the format as 
//mapData=[{'state':'xxxx','death':1234},{'state':'xxxx','death':123},{..},...]
//statStateDeath = {'Alabama':{'death':50,'population':40,'white-share':45%,'black-share':45%,'hisoanic-share':10%},'CA':{},....}
      var statStateDeath = {};

      //change the column in csv file to a map
      for (var i = 0; i < deaths.length; i++) {
        //push the longitude and latitude in each line;
         deaths[i].arcs.coordinates.push(deaths[i]);

          var state = deaths[i].state;
          if (!statStateDeath.hasOwnProperty(state)) {
              statStateDeath[state] = {};
              statStateDeath[state]['death'] = 1;
              statStateDeath[state]['population'] = +deaths[i].pop;
              statStateDeath[state]['white-share'] = +deaths[i].share_white;
              statStateDeath[state]['black-share'] = +deaths[i].share_black;
              statStateDeath[state]['hispanic-share'] = +deaths[i].share_hispanic;
              if(deaths[i].raceethnicity == 'White'){
                statStateDeath[state]['white-death'] = 1;
                statStateDeath[state]['black-death'] = 0;
                statStateDeath[state]['hispanic-death'] = 0;
              }
              if(deaths[i].raceethnicity == 'Black'){
                statStateDeath[state]['white-death'] = 0;
                statStateDeath[state]['black-death'] = 1;
                statStateDeath[state]['hispanic-death'] = 0;
                } 
              if(deaths[i].raceethnicity == 'Hispanic/Latino'){
                statStateDeath[state]['white-death'] = 0;
                statStateDeath[state]['black-death'] = 0;
                statStateDeath[state]['hispanic-death'] = 1;
                } 

          } else {
              statStateDeath[state]['death'] += 1; 
              statStateDeath[state]['white-share'] = updateRate(statStateDeath[state]['population'], statStateDeath[state]['white-share'], +deaths[i].pop, +deaths[i].share_white);
              statStateDeath[state]['black-share'] = updateRate(statStateDeath[state]['population'], statStateDeath[state]['black-share'], +deaths[i].pop, +deaths[i].share_black);
              statStateDeath[state]['hisoanic-share'] = updateRate(statStateDeath[state]['population'], statStateDeath[state]['hispanic-share'], +deaths[i].pop, +deaths[i].share_hispanic);
              statStateDeath[state]['population'] += +deaths[i].pop;

              if(deaths[i].raceethnicity == 'White'){
                statStateDeath[state]['white-death'] += 1;
              }
              if(deaths[i].raceethnicity == 'Black'){
                  statStateDeath[state]['black-death'] += 1;
                } 
              if(deaths[i].raceethnicity == 'Hispanic/Latino'){
                  statStateDeath[state]['hispanic-death'] += 1;
                } 
            }
        };

        var mapData = [];
          for (var state in statStateDeath) {
            var pair = {};
            pair['state'] = state;
            pair['death'] = statStateDeath[state]['death'];
            mapData.push(pair);
          };

//set the color to linear scle,death = [1,2,4,21,55...]
      var death = [];
        for (var i=0; i< mapData.length; i++){
            death.push(mapData[i].death);
        };
      var color = d3.scaleLinear()
              .domain([d3.min(death),d3.max(death)])
              .range([lowColor,highColor]); 

      function mapColor(d){
            var hasColor = 0;
            for(var i in mapData){
                if(mapData[i].state == d.properties.name){
                    hasColor = 1;
                    return color(mapData[i].death);  
                }
            }
            if (hasColor == 0){
              return '#fff'
             }
        };

//append death dots on the map
      deathDots = deaths.filter(function(d) { return d.arcs.coordinates.length; });

      svg.append("path")
      .datum({type: "MultiPoint", coordinates: deathDots})
      .attr("class", "death-dots")
      .attr("d", path)
      .style("fill","#999")
      ;

//append states outline to map
        svg.append("path")
           .datum(topojson.mesh(topology, topology.objects.states, function(a, b) { 
                  return a.id !== b.id; }))
           .attr("class", "states")
           .attr("d", path);

//append path to map
      map.selectAll(".state-land")//path
         .attr("class", "state-land")
         .data(topojson.feature(UStates, UStates.objects["usa.geo"]).features)
        .enter().append("path")
        .style("fill", mapColor)
        .attr("d", path)
        .on('click', function(state) {clickState.call(this, state, deaths);})
        .on("mouseover", mouseOverMap)
        .on("mousemove", mouseMove)
        .on("mouseout", mouseOut);

//mouseover event
      function mouseOverMap(d){
        var val = statStateDeath[d.properties.name];
        var fill_color = color(val["death"]);
        tooltip.html("");
        tooltip.style("visibility", "visible")
               .style("border", "3px solid " + fill_color);
       //h3 set the margin ,append all the txt show in label  
        tooltip.append("h3").text(d.properties.name);
        tooltip.append("div")
          .text("Population: " + val["population"]+ ", Deaths: "+ val["death"]);
        tooltip.append("div")
          .text("WhitePopShare: " + val["white-share"] + ", WhiteDeathsShare: "+ val["white-death"]);
        tooltip.append("div")
          .text("BlackPopShare: " + val["black-share"] + ", BlackDeathsShare: "+ val["black-death"]);
        tooltip.append("div")
          .text("HisoanicPopShare: " + val["hisoanic-share"] + ", HisoanicDeathsShare: "+ val["hispanic-death"]);

        d3.select("#tooltip").transition().duration(200)
          .style("opacity", 0.9)
          .style("stroke", null);
        d3.select(this)
          .style("opacity", 0.4)
          //.style("fill", "#fff")
          .raise();
       /* d3.selectAll(".states")
          .style("opacity", 0);*/
      };

//hover event: Mouse Move and Move Out
      function mouseMove(d) {
              return tooltip.style("top", (d3.event.pageY-52) + "px")
                            .style("left", (d3.event.pageX+18) + "px");
      };
    
      function mouseOut(d) {
            tooltip.style("visibility", "hidden")
            //d3.selectAll(".state-land path")
            d3.select(this)
              .style("opacity", 1)
              .style("fill",mapColor);
            d3.selectAll(".states")
              .style("opacity", 1);
      };

      drawLegend(death);
};


      function updateRate(oldPop, oldRate, addPop, addPopRate){
        var newRate = ((oldPop * oldRate) + (addPop * addPopRate))/(oldPop + addPop);
        return newRate.toFixed(1);
      };

    function drawLegend(death) {
      var w = 140, h = 300;

      var key = d3.select("#map")
      .append("svg")
      .attr("width", w)
      .attr("height", h)
      .attr("class", "legend");

      var legend = key.append("defs")
      .append("svg:linearGradient")
      .attr("id", "gradient")
      .attr("x1", "100%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "100%")
      .attr("spreadMethod", "pad");

      legend.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", highColor)
      .attr("stop-opacity", 1);
      
      legend.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", lowColor)
      .attr("stop-opacity", 1);

      key.append("rect")
      .attr("width", w - 100)
      .attr("height", h)
      .style("fill", "url(#gradient)")
      .attr("transform", "translate(20,10)");

      var y = d3.scaleLinear()
      .range([h, 0])
      .domain([d3.min(death),d3.max(death)]);

      var yAxis = d3.axisRight(y);

      key.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(61,10)")
      .call(yAxis)
    };
//draw parallel function, data is filted by the map
      function clickState(state, data){ 
      //console.log(this)

          var x = d3.scaleBand().rangeRound([0,width]).padding(1),
              y = {},
              dragging = {};

          var line = d3.line(),
              extents,
              background,
              foreground;

  //console.log(state);
var svg = d3.select("#parallel").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



  // Extract the list of dimensions and create a scale for each.  
  x.domain(dimensions = d3.keys(data[0]).filter(function(d){
        if (d == 'college' || d == 'pov' || d == 'urate' || d == 'county_income'){
                  return (y[d] = d3.scaleLinear()
                  .domain(d3.extent(data, function(p) { return +p[d]; }))
                  .range([height, 0]));
                }
              }));

 extents = dimensions.map(function(p) { return [0,0]; });
  // Add grey background lines for context.
  background = svg.append("g")
      .attr("class", "background")
    .selectAll("path")
      .data(data)
    .enter().append("path")
      .attr("d", path);

  // Add blue foreground lines for focus.
  foreground = svg.append("g")
      .attr("class", "foreground")
    .selectAll("path")
      .data(data)
    .enter().append("path")
      .attr("d", path);
  
//console.log(dimensions);  
  
  // Add a group element for each dimension.
  var g = svg.selectAll(".dimension")
      .data(dimensions)
    .enter().append("g")
      .attr("class", "dimension")
      .attr("transform", function(d) { return "translate(" + x(d) + ")"; })

    //console.log(dimensions);
  // Add an axis and title.
  
  g.append("g")
      .attr("class", "axis")
      .each(function(d) { d3.select(this).call(d3.axisLeft(y[d])); })
    .append("text")
      .style("text-anchor", "middle")
      .attr("y", -9)
      .text(function(d) { return d; });


  // Add and store a brush for each axis.
    g.append("g")
      .attr("class", "brush")
      .each(function(d) {
        d3.select(this)
          .call(y[d].brush = d3.brushY()
                .extent([[-8, 0], [8,height]])
                .on("brush start", brushstart)
                .on("brush", brush_parallel_chart));
      })
    .selectAll("rect")
      .attr("x", -8)
      .attr("width", 16);


function position(d) {
  var v = dragging[d];
  return v == null ? x(d) : v;
}

function transition(g) {
  return g.transition().duration(500);
}

// Returns the path for a given data point.
function path(d) {
  return line(dimensions.map(function(p) { return [position(p), y[p](d[p])]; }));
}
  
function brushstart() {
  d3.event.sourceEvent.stopPropagation();
}

function brush_parallel_chart() {    
    for(var i=0;i<dimensions.length;++i){
        if(d3.event.target==y[dimensions[i]].brush) {
            extents[i]=d3.event.selection.map(y[dimensions[i]].invert,y[dimensions[i]]);

        }
    }

      foreground.style("display", function(d) {
        return dimensions.every(function(p, i) {
            if(extents[i][0]==0 && extents[i][0]==0) {
                return true;
            }
          return extents[i][1] <= d[p] && d[p] <= extents[i][0];
        }) ? null : "none";
      });
}
};

	}
	
}