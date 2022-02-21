var parseDate = d3.timeParse("%Y");
//export 
class DataRangeFinder {
	constructor(data) {
		this.countries = new Set();
		data.forEach((item, index)=> {
			for (const [index, columnName] of Object.keys(item).entries()) {
				if(columnName=='year') {
					item[columnName] = item[columnName].getFullYear();
				}
				if(columnName=='country') {
					this.countries.add(item[columnName]);
				}
				else {
					if(this[columnName] === undefined) {
						this[columnName] = new Object();
						this[columnName].min = item[columnName];
						this[columnName].max = item[columnName];
					}
					else {
						this[columnName].min = Math.min(item[columnName], this[columnName].min);
						this[columnName].max = Math.max(item[columnName], this[columnName].max);
					}
				}
			}
		});
		this.dimensions = Object.keys(data[0]).filter(function(value, index, arr){ 
			return value != 'year' && value != 'country';
		});
		this.countries = Array.from(this.countries);
		this.country_color = new Object();
		this.countries.forEach((item, index)=>{
			this.country_color[item] = d3.interpolate(d3.rgb(70, 130, 180), d3.rgb(169, 169, 169))((index+1)/(this.countries.length+1));
		});
		// Array.from(Array(this.countries.length).keys()).map((element, index) => {
		// 	return d3.interpolate(d3.rgb(70, 130, 180), d3.rgb(169, 169, 169))((index+1)/(this.countries.length+1));
		// });
		this.year.min = new Date(this.year.min, 0);
		this.year.max = new Date(this.year.max, 0);
		return this;
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
export { DataRangeFinder };