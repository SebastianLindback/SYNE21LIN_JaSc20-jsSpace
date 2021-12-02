//https://api.nasa.gov/planetary/apod?api_key=lZwg9tTZMqD86tp9mvKrQIFAjbrC4kpgVtKnCKp5
//lZwg9tTZMqD86tp9mvKrQIFAjbrC4kpgVtKnCKp5
//https://wilsjame.github.io/how-to-nasa/

var req = new XMLHttpRequest();
var url = "https://api.nasa.gov/planetary/apod?api_key=";
let neoStartDate = "2019-10-11";
let neoEndDate = "2019-10-12";
let neoWs = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${neoStartDate}&end_date=${neoEndDate}&api_key=`;
var api_key = "lZwg9tTZMqD86tp9mvKrQIFAjbrC4kpgVtKnCKp5";
let publicTemp;

todaysDate();
sendAPIreq(url + api_key,1);

function handler(e){
  var hUrl = "https://api.nasa.gov/planetary/apod?";
  var datum = e.target.value;
	sendAPIreq(hUrl + "start_date=" + datum + "&end_date=" + datum + "&api_key=" + api_key, 1);
}

async function sendAPIreq(fetchUrl, apiMetod) {
	// apimetod: 1 = APOS, 0 = NeoWs
	let req = await fetch(fetchUrl);
	req.json().then(data => {
  console.log(data, "oki" + apiMetod);
	apiDataUse(data, apiMetod);
	});
	console.log(req);

}
function apiDataUse(data, apiMetod){
	let danger = 0;
	if (apiMetod){
		//APOS Metod
	if (data.date == undefined) {data = data[0]}
	document.getElementById("title").textContent = data.title;
	document.getElementById("date").textContent = data.date;
	document.getElementById("pic").src = data.hdurl;
	document.getElementById("explanation").textContent = data.explanation;
	}
	else{
		// NeoWs Metod
		console.log(`Mellan ${neoStartDate} och ${neoEndDate} passerade ${data.element_count}st astroider.`);
		// astroMin + astroMax består av två olika arrayer. en array för startdatumet (neoStartDate) och en för slutdatum (neoEndDate)
		let astroMin = data.near_earth_objects[neoStartDate];
		// skriver ut alla namn i arrayen med startdatumet och kollor ifall det fanns någon astroid med potenciell fara.
		for (let i = 0; i < astroMin.length; i++){
			 console.log(astroMin[i].name);
		  	if (astroMin.is_potentially_hazardous_asteroid){ danger++;}
			}

		let astroMax = data.near_earth_objects[neoEndDate];
		// skriver ut alla namn i arrayen med slutdatumet och kollor ifall det fanns någon astroid med potenciell fara.
		for (let i = 0; i < astroMax.length; i++){
			 console.log(astroMax[i].name);
		 if (astroMax.is_potentially_hazardous_asteroid){ danger++;} }
		}
		// skriver ut resultatet av hur många som var farliga.
		console.log(`${danger} av nämnda astroider var potenciellt farliga`);
	}

function todaysDate(){
	// funktionen definerar dagens datum som ett max värde för datumväljaren med id=dt. så att programmet inte error uppstår av att framtida datum väljs.
	var today = new Date();
	let todayDate = today.getDate();

	// datumet kommer i fel format 
	if (String(todayDate).length == 1) {todayDate = `0${todayDate}`;}
	console.log(todayDate.length, todayDate);
	var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+todayDate;
	document.getElementById("dt").max = date;
}

sendAPIreq(neoWs + api_key, 0);
