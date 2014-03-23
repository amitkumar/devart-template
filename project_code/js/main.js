/**
 *
 * References:
 * - http://prcweb.co.uk/lab/d3-tree
 * 
 */

// Namespace will be "Live Plants"
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

LP.Plant = function(settings){
	this.id = settings.id || LP.getUniqueId();
	
	this.$svg = settings.$svg;

	// How many levels of branches
	this.branchLevelCount = settings.branchLevelCount || 1;

	// How many branches split off at each branching point
	this.branchMultiple = settings.branchLevels || 2;
	
	// Collection of LP.Branch
	this.branches = [];

	this.x1 = settings.x1 || 0;

	this.y1 = settings.y1 || 0;

	this.init();
};

LP.Plant.prototype = {

	init : function(){
		var self = this,
			i;
		
		for (i = 0; i < self.branchLevelCount; i++){
			self.branches.push(new LP.Branch({
				plant : self,
				level : 0,
				$svg : self.$svg,
				x1 : self.x1,
				y1 : self.y1
			}));
		}
	}
	// ,

	// draw : function(){
	// 	this.branches.forEach(function(branch, index){
	// 		branch.draw();
	// 	});
	// }
};


LP.Branch = function(settings){
	this.id = settings.id || LP.getUniqueId();
	
	this.plant = settings.plant;
	this.parent = settings.parent || undefined;
	this.children = [];
	this.level = settings.level || 0;
	this.$svg = settings.$svg;
	
	this.length = settings.length || 100;
	this.x1 = settings.x1 || 0;
	this.y1 = settings.y1 || 0;
	
	this.strokeWidth = settings.strokeWidth || 1;
	this.stroke = settings.stroke || 'white';
	this.tauRadians = settings.tauRadians || .25;

	// Endpoint is defined in init()
	this.x2 = undefined;
	this.y2 = undefined;

	this.init();
};

LP.Branch.prototype = {
	init : function(){
		var endPoint = this.getEndPoint();
		this.x2 = endPoint.x;
		this.y2 = endPoint.y;
	},

	getEndPoint : function(){
		var self = this,
			x2 = self.x1 + self.length * Math.cos(self.tauRadians * LP.TAU);
			// Subtract because the graph's 0,0 is in upper left
			y2 = self.y1 - self.length * Math.sin(self.tauRadians * LP.TAU);
		return { x: x2, y: y2 };
	}
	// ,

	// draw : function(){
	// 	var line = [
	// 		'<line',
	// 		' x1="' + this.x1 + '" ',
	// 		' y1="' + this.y1 + '" ',
	// 		' stroke-width="' + this.strokeWidth + '" ',
	// 		' stroke="' + this.stroke + '" ',
	// 		' />'
	// 	].join('');

	// 	this.$svg.append($('<line x1='))
	// }
};


$(function(){
	// Create plants. Starting with a 1-time draw.
	var numberOfPlants = 1,
		plants = [],
		svg = document.getElementById('svg');



	for (var i = 0; i < numberOfPlants; i++){
		plants.push(new LP.Plant({
			svg : svg,
			branchLevelCount : 1,
			branchMultiple : 2,
			x1 : 500,
			y1 : 500
		}));
	}

	// plants.forEach(function(plant){
	// 	plant.draw();
	// });

	console.log('plants[0]', plants[0])

	d3.select('#svg')
		.selectAll('line')
		.data(plants[0].branches)
		.enter()
		.append('line')
		.attr('x1', function (d) { 
			return d.x1; 
		})
		.attr('y1', function (d) { 
			return d.y1; 
		})
		.attr('x2', function (d) { 
			return d.x2; 
		})
		.attr('y2', function (d) { 
			return d.y2; 
		})
		.style('stroke-width', function(d) {
			return d.strokeWidth + 'px';
		})
		.style('stroke', function(d) {
			return d.stroke;
		})
		.attr('id', function(d) {
			return d.id;
		});
});


window.requestAnimationFrame(function(time){
  
});