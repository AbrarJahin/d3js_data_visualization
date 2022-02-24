function getCountryIndex(data, countryName) {
	for (const [index, item] of data.entries()) {
		if(item.country == countryName) return index;
	}
	return -1;
}

function getParallelCoordinatesData(data, year=1990) {
    var output = [];
	for (const [index, singleData] of data.entries()) {
		if(singleData.year == year)
		{
			var tempSingleData = Object.assign({}, singleData);
			delete tempSingleData.year; //delete last_name property
			output.push(tempSingleData);
		}
	}
	return output;
}

//Export Function
export { getParallelCoordinatesData as getParallelCoordinatesData };