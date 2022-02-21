// https://www.d3-graph-gallery.com/graph/parallel_custom.html
// Color Red to blue

//https://www.d3-graph-gallery.com/parallel.html
//https://syntagmatic.github.io/parallel-coordinates/

import { Data as Data} from './singleData.js';
import { DataRangeFinder as Range} from './DataRangeFinder.js';
import { drawParallelCordinate} from './parallelCordinate.js';

var csvLocation = "https://raw.githubusercontent.com/AbrarJahin/d3js_data_visualization/master/cleaned_data/processed_data.csv";

(function() {
	// your page initialization code here
	// the DOM will be available here
	d3.csv(csvLocation)
		.row(function(row){
			return new Data(row);
		})
		.get(function(error, data) {
			if(error!=null) {
				console.error(error);
				//return;
				throw error;
			}
			var ranges = new Range(data);
			// Draw Parallel Cordinate
			drawParallelCordinate(ranges, data, '#parallel_cordinates');
		});
 })();