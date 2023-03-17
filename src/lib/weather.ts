// Use the free API from
// https://open-meteo.com/en/docs

type city_t = {
    name: string,
    lat: number,
    lon: number,
    timezone: string,
};

const CODES = {
0: "Clear sky",
1: "Mainly clear",
2: "partly cloudy",
3: "overcast",
45: "Fog",
48: "Fog",
51: "Drizzle",
53: "Drizzle",
55: "Drizzle",
56: "Freezing drizzle",
57: "Freezing drizzle",
61: "Light rain",
63: "Moderate rain",
65: "Heavy rain",
66: "Freezing rain",
67: "Freezing rain",
71: "Light snow",
73: "Moderate snow",
75: "Heavy snow",
77: "Snow grains",
80: "Slight showers",
81: "Moderate showers",
82: "Violent showers",
85: "Snow",
86: "Snow",
95: "Thunderstorm",
96: "Thunderstorm with slight and heavy hail",
99: "Thunderstorm with slight and heavy hail"
}


type dayWeather_t = {
  date: Date,
  code: number,
  maxTemp: number, // in °C
  minTemp: number, // in °C
  maxApparentTemp: number, // in °C
  minApparentTemp: number, // in °C
  sunrise: string, // HH:MM
  sunset: string, // HH:MM
  uvIndex: number, //scalar
  rain: number, // in mm
  snow: number, // in cm
  wind: number // in km/h
}


const CITIES : city_t[] = [
  {
    name: "Niederscherli",
    lat: 46.87947121444593,
    lon: 7.3854075510875985,
    timezone: "Europe%2FBerlin",
  }
]




function findCity(name: string): city_t | undefined {
  const city = CITIES.find(c => c.name == name);
  return city;
}

export async function getDayWeather(cityName: string, offset=0): Promise<dayWeather_t> {
  return new Promise((resolve, reject) => {
    try {
      const city = findCity(cityName);
      const parameters = [
              "weathercode",
              "temperature_2m_max",
              "temperature_2m_min",
              "apparent_temperature_max",
              "apparent_temperature_min",
              "sunrise",
              "sunset",
              "uv_index_max",
              "precipitation_sum",
              "snowfall_sum",
              "windspeed_10m_max",
            ];
      if(city){
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&daily=${parameters.join()}&timezone=${city.timezone}`)
        .then(response => response.json())
        .then(json => {
          if(json.code == "404"){
            return reject(new Error(`Error while fetching weather data.\n${json}`));
          } else {
            const result: dayWeather_t =  {
              date: new Date(json.daily.time[offset]),
              code: json.daily.weathercode[offset],
              maxTemp: json.daily.temperature_2m_max[offset],
              minTemp: json.daily.temperature_2m_min[offset],
              maxApparentTemp: json.daily.apparent_temperature_max[offset],
              minApparentTemp: json.daily.apparent_temperature_min[offset],
              sunrise: json.daily.sunrise[offset].split("T")[1],
              sunset: json.daily.sunset[offset].split("T")[1],
              uvIndex: json.daily.uv_index_max[offset],
              rain: json.daily.precipitation_sum[offset],
              snow: json.daily.snowfall_sum[offset],
              wind: json.daily.windspeed_10m_max[offset],
            };
            resolve(result);
          }
        })
      }
    } catch (error) {
      return reject(new Error(`Error while fetching weather data.\n${error}`));
    }
  });
}
