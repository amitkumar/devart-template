![Basic branching](../project_images/Screen Shot 2014-03-23 at 5.48.49 PM.png?raw=true "Basic branching")

Accomplished one milestone: a recursive drawing algorithm for branches. Right now, as subsequent branch levels are drawn, they receive a randomized angle (within a variability constrant) and a halved length, eventually reaching terminus when the branch level has passed the plant's `branchLevelCount`.

I'm making every variable a setting that can be passed from parent branches to child branches so that I can eventually introduce more gradations of effects as we reach the tips. i.e., change branch thickness, color, opacity, etc.