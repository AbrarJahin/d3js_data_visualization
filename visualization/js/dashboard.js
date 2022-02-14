//import { Data } from './singleData.js';	//Imported in HTML

var csvLocation = "./data/processed_data.csv";
var parseDate = d3.timeParse("%Y");

$(function() {
	d3.csv(csvLocation)
		.row(function(row){
			// var rowElement = new Data(
			// 	row.country,
			// 	row.year,
			// 	row.aid_received_per_person,
			// 	row.average-daily-income-per-capita,
			// 	row.gdp-total,
			// 	row.income_per_person_gdppercapita,
			// 	row.market-value-of-listed-companies,
			// 	);
			return row;
			data = {
				country: row.country,
				year: parseDate(row.year),
				prop0: row.aid_received_per_person,
				prop1: row.average-daily-income-per-capita,
				prop2: row.gdp-total,
				prop3: row.income_per_person_gdppercapita,
				prop4: row.market-value-of-listed-companies
				};
			return row;
		})
		.get(function(error, data){
			console.log(data);
		});
});