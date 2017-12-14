var initScatter = {
	draw: function(){
var margin = {top: 20, right: 10, bottom: 30, left: 30},
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
    radius = 100;

    var color = d3.scaleOrdinal()
    .range(["#5f7ca5", "#727093", "#857192", "#644364", "#a05d56", "#d4814e"])
    .domain(["Arab-American", "Asian/Pacific Islander", "Black", "Hispanic/Latino","Native American", "White"]);
    
    var x = d3.scaleBand()
          .range([0, width/2-50])
    			.padding(0.1);
		var y = d3.scaleLinear()
          .range([height, 0]);
    
    var xscale = d3.scaleLinear()
    		.range([0, width/2]);

		var yscale = d3.scaleLinear()
  			.range([height,0]);
    
    var svg1 = d3.select('#sub_container2').append("svg")
    .attr('id','bar')
    .attr("width", (width + margin.left + margin.right)/2-55)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");
    
    var svg2 = d3.select('#sub_container2').append("svg")
    .attr('id','scatter')
    .attr("width", (width + margin.left + margin.right)/2+50)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");	
    
    var stooltip = d3.select('#sub_container2').append('div')
    .attr('class', 'hidden scatter_tooltip')
    .style("opacity", 0);

    var svg3 = d3.select('#canvas').append("svg")
    .attr('id','newscatter')
    .attr("width", (width + margin.left + margin.right)/2)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")"); 

    var svg4 = d3.select('#canvas').append("svg")
    .attr('id','piechart')
    .attr("width", (width + margin.left + margin.right)/2)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + (margin.left+200) + "," + height / 2 + ")");
    

function createbar(data){   
  var ndx = crossfilter(data);

  var raceethnicity = ndx.dimension(function(d) { return [d["raceethnicity"]]; })
  
  var raceethnicityGroup = raceethnicity.group().reduceCount(function(d) {
    return d.raceethnicity;
  });
  
  var bardata = raceethnicityGroup.all();
  
  var raceAgeNames = ndx.dimension(function(d) { return [d["raceethnicity"], d["age"]];});    
  
      
  var raceAgeGroup = raceAgeNames.group().reduceCount(function(d) {
    return d.raceethnicity;
  });
  
  
  var filteredData = raceAgeGroup.all();
  
  x.domain(bardata.map(function(d) {return d.key;}));
  y.domain([0, 600]);
      
  var nestedData = d3.nest()
    .key(function(d) {return d.key;})
    .rollup(function(d) {
      return {"value": function(d) {return d.value;}(d[0])};
    })
    .entries(bardata);
      
  svg1.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
      
  svg1.append("g")
      .call(d3.axisLeft(y));
  
  svg1.append("text")
      .attr("y", 0)
      .attr("x",50)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Number of Death");

  var bar = svg1.selectAll(".bar")
      .data(bardata)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.key); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
  		.style("fill", function(d) { return color(d.key); });
  
  createscatter(filteredData);
  bar.on("mouseover", function(d) {
      d3.selectAll(".bar")
        .style("opacity", 0.2);
      d3.select(this)
        .style("opacity", 1);
    	svg2.selectAll("*").remove();
    	raceethnicity.filter(d.key[0]);
    	createscatter(filteredData);
    })
    .on("mouseout", function() {
    	svg2.selectAll("*").remove();
    	raceethnicity.filterAll();
      createscatter(filteredData);
      d3.selectAll(".bar")
        .style("opacity", 1);
  	 });   
  
    };

    
function createscatter(filteredData) {       	
    var raceAccessor = function(d) {return d.key[0];};
    var ageNameAccessor = function(d) {return d.key[1];};
 		var amountAccessor = function(d) {return d.value;};
    
    //scatter chart x=age, y=amount
  	var ageNames = d3.set(filteredData.map(ageNameAccessor)).values()
  	var race = d3.set(filteredData.map(raceAccessor)).values()
  	var amount = filteredData.map(amountAccessor); 
  
  	xscale.domain([0, 90]);
  	yscale.domain([0, 24]);
  
  	svg2.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xscale));
      
  	svg2.append("g")
      .call(d3.axisLeft(yscale));
  
    var group = svg2.selectAll("g.bubble")
    .data(filteredData)
    .enter().append("g")
    .attr("class", "bubble")
    .attr("transform", function(d) {
      return "translate(" + xscale(d.key[1]) + "," + yscale(d.value) + ")"
    });
    
    //axis label
    svg2.append("text")
      .attr("y", 0)
      .attr("x",50)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Number of Death");

    svg2.append("text")
      .attr("y", height-5)
      .attr("x",width/2+20)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Age");

    //draw circle
  	group
    .append("circle")
    .attr("r", 6)
    .style('opacity', 0.8)
    .style("fill", function(d) {return color(d.key[0]);})
    .on("mouseover", function(d) {

      //vertical line
       svg2.append("line")
					.attr("class", "guide")
					.attr("x1", xscale(d.key[1]))
					.attr("x2", xscale(d.key[1]))
					.attr("y1", yscale(d.value))
					.attr("y2", height)
					.style("stroke", color(d.key[0]))
					.style("opacity",  0)
					.transition().duration(200)
					.style("opacity", 0.8);
      
      //Value on the axis
			svg2
				.append("text")
				.attr("class", "guide")
				.attr("x", xscale(d.key[1])+8)
				.attr("y", height - 3)
				.style("fill", color(d.key[0]))
				.style("opacity",  0)
				.style("text-anchor", "middle")
				.text(d.key[1])
				.transition().duration(200)
				.style("opacity", 0.8);

      //horizontal line
			svg2
				.append("line")
				.attr("class", "guide")
				.attr("x1", 0)
				.attr("x2", xscale(d.key[1]))
				.attr("y1", yscale(d.value))
				.attr("y2", yscale(d.value))
				.style("stroke", color(d.key[0]))
				.style("opacity", 0)
				.transition().duration(200)
				.style("opacity", 0.8);
      
      //Value on the axis
			svg2
				.append("text")
				.attr("class", "guide")
				.attr("x", 13)
				.attr("y", yscale(d.value)+8)
				.attr("dy", "0.35em")
				.style("fill", color(d.key[0]))
				.style("opacity", 0)
				.style("text-anchor", "end")
				.text(d.value)
				.transition().duration(200)
				.style("opacity", 0.8);	

       stooltip.classed('hidden', false)
         .transition()
         .duration(200)
         .style("opacity", .9);
      
       stooltip.html(d.key[0])     
         .style("left", (d3.event.pageX) + "px")             
         .style("top", (d3.event.pageY - 28) + "px");
       })
    
    .on("mouseout", function() {
      		//remove guide
          d3.selectAll(".guide")
          	.classed('hidden', true);
					//Remove the stooltip
					stooltip.classed('hidden', true);					
			   })
    .filter(function(d) { return d.value == 0; })
    .style("opacity", 0);
  };
  
function createpie(dataset){
 var arc = d3.arc()
      .outerRadius(radius - 10)
      .innerRadius(40);

 var pie = d3.pie()
      .sort(null)
      .value(function(d) {
          return d.value;
      });

 console.log(pie(dataset));
 var path = svg4.selectAll(".arc")
                .data(pie(dataset))
                .enter()
                .append('path')
                .attr('d', arc)
                .attr('fill', function(d) {
                    return color(d.index);
                }); 
};

d3.csv("data.csv", function(error, data) {
  if (error) throw error;
  //create filterdata
  var ndx = crossfilter(data);
  var raceAgeNames = ndx.dimension(function(d) { return [d["raceethnicity"], d["age"]];}); 
  var raceAgeGroup = raceAgeNames.group().reduceCount(function(d) {
    return d.raceethnicity;
  });
  
  var filteredData = raceAgeGroup.all();

  createbar(data)
  
  //create scatter
  var raceAccessor = function(d) {return d.key[0];};
  var ageNameAccessor = function(d) {return d.key[1];};
  var amountAccessor = function(d) {return d.value;};
    
    //scatter chart x=age, y=amount
  var ageNames = d3.set(filteredData.map(ageNameAccessor)).values()
  var race = d3.set(filteredData.map(raceAccessor)).values()
  var amount = filteredData.map(amountAccessor); 
  
  xscale.domain([0, 90]);
  yscale.domain([0, 24]);
  
  svg3.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(xscale));
      
  svg3.append("g")
      .call(d3.axisLeft(yscale));
  
  var group = svg3.selectAll("g.bubble")
    .data(filteredData)
    .enter().append("g")
    .attr("class", "bubble")
    .attr("transform", function(d) {
      return "translate(" + xscale(d.key[1]) + "," + yscale(d.value) + ")"
    });
    
    //axis label
  svg3.append("text")
      .attr("y", 0)
      .attr("x",50)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Number of Death");

  svg3.append("text")
      .attr("y", height-5)
      .attr("x",width/2+20)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Age");

    //draw circle
  group
    .append("circle")
    .attr("r", 6)
    .style('opacity', 0.8)
    .style("fill", function(d) {return color(d.key[0]);}) 

  //legend
  var legend = svg3.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(2," + i * 14 + ")"; });
  
  legend.append("rect")
      .attr("x", width/2-80)
      .attr("width", 12)
      .attr("height", 12)
      .style("fill", color);

  legend.append("text")
      .attr("x", width/2-65)
      .attr("y", 6)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .text(function(d) { return d; });

  legend.on("mouseover", function(type) {
      d3.selectAll(".legend")
        .style("opacity", 0.1);
      d3.select(this)
        .style("opacity", 1);
      d3.selectAll("circle")
        .style("opacity", 0.1)
        .filter(function(d) { return d.key[0] == type; })
        .style("opacity", 1);
    })

    .on("mouseout", function(type) {
      d3.selectAll(".legend")
        .style("opacity", 1);
      d3.selectAll("circle")
        .style("opacity", 1);
    }); 

//brush
  var brush = d3.brushX()
      .extent([[0, 0], [width, height]])
      .on('start brush', function () {
          var s = d3.event.selection,
              x0 = s[0][0],
              x1 = s[0][1];
            //convert into age
          var min=xscale.invert(s[0])
          var max=xscale.invert(s[1])
            //console.log(min,max)
          var dataset = [
              {name: 'Arab-American', value: 0},
              {name: 'Asian/Pacific Islander', value: 0},
              {name: 'Black', value: 0},
              {name: 'Hispanic/Latino', value: 0},
              {name: 'Native American', value: 0},
              {name: 'White', value: 0}
            ];
          filteredData.forEach(function(d,i){
                  if (min <= d.key[1] && d.key[1] <= max){
                    for (i = 0; i < dataset.length; i++) { 
                      if (dataset[i].name==d.key[0]){
                        dataset[i].value+=d.value
                      };
                    };
                  };
            });
            //console.log(dataset)

          createpie(dataset)  
            });
  
  svg3.append('g')
     .attr('class', 'brush')
     .call(brush) 




});
}
};