//https://api.nasa.gov/planetary/apod?api_key=lZwg9tTZMqD86tp9mvKrQIFAjbrC4kpgVtKnCKp5
//lZwg9tTZMqD86tp9mvKrQIFAjbrC4kpgVtKnCKp5

let url = "https://api.nasa.gov/planetary/apod?api_key=";
let aposSelectionURL = "https://api.nasa.gov/planetary/apod?";
let neoStartDate = "";
let neoEndDate = "";
todaysDate(); // definerar dagens datum i datumväljaren.
neoWs = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${neoStartDate}&end_date=${neoEndDate}&api_key=`;

let api_key = "lZwg9tTZMqD86tp9mvKrQIFAjbrC4kpgVtKnCKp5";
let publicTemp;
let arrNamn = [];
let doomsdayAstro = [];

sendAPIreq(url + api_key,1); // kör APOS API

function handler(e){
	// när datumet väljs i datumväljaren skickas läggs det till i filtreringen vid api call

  let datum = e.target.value;
	sendAPIreq(aposSelectionURL + "start_date=" + datum + "&end_date=" + datum + "&api_key=" + api_key, 1);
}

async function sendAPIreq(fetchUrl, apiMetod) {
	// funktionen tar emot data från api länk + api key och sedan skckar den ner datan som en JSON till apiDataUse
	// apimetod: 1 = APOS, 0 = NeoWs
	let req = await fetch(fetchUrl);
	req.json().then(data => {
  console.log(data, "APImetod: " + apiMetod);
	apiDataUse(data, apiMetod);
	});

}
function apiDataUse(data, apiMetod){
  doomsdayAstro = [];
	let danger = 0;
	if (apiMetod){
		//APOS Metod
	if (data.date == undefined) {data = data[0]}
	document.getElementById("title").textContent = data.title;
	document.getElementById("date").textContent = data.date;
  // Finns tydligen med youtube videor i APIn. togglar av och på en iframe berorende på media_type
  if (data.media_type == "image") {
    document.getElementById("pic").src = data.hdurl;
    document.getElementById("pic").style.display = "block";
    document.getElementById("vid").style.display = "none";}
  else if (data.media_type == "video") {
    document.getElementById("vid").src = data.url;
    document.getElementById("pic").style.display = "none";
    document.getElementById("vid").style.display = "block" }

	document.getElementById("explanation").textContent = data.explanation;
	}
	else{
		// NeoWs Metod
    document.getElementById("astroider").innerHTML = "";
    arrNamn=[];
    let classDanger= "";
    let link = "";
		// astroMin + astroMax består av två olika arrayer. en array för startdatumet (neoStartDate) och en för slutdatum (neoEndDate)
		let astroMin = data.near_earth_objects[neoStartDate];
		// skriver ut alla namn i arrayen med startdatumet och kollor ifall det fanns någon astroid med potenciell fara.
    for (let i = 0; i < astroMin.length; i++){
			 console.log(astroMin[i].name);
			 arrNamn.push(astroMin[i].name);
		 if (astroMin[i].is_potentially_hazardous_asteroid){ danger++;doomsdayAstro.push(astroMin[i]);} }


		let astroMax = data.near_earth_objects[neoEndDate];
		// skriver ut alla namn i arrayen med slutdatumet och kollor ifall det fanns någon astroid med potenciell fara.
		for (let i = 0; i < astroMax.length; i++){
			 console.log(astroMax[i].name);
			 arrNamn.push(astroMax[i].name);
		 if (astroMax[i].is_potentially_hazardous_asteroid){ danger++;doomsdayAstro.push(astroMax[i]);}
   }
    // filtrera ut resultaten och flaggar potenciella faror
    for (let i = 0; i < arrNamn.length; i++) {
      link = `https://www.google.com/search?q=${arrNamn[i]}`;
      for (let y = 0; y < doomsdayAstro.length; y++) {
        if (arrNamn[i] == doomsdayAstro[y].name) { classDanger= `class='danger'`; console.log("danger");
        link = `https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley`;}
      }
      // print to html
      document.getElementById("astroider").innerHTML += `<li ${classDanger}><a href='${link}'> ${arrNamn[i]}  <a/></li>`;
      classDanger= "";
      link = "";
    }
    document.getElementById("dangerText").innerHTML = (`Mellan ${neoStartDate} och ${neoEndDate} förväntas ${data.element_count}st astroider passera. <br> ${danger} av listade astroider är potenciellt farliga`);

  }
	}

function todaysDate(){
  // definerar de närmsta två dagarna och lägger in en gräns för datumväljaren så att inte framtida APOS calls görs och ger error
  let today = new Date();
    neoStartDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()+2).toISOString().split('T')[0];
    neoEndDate = new Date(today.getFullYear(), today.getMonth(), (today.getDate()+3)).toISOString().split('T')[0];
    document.getElementById("dt").max = new Date(today.getFullYear(), today.getMonth(), today.getDate()+1).toISOString().split('T')[0];
    document.getElementById("dt").value = document.getElementById("dt").max;
	console.log(neoStartDate, neoEndDate);

}
