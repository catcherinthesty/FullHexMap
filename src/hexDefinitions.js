// CONSTANTS are expressed in a all uppercase //

// Defining hex geometry
const HEX_RADIUS = 36; // changing this should adjust the size seamlessly
//const HEX_RADIUS = 72; // changing this should adjust the size seamlessly
const HEX_HEIGHT = Math.sqrt(3) * HEX_RADIUS;
const HEX_WIDTH = 2 * HEX_RADIUS;
const HEX_SIDE = (3/2) * HEX_RADIUS;
const HEX_CENTER_X = HEX_WIDTH/2
const HEX_CENTER_Y = HEX_HEIGHT/2

// List of all neighbors out to 3 degrees for use with the hexAdd() function
// Even and odd X have different neighbors. No need to overthink this.
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
const ODD_STACKS = [
    [ +0, -3 ],
    [ +3, -1 ],
    [ +3, +2 ],
    [ +0, +0 ],
    [ +0, +3 ],
    [ -3, +2 ],
    [ -3, -1 ],
];
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
const EVEN_STACKS = [
    [ +0, -3 ],
    [ +3, -2 ],
    [ +3, +1 ],
    [ +0, +0 ],
    [ +0, +3 ],
    [ -3, +1 ],
    [ -3, -2 ],
];
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