import { StatusBar } from "expo-status-bar";
import React from "react";
import { Alert } from "react-native";
import Loading from "./Loading";
import Weather from "./Weather";
import * as Location from "expo-location";
import axios from "axios";

// Please enter your open weather API key
const API_KEY = "";

export default class App extends React.Component {
  state = {
    isLoading: true,
  };
  getWeather = async (latitude, longitude) => {
    const { data } = await axios.get(
      `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
    );
    this.setState({
      isLoading: false,
      city: data.name,
      condition: data.weather[0].main,
      temp: data.main.temp,
    });
  };
  getLocation = async () => {
    try {
      await Location.requestPermissionsAsync();
      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync();
      this.getWeather(latitude, longitude);
    } catch (error) {
      Alert.alert("Can't get your location", "Sorry");
    }
  };
  componentDidMount() {
    this.getLocation();
  }
  render() {
    const { isLoading, city, temp, condition } = this.state;
    return isLoading ? (
      <Loading />
    ) : (
      <Weather city={city} temp={Math.round(temp)} condition={condition} />
    );
  }
}
