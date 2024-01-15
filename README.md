# metrocity2020
This is one piece of location modelling for business travel, using quadtrees, tile generation, string compression, canvas drawing, leaflet, d3 and a whole lot of optimisations to make a neat little front end for editing the 'where' that can be displayed on geolocated data.

Generally speaking, someone travelling to New York City does not want to see their location details in reports as a mix of Queens, Manhattan, NYC, New York etc.  It's very possible for different individuals to have different opinions about where boundaries should be, but difficult to convert that to something concrete without a supporting layer.  This serves as that layer, letting you paint exactly what you mean when you say 'Berlin'.

Generated tiles were put through png gauntlet to further minimise their size and make what is very complex under the hood as responsive as possible.

Zoom isn't possible as implemented - it would make the tileset much larger and was chosen to be appropriate for the task.  The output from this is intended to show what people feel is right, not to define boundaries accurate to within a few metres.  All processing is done in browser, so limits are also necessary out of respect for the end user.
