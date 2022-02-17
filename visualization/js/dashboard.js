import { Data as Data} from './singleData.js';	//Imported in HTML

var csvLocation = "./data/processed_data.csv";

(function() {
	// your page initialization code here
	// the DOM will be available here
	d3.csv(csvLocation)
		.row(function(row){
			var rowElement = new Data(row);
			return rowElement;
		})
		.get(function(error, data){
			if(error!=null) {
				console.error(error);
				throw error;
				return;
			}
			console.log(data);
		});
 })();

//Global Configurations for Scatterplot Matrix
var width = 960,
    size = 230,
    padding = 20;

var x = d3.scaleLinear()
    .range([padding / 2, size - padding / 2]);

var y = d3.scaleLinear()
    .range([size - padding / 2, padding / 2]);

var xAxis = d3.axisBottom()
    .scale(x)
    .ticks(6);

var yAxis = d3.axisLeft()
    .scale(y)
    .ticks(6);

var color = d3.scaleOrdinal(d3.schemeCategory10);

