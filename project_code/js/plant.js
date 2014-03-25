(function(){
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

})();
