(function(){
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


	// Create getters for D3
	var createBranchPropertyGetter = function(property, suffix){
		return function(branch){
			if (suffix){
				return branch[property] + suffix;
			}
			return branch[property];
		}
	};

	
	LP.Branch.getters = {
		'id' : createBranchPropertyGetter('id'),
		'x1' : createBranchPropertyGetter('x1'),
		'y1' : createBranchPropertyGetter('y1'),
		'x2' : createBranchPropertyGetter('x2'),
		'y2' : createBranchPropertyGetter('y2'),
		'strokeWidth' : createBranchPropertyGetter('strokeWidth', 'px'),
		'stroke' : createBranchPropertyGetter('stroke'),
		'opacity' : createBranchPropertyGetter('opacity')
	};

})();