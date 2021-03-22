const uniqid = require("uniqid");
const fs = require("fs");

const SOUBOR_S_DATY = "park.json";

let seznamVozidel = new Array();
if (fs.existsSync(SOUBOR_S_DATY)) {
  seznamVozidel = JSON.parse(fs.readFileSync(SOUBOR_S_DATY));
}

function seznam(pozadavek, odpoved) {
  odpoved.writeHead(200, {"Content-type": "application/json"});
  odpoved.end(JSON.stringify(seznamVozidel));
}

function pridani(pozadavek, odpoved) {
  let data = "";
  pozadavek.on('data', function (kusDat) {
    console.log(kusDat);
    data += kusDat;
  })
  pozadavek.on('end', function () {
    let parametry = JSON.parse(data);
    console.log(parametry);
    let obj = {};
    obj.id = uniqid();
    obj.rz_spz = parametry.rz_spz;
    obj.znacka = parametry.znacka;
    obj.model = parametry.model;
    obj.palivo = parametry.palivo;
    obj.v_mista = parametry.v_mista;
    seznamVozidel.push(obj);
    fs.writeFileSync(SOUBOR_S_DATY, JSON.stringify(seznamVozidel, null, 4));

    odpoved.writeHead(200, {"Content-type": "application/json",
            "Access-Control-Allow-Origin": "*"});
    odpoved.end(JSON.stringify({status:"OK"}));
  })
}

function detail(pozadavek, odpoved) {
  let data = "";
  pozadavek.on('data', function (kusDat) {
    console.log(kusDat);
    data += kusDat;
  })
  pozadavek.on('end', function () {
    let parametry = JSON.parse(data);
    console.log(parametry);
    let polozka = {status:"Chyba",chyba:"Nenalezeno"};
    for (let i = 0; i < seznamVozidel.length; i++) {
      if (seznamVozidel[i].id == parametry.id) {
        polozka = seznamVozidel[i];
        break;
      }
    }

    odpoved.writeHead(200, {"Content-type": "application/json",
            "Access-Control-Allow-Origin": "*"});
    odpoved.end(JSON.stringify(polozka));
  })
}

function aktualizace(pozadavek, odpoved) {
  let data = "";
  pozadavek.on('data', function (kusDat) {
    console.log(kusDat);
    data += kusDat;
  })
  pozadavek.on('end', function () {
    let parametry = JSON.parse(data);
    console.log(parametry);
    for (let i = 0; i < seznamVozidel.length; i++) {
      if (seznamVozidel[i].id == parametry.id) {
        seznamVozidel[i].rz_spz = parametry.rz_spz;
        seznamVozidel[i].znacka = parametry.znacka;
        seznamVozidel[i].model = parametry.model;
        seznamVozidel[i].palivo = parametry.palivo;
        seznamVozidel[i].v_mista = parametry.v_mista;
        seznamVozidel[i].upraveno = true;
        fs.writeFileSync(SOUBOR_S_DATY, JSON.stringify(seznamVozidel, null, 4));
        break;
      }
    }

    odpoved.writeHead(200, {"Content-type": "application/json",
            "Access-Control-Allow-Origin": "*"});
    odpoved.end(JSON.stringify({status:"OK"}));
  })
}

function odstraneni(pozadavek, odpoved) {
  let data = "";
  pozadavek.on('data', function (kusDat) {
    console.log(kusDat);
    data += kusDat;
  })
  pozadavek.on('end', function () {
    let parametry = JSON.parse(data);
    console.log(parametry);
    for (let i = 0; i < seznamVozidel.length; i++) {
      if (seznamVozidel[i].id == parametry.id) {
        seznamVozidel.splice(i, 1);
        fs.writeFileSync(SOUBOR_S_DATY, JSON.stringify(seznamVozidel, null, 4));
        break;
      }
    }

    odpoved.writeHead(200, {"Content-type": "application/json",
            "Access-Control-Allow-Origin": "*"});
    odpoved.end(JSON.stringify({status:"OK"}));
  })
}

exports.zpracovaniPark = function(pozadavek, odpoved) {
  if (pozadavek.url.startsWith("/park/seznam")) {
    seznam(pozadavek, odpoved);
  } else if (pozadavek.url.startsWith("/park/pridani")) {
    pridani(pozadavek, odpoved);
  } else if (pozadavek.url.startsWith("/park/detail")) {
    detail(pozadavek, odpoved);
  } else if (pozadavek.url.startsWith("/park/aktualizace")) {
    aktualizace(pozadavek, odpoved);
  } else if (pozadavek.url.startsWith("/park/odstraneni")) {
    odstraneni(pozadavek, odpoved);
  } else {
    odpoved.writeHead(404);
    odpoved.end();
  }

}