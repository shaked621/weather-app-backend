import { NextFunction, Request, Response } from "express";
import { AxiosAdapter } from "../axios/axios";
import { Temp } from "../model/temp";

export class WeatherController {
  /**
   * Get the Weather data in your Geolocation
   * @param req
   * @param res
   * @param next
   */
  static async getweather(req: Request, res: Response, next: NextFunction) {
    try {
      const geo = await WeatherController.getGeoLocation();
      let latitude = 32.08088;
      let longitude = 34.78057;
      if (geo !== undefined) {
        latitude = geo.latitude;
        longitude = geo.longitude;
      }
      let url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&relativehumidity_2m,windspeed_10m`;
      const axios = AxiosAdapter.createAxiosAdapter(url);
      const response = await axios.get("").then((response) => {
        console.log(response.data);
        const temp: Temp = {
          temperature: response.data.current_weather.temperature,
          winddirection: response.data.current_weather.winddirection,
          windspeed: response.data.current_weather.windspeed,
        };
        return temp;
      });
      res.status(201).json({ message: "Weather Data", weatherData: response });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  }

  /**
   * Get your Geolocation
   * Using API https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=10&language=en&format=json
   * @returns
   */
  static async getGeoLocation() {
    const responseLocation = await WeatherController.getLocation();
    let cityName: string = responseLocation?.location?.region;
    console.log(WeatherController.stringChange(cityName));
    if (!cityName) {
      cityName = "tel+aviv";
    }
    let url = `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=10&language=en&format=json`;
    try {
      const axios = AxiosAdapter.createAxiosAdapter(url);
      const response = await axios.get("").then((response) => {
        console.log(response.data);
        const geo = {
          latitude: response?.data.results[0].latitude,
          longitude: response?.data.results[0].longitude,
        };
        return geo;
      });
      return response;
    } catch (error) {}
  }

  /**
   * Get your City name,
   * using API: https://geo.ipify.org/api/v2/country?
   * @returns
   */
  static async getLocation() {
    let api_key = "at_bm4PkgUVpVFgpnlX61F9u6YJXXYcq";
    let api_url = "https://geo.ipify.org/api/v2/country?";
    const responseIp = await WeatherController.getIp();
    if (responseIp) {
      const urlLocation =
        api_url + "apiKey=" + api_key + "&ipAddress=" + responseIp;
      try {
        const axios = AxiosAdapter.createAxiosAdapter(urlLocation);
        const response = await axios.get("").then((response) => {
          console.log(response.data);
          return response.data;
        });
        return response;
      } catch (error) {
        console.log(error);
      }
    }
  }

  /**
   * Get your computer IP,
   * using API: https://api.ipify.org
   * @returns
   */
  static async getIp() {
    try {
      const axios = AxiosAdapter.createAxiosAdapter("https://api.ipify.org");
      const response = await axios.get("").then((response) => {
        console.log(response.data);
        return response.data;
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  //Using to change string to message format
  static stringChange(cityName: string): void {
    if (cityName) {
      let lastIndex = cityName.lastIndexOf(" ");
      if (lastIndex > 2) {
        cityName = cityName.substring(0, lastIndex);
      }
      cityName = cityName.toLowerCase();
      cityName = cityName.replace(" ", "+");
    }
  }
}
