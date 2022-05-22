const fs = require('fs')
const { DxfParser, toGeojson } = require('dxf2json')

const fileName = '2a';

new DxfParser().init(`./assets/${fileName}.dxf`)
  .then(result => {
    fs.writeFile(__dirname + `/results/${fileName}.json`, JSON.stringify(result), err => {
      if (err) {
        console.error(err)
        return
      }
    })
    console.log(result);
    return result
  })

// const content = fs.readFileSync('./assets/r18.dxf', 'utf-8')
// new DxfParser().parseContent(content)
//   .then(result => {
//     console.log(result);
//     return toGeojson(result)
//   })