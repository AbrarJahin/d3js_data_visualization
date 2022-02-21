var svgSelector = "#grouped_bar_chart";
var default_width = 960;
var default_height = 500;

////////////////////////////////////////////////////////////////////////////////////////////////

function clearDiv(elementSelector) {
    d3.selectAll(elementSelector + ' svg').remove();
}

function rgbToHex(color) {
    var r = color.r, g = color.g, b = color.b;
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function getYearsFromData(data) {
    var yearArray = [];
    Object.keys(data[0]).forEach((item, index)=>{
        if(item!='country')
            yearArray.push(item);
    });
    yearArray.sort();
    return yearArray;
}

function getCountriesFromData(data) {
    var countryArray = [];
    data.forEach((item, index)=>{
        countryArray.push(item['country'])
    });
    countryArray.sort();
    return countryArray;
}

function getColorArray(noOfElement = 20) {
    var output = [];
    var color = d3.scaleLinear().domain([0,noOfElement])
        .range(['#FF0000', '#0000FF']);
    for (let step = 0; step < noOfElement; step++) {
        var colorVal = rgbToHex(d3.color(color(step)));
        output.push(colorVal);
    }
    return output;
}

function drawBarChartFromData(data, propertyName, htmlSelector = svgSelector, defaultWidth = default_width, defaultHeight = default_height) {
    clearDiv(htmlSelector);
    var svg = d3.select(htmlSelector).append("svg")
            .attr("width", defaultWidth)
            .attr("height", defaultHeight);
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
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

    /////////////////////////////////////////////////////////////////////////////////////////////
    //var colorArray = ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"];
    var categories = getYearsFromData(data);
    var countryList = getCountriesFromData(data);
    var colorArray = getColorArray(categories.length);//==================================================
    var zColorScale = d3.scaleOrdinal()
        .range(colorArray);
    /////////////////////////////////////////////////////////////////////////////////////////////
    //var categories = data.columns.slice(1);
    var categories = getYearsFromData(data);

    x0.domain(data.map(function(d) {
        return d['country'];
    }));
    x1.domain(categories).rangeRound([0, x0.bandwidth()]);
    y.domain([0, d3.max(data, function(d) {
        return d3.max(categories, function(key) { return d[key]; });
    })]).nice();

    g.append("g")
        .selectAll("g")
        .data(data)
        .enter().append("g")
            .attr("transform", function(d) {
                return "translate(" + x0(d['country']) + ",0)";
            })
        .selectAll("rect")
        .data(function(d) {
            return categories.map(function(key) {
                return {
                    key: key,
                    value: d[key]
                };
            });
        })
        .enter().append("rect")
            .attr("x", function(d) {
                return x1(d.key);
            })
            .attr("y", function(d) {
                return y(d.value);
            })
            .attr("width", x1.bandwidth())
            .attr("height", function(d) {
                return height - y(d.value);
            })
            .attr("fill", function(d) {
                return zColorScale(d.key);
            });

    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x0));

    g.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y).ticks(null, "s"))
        .append("text")
            .attr("x", 2)
            .attr("y", y(y.ticks().pop()) + 0.5)
            .attr("dy", "0.32em")
            .attr("fill", "#000")
            .attr("font-weight", "bold")
            .attr("text-anchor", "start")
            .text(propertyName);

    var legend = g.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
        .selectAll("g")
        .data(categories.slice().reverse())
        .enter().append("g")
            .attr("transform", function(d, i) {
                return "translate(0," + i * 20 + ")";
            });

    legend.append("rect")
        .attr("x", width - 19)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", zColorScale);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(function(d) {
            return d;
        });
}

//Export Function
export { drawBarChartFromData };