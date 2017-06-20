
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// add the tooltip area to the webpage
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip");

//set up x,y
var x = d3.scale.linear().range([0, width]);
var	y = d3.scale.linear().range([height, 0]); 

var xAxis = d3.svg.axis().scale(x).orient('bottom');
var yAxis = d3.svg.axis().scale(y).orient('left');
   
// setup fill color
//var color = d3.scaleOrdinal(d3.schemeCategory10);
var color = d3.scale.category10();
cValue = function(d) { return d.Manufacturer;},
 //   color = d3.scale.category10();

d3.csv("cars-sample.csv", function(data){
	data.forEach(function(d) {
	//if (d.MPG = 'NA') return null;
	//return{
	//	Manufacturer: +d.Manufacturer,
		Weight: +d.Weight;
		MPG: +d.MPG;
		
	});

	//x.domain(d3.extend(data, function(d){ return d.Weight; })).nice();
	//y.domain(d3.extend(data, function(d){ return d.MPG; })).nice();
		x.domain([1000,5000]);
		y.domain([5,50]);

	 svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text")
      .attr("class", "label")
      .attr("x", width*0.5)
      .attr("y", 30)
      .style("text-anchor", "middle")
      .text("Weight");

     svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("x", -width*0.2)
      .attr("y", -30)
      .style("text-anchor", "top")
      .text("MPG");


     svg.selectAll(".dot")
      	.data(data)
    	.enter().append("circle")
    	.attr("class", "dot")
    	.attr("r", function(d) {
      		return d.Weight/ 500.0 ;
    		})
    	.attr("cx", function(d) {
      		return x(d.Weight);
    		})
    	.attr("cy", function(d) {
     		 return y(d.MPG);
    		})
    	.style("stroke-width", 0)
    	.attr('fill-opacity', 0.5)
    	.style("fill", function(d) {
      		return color(d.Manufacturer);
   			 });
});