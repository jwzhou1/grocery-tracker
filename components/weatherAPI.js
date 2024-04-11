import * as Location from 'expo-location';

export const getUserLocation = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('Permission to access location was denied');
      return null;
    }

    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    return { latitude, longitude };
  } catch (error) {
    console.error('Error getting user location:', error);
    return null;
  }
};

export const fetchWeatherData = async (latitude, longitude) => {
  const params = {
    "latitude": latitude,
    "longitude": longitude,
    "hourly": ["temperature_2m", "precipitation_probability"]
  };
  const queryParams = Object.keys(params)
    .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(params[key]))
    .join("&");

  const url = "https://api.open-meteo.com/v1/forecast?" + queryParams;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log("weather data", data);
    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
};
