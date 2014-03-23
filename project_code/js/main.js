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
	
	this.svg = settings.svg;

	// How many levels of branches
	this.branchLevelCount = settings.branchLevelCount || 1;

	// How many branches split off at each branching point
	this.branchMultiple = settings.branchLevels || 2;

	this.branchAngleVariability = settings.branchAngleVariability || .4;

	this.childLengthRatio = settings.childLengthRatio || .5;
	
	// Collection of LP.Branch
	this.branches = [];

	this.x1 = settings.x1 || 0;

	this.y1 = settings.y1 || 0;

	this.init();
};

LP.Plant.prototype = {

	init : function(){
		var self = this,
			trunk = new LP.Branch({
				svg : self.svg,
				plant : self,
				level : 0,
				
				branchMultiple : self.branchMultiple,
				branchAngleVariability : self.branchAngleVariability,
				childLengthRatio : self.childLengthRatio,

				x1 : self.x1,
				y1 : self.y1
			});
	}
};


LP.Branch = function(settings){
	var self = this;

	self.id = settings.id || LP.getUniqueId();
	
	// Settings from parent
	self.svg = settings.svg;
	self.plant = settings.plant;
	self.parent = settings.parent || undefined;
	self.level = settings.level || 0;
	
	self.branchMultiple = settings.branchLevels || 2;
	self.branchAngleVariability = settings.branchAngleVariability;
	self.childLengthRatio = settings.childLengthRatio;
	
	
	self.length = settings.length || 100;
	self.x1 = settings.x1 || 0;
	self.y1 = settings.y1 || 0;
	self.tauRadians = settings.tauRadians || .25;

	self.children = [];
	self.strokeWidth = settings.strokeWidth || 1;
	self.stroke = settings.stroke || 'white';
	

	var endPoint = self.getEndPoint();

	self.x2 = endPoint.x;
	self.y2 = endPoint.y;

	self.plant.branches.push(self);

	self.init();
};

LP.Branch.prototype = {
	
	init : function(){
		var self = this,
			i = 0;

		if (self.level < (self.plant.branchLevelCount - 1)){
			// how many branches
			for (i = 0; i < self.branchMultiple; i++){
				var angleDelta = (self.branchAngleVariability * Math.random()) - (self.branchAngleVariability / 2),
					newAngle = self.tauRadians + angleDelta,
					newLength = self.length * self.childLengthRatio;

				self.children.push(new LP.Branch({
					svg : self.svg,
					plant : self.plant,
					parent : self,
					level : self.level + 1,
					
					branchMultiple : self.branchMultiple,
					branchAngleVariability : self.branchAngleVariability,
					childLengthRatio : self.childLengthRatio,			

					// start it at this branch's endpoint
					x1 : self.x2,
					y1 : self.y2,

					length : newLength,
					tauRadians : newAngle
					
				}));
			}
		}
	},

	getEndPoint : function(){
		var self = this,
			x2 = self.x1 + ( self.length * Math.cos(self.tauRadians * LP.TAU) );
			// Subtract because the graph's 0,0 is in upper left
			y2 = self.y1 - ( self.length * Math.sin(self.tauRadians * LP.TAU) );
		return { x: x2, y: y2 };
	}

};


$(function(){
	// Create plants. Starting with a 1-time draw.
	var numberOfPlants = 1,
		plants = [],
		svg = document.getElementById('svg');



	for (var i = 0; i < numberOfPlants; i++){
		plants.push(new LP.Plant({
			svg : svg,
			branchLevelCount : 8,
			branchMultiple : 2,
			x1 : 500,
			y1 : 500
		}));
	}

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