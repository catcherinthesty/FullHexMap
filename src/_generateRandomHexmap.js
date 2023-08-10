terrainTypes = require('./terrain.js');
terrainList = Object.keys(terrainTypes)
terrainList.splice(terrainList.indexOf('blank'),1)
gridOut = { rows: 25, columns: 20, tiles: [],}
for(let col=0; col<gridOut.columns; col++) {
    for(let row=0; row<gridOut.rows; row++) {
        gridOut.tiles.push({
            x: col,
            y: row,
            terrain: terrainList[Math.floor(Math.random() * terrainList.length)]
        });
    }
}
console.log(JSON.stringify(gridOut));