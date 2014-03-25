/**
 *
 * References:
 * - http://prcweb.co.uk/lab/d3-tree
 * 
 */



$(function(){
	
	// Create plants. Starting with a 1-time draw.
	LP.generatePlants();
	LP.drawToSvg(true);

	var animationFrameLastRun = undefined;
	var animationFrame = function(timestamp){
		if (!animationFrameLastRun || (timestamp - animationFrameLastRun > (Math.random() * 10000)) ) {
			animationFrameLastRun = timestamp;

			LP.plants.forEach(function(plant){
				plant.move( (Math.random() * 1) - 1, .1);
			});

			LP.drawToSvg();
			
		}
		window.requestAnimationFrame(animationFrame);
	};
	window.requestAnimationFrame(animationFrame);
});

