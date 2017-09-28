<template>
  <div class="weather">
    <li v-for="weather in weatherList" v-bind:key="weather.dt">
      <span>{{weather.dt}}</span>
    </li>
  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';

export default {
  name: 'weather',
  data() {
    return {
      openWeather: {
        apiKey: '0500ba0340ef629d69d8673fdc5209ba',
        url: 'http://api.openweathermap.org/data/2.5/forecast'
      },
      weatherList: []
    }
  },
  created() {
    this.fill()
  },
  methods: {
    fill() {
      axios.get(this.openWeather.url, {
        params: {
          q: 'Fortaleza,br',
          mode: 'json',
          appid: this.openWeather.apiKey,

        }
      }).then(response => {
        this.weatherList = response.data.list.map(info => {
          const data = {
            cloudness: info.clouds.all,
            dt: moment(info.dt_txt).format("DD/MM hh:mm"),
            weather: info.weather[0],
            wind: info.wind,
            main: {
              temp: info.main.temp,
              temp_max: info.main.temp_max,
              temp_min: info.main.temp_min
            }
          }
          return data;
        });
      })
        .catch(error => {
          console.log(error);
        });
    },
  }
}
</script>