const fs = require('fs')
const { DxfParser, toGeojson } = require('dxf2json')

// json
// const fileName = '2a';

// new DxfParser().init(`./assets/${fileName}.dxf`)
//   .then(result => {
//     fs.writeFile(__dirname + `/results/${fileName}.json`, JSON.stringify(result), err => {
//       if (err) {
//         console.error(err)
//         return
//       }
//     })
//     console.log(result);
//     return result
//   })

// length
const jsonFile = JSON.parse(fs.readFileSync('./results/2.json', 'utf-8'));

const entities = jsonFile.ENTITIES;

let totalCut = 0;
let totalBend = 0;

entities.forEach(v => {
  const operation = v.lineType.toLowerCase() == 'continuous' ? 'cut' : 'bend';
  if (v.type == 'ARC') {
    let theta = v.endAngle - v.startAngle;

    if (theta < 0) {
      theta = 360 + theta;
    }

    const arcLength = 2 * Math.PI * v.radius * (theta / 360);
    console.log(`Arc: ${arcLength} (${operation})`);

    if (operation == 'cut') {
      totalCut += arcLength;
    } else if (operation == 'bend') {
      totalBend += arcLength;
    }
  } else if (v.type == 'LINE') {
    const p1 = v.vertices[0];
    const p2 = v.vertices[1];
    const distance = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));

    console.log(`Line: ${distance} (${operation})`);
    if (operation == 'cut') {
      totalCut += distance;
    } else if (operation == 'bend') {
      totalBend += distance;
    }
  } else if (v.type == 'CIRCLE') {
    const circum = 2 * Math.PI * v.radius;

    console.log(`Circle: ${circum} (${operation})`);

    if (operation == 'cut') {
      totalCut += circum;
    } else if (operation == 'bend') {
      totalBend += circum;
    }
  } else {
    console.log(`=========Unhandled type: ${v.type} (${operation})=========`)
  }
});

console.log(`Total cut: ${totalCut}`);
console.log(`Total bend: ${totalBend}`);