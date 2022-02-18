// https://www.d3-graph-gallery.com/graph/stackedarea_template.html

import { Data as Data} from './singleData.js';
import { DataRangeFinder as Range} from './DataRangeFinder.js';
import { drawParallelCordinate} from './parallelCordinate.js';
import { drawStreamgraph} from './streamgraph.js';
import { StreamgraphData} from './streamgraphData.js';

var csvLocation = "https://raw.githubusercontent.com/AbrarJahin/d3js_data_visualization/master/cleaned_data/processed_data.csv";

(function() {
	// your page initialization code here
	// the DOM will be available here
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
			var ranges = new Range(data);
			// Draw Parallel Cordinate
			var propertiesToSelect = data.columns.filter(name => name!='country' && name!='year');
			//PropertyName should come from dropdown selector
			var propertyName = propertiesToSelect[Math.floor(Math.random() * propertiesToSelect.length)];
			var streamgraphData = new StreamgraphData(data, propertyName);
			drawStreamgraph(ranges[propertyName], streamgraphData, propertyName,'#streamgraph');
		});
 })();