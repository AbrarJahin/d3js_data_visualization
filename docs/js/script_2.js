import { Data as Data } from './Data/singleData.js';
import { DataRangeFinder as Range } from './Data/DataRangeFinder.js';

import { drawBarChartFromData as BarChart } from './GroupedBarChart/groupedBarChart.js';
import { getGroupedBarChartData as BarChartData } from './GroupedBarChart/getGroupedBarChartData.js';

import { drawStackedAreaChart as StackedAreaChart } from './StackedAreaChart/stackedAreaChart.js';
import { StackedAreaData as StackedAreaData } from './StackedAreaChart/stackedAreaData.js';

// import { drawParallelCordinate} from './parallelCordinate.js';
// import { drawStreamgraph} from './streamgraph.js';
// import { StreamgraphData} from './streamgraphData.js';

var csvLocation = "https://raw.githubusercontent.com/AbrarJahin/d3js_data_visualization/master/cleaned_data/processed_data.csv";
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
				//return;
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
					var barChartData = BarChartData(downloadedData, dataRange, this.value);
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
				//////////////////////////////==============================Grouped Bar Chart=====================================End
			}
			catch(err) {
				console.error("Stacked Area Chart Failed", err);
			}

		});
})();