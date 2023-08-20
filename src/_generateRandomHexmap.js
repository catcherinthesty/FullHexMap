var $rows = 25;
var $columns = 20;
terrainTypes = require('./terrain.js');
terrainList = Object.keys(terrainTypes)
terrainList.splice(terrainList.indexOf('blank'),1)
gridOut = { rows: $rows, columns: $columns, tiles: [],}
for(let col=0; col<gridOut.columns; col++) {
    for(let row=0; row<gridOut.rows; row++) {
        gridOut.tiles.push({
            x: col,
            y: row,
            terrain: terrainList[Math.floor(Math.random() * terrainList.length)]
        });
    }
}
var whereArethey = []
specialTerrainList = require('./!specialTerrain');
for(item of Object.keys(specialTerrainList)) {
    let x = Math.floor(Math.random()*$columns);
    let y = Math.floor(Math.random()*$rows)
    changeTile(x,y,item);
}
function changeTile(col,row,newTerrain) {
    gridOut.tiles.find( (entry) => {
	    if(entry.x == col && entry.y == row) {
			delete entry.terrain;
			delete entry.specialTerrain;
            whereArethey.push(col+','+row);
		    typeof(newTerrain,'Object') ?
			    entry.specialTerrain = specialTerrainList[newTerrain] :
				entry.terrain = newTerrain
		}
	});
}
console.log(JSON.stringify(gridOut));
console.log('\r\r ' +JSON.stringify(whereArethey));