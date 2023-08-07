const path = require('path');
const fs = require('fs');
fs.readdir("C:\\web\\FullHexMapApp\\terrain", function(err, files) {
    if(err){
        return console.error(err);
    }
    for(file of files) {
        name = file.split('.')[0];
        console.log(name + ':  {' + `
    image: ${name};
    color: '#000000';
    types: '';
` + '}');
    };
});