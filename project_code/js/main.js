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
	var self = this;

	self.id = settings.id || LP.getUniqueId();
	
	self.svg = settings.svg;

	// How many levels of branches
	self.branchLevelCount = settings.branchLevelCount;

	// How many branches split off at each branching point
	self.branchMultiple = settings.branchMultiple;

	self.branchAngleVariability = settings.branchAngleVariability;

	self.childLengthRatio = settings.childLengthRatio;

	self.childStrokeWidthRatio = settings.childStrokeWidthRatio;

	self.childOpacityRatio = settings.childOpacityRatio;

	self.maxHeight = settings.maxHeight;
	
	// Collection of LP.Branch
	self.branches = [];

	self.x1 = settings.x1 || 0;

	self.y1 = settings.y1 || 0;

	self.init();
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
				childStrokeWidthRatio : self.childStrokeWidthRatio,
				childOpacityRatio : self.childOpacityRatio,

				strokeWidth : 40,
				opacity: 1,

				length : self.maxHeight * (self.childLengthRatio / self.branchLevelCount) * 3,
				x1 : self.x1,
				y1 : self.y1
				
			});
	},

	
	move : function(tauRadiansDelta){
		var trunk = this.branches[0];
		trunk.move(trunk.x1, trunk.y1, tauRadiansDelta);
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
	
	self.branchMultiple = settings.branchMultiple;
	self.branchAngleVariability = settings.branchAngleVariability;
	self.childLengthRatio = settings.childLengthRatio;
	self.childStrokeWidthRatio = settings.childStrokeWidthRatio;
	self.childOpacityRatio = settings.childOpacityRatio;
	
	self.length = settings.length || 100;
	self.x1 = settings.x1 || 0;
	self.y1 = settings.y1 || 0;
	self.tauRadians = settings.tauRadians || .25;

	self.children = [];
	self.strokeWidth = settings.strokeWidth;
	self.stroke = settings.stroke || 'white';
	self.opacity = settings.opacity;

	self.updateEndPoint();

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
					childAngle = self.tauRadians + angleDelta,
					childLength = self.length * self.childLengthRatio,
					childStrokeWidth = self.strokeWidth * self.childStrokeWidthRatio,
					childOpacity = self.opacity * self.childOpacityRatio;

				self.children.push(new LP.Branch({
					svg : self.svg,
					plant : self.plant,
					parent : self,
					level : self.level + 1,
					
					branchMultiple : self.branchMultiple,
					branchAngleVariability : self.branchAngleVariability,
					childLengthRatio : self.childLengthRatio,			
					childStrokeWidthRatio : self.childStrokeWidthRatio,
					childOpacityRatio : self.childOpacityRatio,

					// start it at this branch's endpoint
					x1 : self.x2,
					y1 : self.y2,

					length : childLength,
					tauRadians : childAngle,
					strokeWidth : childStrokeWidth,
					opacity : childOpacity
					
				}));
			}
		}
	},

	move : function(x1, y1, tauRadiansDelta){
		// Update start & end points and cascade the changes down to the children
		var self = this;
		self.x1 = x1;
		self.y1 = y1;
		self.tauRadians += tauRadiansDelta;

		self.updateEndPoint();

		if (self.children){
			self.children.forEach(function(child){
				child.move(self.x2, self.y2, tauRadiansDelta);
			});
		}
	},

	updateEndPoint : function(){
		var self = this;
		
		self.x2 = self.x1 + ( self.length * Math.cos(self.tauRadians * LP.TAU) );
		
		// Subtract because the graph's 0,0 is in upper left
		self.y2 = self.y1 - ( self.length * Math.sin(self.tauRadians * LP.TAU) );
		
	}

};


LP.createBranchPropertyGetter = function(property, suffix){
	return function(branch){
		if (suffix){
			return branch[property] + suffix;
		}
		return branch[property];
	}
};


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

			branchLevelCount : 4,
			branchMultiple : 3,
			branchAngleVariability : .2,

			childLengthRatio : .7,
			childStrokeWidthRatio : .6,
			childOpacityRatio : .9,
			
			x1 : xSpacing * (i + 1),
			y1 : windowHeight
		}));
	}

	plants.forEach(function(plant){
		d3.select('#svg')
			.append('g')
			.attr('id', plant.id);
	});

	plants.forEach(function(plant){
		d3.select('#' + plant.id)
			.selectAll('line')
			.data(plant.branches)
			.enter()
			.append('line')
			.attr('id', LP.createBranchPropertyGetter('id'))
			.attr('x1', LP.createBranchPropertyGetter('x1'))
			.attr('y1', LP.createBranchPropertyGetter('y1'))
			.attr('x2', LP.createBranchPropertyGetter('x2'))
			.attr('y2', LP.createBranchPropertyGetter('y2'))
			.style('stroke-width', LP.createBranchPropertyGetter('strokeWidth', 'px'))
			.style('stroke', LP.createBranchPropertyGetter('stroke'))
			.style('opacity', LP.createBranchPropertyGetter('opacity'));
			
	});

	LP.plants = plants;
};


$(function(){
	
	// Create plants. Starting with a 1-time draw.
	LP.generatePlants();


	var animationFrameLastRun = undefined;
	var animationFrame = function(timestamp){
		if (!animationFrameLastRun || (timestamp - animationFrameLastRun > 500) ) {
			animationFrameLastRun = timestamp;

			LP.plants.forEach(function(plant){
				plant.move( (Math.random() * 1) - 1);

				d3.select('#' + plant.id)
					.selectAll('line')
					.data(plant.branches)
					.transition()
					.attr('x1', LP.createBranchPropertyGetter('x1'))
					.attr('y1', LP.createBranchPropertyGetter('y1'))
					.attr('x2', LP.createBranchPropertyGetter('x2'))
					.attr('y2', LP.createBranchPropertyGetter('y2'))
					.style('stroke-width', LP.createBranchPropertyGetter('strokeWidth', 'px'))
					.style('stroke', LP.createBranchPropertyGetter('stroke'))
					.style('opacity', LP.createBranchPropertyGetter('opacity'));
			});
			
		}
		window.requestAnimationFrame(animationFrame);
	};
	window.requestAnimationFrame(animationFrame);
});

