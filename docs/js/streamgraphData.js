var parseDate = d3.timeParse("%Y");
//export 
class StreamgraphData {
	constructor(data, targetColumnName) {
		this.yearData = {};
		data.forEach((item, index)=> {
			if(!this.yearData.hasOwnProperty(item.year))
			{
				this.yearData[item.year] = {};
			}
			for (const [index, columnName] of Object.keys(item).entries()) {
				if (columnName==targetColumnName) {
					this.yearData[item.year][item.country] = item[columnName];
				}
			}
		});
		var processedData = [];
		for (const [key, value] of Object.entries(this.yearData)) {
			var data = {};
			//console.log(key, value);
			data.year = key;
			for (var property in value) {
				data[property] = value[property];
			}
			processedData.push(data);
		}
		return processedData;
		//return this.yearData;
	}
	// Getter
	get to_string() {
		return this.getString();
	}
	// Method/function
	getString() {
		return this.yearData[0].toString();
	}
}

//const square = new Rectangle(10, 10);

//Export data
export { StreamgraphData };