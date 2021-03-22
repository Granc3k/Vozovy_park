function poNacteni() {
  //alert("Kuk!");
}

async function vypocet() {
  let c1 = document.getElementById("cislo1").valueAsNumber;
  let c2 = document.getElementById("cislo2").valueAsNumber;

  let odpoved = await fetch(window.location.href + "soucet?c1="+c1+"&c2="+c2);
  let data = await odpoved.json();  
  document.getElementById("vysledek").innerHTML = data.soucet;
}

async function zkontrolujRC() {
  let body = {};
  body.rodnecislo = document.getElementById("rodnecislo").value;
  let odpoved = await fetch(window.location.href + "rodnecislo",
    {method: "POST", body: JSON.stringify(body)});
  let data = await odpoved.json();  
  document.getElementById("vysledekRC").innerHTML = data.status;
}