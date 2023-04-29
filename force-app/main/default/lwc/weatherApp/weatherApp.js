import { LightningElement } from 'lwc';

import WEATHER_ICONS from '@salesforce/resourceUrl/weatherAppIcons';

import GET_WEATHER_DETAILS from '@salesforce/apex/weatherAppController.getWeatherDetails';

const API_KEY='e80b1298707b974c079898de10ec7858'
export default class WeatherApp extends LightningElement {

    clearIcon=WEATHER_ICONS+'/weatherAppIcons/clear.svg'
    cloudIcon=WEATHER_ICONS+'/weatherAppIcons/cloud.svg'
    dropletIcon=WEATHER_ICONS+'/weatherAppIcons/droplet.svg'
    hazeIcon=WEATHER_ICONS+'/weatherAppIcons/haze.svg'
    mapIcon=WEATHER_ICONS+'/weatherAppIcons/map.svg'
    rainIcon=WEATHER_ICONS+'/weatherAppIcons/rain.svg'
    snowIcon=WEATHER_ICONS+'/weatherAppIcons/snow.svg'
    stormIcon=WEATHER_ICONS+'/weatherAppIcons/strom.svg'
    thermometerIcon=WEATHER_ICONS+'/weatherAppIcons/thermometer.svg'
    arrowBackIcon=WEATHER_ICONS+'/weatherAppIcons/arrow-back.svg'


    cityName = ''
  loadingText = ''
  isError = false
  response

  weatherIcon

  get loadingClasses(){
    return this.isError ? 'error-msg':'success-msg'
  }
  searchHandler(event){
    this.cityName = event.target.value
  }

  submitHandler(event){
    event.preventDefault()
    this.fetchData()
  }

  fetchData(){
    this.isError = false
    this.loadingText = 'Fetching weather details...'
    // console.log("cityName", this.cityName)

    GET_WEATHER_DETAILS({input:this.cityName}).then(result=>{
        this.weatherDetails(JSON.parse(result))
        // console.log(JSON.stringify(result))
    }).catch((error)=>{
               console.error(error)
               this.response=null
               this.loadingText = "Something went wrong"
               this.isError = true
             })

    //Below is CLient Side
   
//    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${this.cityName}&units=metric&appid=${API_KEY}`
//     fetch(URL).then(res=>res.json()).then(result=>{
//         console.log(JSON.stringify(result))
//         this.weatherDetails(result)
//     }).catch((error)=>{
//       console.error(error)
//       this.loadingText = "Something went wrong"
//       this.isError = true
//     })
  }

  weatherDetails(info){
    if(info.cod === "404"){
      this.isError = true 
      this.loadingText = `${this.cityName} isn't a valid city name`
    } else {
      this.loadingText = ''
      this.isError=false

      const city=info.name
      const country=info.sys.country
      const {description,id}=info.weather[0]
      const {temp,feels_like,humidity}=info.main

      if(id===800){
        this.weatherIcon=this.clearIcon
      }

      else if((id>=200 && id<=232) || (id >=600 && id<=622)){
        this.weatherIcon=this.stormIcon
      }

      else if(id>=701 && id<=781){
        this.weatherIcon=this.hazeIcon
      }

      else if(id>=801 && id<=804){
        this.weatherIcon=this.cloudIcon
      }

      else if((id>=500 && id<=531) || (id>=300 && id<=321) ){
        this.weatherIcon=this.rainIcon
      }

      else{}

      
      this.response={
        city:city,
        temprature:Math.floor(temp),
        description:description,
        location:`${city},${country}`,
        feels_like:Math.floor(feels_like),
        humidity:`${humidity}%`
      }
    }
  }

  backHandler(){
    this.response=null
    this.cityName=''
    this.loadingText=''
    this.isError=false
    this.weatherIcon=''
  }
}