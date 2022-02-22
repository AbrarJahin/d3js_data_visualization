function getCountryIndex(data, countryName) {
	for (const [index, item] of data.entries()) {
		if(item.country == countryName) return index;
	}
	return -1;
}

function getGroupedBarChartData(data, dataRange, propertyName, maxCountryToKeep = 5) {
    var output = [];
	for (const [index, country] of dataRange.countries.entries()) {
		var tempData = new Object();
		tempData.country = country;
		for (let year = dataRange.year.min.getFullYear(); year < dataRange.year.max.getFullYear()+1; year++) {
			tempData.year = 0;
		}
		if(output.length<maxCountryToKeep) {
			output.push(tempData);
		}
	}
	data.forEach((item, index)=> {
		var valIndex = getCountryIndex(output, item.country);
		if(valIndex == -1) {
			console.error(item.country, item.year, "Not Found in range");
		}
		else {
			output[valIndex][item.year] = item[propertyName];
		}
	});
	output.sort(x => x['country']);
	return output;
}

//Export Function
export { getGroupedBarChartData as getGroupedBarChartData };