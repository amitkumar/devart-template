// Namespace will be "Live Plants". AKA long player!
var LP = {};


// http://tauday.com/tau-manifesto
LP.TAU = Math.PI * 2;


LP.getUniqueId = (function(){
	var id = 0;
	return function(){
		id += 1;
		return "LP-" + id;
	}
})();

LP.getPlusMinusRandom = function(max){
	return (max * Math.random()) - (max / 2);
}

LP.generatePlants = function(){
	var numberOfPlants = 4,
		plants = [],
		svg = document.getElementById('svg'),
		$window = $(window),
		windowWidth = $window.width(),
		windowHeight = $window.height(),
		xSpacing = windowWidth / (numberOfPlants + 1);



	for (var i = 0; i < numberOfPlants; i++){
		plants.push(new LP.Plant({
			svg : svg,
			maxHeight : windowHeight/2,

			branchLevelCount : 15,
			branchMultiple : 1,
			branchAngleVariability : .3,

			childLengthRatio : .8,
			childStrokeWidthRatio : .7,
			childOpacityRatio : .95,
			
			x1 : xSpacing * (i + 1),
			y1 : windowHeight/1.25
		}));
	}

	LP.plants = plants;
};

LP.drawToSvg = function(firstTimeDraw){
	
	if (firstTimeDraw){
		LP.plants.forEach(function(plant){
			d3.select('#svg')
				.append('g')
				.attr('id', plant.id);
		});

		LP.plants.forEach(function(plant){
			d3.select('#' + plant.id)
				.selectAll('line')
				.data(plant.branches)
				.enter()
				.append('line')
				.attr('id', LP.Branch.getters['id'])
				.attr('x1', LP.Branch.getters['x1'])
				.attr('y1', LP.Branch.getters['y1'])
				.attr('x2', LP.Branch.getters['x2'])
				.attr('y2', LP.Branch.getters['y2'])
				.style('stroke-width', LP.Branch.getters['strokeWidth'])
				.style('stroke', LP.Branch.getters['stroke'])
				.style('opacity', LP.Branch.getters['opacity']);
				
		});	

	} else {

		LP.plants.forEach(function(plant){

			d3.select('#' + plant.id)
				.selectAll('line')
				.data(plant.branches)
				.transition()
				// .duration(750)
				.ease('elastic')
				.attr('id', LP.Branch.getters['id'])
				.attr('x1', LP.Branch.getters['x1'])
				.attr('y1', LP.Branch.getters['y1'])
				.attr('x2', LP.Branch.getters['x2'])
				.attr('y2', LP.Branch.getters['y2'])
				.style('stroke-width', LP.Branch.getters['strokeWidth'])
				.style('stroke', LP.Branch.getters['stroke'])
				.style('opacity', LP.Branch.getters['opacity']);
		});
	}
	
}