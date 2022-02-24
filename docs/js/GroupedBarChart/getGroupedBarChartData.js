function getCountryIndex(data, countryName) {
	for (const [index, item] of data.entries()) {
		if(item.country == countryName) return index;
	}
	return -1;
}

function getGroupedBarChartData(data, dataRange, propertyName, maxCountryToKeep = 5) {
    var output = [];
	for (const [index, country] of dataRange.countries.sort(() => Math.random() - 0.5).entries()) {
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
			var message = "Not Found in range - Maybe removed";
			console.warn(item.country, item.year, message);
		}
		else {
			output[valIndex][item.year] = item[propertyName];
		}
	});
	try {
		// Try to run this code 
		output.sort((a, b) => (a.country > b.country) ? 1 : -1);
	}
	catch(err) {
		console.log(err);
		output.sort((a, b) => (a[propertyName] > b[propertyName]) ? 1 : -1);
	}
	return output;
}

//Export Function
export { getGroupedBarChartData as getGroupedBarChartData };