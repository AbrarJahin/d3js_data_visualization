import { Data as Data } from './Data/singleData.js';
import { DataRangeFinder as Range } from './Data/DataRangeFinder.js';
import { drawBarChartFromData as BarChart } from './GroupedBarChart/groupedBarChart.js';
import { getGroupedBarChartData as BarChartData } from './GroupedBarChart/getGroupedBarChartData.js';

// import { drawParallelCordinate} from './parallelCordinate.js';
// import { drawStreamgraph} from './streamgraph.js';
// import { StreamgraphData} from './streamgraphData.js';

var csvLocation = "https://raw.githubusercontent.com/AbrarJahin/d3js_data_visualization/master/cleaned_data/processed_data.csv";
var oldData = null;
var downloadedData = null;
var dataRange = null;

function populateDropdownElements(params) {
	const select_elem = document.createElement('select');
	langArray.forEach(d=> select_elem.add(new Option(d.display,d.value)));
}

d3.csv("data.csv", function(d, i, columns) {
	for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];
	return d;
  }, function(error, data)
  {
	  if (error) throw error;
	  oldData = data;
  });

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
			downloadedData = data;
			dataRange = new Range(data);

			var temp = BarChartData(downloadedData, dataRange, "income_per_person_gdppercapita_ppp_inflation_adjusted");
			BarChart(temp, "income_per_person_gdppercapita_ppp_inflation_adjusted", "#grouped_bar_chart");
			console.log(`downloadedData`);

			////////////////////////////////=============================================================================
			//Populate values in dropdown
			$('#barChartProperty').empty();
			dataRange.dimensions.forEach((item, index)=>{
				$("#barChartProperty").append($("<option />").val(item).text(item));
			})
			//Dropdown OnChange
			$('#barChartProperty').on('change', function() {
				var temp = BarChartData(downloadedData, dataRange, this.value);
				BarChart(temp, this.value, "#grouped_bar_chart");
				console.log(temp);
			});
			////////////////////////////////=============================================================================
		});

		// setTimeout(function(){
		// 	var temp = BarChartData(downloadedData, dataRange);
		// 	BarChart(oldData, "1", "#grouped_bar_chart");
		// 	console.log(`downloadedData`); 
		// }, 2000);//wait 2 seconds

})();