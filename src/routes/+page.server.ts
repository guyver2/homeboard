import { getDayWeather } from '$lib/weather';


const weather = await getDayWeather("Niederscherli");
console.log("today", weather);
const j1 = await getDayWeather("Niederscherli",1);
const j2 = await getDayWeather("Niederscherli",2);
console.log("J+1", j1);
console.log("J+2", j2);

