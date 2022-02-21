// set the dimensions and margins of the graph
var Margin = {top: 30, right: 50, bottom: 10, left: 50},
Width = 960 - Margin.left - Margin.right,
Height = 600 - Margin.top - Margin.bottom;

function drawParallelCordinate(ranges, data, svgSelector, width = Width, height = Height, margin = Margin) {
	var parallelCordinateSvg = d3.select(svgSelector)
				.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.append("g")
				.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	var colors = d3.scaleQuantize()
		.domain([0,3000])
		.range(["#5E4FA2", "#3288BD", "#66C2A5", "#ABDDA4", "#E6F598", 
			"#FFFFBF", "#FEE08B", "#FDAE61", "#F46D43", "#D53E4F", "#9E0142"]);
	var color = d3.scaleOrdinal()
		.domain(ranges.countries)
		.range([ "#b3fff0", "#ffff80", "#ffb3ff"]);
	//console.log(color);
	// var color = d3.scaleLinear()
	// 	.range(ranges.countries)
	// 	.interpolate(d3.interpolateHcl);

	// For each dimension, I build a linear scale. I store all in a y object
	var yScale = {}
	// Here I set the list of dimension on the order stored in CSV file
	ranges.dimensions.forEach((name, index)=> {
		yScale[name] = d3.scaleLinear()
			.domain( [ranges[name].min,ranges[name].max] ) // --> Same axis range for each group
			// --> different axis range for each group --> .domain( [d3.extent(data, function(d) { return +d[name]; })] )
			.range([height, 0]);
	});

	// Build the X scale -> it find the best position for each Y axis
	var xScale = d3.scalePoint()
		.range([0, width])
		.domain(ranges.dimensions);

	// Highlight the specie that is hovered
	var highlight = function(singleData) {
		var category = singleData.country;
		// first every group turns grey
		d3.selectAll(".line")
			.transition().duration(200)
			.style("stroke", "lightgrey")
			.style("opacity", "0.2");
		// Second the hovered specie takes its color
		d3.selectAll("." + category)
			.transition().duration(200)
			.style("stroke", ranges.country_color[category])	//color(category)
			.style("opacity", "1");
	}

	// Unhighlight
	var doNotHighlight = function(singleData) {
		d3.selectAll(".line")
			.transition().duration(200).delay(1000)
			.style("stroke", function(singleData) {
				return ranges.country_color[singleData.country];
			})
			.style("opacity", "1");
	}

	// The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
	function parallelCordinatePath(d) {
		return d3.line()(ranges.dimensions.map(function(p) {
			return [xScale(p), yScale[p](d[p])];
		}));
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
			.style("stroke", function(singleData){ return ranges.country_color[singleData.country];} )
			.style("opacity", 0.5)
			.on("mouseover", highlight)
			.on("mouseleave", doNotHighlight );

	// Draw the axis:
	parallelCordinateSvg.selectAll("myAxis")
		// For each dimension of the dataset I add a 'g' element:
		.data(ranges.dimensions)
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
}

export { drawParallelCordinate };