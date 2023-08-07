$(document).ready(function(){
// List of all neighbors out to 3 degrees for use with the hexAdd() function
// Even and odd X have different neighbors. No need to overthink this.

// CONSTANTS are expressed in a all uppercase //
const ISOLATED_ODD_NEIGHBORS = {
    '0':[
        [0,0],
    ],
    '1':[
        [-1, 0],[-1, 1],[0, -1],
        [0, 1],[1, 0],[1, 1],
    ],
    '2': [
        [-2,0],[-2,-1],[-1,2],
        [-2,1],[-1,-1],[0,2],
        [0,-2],[1,2],[1,-1],
        [2,0],[2,-1],[2,1],
    ],
    '3': [
        [0,-3],[-2,-2],[-1,-2],
        [1,-2],[2,-2],[-3,-1],
        [3,-1],[-3,0],[3,0],
        [-3,1],[3,1],[-3,2],
        [-2,2],[2,2],[3,2],
        [-1,3],[0,3],[1,3],
    ],
};
const ODD_NEIGHBORS = {
    '0':ISOLATED_ODD_NEIGHBORS['0'],
    '1':ISOLATED_ODD_NEIGHBORS['0'].concat(
        ISOLATED_ODD_NEIGHBORS['1']),
    '2':ISOLATED_ODD_NEIGHBORS['0'].concat(
        ISOLATED_ODD_NEIGHBORS['1'],
        ISOLATED_ODD_NEIGHBORS['2']),
    '3':ISOLATED_ODD_NEIGHBORS['0'].concat(
        ISOLATED_ODD_NEIGHBORS['1'],
        ISOLATED_ODD_NEIGHBORS['2'],
        ISOLATED_ODD_NEIGHBORS['3']),
}
const ISOLATED_EVEN_NEIGHBORS = {
    '0': [
        [0,0],
    ],
    '1': [
        [-1, -1],[-1, 0],[0, -1],
        [0, 1],[1, -1],[1, 0],
    ],
    '2': [
        [-2,-1],[-2,0],[-1,-2],
        [-2,1],[-1,1],[0,-2],
        [1,-2],[0,2],[1,1],
        [2,-1],[2,0],[2,1],
    ],
    '3': [
        [-1,-3],[0,-3],[1,-3],
        [-3,-2],[-2,-2],[2,-2],
        [3,-2],[-3,-1],[3,-1],
        [-3,0],[3,0],[-3,1],
        [3,1],[-2,2],[-1,2],
        [1,2],[2,2],[0,3],
    ],
};
const DIRECTIONAL_NEIGHBORS = {
    even: {
        "NW":[-1,-1],
        "SW":[-1,+0],
        "NE":[+1,-1],
        "SE":[+1,+0],
        "N":[0,-1],
        "S":[0,+1],
        "CENTER":[0,0]
    },
    odd: {
        "NW":[-1,+0],
        "SW":[-1,+1],
        "NE":[+1,+0],
        "SE":[+1,+1],
        "N":[0,-1],
        "S":[0,+1],
        "CENTER":[0,0]
    },
}

const EVEN_NEIGHBORS = {
    '0':ISOLATED_EVEN_NEIGHBORS['0'],
    '1':ISOLATED_EVEN_NEIGHBORS['0'].concat(
        ISOLATED_EVEN_NEIGHBORS['1']),
    '2':ISOLATED_EVEN_NEIGHBORS['0'].concat(
        ISOLATED_EVEN_NEIGHBORS['1'],
        ISOLATED_EVEN_NEIGHBORS['2']),
    '3':ISOLATED_EVEN_NEIGHBORS['0'].concat(
        ISOLATED_EVEN_NEIGHBORS['1'],
        ISOLATED_EVEN_NEIGHBORS['2'],
        ISOLATED_EVEN_NEIGHBORS['3']),
}

const CANVAS_ELEM = $('#hexCanvas');
const CANVAS_CONTEXT = CANVAS_ELEM[0].getContext('2d');
const GRID_ELEM = $('#hexGrid');

const HEX_RADIUS = 36; // changing this should adjust the size seamlessly
//const HEX_RADIUS = 72; // changing this should adjust the size seamlessly
const HEX_HEIGHT = Math.sqrt(3) * HEX_RADIUS;
const HEX_WIDTH = 2 * HEX_RADIUS;
const HEX_SIDE = (3/2) * HEX_RADIUS;
const HEX_CENTER_X = HEX_WIDTH/2
const HEX_CENTER_Y = HEX_HEIGHT/2

const IMAGE_EXT = '.png';
const TERRAIN_DIR = './terrain/'

const DEBUG = true;

/* This should eventually be retrieved from a database,
   but this is excellent test data */
var $testGrid1 = {
    rows:5,
    columns:5,
    tiles: [
        {terrain: "Broken Lands", x: 0, y: 0},
        {terrain: "Dense Mixed Forest", x: 0, y: 1},
        {terrain: "Badlands", x: 0, y: 2},
        {terrain: "Badlands", x: 0, y: 3},
        {terrain: "Dense Jungle", x: 0, y: 4},
        {terrain: "Forested Mountain", x: 1, y: 0},
        {terrain: "Dense Forest", x: 1, y: 1},
        {terrain: "Light Forest", x: 1, y: 2},
        {terrain: "Sandy Desert", x: 1, y: 3},
        {terrain: "Hills", x: 1, y: 4},
        {terrain: "Grassy Hills", x: 2, y: 0},
        {terrain: "Plains", x: 2, y: 1},
        {terrain: "Mountain", x: 2, y: 2},
        {terrain: "Mountains", x: 2, y: 3},
        {terrain: "Foothills", x: 2, y: 4},
        {terrain: "Foothills", x: 3, y: 0},
        {terrain: "Mangrove Forest", x: 3, y: 1},
        {terrain: "Dormant Volcano", x: 3, y: 2},
        {terrain: "Water", x: 3, y: 3},
        {terrain: "Badlands", x: 3, y: 4},
        {terrain: "Light Mixed Forest", x: 4, y: 0},
        {terrain: "Badlands", x: 4, y: 1},
        {terrain: "Badlands", x: 4, y: 2},
        {terrain: "Badlands", x: 4, y: 3},
        {terrain: "Badlands", x: 4, y: 4},
    ]
}
var $testGrid2 = {
	"rows":25,
	"columns":20,
	"tiles":[
		{"x":0,"y":0,"terrain":"Mangrove Forest"},
		{"x":0,"y":1,"terrain":"Sparse Evergreen Forest"},
		{"x":0,"y":2,"terrain":"Mixed Forested Mountain"},
		{"x":0,"y":3,"terrain":"Dense Forest"},
		{"x":0,"y":4,"terrain":"Water"},
		{"x":0,"y":5,"terrain":"Light Forest"},
		{"x":0,"y":6,"terrain":"Cactus Forest"},
		{"x":0,"y":7,"terrain":"Mountains"},
		{"x":0,"y":8,"terrain":"Sparse Forest"},
		{"x":0,"y":9,"terrain":"Swamp"},
		{"x":0,"y":10,"terrain":"Forested Evergreen Mountain"},
		{"x":0,"y":11,"terrain":"Swamp"},
		{"x":0,"y":12,"terrain":"Foothills"},
		{"x":0,"y":13,"terrain":"Sandy Desert"},
		{"x":0,"y":14,"terrain":"Broken Lands"},
		{"x":0,"y":15,"terrain":"Forested Mountain"},
		{"x":0,"y":16,"terrain":"Jungle Mountain"},
		{"x":0,"y":17,"terrain":"Water"},
		{"x":0,"y":18,"terrain":"Dense Jungle"},
		{"x":0,"y":19,"terrain":"Dense Mixed Forest"},
		{"x":0,"y":20,"terrain":"Blank"},
		{"x":0,"y":21,"terrain":"Dense Evergreen Forest"},
		{"x":0,"y":22,"terrain":"Plains"},
		{"x":0,"y":23,"terrain":"Foothills"},
		{"x":0,"y":24,"terrain":"Light Forest"},
		{"x":1,"y":0,"terrain":"Mountains"},
		{"x":1,"y":1,"terrain":"Water"},
		{"x":1,"y":2,"terrain":"Mixed Forested Mountains"},
		{"x":1,"y":3,"terrain":"Cactus Forest"},
		{"x":1,"y":4,"terrain":"Grassy Hills"},
		{"x":1,"y":5,"terrain":"Hills"},
		{"x":1,"y":6,"terrain":"Sandy Desert"},
		{"x":1,"y":7,"terrain":"Cactus Forest"},
		{"x":1,"y":8,"terrain":"Badlands"},
		{"x":1,"y":9,"terrain":"Cactus Forest"},
		{"x":1,"y":10,"terrain":"Water"},
		{"x":1,"y":11,"terrain":"Light Forest"},
		{"x":1,"y":12,"terrain":"Water"},
		{"x":1,"y":13,"terrain":"Mixed Forested Mountain"},
		{"x":1,"y":14,"terrain":"Desert Dunes"},
		{"x":1,"y":15,"terrain":"Badlands"},
		{"x":1,"y":16,"terrain":"Forested Mountains"},
		{"x":1,"y":17,"terrain":"Sandy Desert"},
		{"x":1,"y":18,"terrain":"Light Jungle"},
		{"x":1,"y":19,"terrain":"Desert Dunes"},
		{"x":1,"y":20,"terrain":"Jungle Mountains"},
		{"x":1,"y":21,"terrain":"Broken Lands"},
		{"x":1,"y":22,"terrain":"Plains"},
		{"x":1,"y":23,"terrain":"Desert Dunes"},
		{"x":1,"y":24,"terrain":"Sparse Evergreen Forest"},
		{"x":2,"y":0,"terrain":"Dense Mixed Forest"},
		{"x":2,"y":1,"terrain":"Jungle Mountain"},
		{"x":2,"y":2,"terrain":"Forested Evergreen Mountain"},
		{"x":2,"y":3,"terrain":"Plains"},
		{"x":2,"y":4,"terrain":"Sparse Evergreen Forest"},
		{"x":2,"y":5,"terrain":"Dense Forest"},
		{"x":2,"y":6,"terrain":"Desert Dunes"},
		{"x":2,"y":7,"terrain":"Sparse Evergreen Forest"},
		{"x":2,"y":8,"terrain":"Sparse Jungle"},
		{"x":2,"y":9,"terrain":"Swamp"},
		{"x":2,"y":10,"terrain":"Mixed Forested Mountains"},
		{"x":2,"y":11,"terrain":"Badlands"},
		{"x":2,"y":12,"terrain":"Desert Dunes"},
		{"x":2,"y":13,"terrain":"Cactus Forest"},
		{"x":2,"y":14,"terrain":"Foothills"},
		{"x":2,"y":15,"terrain":"Plains"},
		{"x":2,"y":16,"terrain":"Sandy Desert"},
		{"x":2,"y":17,"terrain":"Grassy Hills"},
		{"x":2,"y":18,"terrain":"Light Evergreen Forest"},
		{"x":2,"y":19,"terrain":"Grassy Hills"},
		{"x":2,"y":20,"terrain":"Grassy Hills"},
		{"x":2,"y":21,"terrain":"Cactus Forest"},
		{"x":2,"y":22,"terrain":"Foothills"},
		{"x":2,"y":23,"terrain":"Blank"},
		{"x":2,"y":24,"terrain":"Desert Dunes"},
		{"x":3,"y":0,"terrain":"Sparse Forest"},
		{"x":3,"y":1,"terrain":"Mixed Forested Mountains"},
		{"x":3,"y":2,"terrain":"Grassy Hills"},
		{"x":3,"y":3,"terrain":"Dense Forest"},
		{"x":3,"y":4,"terrain":"Dense Evergreen Forest"},
		{"x":3,"y":5,"terrain":"Badlands"},
		{"x":3,"y":6,"terrain":"Hills"},
		{"x":3,"y":7,"terrain":"Dense Jungle"},
		{"x":3,"y":8,"terrain":"Broken Lands"},
		{"x":3,"y":9,"terrain":"Forested Evergreen Mountain"},
		{"x":3,"y":10,"terrain":"Plains"},
		{"x":3,"y":11,"terrain":"Sparse Jungle"},
		{"x":3,"y":12,"terrain":"Hills"},
		{"x":3,"y":13,"terrain":"Dense Mixed Forest"},
		{"x":3,"y":14,"terrain":"Mixed Forested Mountain"},
		{"x":3,"y":15,"terrain":"Desert Dunes"},
		{"x":3,"y":16,"terrain":"Dormant Volcano"},
		{"x":3,"y":17,"terrain":"Cactus Forest"},
		{"x":3,"y":18,"terrain":"Hills"},
		{"x":3,"y":19,"terrain":"Mixed Forested Mountain"},
		{"x":3,"y":20,"terrain":"Dense Mixed Forest"},
		{"x":3,"y":21,"terrain":"Jungle Mountains"},
		{"x":3,"y":22,"terrain":"Light Evergreen Forest"},
		{"x":3,"y":23,"terrain":"Water"},
		{"x":3,"y":24,"terrain":"Blank"},
		{"x":4,"y":0,"terrain":"Dense Evergreen Forest"},
		{"x":4,"y":1,"terrain":"Light Jungle"},
		{"x":4,"y":2,"terrain":"Hills"},
		{"x":4,"y":3,"terrain":"Jungle Mountain"},
		{"x":4,"y":4,"terrain":"Mountains"},
		{"x":4,"y":5,"terrain":"Forested Evergreen Mountain"},
		{"x":4,"y":6,"terrain":"Broken Lands"},
		{"x":4,"y":7,"terrain":"Grassy Hills"},
		{"x":4,"y":8,"terrain":"Dense Cactus Forest"},
		{"x":4,"y":9,"terrain":"Light Jungle"},
		{"x":4,"y":10,"terrain":"Forested Mountains"},
		{"x":4,"y":11,"terrain":"Mountain"},
		{"x":4,"y":12,"terrain":"Sparse Forest"},
		{"x":4,"y":13,"terrain":"Light Evergreen Forest"},
		{"x":4,"y":14,"terrain":"Jungle Mountain"},
		{"x":4,"y":15,"terrain":"Light Mixed Forest"},
		{"x":4,"y":16,"terrain":"Dense Jungle"},
		{"x":4,"y":17,"terrain":"Dense Jungle"},
		{"x":4,"y":18,"terrain":"Dormant Volcano"},
		{"x":4,"y":19,"terrain":"Light Jungle"},
		{"x":4,"y":20,"terrain":"Dormant Volcano"},
		{"x":4,"y":21,"terrain":"Jungle Mountain"},
		{"x":4,"y":22,"terrain":"Swamp"},
		{"x":4,"y":23,"terrain":"Light Mixed Forest"},
		{"x":4,"y":24,"terrain":"Mountains"},
		{"x":5,"y":0,"terrain":"Light Mixed Forest"},
		{"x":5,"y":1,"terrain":"Light Evergreen Forest"},
		{"x":5,"y":2,"terrain":"Swamp"},
		{"x":5,"y":3,"terrain":"Dense Mixed Forest"},
		{"x":5,"y":4,"terrain":"Sparse Forest"},
		{"x":5,"y":5,"terrain":"Mountains"},
		{"x":5,"y":6,"terrain":"Light Evergreen Forest"},
		{"x":5,"y":7,"terrain":"Broken Lands"},
		{"x":5,"y":8,"terrain":"Hills"},
		{"x":5,"y":9,"terrain":"Light Mixed Forest"},
		{"x":5,"y":10,"terrain":"Light Mixed Forest"},
		{"x":5,"y":11,"terrain":"Desert Dunes"},
		{"x":5,"y":12,"terrain":"Sandy Desert"},
		{"x":5,"y":13,"terrain":"Forested Evergreen Mountain"},
		{"x":5,"y":14,"terrain":"Dormant Volcano"},
		{"x":5,"y":15,"terrain":"Water"},
		{"x":5,"y":16,"terrain":"Dense Forest"},
		{"x":5,"y":17,"terrain":"Mountain"},
		{"x":5,"y":18,"terrain":"Swamp"},
		{"x":5,"y":19,"terrain":"Hills"},
		{"x":5,"y":20,"terrain":"Jungle Mountain"},
		{"x":5,"y":21,"terrain":"Dense Cactus Forest"},
		{"x":5,"y":22,"terrain":"Badlands"},
		{"x":5,"y":23,"terrain":"Dormant Volcano"},
		{"x":5,"y":24,"terrain":"Dense Evergreen Forest"},
		{"x":6,"y":0,"terrain":"Active Volcano"},
		{"x":6,"y":1,"terrain":"Sparse Forest"},
		{"x":6,"y":2,"terrain":"Dormant Volcano"},
		{"x":6,"y":3,"terrain":"Light Jungle"},
		{"x":6,"y":4,"terrain":"Jungle Mountains"},
		{"x":6,"y":5,"terrain":"Sandy Desert"},
		{"x":6,"y":6,"terrain":"Light Evergreen Forest"},
		{"x":6,"y":7,"terrain":"Dense Cactus Forest"},
		{"x":6,"y":8,"terrain":"Water"},
		{"x":6,"y":9,"terrain":"Hills"},
		{"x":6,"y":10,"terrain":"Light Jungle"},
		{"x":6,"y":11,"terrain":"Dense Cactus Forest"},
		{"x":6,"y":12,"terrain":"Active Volcano"},
		{"x":6,"y":13,"terrain":"Dense Mixed Forest"},
		{"x":6,"y":14,"terrain":"Light Jungle"},
		{"x":6,"y":15,"terrain":"Light Evergreen Forest"},
		{"x":6,"y":16,"terrain":"Dense Evergreen Forest"},
		{"x":6,"y":17,"terrain":"Dense Mixed Forest"},
		{"x":6,"y":18,"terrain":"Light Jungle"},
		{"x":6,"y":19,"terrain":"Active Volcano"},
		{"x":6,"y":20,"terrain":"Sparse Forest"},
		{"x":6,"y":21,"terrain":"Plains"},
		{"x":6,"y":22,"terrain":"Jungle Mountains"},
		{"x":6,"y":23,"terrain":"Mangrove Forest"},
		{"x":6,"y":24,"terrain":"Light Jungle"},
		{"x":7,"y":0,"terrain":"Cactus Forest"},
		{"x":7,"y":1,"terrain":"Light Forest"},
		{"x":7,"y":2,"terrain":"Dense Cactus Forest"},
		{"x":7,"y":3,"terrain":"Sparse Forest"},
		{"x":7,"y":4,"terrain":"Swamp"},
		{"x":7,"y":5,"terrain":"Dense Jungle"},
		{"x":7,"y":6,"terrain":"Active Volcano"},
		{"x":7,"y":7,"terrain":"Forested Mountains"},
		{"x":7,"y":8,"terrain":"Sparse Forest"},
		{"x":7,"y":9,"terrain":"Mountain"},
		{"x":7,"y":10,"terrain":"Plains"},
		{"x":7,"y":11,"terrain":"Dense Jungle"},
		{"x":7,"y":12,"terrain":"Mangrove Forest"},
		{"x":7,"y":13,"terrain":"Forested Evergreen Mountain"},
		{"x":7,"y":14,"terrain":"Mountain"},
		{"x":7,"y":15,"terrain":"Mountain"},
		{"x":7,"y":16,"terrain":"Dense Cactus Forest"},
		{"x":7,"y":17,"terrain":"Mountains"},
		{"x":7,"y":18,"terrain":"Light Forest"},
		{"x":7,"y":19,"terrain":"Broken Lands"},
		{"x":7,"y":20,"terrain":"Blank"},
		{"x":7,"y":21,"terrain":"Dense Forest"},
		{"x":7,"y":22,"terrain":"Hills"},
		{"x":7,"y":23,"terrain":"Forested Mountains"},
		{"x":7,"y":24,"terrain":"Dense Mixed Forest"},
		{"x":8,"y":0,"terrain":"Forested Mountain"},
		{"x":8,"y":1,"terrain":"Light Mixed Forest"},
		{"x":8,"y":2,"terrain":"Desert Dunes"},
		{"x":8,"y":3,"terrain":"Broken Lands"},
		{"x":8,"y":4,"terrain":"Mountains"},
		{"x":8,"y":5,"terrain":"Mountains"},
		{"x":8,"y":6,"terrain":"Water"},
		{"x":8,"y":7,"terrain":"Dense Evergreen Forest"},
		{"x":8,"y":8,"terrain":"Active Volcano"},
		{"x":8,"y":9,"terrain":"Mixed Forested Mountains"},
		{"x":8,"y":10,"terrain":"Dense Jungle"},
		{"x":8,"y":11,"terrain":"Cactus Forest"},
		{"x":8,"y":12,"terrain":"Light Evergreen Forest"},
		{"x":8,"y":13,"terrain":"Foothills"},
		{"x":8,"y":14,"terrain":"Plains"},
		{"x":8,"y":15,"terrain":"Dense Jungle"},
		{"x":8,"y":16,"terrain":"Dormant Volcano"},
		{"x":8,"y":17,"terrain":"Broken Lands"},
		{"x":8,"y":18,"terrain":"Forested Mountains"},
		{"x":8,"y":19,"terrain":"Broken Lands"},
		{"x":8,"y":20,"terrain":"Badlands"},
		{"x":8,"y":21,"terrain":"Mountains"},
		{"x":8,"y":22,"terrain":"Swamp"},
		{"x":8,"y":23,"terrain":"Light Forest"},
		{"x":8,"y":24,"terrain":"Forested Mountain"},
		{"x":9,"y":0,"terrain":"Water"},
		{"x":9,"y":1,"terrain":"Dense Mixed Forest"},
		{"x":9,"y":2,"terrain":"Foothills"},
		{"x":9,"y":3,"terrain":"Jungle Mountains"},
		{"x":9,"y":4,"terrain":"Dense Jungle"},
		{"x":9,"y":5,"terrain":"Light Forest"},
		{"x":9,"y":6,"terrain":"Plains"},
		{"x":9,"y":7,"terrain":"Dense Forest"},
		{"x":9,"y":8,"terrain":"Broken Lands"},
		{"x":9,"y":9,"terrain":"Blank"},
		{"x":9,"y":10,"terrain":"Sparse Jungle"},
		{"x":9,"y":11,"terrain":"Sparse Forest"},
		{"x":9,"y":12,"terrain":"Sparse Jungle"},
		{"x":9,"y":13,"terrain":"Jungle Mountain"},
		{"x":9,"y":14,"terrain":"Light Evergreen Forest"},
		{"x":9,"y":15,"terrain":"Cactus Forest"},
		{"x":9,"y":16,"terrain":"Mixed Forested Mountain"},
		{"x":9,"y":17,"terrain":"Dense Jungle"},
		{"x":9,"y":18,"terrain":"Dense Forest"},
		{"x":9,"y":19,"terrain":"Badlands"},
		{"x":9,"y":20,"terrain":"Sparse Evergreen Forest"},
		{"x":9,"y":21,"terrain":"Sparse Jungle"},
		{"x":9,"y":22,"terrain":"Sparse Evergreen Forest"},
		{"x":9,"y":23,"terrain":"Dense Evergreen Forest"},
		{"x":9,"y":24,"terrain":"Swamp"},
		{"x":10,"y":0,"terrain":"Dense Evergreen Forest"},
		{"x":10,"y":1,"terrain":"Dense Mixed Forest"},
		{"x":10,"y":2,"terrain":"Active Volcano"},
		{"x":10,"y":3,"terrain":"Badlands"},
		{"x":10,"y":4,"terrain":"Badlands"},
		{"x":10,"y":5,"terrain":"Forested Mountains"},
		{"x":10,"y":6,"terrain":"Hills"},
		{"x":10,"y":7,"terrain":"Mangrove Forest"},
		{"x":10,"y":8,"terrain":"Water"},
		{"x":10,"y":9,"terrain":"Dense Cactus Forest"},
		{"x":10,"y":10,"terrain":"Dormant Volcano"},
		{"x":10,"y":11,"terrain":"Sparse Forest"},
		{"x":10,"y":12,"terrain":"Jungle Mountain"},
		{"x":10,"y":13,"terrain":"Active Volcano"},
		{"x":10,"y":14,"terrain":"Dense Mixed Forest"},
		{"x":10,"y":15,"terrain":"Mixed Forested Mountain"},
		{"x":10,"y":16,"terrain":"Foothills"},
		{"x":10,"y":17,"terrain":"Dense Forest"},
		{"x":10,"y":18,"terrain":"Hills"},
		{"x":10,"y":19,"terrain":"Dense Jungle"},
		{"x":10,"y":20,"terrain":"Forested Mountains"},
		{"x":10,"y":21,"terrain":"Broken Lands"},
		{"x":10,"y":22,"terrain":"Sparse Evergreen Forest"},
		{"x":10,"y":23,"terrain":"Light Evergreen Forest"},
		{"x":10,"y":24,"terrain":"Jungle Mountain"},
		{"x":11,"y":0,"terrain":"Mountains"},
		{"x":11,"y":1,"terrain":"Plains"},
		{"x":11,"y":2,"terrain":"Mountain"},
		{"x":11,"y":3,"terrain":"Broken Lands"},
		{"x":11,"y":4,"terrain":"Dense Jungle"},
		{"x":11,"y":5,"terrain":"Mangrove Forest"},
		{"x":11,"y":6,"terrain":"Light Jungle"},
		{"x":11,"y":7,"terrain":"Dense Cactus Forest"},
		{"x":11,"y":8,"terrain":"Light Jungle"},
		{"x":11,"y":9,"terrain":"Foothills"},
		{"x":11,"y":10,"terrain":"Blank"},
		{"x":11,"y":11,"terrain":"Light Mixed Forest"},
		{"x":11,"y":12,"terrain":"Mangrove Forest"},
		{"x":11,"y":13,"terrain":"Dense Jungle"},
		{"x":11,"y":14,"terrain":"Foothills"},
		{"x":11,"y":15,"terrain":"Light Mixed Forest"},
		{"x":11,"y":16,"terrain":"Desert Dunes"},
		{"x":11,"y":17,"terrain":"Sparse Jungle"},
		{"x":11,"y":18,"terrain":"Desert Dunes"},
		{"x":11,"y":19,"terrain":"Plains"},
		{"x":11,"y":20,"terrain":"Sparse Forest"},
		{"x":11,"y":21,"terrain":"Blank"},
		{"x":11,"y":22,"terrain":"Jungle Mountain"},
		{"x":11,"y":23,"terrain":"Swamp"},
		{"x":11,"y":24,"terrain":"Broken Lands"},
		{"x":12,"y":0,"terrain":"Active Volcano"},
		{"x":12,"y":1,"terrain":"Blank"},
		{"x":12,"y":2,"terrain":"Foothills"},
		{"x":12,"y":3,"terrain":"Light Evergreen Forest"},
		{"x":12,"y":4,"terrain":"Cactus Forest"},
		{"x":12,"y":5,"terrain":"Plains"},
		{"x":12,"y":6,"terrain":"Dense Evergreen Forest"},
		{"x":12,"y":7,"terrain":"Light Mixed Forest"},
		{"x":12,"y":8,"terrain":"Blank"},
		{"x":12,"y":9,"terrain":"Forested Evergreen Mountain"},
		{"x":12,"y":10,"terrain":"Sparse Jungle"},
		{"x":12,"y":11,"terrain":"Mountain"},
		{"x":12,"y":12,"terrain":"Grassy Hills"},
		{"x":12,"y":13,"terrain":"Badlands"},
		{"x":12,"y":14,"terrain":"Dense Cactus Forest"},
		{"x":12,"y":15,"terrain":"Plains"},
		{"x":12,"y":16,"terrain":"Light Jungle"},
		{"x":12,"y":17,"terrain":"Hills"},
		{"x":12,"y":18,"terrain":"Mixed Forested Mountain"},
		{"x":12,"y":19,"terrain":"Dormant Volcano"},
		{"x":12,"y":20,"terrain":"Dormant Volcano"},
		{"x":12,"y":21,"terrain":"Light Mixed Forest"},
		{"x":12,"y":22,"terrain":"Light Forest"},
		{"x":12,"y":23,"terrain":"Light Forest"},
		{"x":12,"y":24,"terrain":"Plains"},
		{"x":13,"y":0,"terrain":"Sparse Forest"},
		{"x":13,"y":1,"terrain":"Jungle Mountain"},
		{"x":13,"y":2,"terrain":"Cactus Forest"},
		{"x":13,"y":3,"terrain":"Water"},
		{"x":13,"y":4,"terrain":"Light Forest"},
		{"x":13,"y":5,"terrain":"Sparse Forest"},
		{"x":13,"y":6,"terrain":"Light Jungle"},
		{"x":13,"y":7,"terrain":"Sparse Forest"},
		{"x":13,"y":8,"terrain":"Sandy Desert"},
		{"x":13,"y":9,"terrain":"Plains"},
		{"x":13,"y":10,"terrain":"Forested Mountain"},
		{"x":13,"y":11,"terrain":"Grassy Hills"},
		{"x":13,"y":12,"terrain":"Swamp"},
		{"x":13,"y":13,"terrain":"Light Forest"},
		{"x":13,"y":14,"terrain":"Light Mixed Forest"},
		{"x":13,"y":15,"terrain":"Grassy Hills"},
		{"x":13,"y":16,"terrain":"Light Jungle"},
		{"x":13,"y":17,"terrain":"Dense Mixed Forest"},
		{"x":13,"y":18,"terrain":"Foothills"},
		{"x":13,"y":19,"terrain":"Swamp"},
		{"x":13,"y":20,"terrain":"Hills"},
		{"x":13,"y":21,"terrain":"Light Mixed Forest"},
		{"x":13,"y":22,"terrain":"Sparse Evergreen Forest"},
		{"x":13,"y":23,"terrain":"Desert Dunes"},
		{"x":13,"y":24,"terrain":"Dormant Volcano"},
		{"x":14,"y":0,"terrain":"Broken Lands"},
		{"x":14,"y":1,"terrain":"Light Evergreen Forest"},
		{"x":14,"y":2,"terrain":"Dense Forest"},
		{"x":14,"y":3,"terrain":"Mixed Forested Mountain"},
		{"x":14,"y":4,"terrain":"Mountain"},
		{"x":14,"y":5,"terrain":"Dense Forest"},
		{"x":14,"y":6,"terrain":"Dense Mixed Forest"},
		{"x":14,"y":7,"terrain":"Badlands"},
		{"x":14,"y":8,"terrain":"Sparse Jungle"},
		{"x":14,"y":9,"terrain":"Water"},
		{"x":14,"y":10,"terrain":"Broken Lands"},
		{"x":14,"y":11,"terrain":"Light Forest"},
		{"x":14,"y":12,"terrain":"Blank"},
		{"x":14,"y":13,"terrain":"Mountains"},
		{"x":14,"y":14,"terrain":"Dense Cactus Forest"},
		{"x":14,"y":15,"terrain":"Dense Jungle"},
		{"x":14,"y":16,"terrain":"Grassy Hills"},
		{"x":14,"y":17,"terrain":"Active Volcano"},
		{"x":14,"y":18,"terrain":"Broken Lands"},
		{"x":14,"y":19,"terrain":"Forested Evergreen Mountain"},
		{"x":14,"y":20,"terrain":"Dense Cactus Forest"},
		{"x":14,"y":21,"terrain":"Light Forest"},
		{"x":14,"y":22,"terrain":"Mountains"},
		{"x":14,"y":23,"terrain":"Dense Jungle"},
		{"x":14,"y":24,"terrain":"Desert Dunes"},
		{"x":15,"y":0,"terrain":"Foothills"},
		{"x":15,"y":1,"terrain":"Dense Jungle"},
		{"x":15,"y":2,"terrain":"Dense Jungle"},
		{"x":15,"y":3,"terrain":"Dormant Volcano"},
		{"x":15,"y":4,"terrain":"Light Mixed Forest"},
		{"x":15,"y":5,"terrain":"Dense Jungle"},
		{"x":15,"y":6,"terrain":"Foothills"},
		{"x":15,"y":7,"terrain":"Foothills"},
		{"x":15,"y":8,"terrain":"Jungle Mountain"},
		{"x":15,"y":9,"terrain":"Badlands"},
		{"x":15,"y":10,"terrain":"Dense Jungle"},
		{"x":15,"y":11,"terrain":"Cactus Forest"},
		{"x":15,"y":12,"terrain":"Broken Lands"},
		{"x":15,"y":13,"terrain":"Forested Mountain"},
		{"x":15,"y":14,"terrain":"Dense Jungle"},
		{"x":15,"y":15,"terrain":"Light Jungle"},
		{"x":15,"y":16,"terrain":"Dense Cactus Forest"},
		{"x":15,"y":17,"terrain":"Sparse Jungle"},
		{"x":15,"y":18,"terrain":"Jungle Mountain"},
		{"x":15,"y":19,"terrain":"Blank"},
		{"x":15,"y":20,"terrain":"Water"},
		{"x":15,"y":21,"terrain":"Dormant Volcano"},
		{"x":15,"y":22,"terrain":"Dense Jungle"},
		{"x":15,"y":23,"terrain":"Sparse Jungle"},
		{"x":15,"y":24,"terrain":"Swamp"},
		{"x":16,"y":0,"terrain":"Jungle Mountains"},
		{"x":16,"y":1,"terrain":"Dense Forest"},
		{"x":16,"y":2,"terrain":"Light Mixed Forest"},
		{"x":16,"y":3,"terrain":"Forested Evergreen Mountain"},
		{"x":16,"y":4,"terrain":"Mixed Forested Mountain"},
		{"x":16,"y":5,"terrain":"Active Volcano"},
		{"x":16,"y":6,"terrain":"Desert Dunes"},
		{"x":16,"y":7,"terrain":"Grassy Hills"},
		{"x":16,"y":8,"terrain":"Mangrove Forest"},
		{"x":16,"y":9,"terrain":"Active Volcano"},
		{"x":16,"y":10,"terrain":"Mountains"},
		{"x":16,"y":11,"terrain":"Light Mixed Forest"},
		{"x":16,"y":12,"terrain":"Grassy Hills"},
		{"x":16,"y":13,"terrain":"Mangrove Forest"},
		{"x":16,"y":14,"terrain":"Swamp"},
		{"x":16,"y":15,"terrain":"Swamp"},
		{"x":16,"y":16,"terrain":"Dense Jungle"},
		{"x":16,"y":17,"terrain":"Light Evergreen Forest"},
		{"x":16,"y":18,"terrain":"Light Evergreen Forest"},
		{"x":16,"y":19,"terrain":"Broken Lands"},
		{"x":16,"y":20,"terrain":"Mixed Forested Mountain"},
		{"x":16,"y":21,"terrain":"Water"},
		{"x":16,"y":22,"terrain":"Badlands"},
		{"x":16,"y":23,"terrain":"Swamp"},
		{"x":16,"y":24,"terrain":"Light Jungle"},
		{"x":17,"y":0,"terrain":"Water"},
		{"x":17,"y":1,"terrain":"Active Volcano"},
		{"x":17,"y":2,"terrain":"Light Evergreen Forest"},
		{"x":17,"y":3,"terrain":"Mountains"},
		{"x":17,"y":4,"terrain":"Water"},
		{"x":17,"y":5,"terrain":"Active Volcano"},
		{"x":17,"y":6,"terrain":"Mixed Forested Mountains"},
		{"x":17,"y":7,"terrain":"Dense Evergreen Forest"},
		{"x":17,"y":8,"terrain":"Dormant Volcano"},
		{"x":17,"y":9,"terrain":"Dense Jungle"},
		{"x":17,"y":10,"terrain":"Dense Cactus Forest"},
		{"x":17,"y":11,"terrain":"Foothills"},
		{"x":17,"y":12,"terrain":"Mixed Forested Mountains"},
		{"x":17,"y":13,"terrain":"Swamp"},
		{"x":17,"y":14,"terrain":"Dense Evergreen Forest"},
		{"x":17,"y":15,"terrain":"Badlands"},
		{"x":17,"y":16,"terrain":"Swamp"},
		{"x":17,"y":17,"terrain":"Blank"},
		{"x":17,"y":18,"terrain":"Forested Mountains"},
		{"x":17,"y":19,"terrain":"Swamp"},
		{"x":17,"y":20,"terrain":"Dense Mixed Forest"},
		{"x":17,"y":21,"terrain":"Desert Dunes"},
		{"x":17,"y":22,"terrain":"Grassy Hills"},
		{"x":17,"y":23,"terrain":"Water"},
		{"x":17,"y":24,"terrain":"Desert Dunes"},
		{"x":18,"y":0,"terrain":"Forested Mountain"},
		{"x":18,"y":1,"terrain":"Broken Lands"},
		{"x":18,"y":2,"terrain":"Dense Jungle"},
		{"x":18,"y":3,"terrain":"Sparse Jungle"},
		{"x":18,"y":4,"terrain":"Light Mixed Forest"},
		{"x":18,"y":5,"terrain":"Dense Evergreen Forest"},
		{"x":18,"y":6,"terrain":"Sparse Evergreen Forest"},
		{"x":18,"y":7,"terrain":"Forested Mountain"},
		{"x":18,"y":8,"terrain":"Dense Cactus Forest"},
		{"x":18,"y":9,"terrain":"Forested Mountains"},
		{"x":18,"y":10,"terrain":"Dense Forest"},
		{"x":18,"y":11,"terrain":"Jungle Mountain"},
		{"x":18,"y":12,"terrain":"Light Jungle"},
		{"x":18,"y":13,"terrain":"Dense Evergreen Forest"},
		{"x":18,"y":14,"terrain":"Dense Forest"},
		{"x":18,"y":15,"terrain":"Swamp"},
		{"x":18,"y":16,"terrain":"Light Jungle"},
		{"x":18,"y":17,"terrain":"Jungle Mountain"},
		{"x":18,"y":18,"terrain":"Mixed Forested Mountain"},
		{"x":18,"y":19,"terrain":"Plains"},
		{"x":18,"y":20,"terrain":"Dense Forest"},
		{"x":18,"y":21,"terrain":"Dense Mixed Forest"},
		{"x":18,"y":22,"terrain":"Dense Cactus Forest"},
		{"x":18,"y":23,"terrain":"Dormant Volcano"},
		{"x":18,"y":24,"terrain":"Cactus Forest"},
		{"x":19,"y":0,"terrain":"Sandy Desert"},
		{"x":19,"y":1,"terrain":"Foothills"},
		{"x":19,"y":2,"terrain":"Dense Forest"},
		{"x":19,"y":3,"terrain":"Mangrove Forest"},
		{"x":19,"y":4,"terrain":"Light Forest"},
		{"x":19,"y":5,"terrain":"Sparse Jungle"},
		{"x":19,"y":6,"terrain":"Water"},
		{"x":19,"y":7,"terrain":"Foothills"},
		{"x":19,"y":8,"terrain":"Mixed Forested Mountains"},
		{"x":19,"y":9,"terrain":"Plains"},
		{"x":19,"y":10,"terrain":"Sparse Jungle"},
		{"x":19,"y":11,"terrain":"Dense Mixed Forest"},
		{"x":19,"y":12,"terrain":"Mixed Forested Mountain"},
		{"x":19,"y":13,"terrain":"Jungle Mountain"},
		{"x":19,"y":14,"terrain":"Light Jungle"},
		{"x":19,"y":15,"terrain":"Forested Mountains"},
		{"x":19,"y":16,"terrain":"Jungle Mountain"},
		{"x":19,"y":17,"terrain":"Dense Cactus Forest"},
		{"x":19,"y":18,"terrain":"Light Mixed Forest"},
		{"x":19,"y":19,"terrain":"Badlands"},
		{"x":19,"y":20,"terrain":"Active Volcano"},
		{"x":19,"y":21,"terrain":"Jungle Mountain"},
		{"x":19,"y":22,"terrain":"Desert Dunes"},
		{"x":19,"y":23,"terrain":"Dense Mixed Forest"},
		{"x":19,"y":24,"terrain":"Sparse Forest"}]
}
var $testGrid = {
"rows":25,
"columns":20,
"tiles":[
{"x":0,"y":0,"terrain":"jungle_mountains"},
{"x":0,"y":1,"terrain":"dense_evergreen_forest"},
{"x":0,"y":2,"terrain":"volcano_active"},
{"x":0,"y":3,"terrain":"forested_hills"},
{"x":0,"y":4,"terrain":"jungle_hills"},
{"x":0,"y":5,"terrain":"dense_jungle"},
{"x":0,"y":6,"terrain":"desert_dense_cactus_forest"},
{"x":0,"y":7,"terrain":"mountains"},
{"x":0,"y":8,"terrain":"hills"},
{"x":0,"y":9,"terrain":"marsh"},
{"x":0,"y":10,"terrain":"swamp"},
{"x":0,"y":11,"terrain":"mountains"},
{"x":0,"y":12,"terrain":"light_evergreen_forest"},
{"x":0,"y":13,"terrain":"jungle_hills"},
{"x":0,"y":14,"terrain":"desert_sandy"},
{"x":0,"y":15,"terrain":"forested_hills"},
{"x":0,"y":16,"terrain":"foothills"},
{"x":0,"y":17,"terrain":"jungle_mountains"},
{"x":0,"y":18,"terrain":"plains"},
{"x":0,"y":19,"terrain":"mixed_forested_mountain"},
{"x":0,"y":20,"terrain":"sparse_jungle"},
{"x":0,"y":21,"terrain":"forested_mountain"},
{"x":0,"y":22,"terrain":"volcano_dormant"},
{"x":0,"y":23,"terrain":"desert_dense_cactus_forest"},
{"x":0,"y":24,"terrain":"mountains"},
{"x":1,"y":0,"terrain":"mountains"},
{"x":1,"y":1,"terrain":"dense_forest"},
{"x":1,"y":2,"terrain":"light_forest"},
{"x":1,"y":3,"terrain":"dense_jungle"},
{"x":1,"y":4,"terrain":"fen"},
{"x":1,"y":5,"terrain":"marsh"},
{"x":1,"y":6,"terrain":"jungle_hills"},
{"x":1,"y":7,"terrain":"swamp"},
{"x":1,"y":8,"terrain":"light_evergreen_forest"},
{"x":1,"y":9,"terrain":"desert_dunes"},
{"x":1,"y":10,"terrain":"dense_jungle"},
{"x":1,"y":11,"terrain":"swamp"},
{"x":1,"y":12,"terrain":"mountains"},
{"x":1,"y":13,"terrain":"fen"},
{"x":1,"y":14,"terrain":"hills"},
{"x":1,"y":15,"terrain":"grassy_hills"},
{"x":1,"y":16,"terrain":"desert_dunes"},
{"x":1,"y":17,"terrain":"marsh"},
{"x":1,"y":18,"terrain":"forested_evergreen_mountain"},
{"x":1,"y":19,"terrain":"mixed_forested_mountain"},
{"x":1,"y":20,"terrain":"water"},
{"x":1,"y":21,"terrain":"sparse_forest"},
{"x":1,"y":22,"terrain":"badlands"},
{"x":1,"y":23,"terrain":"badlands"},
{"x":1,"y":24,"terrain":"volcano_active"},
{"x":2,"y":0,"terrain":"dense_evergreen_forest"},
{"x":2,"y":1,"terrain":"jungle_mountains"},
{"x":2,"y":2,"terrain":"light_evergreen_forest"},
{"x":2,"y":3,"terrain":"jungle_mountains"},
{"x":2,"y":4,"terrain":"forested_evergreen_hills"},
{"x":2,"y":5,"terrain":"desert_dunes"},
{"x":2,"y":6,"terrain":"water"},
{"x":2,"y":7,"terrain":"jungle_mountains"},
{"x":2,"y":8,"terrain":"badlands"},
{"x":2,"y":9,"terrain":"forested_hills"},
{"x":2,"y":10,"terrain":"grassy_hills"},
{"x":2,"y":11,"terrain":"swamp"},
{"x":2,"y":12,"terrain":"dense_forest"},
{"x":2,"y":13,"terrain":"mountains"},
{"x":2,"y":14,"terrain":"forested_evergreen_hills"},
{"x":2,"y":15,"terrain":"mixed_forested_mountain"},
{"x":2,"y":16,"terrain":"broken_lands"},
{"x":2,"y":17,"terrain":"forested_hills"},
{"x":2,"y":18,"terrain":"grassy_hills"},
{"x":2,"y":19,"terrain":"desert_cactus_forest"},
{"x":2,"y":20,"terrain":"marsh"},
{"x":2,"y":21,"terrain":"light_mixed_forest"},
{"x":2,"y":22,"terrain":"forested_hills"},
{"x":2,"y":23,"terrain":"hills"},
{"x":2,"y":24,"terrain":"sparse_evergreen_forest"},
{"x":3,"y":0,"terrain":"mixed_forested_hills"},
{"x":3,"y":1,"terrain":"jungle_mountain"},
{"x":3,"y":2,"terrain":"swamp"},
{"x":3,"y":3,"terrain":"mountain"},
{"x":3,"y":4,"terrain":"jungle_hills"},
{"x":3,"y":5,"terrain":"forested_mountains"},
{"x":3,"y":6,"terrain":"volcano_dormant"},
{"x":3,"y":7,"terrain":"forested_evergreen_mountain"},
{"x":3,"y":8,"terrain":"broken_lands"},
{"x":3,"y":9,"terrain":"forested_evergreen_hills"},
{"x":3,"y":10,"terrain":"desert_dense_cactus_forest"},
{"x":3,"y":11,"terrain":"sparse_jungle"},
{"x":3,"y":12,"terrain":"light_forest"},
{"x":3,"y":13,"terrain":"sparse_evergreen_forest"},
{"x":3,"y":14,"terrain":"desert_dense_cactus_forest"},
{"x":3,"y":15,"terrain":"forested_evergreen_mountains"},
{"x":3,"y":16,"terrain":"foothills"},
{"x":3,"y":17,"terrain":"mixed_forested_mountains"},
{"x":3,"y":18,"terrain":"volcano_dormant"},
{"x":3,"y":19,"terrain":"light_jungle"},
{"x":3,"y":20,"terrain":"volcano_active"},
{"x":3,"y":21,"terrain":"desert_cactus_forest"},
{"x":3,"y":22,"terrain":"sparse_jungle"},
{"x":3,"y":23,"terrain":"swamp"},
{"x":3,"y":24,"terrain":"forested_mountains"},
{"x":4,"y":0,"terrain":"sparse_jungle"},
{"x":4,"y":1,"terrain":"foothills"},
{"x":4,"y":2,"terrain":"light_forest"},
{"x":4,"y":3,"terrain":"sparse_forest"},
{"x":4,"y":4,"terrain":"desert_sandy"},
{"x":4,"y":5,"terrain":"jungle_mountains"},
{"x":4,"y":6,"terrain":"forested_mountain"},
{"x":4,"y":7,"terrain":"water"},
{"x":4,"y":8,"terrain":"dense_forest"},
{"x":4,"y":9,"terrain":"jungle_mountain"},
{"x":4,"y":10,"terrain":"mountain"},
{"x":4,"y":11,"terrain":"dense_evergreen_forest"},
{"x":4,"y":12,"terrain":"dense_forest"},
{"x":4,"y":13,"terrain":"forested_hills"},
{"x":4,"y":14,"terrain":"badlands"},
{"x":4,"y":15,"terrain":"mixed_forested_hills"},
{"x":4,"y":16,"terrain":"blank"},
{"x":4,"y":17,"terrain":"light_forest"},
{"x":4,"y":18,"terrain":"jungle_mountain"},
{"x":4,"y":19,"terrain":"forested_evergreen_hills"},
{"x":4,"y":20,"terrain":"light_forest"},
{"x":4,"y":21,"terrain":"dense_jungle"},
{"x":4,"y":22,"terrain":"desert_dunes"},
{"x":4,"y":23,"terrain":"mountains"},
{"x":4,"y":24,"terrain":"marsh"},
{"x":5,"y":0,"terrain":"forested_evergreen_mountain"},
{"x":5,"y":1,"terrain":"sparse_jungle"},
{"x":5,"y":2,"terrain":"water"},
{"x":5,"y":3,"terrain":"forested_evergreen_mountains"},
{"x":5,"y":4,"terrain":"desert_cactus_forest"},
{"x":5,"y":5,"terrain":"grassy_hills"},
{"x":5,"y":6,"terrain":"jungle_mountains"},
{"x":5,"y":7,"terrain":"jungle_mountains"},
{"x":5,"y":8,"terrain":"desert_sandy"},
{"x":5,"y":9,"terrain":"mixed_forested_mountain"},
{"x":5,"y":10,"terrain":"plains"},
{"x":5,"y":11,"terrain":"dense_forest"},
{"x":5,"y":12,"terrain":"jungle_hills"},
{"x":5,"y":13,"terrain":"sparse_jungle"},
{"x":5,"y":14,"terrain":"mixed_forested_mountains"},
{"x":5,"y":15,"terrain":"dense_jungle"},
{"x":5,"y":16,"terrain":"sparse_forest"},
{"x":5,"y":17,"terrain":"forested_mountains"},
{"x":5,"y":18,"terrain":"jungle_mountains"},
{"x":5,"y":19,"terrain":"forested_evergreen_hills"},
{"x":5,"y":20,"terrain":"hills"},
{"x":5,"y":21,"terrain":"hills"},
{"x":5,"y":22,"terrain":"forested_mountains"},
{"x":5,"y":23,"terrain":"desert_dense_cactus_forest"},
{"x":5,"y":24,"terrain":"desert_dunes"},
{"x":6,"y":0,"terrain":"sparse_evergreen_forest"},
{"x":6,"y":1,"terrain":"jungle_hills"},
{"x":6,"y":2,"terrain":"volcano_active"},
{"x":6,"y":3,"terrain":"volcano_dormant"},
{"x":6,"y":4,"terrain":"mixed_forested_mountain"},
{"x":6,"y":5,"terrain":"marsh"},
{"x":6,"y":6,"terrain":"swamp"},
{"x":6,"y":7,"terrain":"jungle_hills"},
{"x":6,"y":8,"terrain":"blank"},
{"x":6,"y":9,"terrain":"mixed_forested_mountain"},
{"x":6,"y":10,"terrain":"desert_cactus_forest"},
{"x":6,"y":11,"terrain":"badlands"},
{"x":6,"y":12,"terrain":"dense_mixed_forest"},
{"x":6,"y":13,"terrain":"forested_evergreen_mountains"},
{"x":6,"y":14,"terrain":"foothills"},
{"x":6,"y":15,"terrain":"jungle_mountain"},
{"x":6,"y":16,"terrain":"dense_evergreen_forest"},
{"x":6,"y":17,"terrain":"badlands"},
{"x":6,"y":18,"terrain":"sparse_jungle"},
{"x":6,"y":19,"terrain":"hills"},
{"x":6,"y":20,"terrain":"broken_lands"},
{"x":6,"y":21,"terrain":"badlands"},
{"x":6,"y":22,"terrain":"sparse_evergreen_forest"},
{"x":6,"y":23,"terrain":"dense_evergreen_forest"},
{"x":6,"y":24,"terrain":"light_jungle"},
{"x":7,"y":0,"terrain":"desert_dense_cactus_forest"},
{"x":7,"y":1,"terrain":"forested_evergreen_hills"},
{"x":7,"y":2,"terrain":"forested_evergreen_mountains"},
{"x":7,"y":3,"terrain":"grassy_hills"},
{"x":7,"y":4,"terrain":"volcano_dormant"},
{"x":7,"y":5,"terrain":"badlands"},
{"x":7,"y":6,"terrain":"forested_evergreen_mountain"},
{"x":7,"y":7,"terrain":"sparse_forest"},
{"x":7,"y":8,"terrain":"water"},
{"x":7,"y":9,"terrain":"desert_sandy"},
{"x":7,"y":10,"terrain":"volcano_active"},
{"x":7,"y":11,"terrain":"marsh"},
{"x":7,"y":12,"terrain":"light_jungle"},
{"x":7,"y":13,"terrain":"fen"},
{"x":7,"y":14,"terrain":"forested_mountain"},
{"x":7,"y":15,"terrain":"forested_evergreen_mountains"},
{"x":7,"y":16,"terrain":"mountains"},
{"x":7,"y":17,"terrain":"jungle_mountain"},
{"x":7,"y":18,"terrain":"forested_mountain"},
{"x":7,"y":19,"terrain":"swamp"},
{"x":7,"y":20,"terrain":"dense_evergreen_forest"},
{"x":7,"y":21,"terrain":"light_mixed_forest"},
{"x":7,"y":22,"terrain":"dense_jungle"},
{"x":7,"y":23,"terrain":"dense_jungle"},
{"x":7,"y":24,"terrain":"desert_dunes"},
{"x":8,"y":0,"terrain":"mountain"},
{"x":8,"y":1,"terrain":"dense_evergreen_forest"},
{"x":8,"y":2,"terrain":"sparse_evergreen_forest"},
{"x":8,"y":3,"terrain":"forested_mountains"},
{"x":8,"y":4,"terrain":"sparse_forest"},
{"x":8,"y":5,"terrain":"desert_dunes"},
{"x":8,"y":6,"terrain":"light_evergreen_forest"},
{"x":8,"y":7,"terrain":"sparse_forest"},
{"x":8,"y":8,"terrain":"broken_lands"},
{"x":8,"y":9,"terrain":"jungle_hills"},
{"x":8,"y":10,"terrain":"dense_mixed_forest"},
{"x":8,"y":11,"terrain":"light_mixed_forest"},
{"x":8,"y":12,"terrain":"volcano_active"},
{"x":8,"y":13,"terrain":"mixed_forested_mountain"},
{"x":8,"y":14,"terrain":"forested_mountain"},
{"x":8,"y":15,"terrain":"desert_sandy"},
{"x":8,"y":16,"terrain":"desert_dense_cactus_forest"},
{"x":8,"y":17,"terrain":"water"},
{"x":8,"y":18,"terrain":"forested_evergreen_mountains"},
{"x":8,"y":19,"terrain":"jungle_mountains"},
{"x":8,"y":20,"terrain":"sparse_jungle"},
{"x":8,"y":21,"terrain":"grassy_hills"},
{"x":8,"y":22,"terrain":"light_evergreen_forest"},
{"x":8,"y":23,"terrain":"desert_cactus_forest"},
{"x":8,"y":24,"terrain":"desert_sandy"},
{"x":9,"y":0,"terrain":"dense_evergreen_forest"},
{"x":9,"y":1,"terrain":"light_forest"},
{"x":9,"y":2,"terrain":"light_evergreen_forest"},
{"x":9,"y":3,"terrain":"fen"},
{"x":9,"y":4,"terrain":"desert_dunes"},
{"x":9,"y":5,"terrain":"badlands"},
{"x":9,"y":6,"terrain":"mixed_forested_mountains"},
{"x":9,"y":7,"terrain":"dense_forest"},
{"x":9,"y":8,"terrain":"light_mixed_forest"},
{"x":9,"y":9,"terrain":"foothills"},
{"x":9,"y":10,"terrain":"forested_evergreen_hills"},
{"x":9,"y":11,"terrain":"desert_sandy"},
{"x":9,"y":12,"terrain":"forested_mountains"},
{"x":9,"y":13,"terrain":"volcano_dormant"},
{"x":9,"y":14,"terrain":"forested_hills"},
{"x":9,"y":15,"terrain":"broken_lands"},
{"x":9,"y":16,"terrain":"forested_mountains"},
{"x":9,"y":17,"terrain":"hills"},
{"x":9,"y":18,"terrain":"jungle_hills"},
{"x":9,"y":19,"terrain":"mountain"},
{"x":9,"y":20,"terrain":"light_mixed_forest"},
{"x":9,"y":21,"terrain":"mixed_forested_mountain"},
{"x":9,"y":22,"terrain":"light_forest"},
{"x":9,"y":23,"terrain":"desert_dense_cactus_forest"},
{"x":9,"y":24,"terrain":"fen"},
{"x":10,"y":0,"terrain":"marsh"},
{"x":10,"y":1,"terrain":"water"},
{"x":10,"y":2,"terrain":"water"},
{"x":10,"y":3,"terrain":"dense_jungle"},
{"x":10,"y":4,"terrain":"forested_mountains"},
{"x":10,"y":5,"terrain":"desert_dunes"},
{"x":10,"y":6,"terrain":"grassy_hills"},
{"x":10,"y":7,"terrain":"fen"},
{"x":10,"y":8,"terrain":"dense_forest"},
{"x":10,"y":9,"terrain":"plains"},
{"x":10,"y":10,"terrain":"light_evergreen_forest"},
{"x":10,"y":11,"terrain":"mountains"},
{"x":10,"y":12,"terrain":"hills"},
{"x":10,"y":13,"terrain":"desert_dense_cactus_forest"},
{"x":10,"y":14,"terrain":"sparse_forest"},
{"x":10,"y":15,"terrain":"swamp"},
{"x":10,"y":16,"terrain":"water"},
{"x":10,"y":17,"terrain":"dense_mixed_forest"},
{"x":10,"y":18,"terrain":"sparse_jungle"},
{"x":10,"y":19,"terrain":"light_mixed_forest"},
{"x":10,"y":20,"terrain":"desert_dense_cactus_forest"},
{"x":10,"y":21,"terrain":"mountains"},
{"x":10,"y":22,"terrain":"desert_cactus_forest"},
{"x":10,"y":23,"terrain":"light_forest"},
{"x":10,"y":24,"terrain":"forested_mountain"},
{"x":11,"y":0,"terrain":"forested_hills"},
{"x":11,"y":1,"terrain":"blank"},
{"x":11,"y":2,"terrain":"forested_hills"},
{"x":11,"y":3,"terrain":"water"},
{"x":11,"y":4,"terrain":"light_forest"},
{"x":11,"y":5,"terrain":"light_jungle"},
{"x":11,"y":6,"terrain":"volcano_active"},
{"x":11,"y":7,"terrain":"mountains"},
{"x":11,"y":8,"terrain":"dense_jungle"},
{"x":11,"y":9,"terrain":"light_evergreen_forest"},
{"x":11,"y":10,"terrain":"mixed_forested_mountains"},
{"x":11,"y":11,"terrain":"desert_dunes"},
{"x":11,"y":12,"terrain":"sparse_forest"},
{"x":11,"y":13,"terrain":"light_mixed_forest"},
{"x":11,"y":14,"terrain":"desert_dunes"},
{"x":11,"y":15,"terrain":"desert_sandy"},
{"x":11,"y":16,"terrain":"water"},
{"x":11,"y":17,"terrain":"dense_forest"},
{"x":11,"y":18,"terrain":"desert_sandy"},
{"x":11,"y":19,"terrain":"volcano_dormant"},
{"x":11,"y":20,"terrain":"light_mixed_forest"},
{"x":11,"y":21,"terrain":"forested_hills"},
{"x":11,"y":22,"terrain":"water"},
{"x":11,"y":23,"terrain":"fen"},
{"x":11,"y":24,"terrain":"mountains"},
{"x":12,"y":0,"terrain":"desert_dunes"},
{"x":12,"y":1,"terrain":"forested_evergreen_mountain"},
{"x":12,"y":2,"terrain":"desert_dense_cactus_forest"},
{"x":12,"y":3,"terrain":"swamp"},
{"x":12,"y":4,"terrain":"badlands"},
{"x":12,"y":5,"terrain":"blank"},
{"x":12,"y":6,"terrain":"volcano_active"},
{"x":12,"y":7,"terrain":"mountain"},
{"x":12,"y":8,"terrain":"plains"},
{"x":12,"y":9,"terrain":"forested_mountains"},
{"x":12,"y":10,"terrain":"light_jungle"},
{"x":12,"y":11,"terrain":"forested_evergreen_hills"},
{"x":12,"y":12,"terrain":"plains"},
{"x":12,"y":13,"terrain":"jungle_mountains"},
{"x":12,"y":14,"terrain":"mountain"},
{"x":12,"y":15,"terrain":"jungle_mountains"},
{"x":12,"y":16,"terrain":"light_evergreen_forest"},
{"x":12,"y":17,"terrain":"light_mixed_forest"},
{"x":12,"y":18,"terrain":"mountains"},
{"x":12,"y":19,"terrain":"light_evergreen_forest"},
{"x":12,"y":20,"terrain":"forested_hills"},
{"x":12,"y":21,"terrain":"forested_mountain"},
{"x":12,"y":22,"terrain":"volcano_dormant"},
{"x":12,"y":23,"terrain":"sparse_evergreen_forest"},
{"x":12,"y":24,"terrain":"fen"},
{"x":13,"y":0,"terrain":"dense_forest"},
{"x":13,"y":1,"terrain":"desert_cactus_forest"},
{"x":13,"y":2,"terrain":"sparse_evergreen_forest"},
{"x":13,"y":3,"terrain":"forested_mountains"},
{"x":13,"y":4,"terrain":"light_forest"},
{"x":13,"y":5,"terrain":"swamp"},
{"x":13,"y":6,"terrain":"jungle_mountains"},
{"x":13,"y":7,"terrain":"light_mixed_forest"},
{"x":13,"y":8,"terrain":"mountains"},
{"x":13,"y":9,"terrain":"jungle_mountain"},
{"x":13,"y":10,"terrain":"mixed_forested_mountain"},
{"x":13,"y":11,"terrain":"blank"},
{"x":13,"y":12,"terrain":"jungle_hills"},
{"x":13,"y":13,"terrain":"dense_evergreen_forest"},
{"x":13,"y":14,"terrain":"desert_dense_cactus_forest"},
{"x":13,"y":15,"terrain":"forested_mountain"},
{"x":13,"y":16,"terrain":"dense_jungle"},
{"x":13,"y":17,"terrain":"mountain"},
{"x":13,"y":18,"terrain":"jungle_mountains"},
{"x":13,"y":19,"terrain":"dense_evergreen_forest"},
{"x":13,"y":20,"terrain":"dense_mixed_forest"},
{"x":13,"y":21,"terrain":"jungle_mountain"},
{"x":13,"y":22,"terrain":"sparse_forest"},
{"x":13,"y":23,"terrain":"hills"},
{"x":13,"y":24,"terrain":"forested_hills"},
{"x":14,"y":0,"terrain":"desert_dense_cactus_forest"},
{"x":14,"y":1,"terrain":"water"},
{"x":14,"y":2,"terrain":"desert_cactus_forest"},
{"x":14,"y":3,"terrain":"desert_dense_cactus_forest"},
{"x":14,"y":4,"terrain":"volcano_dormant"},
{"x":14,"y":5,"terrain":"light_evergreen_forest"},
{"x":14,"y":6,"terrain":"badlands"},
{"x":14,"y":7,"terrain":"light_forest"},
{"x":14,"y":8,"terrain":"dense_jungle"},
{"x":14,"y":9,"terrain":"swamp"},
{"x":14,"y":10,"terrain":"mixed_forested_hills"},
{"x":14,"y":11,"terrain":"foothills"},
{"x":14,"y":12,"terrain":"jungle_hills"},
{"x":14,"y":13,"terrain":"jungle_mountain"},
{"x":14,"y":14,"terrain":"badlands"},
{"x":14,"y":15,"terrain":"swamp"},
{"x":14,"y":16,"terrain":"volcano_active"},
{"x":14,"y":17,"terrain":"light_mixed_forest"},
{"x":14,"y":18,"terrain":"volcano_active"},
{"x":14,"y":19,"terrain":"forested_hills"},
{"x":14,"y":20,"terrain":"foothills"},
{"x":14,"y":21,"terrain":"mountains"},
{"x":14,"y":22,"terrain":"volcano_dormant"},
{"x":14,"y":23,"terrain":"mixed_forested_hills"},
{"x":14,"y":24,"terrain":"forested_hills"},
{"x":15,"y":0,"terrain":"hills"},
{"x":15,"y":1,"terrain":"mixed_forested_mountains"},
{"x":15,"y":2,"terrain":"forested_mountains"},
{"x":15,"y":3,"terrain":"fen"},
{"x":15,"y":4,"terrain":"forested_mountains"},
{"x":15,"y":5,"terrain":"forested_evergreen_mountain"},
{"x":15,"y":6,"terrain":"desert_dense_cactus_forest"},
{"x":15,"y":7,"terrain":"mixed_forested_mountain"},
{"x":15,"y":8,"terrain":"foothills"},
{"x":15,"y":9,"terrain":"mountain"},
{"x":15,"y":10,"terrain":"light_jungle"},
{"x":15,"y":11,"terrain":"mixed_forested_mountain"},
{"x":15,"y":12,"terrain":"forested_evergreen_hills"},
{"x":15,"y":13,"terrain":"badlands"},
{"x":15,"y":14,"terrain":"sparse_jungle"},
{"x":15,"y":15,"terrain":"dense_forest"},
{"x":15,"y":16,"terrain":"volcano_dormant"},
{"x":15,"y":17,"terrain":"hills"},
{"x":15,"y":18,"terrain":"forested_hills"},
{"x":15,"y":19,"terrain":"plains"},
{"x":15,"y":20,"terrain":"dense_forest"},
{"x":15,"y":21,"terrain":"desert_dense_cactus_forest"},
{"x":15,"y":22,"terrain":"badlands"},
{"x":15,"y":23,"terrain":"foothills"},
{"x":15,"y":24,"terrain":"jungle_mountain"},
{"x":16,"y":0,"terrain":"grassy_hills"},
{"x":16,"y":1,"terrain":"light_evergreen_forest"},
{"x":16,"y":2,"terrain":"forested_evergreen_mountain"},
{"x":16,"y":3,"terrain":"mixed_forested_mountains"},
{"x":16,"y":4,"terrain":"mixed_forested_mountain"},
{"x":16,"y":5,"terrain":"fen"},
{"x":16,"y":6,"terrain":"sparse_evergreen_forest"},
{"x":16,"y":7,"terrain":"plains"},
{"x":16,"y":8,"terrain":"forested_evergreen_hills"},
{"x":16,"y":9,"terrain":"sparse_jungle"},
{"x":16,"y":10,"terrain":"sparse_jungle"},
{"x":16,"y":11,"terrain":"dense_forest"},
{"x":16,"y":12,"terrain":"dense_mixed_forest"},
{"x":16,"y":13,"terrain":"blank"},
{"x":16,"y":14,"terrain":"forested_evergreen_hills"},
{"x":16,"y":15,"terrain":"sparse_evergreen_forest"},
{"x":16,"y":16,"terrain":"badlands"},
{"x":16,"y":17,"terrain":"desert_cactus_forest"},
{"x":16,"y":18,"terrain":"broken_lands"},
{"x":16,"y":19,"terrain":"mixed_forested_hills"},
{"x":16,"y":20,"terrain":"hills"},
{"x":16,"y":21,"terrain":"jungle_hills"},
{"x":16,"y":22,"terrain":"mountain"},
{"x":16,"y":23,"terrain":"plains"},
{"x":16,"y":24,"terrain":"forested_evergreen_mountain"},
{"x":17,"y":0,"terrain":"jungle_mountains"},
{"x":17,"y":1,"terrain":"volcano_dormant"},
{"x":17,"y":2,"terrain":"sparse_evergreen_forest"},
{"x":17,"y":3,"terrain":"light_jungle"},
{"x":17,"y":4,"terrain":"water"},
{"x":17,"y":5,"terrain":"water"},
{"x":17,"y":6,"terrain":"marsh"},
{"x":17,"y":7,"terrain":"plains"},
{"x":17,"y":8,"terrain":"plains"},
{"x":17,"y":9,"terrain":"hills"},
{"x":17,"y":10,"terrain":"dense_jungle"},
{"x":17,"y":11,"terrain":"desert_dense_cactus_forest"},
{"x":17,"y":12,"terrain":"desert_dunes"},
{"x":17,"y":13,"terrain":"forested_hills"},
{"x":17,"y":14,"terrain":"desert_cactus_forest"},
{"x":17,"y":15,"terrain":"hills"},
{"x":17,"y":16,"terrain":"grassy_hills"},
{"x":17,"y":17,"terrain":"marsh"},
{"x":17,"y":18,"terrain":"fen"},
{"x":17,"y":19,"terrain":"forested_mountain"},
{"x":17,"y":20,"terrain":"forested_mountains"},
{"x":17,"y":21,"terrain":"forested_hills"},
{"x":17,"y":22,"terrain":"sparse_evergreen_forest"},
{"x":17,"y":23,"terrain":"foothills"},
{"x":17,"y":24,"terrain":"foothills"},
{"x":18,"y":0,"terrain":"badlands"},
{"x":18,"y":1,"terrain":"mountains"},
{"x":18,"y":2,"terrain":"foothills"},
{"x":18,"y":3,"terrain":"light_evergreen_forest"},
{"x":18,"y":4,"terrain":"blank"},
{"x":18,"y":5,"terrain":"light_jungle"},
{"x":18,"y":6,"terrain":"light_mixed_forest"},
{"x":18,"y":7,"terrain":"sparse_jungle"},
{"x":18,"y":8,"terrain":"forested_mountains"},
{"x":18,"y":9,"terrain":"forested_mountain"},
{"x":18,"y":10,"terrain":"forested_evergreen_hills"},
{"x":18,"y":11,"terrain":"light_forest"},
{"x":18,"y":12,"terrain":"forested_hills"},
{"x":18,"y":13,"terrain":"mountain"},
{"x":18,"y":14,"terrain":"forested_mountain"},
{"x":18,"y":15,"terrain":"forested_evergreen_mountain"},
{"x":18,"y":16,"terrain":"volcano_dormant"},
{"x":18,"y":17,"terrain":"hills"},
{"x":18,"y":18,"terrain":"blank"},
{"x":18,"y":19,"terrain":"sparse_evergreen_forest"},
{"x":18,"y":20,"terrain":"mountain"},
{"x":18,"y":21,"terrain":"foothills"},
{"x":18,"y":22,"terrain":"light_jungle"},
{"x":18,"y":23,"terrain":"forested_mountain"},
{"x":18,"y":24,"terrain":"badlands"},
{"x":19,"y":0,"terrain":"sparse_forest"},
{"x":19,"y":1,"terrain":"fen"},
{"x":19,"y":2,"terrain":"jungle_mountain"},
{"x":19,"y":3,"terrain":"forested_evergreen_hills"},
{"x":19,"y":4,"terrain":"forested_evergreen_hills"},
{"x":19,"y":5,"terrain":"dense_forest"},
{"x":19,"y":6,"terrain":"desert_cactus_forest"},
{"x":19,"y":7,"terrain":"forested_evergreen_mountains"},
{"x":19,"y":8,"terrain":"blank"},
{"x":19,"y":9,"terrain":"desert_cactus_forest"},
{"x":19,"y":10,"terrain":"desert_sandy"},
{"x":19,"y":11,"terrain":"foothills"},
{"x":19,"y":12,"terrain":"mixed_forested_hills"},
{"x":19,"y":13,"terrain":"light_forest"},
{"x":19,"y":14,"terrain":"plains"},
{"x":19,"y":15,"terrain":"light_forest"},
{"x":19,"y":16,"terrain":"grassy_hills"},
{"x":19,"y":17,"terrain":"light_forest"},
{"x":19,"y":18,"terrain":"mixed_forested_hills"},
{"x":19,"y":19,"terrain":"volcano_dormant"},
{"x":19,"y":20,"terrain":"forested_mountain"},
{"x":19,"y":21,"terrain":"dense_evergreen_forest"},
{"x":19,"y":22,"terrain":"broken_lands"},
{"x":19,"y":23,"terrain":"dense_forest"},
{"x":19,"y":24,"terrain":"swamp"}]
}
var $currentHexGrid = $testGrid;

// $varaiables meant to be universal start with $ //
var $colorBackground = $('#showTerrainColors').is(':checked');
var $drawHexBorders = $('#showGridlines').is(':checked');
var $displayCoords = $('#showCoordinates').is(':checked');
var $displayImage = $('#showTerrainImages').is(':checked');
var $coordinatesFont="12px Courier";
var $borderColor="#000";

var $hexesAreBuilt=false
var $selectedHexes=[];

$('input').on('change', function(){
    $colorBackground = $('#showTerrainColors').is(':checked');
    $drawHexBorders = $('#showGridlines').is(':checked');
    $displayCoords = $('#showCoordinates').is(':checked');
    $displayImage = $('#showTerrainImages').is(':checked');
    drawHexGrid($currentHexGrid,20,20);
});

drawHexGrid($currentHexGrid,20,20);


/* ### FUNCTIONS TO DRAW HEX GRIDS AND THEIR COMPONENTS ### */
function drawHexGrid(gridArray, originX = 0, originY = 0) {
    let rows = gridArray.rows;
    let cols = gridArray.columns;

    let canvasOriginX = originX;
    let canvasOriginY = originY;

    let canvasWidth = (cols * ((HEX_WIDTH) * 3 / 4) + HEX_WIDTH/3) + originX;
    let canvasHeight = (rows * HEX_HEIGHT + HEX_HEIGHT/2 + 2) + originY;

    CANVAS_ELEM.attr('width', canvasWidth).attr('height', canvasHeight);

    let currentHexX, currentHexY;
    let currentCoords = [];

    let offsetColumn = false;

    for (let col = 0; col < cols; col++) {
        let tiles = gridArray.tiles.filter(o => o.x == col);
        for (let row = 0; row < rows; row++) {
            let tile = tiles.find(o => o.y == row);
            currentHexX = col * HEX_SIDE + originX;
            if (!offsetColumn) {
                currentHexY = row * HEX_HEIGHT + originY;
            } else {
                currentHexY = row * HEX_HEIGHT + originY + HEX_HEIGHT * 0.5;
            }
            // DEBUG ? console.log(tile) : null
            let currentHexTerrain = tile.terrain;
            var terrain = terrainTypes[currentHexTerrain];
            currentCoords = [col,row];
            buildHex(currentHexX, currentHexY, terrain, currentCoords);
        }
        offsetColumn = !offsetColumn;
    }
    allHexContainers = $('.hex');
    if(!$hexesAreBuilt) {
        allHexContainers.on('click',function (event) {
            hexClickEvent(event,this);
        });
        allHexContainers.attr('draggable','false');
    }
    $hexesAreBuilt=true;
//    hexClickEvent(event);
//    });
};

function buildHex(drawHexX, drawHexY, hexTerrain, currentCoords) {
    $colorBackground || $drawHexBorders ? drawHex(drawHexX, drawHexY, hexTerrain) : null;
    $displayCoords ? drawCoordinates(currentCoords,drawHexX,drawHexY) : null;
    if($hexesAreBuilt) {
        if($displayImage) {
           $(`#hex_${currentCoords[0]}_${currentCoords[1]}`)
               .attr('src',TERRAIN_DIR + hexTerrain.image + IMAGE_EXT);
        } else {
            $(`#hex_${currentCoords[0]}_${currentCoords[1]}`)
                .attr('src',TERRAIN_DIR + 'blank' + IMAGE_EXT);
        }
    } else {
        if($displayImage) {
            drawImage(currentCoords[0],currentCoords[1],
            hexTerrain.image,drawHexX,drawHexY)
        } else {
            drawImage(currentCoords[0],currentCoords[1],
            'blank',drawHexX,drawHexY)
        }
    }
    addOverlay(currentCoords[0],currentCoords[1],
        drawHexX,drawHexY)
    // drawImage(currentCoords[0],currentCoords[1],'blank',drawHexX,drawHexY);
    // This is an attempt to include tiles, but we have issues with image size that are a blocker to this.
};

function drawCoordinates(currentCoords,drawHexX,drawHexY) {
    CANVAS_CONTEXT.font = $coordinatesFont;
    CANVAS_CONTEXT.fillStyle = "#000";
    CANVAS_CONTEXT.fillText(currentCoords.join(','),
                           drawHexX + (HEX_WIDTH / 2) -
                           (HEX_WIDTH/4), drawHexY + (HEX_HEIGHT - 5));
}

function drawHex(drawHexX, drawHexY, hexTerrain) {
    // Set the stroke style for drawing the hexagon's outline.
    CANVAS_CONTEXT.strokeStyle = $borderColor;

    // Begin the path for drawing the hexagon.
    CANVAS_CONTEXT.beginPath();

    // Move to the first point of the hexagon.
    CANVAS_CONTEXT.moveTo(drawHexX + HEX_WIDTH - HEX_SIDE, drawHexY);

    // Draw lines to form the hexagon.
    CANVAS_CONTEXT.lineTo(drawHexX + HEX_SIDE, drawHexY);
    CANVAS_CONTEXT.lineTo(drawHexX + HEX_WIDTH, drawHexY + (HEX_HEIGHT / 2));
    CANVAS_CONTEXT.lineTo(drawHexX + HEX_SIDE, drawHexY + HEX_HEIGHT);
    CANVAS_CONTEXT.lineTo(drawHexX + HEX_WIDTH - HEX_SIDE, drawHexY + HEX_HEIGHT);
    CANVAS_CONTEXT.lineTo(drawHexX, drawHexY + (HEX_HEIGHT / 2));

    // Fill the hexagon with the specified color, if provided.
    if ($colorBackground) {
        CANVAS_CONTEXT.fillStyle = hexTerrain.color;
        CANVAS_CONTEXT.fill();
    }

    // Close the path and stroke the hexagon's outline.
    if ($drawHexBorders) {
        CANVAS_CONTEXT.closePath();
        CANVAS_CONTEXT.stroke();
    }
}

function drawImage(x,y,image,xOff,yOff){
    let src = TERRAIN_DIR + image + IMAGE_EXT
    let id = "hex_" + x + '_' + y;
    GRID_ELEM.append(`<img src="${src}" id="${id}" class='_${x + '_' + y} hex' />
`);
    $(`#${id}`)
        .css('left',xOff)
        .css('top',yOff);
    $(`#${id}`)
        .css('width',HEX_WIDTH)
        .css('height',HEX_HEIGHT);
};

function addOverlay (x,y,xOff,yOff){
    let id = 'sel_' + x + '_' + y;
    let image = './assets/Blank2.png';
    let selectionHex = `<img id='${id}' class='_${x + '_' + y} overlay' style='left:${xOff};top:${yOff};height:${HEX_HEIGHT};width:${HEX_WIDTH};z-index=7;' src="${image}" />`; 
    GRID_ELEM.append(selectionHex);
    $(`#${id}`)
        .css('left',xOff)
        .css('top',yOff);
    $(`#${id}`)
        .css('width',HEX_WIDTH)
        .css('height',HEX_HEIGHT);
};

/* ### Click handlers ### */
function hexClickEvent(event,hex) {
    // $selectAction should be 'select', 'toggle' or 'unselect'
    let coordinates = hex.id.split("_").slice(1,3);
    let direction = hexOffset(event);
    let oddOrEven = hex.id.split("_")[1]%2 == 0 ? "even" : "odd"
    let actualClick =addHexes(DIRECTIONAL_NEIGHBORS[oddOrEven][direction],coordinates)
    if(!hexIsInBounds(actualClick)) {
        return null;
    }
    clickAndNeighbors = getHexNeighbors(actualClick);
    switch($('.selectionActionSelect').attr('mapAction')) {
        case "toggle":
            let hexString = actualClick.join('_');
            let currentState = ($selectedHexes.includes(hexString));
            // DEBUG ? console.log(currentState) : null
            for(target of clickAndNeighbors) {
                currentState ? unSelectHex(target.join('_')) : selectHex(target.join('_')); 
            }
            break;
        case "select":
            for(t of clickAndNeighbors) {
                selectHex(t.join('_'));
            }
            break;
        case "unselect":
            for(t of clickAndNeighbors) {
                unSelectHex(t.join('_'));
            }
            break;
    }
}

var $selectNeighbors = $('.selectionShapeSelect').attr('neighbors');
$('img[neighbors]').on('click', function() {
    $selectNeighbors = $(this).attr('neighbors');
    $('.imageButton').removeClass('selectionShapeSelect');
    $(this).addClass('selectionShapeSelect');
    // DEBUG ? console.log($selectNeighbors) : null
});

var $selectAction = $('.selectionActionSelect').attr('mapAction');
$('img[mapAction]').add('img + i').on('click', function(){
     let selection = $(this).prop('tagName') == 'I' ? $(this).prev()
        : $(this);
    $selectAction = $(this).attr('mapAction');
    $('img[mapAction]').removeClass('selectionActionSelect');
    $(selection).addClass('selectionActionSelect');
    // DEBUG ? console.log($selectAction) : null
});

function hexOffset(event) {
    var posx = event.offsetX;
    var posy = event.offsetY;
    // --- Apply offset for the map div
    /*    var map = document.getElementById('hexmap');
        posx = posx - map.offsetLeft;
        posy = posy - map.offsetTop;
    */
    let x,y,z;
    x = (posx - (HEX_WIDTH / 2)) / (HEX_WIDTH * 0.75);
    y = (posy - (HEX_HEIGHT / 2)) / HEX_HEIGHT;
    z = -0.5 * x - y;
    y = -0.5 * x + y;
    
    ix = Math.floor(x + 0.5);
    iy = Math.floor(y + 0.5);
    iz = Math.floor(z + 0.5);
    s = ix + iy + iz;
    if (s) {
        abs_dx = Math.abs(ix - x);
        abs_dy = Math.abs(iy - y);
        abs_dz = Math.abs(iz - z);
        if (abs_dx >= abs_dy && abs_dx >= abs_dz) {
            ix -= s;
        } else if (abs_dy >= abs_dx && abs_dy >= abs_dz) {
            iy -= s;
        } else {
            iz -= s;
        }
    }
    // ----------------------------------------------------------------------
    // --- map_x and map_y are the map coordinates of the click
    // ----------------------------------------------------------------------
    map_x = ix;
    map_y = (iy - iz + (1 - ix % 2)) / 2 - 0.5;
    if(map_x == 1 && map_y == -1) { return "NE"}
    if(map_x == 1 && map_y == 0) {return "SE"}
    if(map_x == -1 && map_y == 0) {return "NW"}
    if(map_x == -1 && map_y == 1) {return "SW"}
    return "CENTER";
}

function getHexNeighbors(centralHex) {
    var neighbors = [];
    let goodneighbors = centralHex[0] % 2 === 0 ? EVEN_NEIGHBORS : ODD_NEIGHBORS;  
    for (i of goodneighbors[$selectNeighbors]) {
            thisNeighbor = addHexes(i, centralHex);
            hexIsInBounds(thisNeighbor) ? 
                neighbors.push(addHexes(i, centralHex))
            : null;
    }
    return neighbors;
}

/* Utility Functions */
function hexEquality(hex1,hex2) {
    hex1 = hex1.join('_');
    hex2 = hex2.join('_');
    check = hex1==hex2;
    return check;
}

function hexIsInBounds(theAccusedHex) {
    x = theAccusedHex[0];
    y = theAccusedHex[1];
    if(x >= $testGrid.columns ||
    x < 0 ||
    y >= $testGrid.rows ||
    y < 0) {
        return false
    } else {
        return true
    }
}

function addHexes (hex1,hex2) {
    let sumHex = (
        [
            (Number(hex1[0])+
             Number(hex2[0]))
            ,(Number(hex1[1])+
              Number(hex2[1]))
        ]);
    return sumHex;
}

function selectHex (selectedHex) {
    !typeof(selectedHex,'string') ? selectedHex = selectedHex.join('_') : null
    // DEBUG ? console.log($selectedHexes.includes(selectedHex)) : null
    if($selectedHexes.includes(selectedHex)) {
        return null;
    }
    $(`#sel_${selectedHex}`).addClass('selection');
    $selectedHexes.push(selectedHex);
}

$('#btnSelectNone').on('click',function(){
    unSelectAll();
});

function unSelectAll() {
    // Currently, the implementation is 100% reliant on unSelectHex
    // It pulls a shallow copy of the $selectedHexes array and works through them
    for(hex of $selectedHexes.slice()) {
        unSelectHex(hex);
    }
}

function unSelectHex (selectedHex) {
    !typeof(selectedHex,'string') ? selectedHex = selectedHex.join('_') : null
    if(!$selectedHexes.includes(selectedHex)) {
        return null
    }
    //$selectedHexes.delete(selectedHex)
    hexIndex = $selectedHexes.indexOf(selectedHex);
    // DEBUG ? console.log(hexIndex) : null
    $selectedHexes.splice(hexIndex,1);
    $('#sel_' + selectedHex).removeClass('selection');
}

});