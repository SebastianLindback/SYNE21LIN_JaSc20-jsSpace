//https://api.nasa.gov/planetary/apod?api_key=lZwg9tTZMqD86tp9mvKrQIFAjbrC4kpgVtKnCKp5
//lZwg9tTZMqD86tp9mvKrQIFAjbrC4kpgVtKnCKp5
//https://wilsjame.github.io/how-to-nasa/

var req = new XMLHttpRequest();
var url = "https://api.nasa.gov/planetary/apod?api_key=";
var api_key = "lZwg9tTZMqD86tp9mvKrQIFAjbrC4kpgVtKnCKp5";

req.open("GET", url + api_key, true);
req.send();

req.addEventListener("load", function(){
	if(req.status == 200 && req.readyState == 4){
  	var response = JSON.parse(req.responseText);
    document.getElementById("title").textContent = response.title;
    document.getElementById("date").textContent = response.date;
    document.getElementById("pic").src = response.hdurl;
    document.getElementById("explanation").textContent = response.explanation;
  }

});

function handler(e){
  var req = new XMLHttpRequest();
  var url = "https://api.nasa.gov/planetary/apod?";
  var api_key = "lZwg9tTZMqD86tp9mvKrQIFAjbrC4kpgVtKnCKp5";
  var datum = e.target.value;

  req.open("GET", url + "start_date=" + datum + "&end_date=" + datum + "&api_key=" + api_key, true);
  req.send();

  req.addEventListener("load", function(){
    if(req.status == 200 && req.readyState == 4){
      var response = JSON.parse(req.responseText);
      document.getElementById("title").textContent = response[0].title;
      document.getElementById("date").textContent = response[0].date;
      document.getElementById("pic").src = response[0].hdurl;
      document.getElementById("explanation").textContent = response[0].explanation;
}
});

}