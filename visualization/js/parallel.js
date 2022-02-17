import { Data as Data} from './singleData.js';
import { DataRangeFinder as Range} from './DataRangeFinder.js';

var csvLocation = "https://raw.githubusercontent.com/AbrarJahin/d3js_data_visualization/master/cleaned_data/processed_data.csv";

// set the dimensions and margins of the graph
var margin = {top: 30, right: 50, bottom: 10, left: 50},
width = 460 - margin.left - margin.right,
height = 400 - margin.top - margin.bottom;

//////////////////////////////////////////////////////////
// append the svg object to the body of the page
var parallelCordinateSvg = d3.select("#parallel_cordinates")
	.append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//////////////////////////////////////////////////////////


(function() {
	// your page initialization code here
	// the DOM will be available here
	d3.csv(csvLocation)
		.row(function(row){
			return new Data(row);
		})
		.get(function(error, data) {
			if(error!=null) {
				console.error(error);
				//return;
				throw error;
			}
			//console.log(data);
			var ranges = new Range(data);
			console.log(ranges.year.min,ranges.year.max);
		});
 })();

// Parse the Data
d3.csv("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/iris.csv", function(data) {
	// Color scale: give me a specie name, I return a color
	var color = d3.scaleOrdinal()
		.domain(["setosa", "versicolor", "virginica" ])
		.range([ "#440154ff", "#21908dff", "#fde725ff"]);
	//console.log(color);

	// Here I set the list of dimension manually to control the order of axis:
	var dimensions = ["Petal_Length", "Petal_Width", "Sepal_Length", "Sepal_Width"];

	// For each dimension, I build a linear scale. I store all in a y object
	var yScale = {}
	for (var i in dimensions) {
		var name = dimensions[i];
		yScale[name] = d3.scaleLinear()
			.domain( [0,8] ) // --> Same axis range for each group
			// --> different axis range for each group --> .domain( [d3.extent(data, function(d) { return +d[name]; })] )
			.range([height, 0]);
	}

	// Build the X scale -> it find the best position for each Y axis
	var xScale = d3.scalePoint()
		.range([0, width])
		.domain(dimensions);

	// Highlight the specie that is hovered
	var highlight = function(d) {
		var selected_specie = d.Species;
		// first every group turns grey
		d3.selectAll(".line")
			.transition().duration(200)
			.style("stroke", "lightgrey")
			.style("opacity", "0.2");
		// Second the hovered specie takes its color
		d3.selectAll("." + selected_specie)
			.transition().duration(200)
			.style("stroke", color(selected_specie))
			.style("opacity", "1");
	}

	// Unhighlight
	var doNotHighlight = function(d) {
		d3.selectAll(".line")
			.transition().duration(200).delay(1000)
			.style("stroke", function(d){ return( color(d.Species))} )
			.style("opacity", "1");
	}

	// The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
	function parallelCordinatePath(d) {
		return d3.line()(dimensions.map(function(p) { return [xScale(p), yScale[p](d[p])]; }));
	}

	// Draw the lines
	parallelCordinateSvg
		.selectAll("myPath")
			.data(data)
			.enter()
		.append("path")
			.attr("class", function (d) { return "line " + d.Species } ) // 2 class for each line: 'line' and the group name
			.attr("d", parallelCordinatePath)
			.style("fill", "none" )
			.style("stroke", function(d){ return( color(d.Species))} )
			.style("opacity", 0.5)
			.on("mouseover", highlight)
			.on("mouseleave", doNotHighlight );

	// Draw the axis:
	parallelCordinateSvg.selectAll("myAxis")
		// For each dimension of the dataset I add a 'g' element:
		.data(dimensions)
		.enter()
		.append("g")
		.attr("class", "axis")
		// I translate this element to its right position on the x axis
		.attr("transform", function(d) { return "translate(" + xScale(d) + ")"; })
		// And I build the axis with the call function
		.each(function(d) {
			d3.select(this).call(d3.axisLeft().ticks(5).scale(yScale[d]));
		})
		// Add axis title
		.append("text")
		.style("text-anchor", "middle")
		.attr("y", -9)
		.text(function(d) { return d; })
		.style("fill", "black");
});