// https://api.nasa.gov/planetary/apod?api_key=lZwg9tTZMqD86tp9mvKrQIFAjbrC4kpgVtKnCKp5
// lZwg9tTZMqD86tp9mvKrQIFAjbrC4kpgVtKnCKp5
// https://wilsjame.github.io/how-to-nasa/

const url = 'https://api.nasa.gov/planetary/apod?api_key=';
const api_key = 'lZwg9tTZMqD86tp9mvKrQIFAjbrC4kpgVtKnCKp5';
const arrNamn = [];

let req = new XMLHttpRequest();
let neoStartDate;
let neoEndDate;
let publicTemp;
let doomsdayAstro = [];

todaysDate(); // definerar dagens datum i datumväljaren.
neoWs = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${neoStartDate}&end_date=${neoEndDate}&api_key=`;

sendAPIreq(url + api_key, 1); // kör APOS API

// den här körs på onclick
function handler(e) {
  // när datumet väljs i datumväljaren skickas läggs det till i filtreringen vid api call
  const hUrl = 'https://api.nasa.gov/planetary/apod?';
  const datum = e.target.value;
  sendAPIreq(`${hUrl}start_date=${datum}&end_date=${datum}&api_key=${api_key}`, 1);
}

function ClearAsteroids() {
  arrNamn.length = 0; // nollställ
  document.getElementById('dangerText').innerHTML = ''; // ta bort dangertexten
  document.getElementById('astroider').innerHTML = ''; // ta bort alla Asteroider
}

// Nedan defineras funktionerna, men det körs enbart när de anropas, se åvan.
async function sendAPIreq(fetchUrl, apiMetod) {
  // funktionen tar emot data från api länk + api key och sedan skckar den ner datan som en JSON till apiDataUse
  // apimetod: 1 = APOS, 0 = NeoWs
  req = await fetch(fetchUrl);
  req.json().then((data) => {
    console.log(data, `oki${apiMetod}`);
    apiDataUse(data, apiMetod);
  });
}

function apiDataUse(data, apiMetod) {
  ClearAsteroids();
  doomsdayAstro = [];
  let danger = 0;
  if (apiMetod) {
    // APOS Metod
    if (data.date === undefined) { data = data[0]; }
    document.getElementById('title').textContent = data.title;
    document.getElementById('date').textContent = data.date;
    // Finns tydligen med youtube videor i APIn. togglar av och på en iframe berorende på media_type
    if (data.media_type === 'image') {
      document.getElementById('pic').src = data.hdurl;
      document.getElementById('pic').style.display = 'block';
      document.getElementById('vid').style.display = 'none';
    } else if (data.media_type === 'video') {
      document.getElementById('vid').src = data.url;
      document.getElementById('pic').style.display = 'none';
      document.getElementById('vid').style.display = 'block';
    }

    document.getElementById('explanation').textContent = data.explanation;
  } else {
    // NeoWs Metod
    console.log(`Mellan ${neoStartDate} och ${neoEndDate} passerade ${data.element_count}st astroider.`);
    // astroMin + astroMax består av två olika arrayer. en array för startdatumet (neoStartDate) och en för slutdatum (neoEndDate)
    const astroMin = data.near_earth_objects[neoStartDate];
    // skriver ut alla namn i arrayen med startdatumet och kollor ifall det fanns någon astroid med potenciell fara.
    for (let i = 0; i < astroMin.length; i++) {
			 console.log(astroMin[i].name);
			 arrNamn.push(astroMin[i].name);
		 if (astroMin[i].is_potentially_hazardous_asteroid) { danger++; doomsdayAstro.push(astroMin[i]); }
    }

    const astroMax = data.near_earth_objects[neoEndDate];
    // skriver ut alla namn i arrayen med slutdatumet och kollor ifall det fanns någon astroid med potenciell fara.
    for (let i = 0; i < astroMax.length; i++) {
			 console.log(astroMax[i].name);
			 arrNamn.push(astroMax[i].name);
		 if (astroMax[i].is_potentially_hazardous_asteroid) { danger++; doomsdayAstro.push(astroMax[i]); }
    }

    // skriver ut resultatet av hur många som var farliga.
    let classDanger = '';
    let link = '';
    for (let i = 0; i < arrNamn.length; i++) {
      link = `https://www.google.com/search?q=${arrNamn[i]}`;
      for (let y = 0; y < doomsdayAstro.length; y++) {
        if (arrNamn[i] === doomsdayAstro[y].name) {
          classDanger = 'class=\'danger\''; console.log('danger');
          link = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley';
        }
      }

      document.getElementById('astroider').innerHTML += `<li ${classDanger}><a href='${link}'> ${arrNamn[i]}  <a/></li>`;
      classDanger = '';
      link = '';
    }

    document.getElementById('dangerText').innerHTML = (`Mellan ${neoStartDate} och ${neoEndDate} förväntas ${data.element_count}st astroider passera. <br> ${danger} av listade astroider är potenciellt farliga`);

    // scrolla ner automatiskt till astroiderna
    window.scrollTo(0, document.body.scrollHeight);
  }
}

function todaysDate() {
  // funktionen definerar dagens datum som ett max värde för datumväljaren med id=dt. så att programmet inte error uppstår av att framtida datum väljs.
  const today = new Date();
  neoStartDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2).toISOString().split('T')[0];
  neoEndDate = new Date(today.getFullYear(), today.getMonth(), (today.getDate() + 3)).toISOString().split('T')[0];
  document.getElementById('dt').max = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1).toISOString().split('T')[0];
  document.getElementById('dt').value = document.getElementById('dt').max;
  console.log(neoStartDate, neoEndDate);
}
