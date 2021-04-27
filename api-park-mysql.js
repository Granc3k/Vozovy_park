const mysql = require("mysql");
const host = process.env['host']
const port = process.env['port']
const user = process.env['user']
const password = process.env['password']
const database = process.env['database']

let con = mysql.createConnection({
  host: host,
  port: port,
  user: user,
  password: password,
  database: database,

});

con.connect(function(err) {
  if (err) throw err;
});

function seznam(pozadavek, odpoved) {console.log("### seznam");
  con.query("SELECT * FROM parkoviste ORDER BY id", function (err, result) {
    if (err) throw err;
    console.log("### result");
    console.log(result);
    odpoved.writeHead(200, {"Content-type": "application/json"});
    odpoved.end(JSON.stringify(result));
  });
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

    con.query("INSERT INTO parkoviste (spz, znacka, model, palivo, mista) VALUES ('"+parametry.spz+"','"+parametry.znacka+"','"+parametry.model+"','"+parametry.palivo+"','"+parametry.mista+"')", function (err, result) {
      if (err) throw err;
      console.log("### INSERT INTO");
      console.log(result);
      odpoved.writeHead(200, {"Content-type": "application/json",
              "Access-Control-Allow-Origin": "*"});
      odpoved.end(JSON.stringify({status:"OK"}));
    });

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
    con.query("SELECT * FROM parkoviste WHERE id =" + parametry.id, function (err, result) {
      if (err) throw err;
      console.log("### result");
      console.log(result);
      odpoved.writeHead(200, {"Content-type": "application/json"});
      odpoved.end(JSON.stringify(result[0]));
      return;
    });
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
    con.query("UPDATE parkoviste SET spz = '"+parametry.spz+"', znacka = '"+parametry.znacka+"', model = '"+parametry.model+"', palivo = '"+parametry.palivo+"', mista = '"+parametry.mista+"' WHERE id = "+parametry.id, function (err, result) {
      if (err) throw err;
      console.log("### UPDATE");
      console.log(result);
      odpoved.writeHead(200, {"Content-type": "application/json",
              "Access-Control-Allow-Origin": "*"});
      odpoved.end(JSON.stringify({status:"OK"}));
    });
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
    con.query("DELETE FROM parkoviste WHERE id = "+parametry.id, function (err, result) {
      if (err) throw err;
      console.log("### DELETE");
      console.log(result);
      odpoved.writeHead(200, {"Content-type": "application/json",
              "Access-Control-Allow-Origin": "*"});
      odpoved.end(JSON.stringify({status:"OK"}));
    });
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