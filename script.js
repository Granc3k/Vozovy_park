const URL_CRUD = window.location.href + "park/";

async function nactiSeznamZadatelu() {
  let url = URL_CRUD + "seznam";
  let response = await fetch(url);
  let data = await response.json();
  let s = "";
  for (let item of data) {
    s += `<tr><td>${item.spz}</td> <td>${item.znacka}</td> <td>${item.model}</td> <td>${item.palivo}</td> <td>${item.mista}</td> <td><button value="Upravit" onclick="upravZadatele('${item.id}')"><span class="		glyphicon glyphicon-edit
    "></span><button value="Odstranit" onclick="odstranZadatele('${item.id}')"><span class="	glyphicon glyphicon-remove-circle"></span></button></td></tr>`; 
      }
      document.getElementById("tbody_seznam_zadatelu").innerHTML = s;

}  

let idEditace;

async function ulozZadatele() {
  let spz = document.getElementById("spz").value;
  let znacka = document.getElementById("znacka").value;
  let model = document.getElementById("model").value;
  let palivo = document.getElementById("palivo").value;
  let mista = document.getElementById("mista").value;
  
  let url = URL_CRUD + "pridani";
  let body = {};
  body = {};
  body.spz = spz;
  body.znacka = znacka;
  body.model = model;
  body.palivo = palivo;
  body.mista = mista;
  body.fotka = fotkaUrl;
  if (idEditace) { //=false pro undefined, =true pro jakoukoliv nastavenou hodnotu
    url = URL_CRUD + "aktualizace";
    body.id = idEditace;
  }
  let response = await fetch(url, {method: "POST", body: JSON.stringify(body)});
  let data = await response.json();
  console.log(data);
  ukazOblast("div_seznam");
  nactiSeznamZadatelu();
}

function pridejZadatele() {
  ukazOblast("div_editace");
  idEditace = undefined;
  document.getElementById("spz").value = "";
  document.getElementById("znacka").value = "";
  document.getElementById("model").value = "";
  document.getElementById("palivo").value = "";
  document.getElementById("mista").value = "";
  document.getElementById("fotka").src = "avatarr.png";

  ukazOblast("div_editace");
}

async function upravZadatele(id) {
  ukazOblast("div_editace")
  idEditace = id;
  let url = URL_CRUD + "detail";
  let body = {};
  body.id = id;
  let response = await fetch(url, {method: "POST", body: JSON.stringify(body)});
  let data = await response.json();
  let item = data.items[0];
  document.getElementById("spz").value = item.spz;
  document.getElementById("znacka").value = item.znacka;
  document.getElementById("model").value = item.model;
  document.getElementById("palivo").value = item.palivo;
  document.getElementById("mista").value = item.mista;
  document.getElementById("fotka").src = item.fotka;

  ukazOblast("div_editace");
}

async function odstranZadatele(id) {
  if (!confirm("Opravdu odstranit?")) return;
  
  idEditace = id;
  let url = URL_CRUD + "odstraneni";
  let body = {};
  body.id = id;
  let response = await fetch(url, {method: "POST", body: JSON.stringify(body)});
  let data = await response.json();
  nactiSeznamZadatelu();
}

let fotkaUrl;
function getBase64Image(img, resize = false) {
    let cnv = document.createElement("canvas");
    if (resize) {
        cnv.width = img.width;
        cnv.height = img.height;
    } else {
        cnv.width = img.naturalWidth;
        cnv.height = img.naturalHeight;
    }

    let ctx = cnv.getContext("2d");
    ctx.drawImage(img, 0, 0, cnv.width, cnv.height);

    return cnv.toDataURL();
}

async function ulozFotku() {
  const file = document.getElementById('file_fotka').files[0];
  if (!file) return; //stisknuto Storno
  let tmppath = URL.createObjectURL(file); //vytvoření dočasného souboru
  console.log(tmppath);
  let img = document.getElementById("fotka");
  img.src = tmppath;
  img.onload = async function(){
    let body = {};
    body.fileName = file.name;
    body.contentType = file.type;
    body.data = getBase64Image(img, true); //převod obrázku na Base64
    let opt = {};
    opt.method = "POST";
    opt.body = JSON.stringify(body);
    let response = await fetch('https://nodejs-3260.rostiapp.cz/crud/upload', opt);
    let data = await response.json();
    console.log(data);
    fotkaUrl = 'https://nodejs-3260.rostiapp.cz/' + data.savedToFile;
    console.log(fotkaUrl);
    img.onload = null;
  };
}

const oblasti = ["div_editace","div_seznam"];

function ukazOblast(oblast) {
  for (let o of oblasti) {
    let disp = "none";
    if (o == oblast) {
      disp = "block";
    }
    document.getElementById(o).style.display = disp;
  }
}
function poNacteni() {
  ukazOblast("div_seznam");
  nactiSeznamZadatelu();
}