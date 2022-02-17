var parseDate = d3.timeParse("%Y");
//export 
class Data {
	constructor(row) {
		//var propertyList = Object.keys(row);
		for (const [index, columnName] of Object.keys(row).entries())
		{
			var value = row[columnName];
			switch(columnName)
			{
				case 'country':
					// code block
					this.country = value;
					break;
				case 'year':
					// code block
					this.year = parseDate(value);
					break;
				default:
					//console.log(index, columnName, value);
					this[columnName] = parseFloat(value);
					break;
			}
		}
	}
	// Getter
	get to_string() {
		return this.getString();
	}
	// Method/function
	getString() {
		return this.country.toString() + "-" + this.year.getFullYear().toString();
	}
}

//const square = new Rectangle(10, 10);

//Export data
export { Data };