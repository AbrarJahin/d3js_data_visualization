function rgbToHex(color) {
    var r = color.r, g = color.g, b = color.b;
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function getIncrementalColorArray(noOfElement = 20, startColor = '#FF0000', endColor = '#0000FF') {
    var output = [];
    var color = d3.scaleLinear().domain([0,noOfElement])
        .range([startColor, endColor]);
    for (let step = 0; step < noOfElement; step++) {
        var colorVal = rgbToHex(d3.color(color(step)));
        output.push(colorVal);
    }
    return output;
}

function getRandomColorArray(noOfElement = 200, startColor = '#333333', endColor = '#CCCCCC') {
    var output = [];
    Array.from(Array(noOfElement).keys()).sort(() => 0.5 - Math.random()).forEach((step, index)=>{
        var color;
        if(step%2==0) {
            color = d3.scaleLinear().domain([0,noOfElement])
                .range([d3.schemeSet3[step%12], endColor]);
        }
        else {
            color = d3.scaleLinear().domain([0,noOfElement])
                .range([startColor, d3.schemeSet3[step%12]]);
        }
        var colorVal = rgbToHex(d3.color(color(step)));
        output.push(colorVal);
    });
    return output;
}

export { getIncrementalColorArray, getRandomColorArray };