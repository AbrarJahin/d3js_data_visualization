import { getIncrementalColorArray } from './../Color/generateColor.js';

var default_width = 960;
var default_height = 500;
var default_html_selector = "#parallel_coordinates_chart";

function clearDiv(elementSelector) {
    d3.selectAll(elementSelector + ' svg').remove();
}

function getMaxValueOfTheProperty(data, propertyname) {
	var maxValue = Number.NEGATIVE_INFINITY;
	data.forEach((item, index)=>{
		//console.log(item[propertyname]);
		maxValue = Math.max(maxValue, item[propertyname]);
	});
	return maxValue;
}

function getBasePropertiesFromData(data, baseProperty = 'country') {
	const properties = new Set();
	data.forEach((item, index)=>{
		properties.add(item[baseProperty]);
	});
	var output = Array.from(properties);
	output.sort();
	return output;
}

function getDimentions(data, baseProperty) {
	const dimentions = new Set();
	Object.keys(data[0]).forEach(function (key, index) {
		if(key!=baseProperty)
			dimentions.add(key);
	});
	var output = Array.from(dimentions);
	output.sort(() => Math.random() - 0.5);
	return output;
	//return ["Petal_Length", "Petal_Width", "Sepal_Length", "Sepal_Width"];
}

function drawParallelCoordinates(data,
	htmlSelector = default_html_selector,
	baseProperty = 'country',
	defaultWidth = default_width,
	defaultHeight = default_height)
{
	clearDiv(htmlSelector);
	// Here I set the list of dimension manually to control the order of axis:
	var dimensions = getDimentions(data, baseProperty);

	// set the dimensions and margins of the graph
	var margin = { top: 30, right: 50, bottom: 10, left: 50 },
		width = defaultWidth - margin.left - margin.right,
		height = defaultHeight - margin.top - margin.bottom;

	// append the svg object to the body of the page
	var svg = d3.select(htmlSelector)
		.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	// Color scale: give me a specie name, I return a color
	var countries = getBasePropertiesFromData(data, baseProperty);
	var colorList = getIncrementalColorArray(countries.length);
	var color = d3.scaleOrdinal()
			.domain(countries)
			.range(colorList);

	// For each dimension, I build a linear scale. I store all in a y object
	var yAxisColorStore = {};
	dimensions.forEach((name, index)=>{
		yAxisColorStore[name] = d3.scaleLinear()
			.domain( [0, getMaxValueOfTheProperty(data, name)] ) // --> Same axis range for each group
			// --> different axis range for each group --> .domain( [d3.extent(data, function(d) { return +d[name]; })] )
			.range([height, 0]);
	});

	// Build the X scale -> it find the best position for each Y axis
	var xScalePoints = d3.scalePoint()
		.range([0, width])
		.domain(dimensions);

	// Highlight the specie that is hovered
	var highlight = function(singleData){
		var selectedFeature = singleData[baseProperty];
		// first every group turns grey
		d3.selectAll(".line")
			.transition().duration(200)
			.style("stroke", "lightgrey")
			.style("opacity", "0.2");
		// Second the hovered specie takes its color
		d3.selectAll("." + selectedFeature)
			.transition().duration(200)
			.style("stroke", color(selectedFeature))
			.style("opacity", "1");
	}

	// Unhighlight
	var doNotHighlight = function(singleData) {
		d3.selectAll(".line")
			.transition().duration(200).delay(1000)
			.style("stroke", function(single_data) {
				return( color(single_data[baseProperty]));
			})
			.style("opacity", "1");
	}

	// The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
	function path(data) {
		return d3.line()(dimensions.map(function(featureName) {
			return [xScalePoints(featureName), yAxisColorStore[featureName](data[featureName])];
		}));
	}

	// Draw the lines
	svg
		.selectAll("myPath")
		.data(data)
		.enter()
		.append("path")
			.attr("class", function (d) { return "line " + d[baseProperty] } ) // 2 class for each line: 'line' and the group name
			.attr("d",  path)
			.style("fill", "none" )
			.style("stroke", function(d){ return( color(d[baseProperty]))} )
			.style("opacity", 0.5)
			.on("mouseover", highlight)
			.on("mouseleave", doNotHighlight);

	// Draw the axis:
	svg.selectAll("myAxis")
		// For each dimension of the dataset I add a 'g' element:
		.data(dimensions).enter()
		.append("g")
		.attr("class", "axis")
		// I translate this element to its right position on the x axis
		.attr("transform", function(d) { return "translate(" + xScalePoints(d) + ")"; })
		// And I build the axis with the call function
		.each(function(d) { d3.select(this).call(d3.axisLeft().ticks(5).scale(yAxisColorStore[d])); })
		// Add axis title
		.append("text")
			.style("text-anchor", "middle")
			.attr("y", -9)
			.text(function(d) { return d; })
			.style("fill", "black");
}

export { drawParallelCoordinates };