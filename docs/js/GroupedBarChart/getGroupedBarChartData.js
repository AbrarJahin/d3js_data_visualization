function getCountryIndex(data, countryName) {
	// var foundIndex = -1;
    // data.forEach((item, index)=> {
	// 	if(item.country == countryName)
	// 		return index;
	// });
	for (const [index, item] of data.entries()) {
		if(item.country == countryName) return index;
	}
	return -1;
}

function getGroupedBarChartData(data, dataRange, propertyName) {
    var output = [];
	for (const [index, country] of dataRange.countries.entries()) {
		var tempData = {};
		tempData['country'] = country;
		for (let year = dataRange.year.min.getFullYear(); year < dataRange.year.max.getFullYear()+1; year++) {
			tempData[year] = 0;
		}
		output.push(tempData);
	}
	data.forEach((item, index)=> {
		var valIndex = getCountryIndex(output, item.country);
		if(valIndex == -1){
			console.error(item.country, item.year, "Not Found in range");
		}
		output[valIndex][item.year] = item[propertyName];
	});
	return output;
}

//Export Function
export { getGroupedBarChartData as getGroupedBarChartData };