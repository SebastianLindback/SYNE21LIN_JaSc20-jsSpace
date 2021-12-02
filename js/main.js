//https://api.nasa.gov/planetary/apod?api_key=lZwg9tTZMqD86tp9mvKrQIFAjbrC4kpgVtKnCKp5
//lZwg9tTZMqD86tp9mvKrQIFAjbrC4kpgVtKnCKp5
//https://wilsjame.github.io/how-to-nasa/

var req = new XMLHttpRequest();
var url = "https://api.nasa.gov/planetary/apod?api_key=";
let neoStartDate = "2019-10-11";
let neoEndDate = "2019-10-12";
let neoWs = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${neoStartDate}&end_date=${neoEndDate}&api_key=`;
var api_key = "lZwg9tTZMqD86tp9mvKrQIFAjbrC4kpgVtKnCKp5";


todaysDate();
sendAPIreq(url + api_key);

function handler(e){
  var hUrl = "https://api.nasa.gov/planetary/apod?";
  var datum = e.target.value;
	sendAPIreq(hUrl + "start_date=" + datum + "&end_date=" + datum + "&api_key=" + api_key, 1);
}

async function sendAPIreq(fetchUrl, click) {
	let req = await fetch(fetchUrl);
	req.json().then(data => {
  console.log(data, "oki" + click);
	console.log(data.date);
	apiDataUse(data, click);
	});
	console.log(req);

}
function apiDataUse(data, click){
	if (click){
	if (data.date == undefined) {data = data[0]}
	document.getElementById("title").textContent = data.title;
	document.getElementById("date").textContent = data.date;
	document.getElementById("pic").src = data.hdurl;
	document.getElementById("explanation").textContent = data.explanation;
	}
}
function todaysDate(){
	var today = new Date();
	let todayDate = today.getDate();
	if (String(todayDate).length == 1) {todayDate = `0${todayDate}`;}
	console.log(todayDate.length, todayDate);
	var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+todayDate;
	document.getElementById("dt").max = date;
}
