import { LightningElement } from 'lwc';

// Importing the static resources
import WEATHER_ICONS from '@salesforce/resourceUrl/weatherAppIcons';

// Importing the class and method
import GET_WEATHER_DETAILS from '@salesforce/apex/weatherAppController.getWeatherDetails';

const API_KEY='e80b1298707b974c079898de10ec7858'
export default class WeatherApp extends LightningElement {

    // Defining the weather icons using imported resources
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


  // Initializing variables to store user input, loading text, response, and error status
  cityName = ''
  loadingText = ''
  isError = false
  response
  weatherIcon

  // Getter function for returning the class name based on the error status
  get loadingClasses(){
    return this.isError ? 'error-msg':'success-msg'
  }

  // Event handler for capturing user input for the city name
  searchHandler(event){
    this.cityName = event.target.value
  }

  // Event handler for handling form submission
  submitHandler(event){
    event.preventDefault()
    this.fetchData()
  }

  // Function for fetching weather data from the server using Apex controller
  fetchData(){

    // Resetting error status and loading text
    this.isError = false
    this.loadingText = 'Fetching weather details...'
    // console.log("cityName", this.cityName)

    // Calling the Apex controller method to get weather details
    GET_WEATHER_DETAILS({input:this.cityName}).then(result=>{

        // Parsing the result and processing the weather data
        this.weatherDetails(JSON.parse(result)) 
        // console.log(JSON.parse(result));
        // console.log(JSON.stringify(result))

        // Handling errors
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

  // Function for processing the weather data
  weatherDetails(info){

    // Checking for invalid city names and displaying error message
    if(info.cod === "404"){
      this.isError = true 
      this.loadingText = `${this.cityName} isn't a valid city name`
    } 
    else 
    {
      // Extracting weather data and storing it in response variable
      this.loadingText = ''
      this.isError=false

      const city=info.name
      const country=info.sys.country
      const {description,id}=info.weather[0]
      const {temp,feels_like,humidity}=info.main

      // Determine which weather icon to display based on weather condition
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

      // Update response state with weather data
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

  // Handling the back icon 
  backHandler(){
    this.response=null
    this.cityName=''
    this.loadingText=''
    this.isError=false
    this.weatherIcon=''
  }
}