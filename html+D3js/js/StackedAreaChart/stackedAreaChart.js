import { getIncrementalColorArray, getRandomColorArray } from './../Color/generateColor.js';

var defaultWidth = 960;
var defaultHeight = 500;
var defaultHtmlSelector = "#stacked_area_chart";

////////////////////////////////////////////////////////////////////////

function clearDiv(elementSelector) {
    d3.selectAll(elementSelector + ' svg').remove();
}

function getCountryList(data) {
	var countries = [];
	Object.keys(data[0]).forEach((propertyName, index)=>{
        if(!["country", "year"].includes(propertyName))
			countries.push(propertyName);
    });
	countries.sort();
	return countries;
}

function getYearsFromData(data) {
    const yearSet = new Set();
	data.forEach((item, index)=>{
		yearSet.add(item.year);
	});
	var yearArray = Array.from(yearSet);
    yearArray.sort();
    return yearArray;
}

function getMaxStackedValue(data) {
	var yearList = getYearsFromData(data);
	var countryList = getCountryList(data);
	let stackedDataDictonary = {};
	yearList.forEach((item, index)=>{
		stackedDataDictonary[item] = 0;
	});

	data.forEach((singleData, index)=>{
		var currentYear = singleData.year;
		countryList.forEach((country, i)=>{
			stackedDataDictonary[currentYear] += singleData[country];
		});
	});
	var maxVal = 0;
	for (const [key, value] of Object.entries(stackedDataDictonary)) {
		//console.log(key, value);
		maxVal = Math.max(maxVal,value);
	}
	return maxVal;
}

function drawStackedAreaChart(data,
			htmlSelector = defaultHtmlSelector,
			yAxisLabel= "# of baby born",
			xAxisLabel= "Time (year)",
			chartWidth = defaultWidth,
			chartHeight = defaultHeight) {
	clearDiv(htmlSelector);	//Clear the SVG
	// set the dimensions and margins of the graph
	var margin = {top: 60, right: 100, bottom: 50, left: 50},
	width = chartWidth - margin.left - margin.right,
	height = chartHeight - margin.top - margin.bottom;
	var legendStartPosition = chartWidth-margin.right-30;

	// append the svg object to the body of the page
	var svg = d3.select(htmlSelector)
			.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform",
				"translate(" + margin.left + "," + margin.top + ")");

	//////////
	// GENERAL //
	//////////

	// List of groups = header of the csv files
	var categoryList = getCountryList(data);
	///////////////////////////////////////////////////////////////Color Schema Set - Start
	//var colorArray = d3.schemeSet3;
	//var colorArray = getIncrementalColorArray(categoryList.length);
	var colorArray = getRandomColorArray(categoryList.length);
	///////////////////////////////////////////////////////////////Color Schema Set - End
	var maxYValue = getMaxStackedValue(data);	//Should be dynamic

	// color palette
	var color = d3.scaleOrdinal()
		.domain(categoryList)
		.range(colorArray);

	//stack the data?
	var stackedData = d3.stack().keys(categoryList)(data);

	//////////
	// AXIS //
	//////////

	// Add X axis
	var x = d3.scaleLinear()
		.domain(d3.extent(data, function(singleData) {
			return singleData.year;
		}))
		.range([ 0, width ]);
	var xAxis = svg.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x).ticks(5));

	// Add X axis label:
	svg.append("text")
		.attr("text-anchor", "end")
		.attr("x", width)
		.attr("y", height+40 )
		.text(xAxisLabel);

	// Add Y axis label:
	svg.append("text")
		.attr("text-anchor", "end")
		.attr("x", 0)
		.attr("y", -20 )
		.text(yAxisLabel)
		.attr("text-anchor", "start");

	// Add Y axis
	var y = d3.scaleLinear()
		.domain([0, maxYValue])
		.range([ height, 0 ]);
	svg.append("g")
		.call(d3.axisLeft(y).ticks(5))

	//////////
	// BRUSHING AND CHART //
	//////////

	// Add a clipPath: everything out of this area won't be drawn.
	var clip = svg.append("defs").append("svg:clipPath")
		.attr("id", "clip")
		.append("svg:rect")
		.attr("width", width )
		.attr("height", height )
		.attr("x", 0)
		.attr("y", 0);

	// Add brushing
	var brush = d3.brushX()                 // Add the brush feature using the d3.brush function
		.extent( [ [0,0], [width,height] ] ) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
		.on("end", updateChart); // Each time the brush selection changes, trigger the 'updateChart' function

	// Create the scatter variable: where both the circles and the brush take place
	var areaChart = svg.append('g').attr("clip-path", "url(#clip)");

	// Area generator
	var area = d3.area()
		.x(function(d) {
			return x(d.data.year);
		})
		.y0(function(d) {
			return y(d[0]);
		})
		.y1(function(d) {
			return y(d[1]);
		});

	// Show the areas
	areaChart
		.selectAll("mylayers")
		.data(stackedData)
		.enter()
		.append("path")
		.attr("class", function(d) { return "myArea " + d.key })
		.style("fill", function(d) { return color(d.key); })
		.attr("d", area);

	// Add the brushing
	areaChart
		.append("g")
		.attr("class", "brush")
		.call(brush);

	var idleTimeout;
	function idled() {
		idleTimeout = null;
	}

	// A function that update the chart for given boundaries
	function updateChart() {
		var extent = d3.event.selection;

		// If no selection, back to initial coordinate. Otherwise, update X axis domain
		if(!extent) {
			if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
			x.domain(d3.extent(data, function(singleData) {
				return singleData.year;
			}));
		} else {
			x.domain([ x.invert(extent[0]), x.invert(extent[1]) ]);
			areaChart.select(".brush").call(brush.move, null); // This remove the grey brush area as soon as the selection has been done
		}

		// Update axis and area position
		xAxis.transition().duration(1000).call(d3.axisBottom(x).ticks(5));
		areaChart
			.selectAll("path")
			.transition().duration(1000)
			.attr("d", area);
	}

	//////////
	// HIGHLIGHT GROUP //
	//////////

	// What to do when one group is hovered
	var highlight = function(countryName) {
		d3.selectAll(".myArea").style("opacity", .1);	// reduce opacity of all groups
		//d3.select("."+countryName).style("opacity", 1);
		d3.selectAll("."+countryName).style("opacity", 1);	// expect the one that is hovered
		//console.log(countryName);
	}

	// And when it is not hovered anymore
	var noHighlight = function(countryName){
		d3.selectAll(".myArea").style("opacity", 1);
	}

	//////////
	// LEGEND //
	//////////

	// Add one dot in the legend for each name.
	var legendRectangleSize = 10;
	svg.selectAll("myrect")
		.data(categoryList)
		.enter()
		.append("rect")
			.attr("x", legendStartPosition)
			.attr("y", function(countryName, index) {
				return 10 + index*(legendRectangleSize+5);
			}) // 100 is where the first dot appears. 25 is the distance between dots
			.attr("width", legendRectangleSize)
			.attr("height", legendRectangleSize)
			.style("fill", function(d){
				return color(d);
			})
			.on("mouseover", highlight)
			.on("mouseleave", noHighlight);

	// Add one dot in the legend for each name.
	svg.selectAll("mylabels")
		.data(categoryList)
		.enter()
		.append("text")
			.attr("x", legendStartPosition + legendRectangleSize*1.2)
			.attr("y", function(d,i){ return 10 + i*(legendRectangleSize+5) + (legendRectangleSize/2)}) // 100 is where the first dot appears. 25 is the distance between dots
			.style("fill", function(d){ return color(d)})
			.text(function(d){ return d})
			.attr("text-anchor", "left")
			.style("alignment-baseline", "middle")
			.on("mouseover", highlight)
			.on("mouseleave", noHighlight);
}

//Export Function
export { drawStackedAreaChart };