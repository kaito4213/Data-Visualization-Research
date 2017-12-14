var width = 400,
    height = 400;

var config = {
    w: width,
    h: height,
    maxValue: 400,
    levels: 5,
    ExtraWidthX: 300
}

d3.csv("data.csv", function(error, data) {
    if (error) throw error;
	var newData = d3.nest()
					.key(function(d) { return d.raceethnicity; })
					.rollup(function(v) { return {
							race: d3.nest().key(function(d) { return d.armed;}).rollup(function(f) {return f.length}).entries(v)
							};}).entries(data);
	var armedData = d3.nest().key(function(d) { return d.armed; }).entries(data);
	console.log(newData);
	var nndata = [];
	nndata.push(newData[0]);
    radarChart.draw("#chart",newData ,armedData, config);
	//drawBar(nndata);
});

/*var svg = d3.select('body')
	.selectAll('svg')
	.append('svg')
	.attr("width", width)
	.attr("height", height);*/

//bar
function drawBar(data){
var svg = d3.select("#chart2").append("svg")
			.attr("width", width)
			.attr("height", height)
			.attr("transform", "translate(0,0)"),
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x0 = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.1);

var x1 = d3.scaleBand()
    .padding(0.05);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var z = d3.scaleOrdinal(d3.schemeCategory10);
data.forEach(function(d, i){

  x0.domain(d.value.race.keys());
  x1.domain(d.value.race.keys()).rangeRound([0, x0.bandwidth()]);
  y.domain([0, 10]).nice();

  g.append("g")
    .selectAll("g")
    .data(data)
    .enter().append("g")
      .attr("transform", function(d) { 
	  
	  return "translate(" + x0(d.State) + ",0)"; })
    .selectAll("s3_rect")
    .data(function(d) { return 10;})
    .enter().append("s3_rect")
      .attr("x", function(d) { return x1(d.key); })
      .attr("y", function(d) { return y(d.value); })
      .attr("width", x1.bandwidth())
      .attr("height", function(d) { return height - y(d.value); })
      .attr("fill", function(d) { return z(d.key); });

  g.append("g")
      .attr("class", "s3_axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x0));

  g.append("g")
      .attr("class", "s3_axis")
      .call(d3.axisLeft(y).ticks(null, "s"))
    .append("text")
      .attr("x", 2)
      .attr("y", y(y.ticks().pop()) + 0.5)
      .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
      .text("Population");

  var legend = g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
    .selectAll("g")
    .data(d.value.race.keys())
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", z);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function(d) { return d; });
});
}