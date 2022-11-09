import { Data as Data } from './Data/singleData.js';
import { DataRangeFinder as Range } from './Data/DataRangeFinder.js';

import { drawBarChartFromData as BarChart } from './GroupedBarChart/groupedBarChart.js';
import { getGroupedBarChartData as BarChartData } from './GroupedBarChart/getGroupedBarChartData.js';

import { drawStackedAreaChart as StackedAreaChart } from './StackedAreaChart/stackedAreaChart.js';
import { StackedAreaData as StackedAreaData } from './StackedAreaChart/stackedAreaData.js';

import { drawParallelCoordinates as ParallelCoordinates } from './ParallelCoordinates/parallelCoordinates.js';
import { getParallelCoordinatesData as ParallelCoordinatesData } from './ParallelCoordinates/getparallelCoordinatesData.js';

var csvLocation = "https://raw.githubusercontent.com/AbrarJahin/d3js_data_visualization/master/html%2BD3js/data/processed_data.csv";
var downloadedData = null;
var dataRange = null;

function populateDropdownElements(params) {
	const select_elem = document.createElement('select');
	langArray.forEach(d=> select_elem.add(new Option(d.display,d.value)));
}

(function() { //OnLoad event
	d3.csv(csvLocation)
		.row(function(row) {
			return new Data(row);
		})
		.get(function(error, data) {
			if(error!=null) {
				console.error(error);
				throw error;
			}
			//Data Processing
			downloadedData = data;
			dataRange = new Range(data);

			//Grouped Bar Chart
			try {
				//////////////////////////////==============================Grouped Bar Chart=====================================Start
				var barChartData = BarChartData(downloadedData, dataRange, dataRange.dimensions[0]);
				BarChart(barChartData, dataRange.dimensions[0], "#grouped_bar_chart");
				//Populate Features in dropdown
				$('#barChartProperty').empty();
				dataRange.dimensions.forEach((item, index)=>{
					$("#barChartProperty").append($("<option/>").val(item).text(item));
				});
				//Dropdown OnChange
				$('#barChartProperty').on('change', function() {
					var barChartData = BarChartData(downloadedData, dataRange, this.value, $('#max_no_of_country').val());
					BarChart(barChartData, this.value, "#grouped_bar_chart");
				});
				//////////////////////////////==============================Grouped Bar Chart=====================================End
			}
			catch(err) {
				console.warn("Bar Chart Failed", err);
			}

			//Stacked Area Chart
			try {
				var stackedAreaData = new StackedAreaData(downloadedData, dataRange.dimensions[0]);
				StackedAreaChart(stackedAreaData, "#stacked_area_chart", dataRange.dimensions[0]);
				//Populate Features in dropdown
				$('#stackedAreaChartProperty').empty();
				dataRange.dimensions.forEach((item, index)=> {
					$("#stackedAreaChartProperty").append($("<option/>").val(item).text(item));
				});
				//Dropdown OnChange
				$('#stackedAreaChartProperty').on('change', function() {
					var stackedAreaData = new StackedAreaData(downloadedData, this.value);
					StackedAreaChart(stackedAreaData, "#stacked_area_chart", this.value);
				});
			}
			catch(err) {
				console.warn("Stacked Area Chart Failed", err);
			}

			//Parallel coordinates
			try {
				var parallelCoordinatesData = new ParallelCoordinatesData(downloadedData, dataRange.year.min.getFullYear());
				ParallelCoordinates(parallelCoordinatesData, "#parallel_coordinates_chart", 'country');

				//Populate Features in slider
				$('#parallel_coordinates_year').val(dataRange.year.min.getFullYear());
				$('#parallel_coordinates_year').attr('min', dataRange.year.min.getFullYear());
				$('#parallel_coordinates_year').attr('max', dataRange.year.max.getFullYear());
				$('#parallel_coordinates_year_data').text(dataRange.year.min.getFullYear());
				//Dropdown OnChange
				$('#parallel_coordinates_year').on('change', function() {
					$('#parallel_coordinates_year_data').text(this.value);	//Update text
					var parallelCoordinatesData = new ParallelCoordinatesData(downloadedData, this.value);
					ParallelCoordinates(parallelCoordinatesData, "#parallel_coordinates_chart", 'country');
				});
			}
			catch(err) {
				console.warn("Parallel Coordinates Chart Failed", err);
			}
		});
})();