const temp=document.getElementById("temp");
const date=document.getElementById("date-time");
const currentLocation=document.getElementById("location");
const condition=document.getElementById("condition");
const rain= document.getElementById("rain"),
mainIcon=document.getElementById("icon"),
uvIndex=document.querySelector(".uv-index"),
uvStaus=document.querySelector(".uv-text"),
windSpeed=document.querySelector(".wind-speed"),
sunrise=document.querySelector(".sunrise"),
sunset=document.querySelector(".sunset"),
humidity=document.querySelector(".humidity"),
humidityStatus=document.querySelector(".humidity-status"),
visibility=document.querySelector(".visibility"),
visibilityStatus=document.querySelector(".visibility-status"),
airQuality=document.querySelector(".air-quality"),
airQualityStaus=document.querySelector(".air-quality-status"),
weathercards=document.querySelector("#weather-card"),
celciusBtn=document.querySelector(".celcius"),
fahrenheitBtn=document.querySelector(".fahrenheit"),
houlyBtn=document.querySelector(".hour");
weekBtn=document.querySelector(".week");
tempunit=document.querySelectorAll(".temp-unit"),
submit=document.querySelector("#submit"),
searchTxt=document.querySelector("#query");

let currentCity="";
let currentUnit="°C";
let hourlyorWeek="Week";

//update date time

function getDateTime(){
    let now=new Date(),
    hour=now.getHours(),
    minute=now.getMinutes();

    let days=["Sunday","Monday","Tuesday",
    "Wednesday","Thursday","Friday","Saturday"];

    // 12 hour format
    hour = hour % 12;
      if(hour < 10){
        hour = "0" + hour;
      }
      if(minute < 10){
        minute = "0" + minute;
      }
      let dayString = days[now.getDay()];
      return `${dayString}, ${hour}:${minute}`;
}
date.innerText=getDateTime();

 // update time every second
 setInterval(() => {
   date.innerText =  getDateTime();
 }, 1000);

// function to get public ip with  fetch
function getPublicIp(){
    fetch("https://geolocation-db.com/json/",{
        method:"GET",
    })
    .then((response) => 
        response.json()
    ).then((data) => {
   currentCity =data.city;
   getWeatherData(data.city,currentUnit,hourlyorWeek);
    });
}
getPublicIp();

// fucntion to get weather data

function getWeatherData(city,unit,hourlyorWeek){
    const apiKey="WKMLAVKCXD8XB3TGWQGZTMQAU";
    fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${apiKey}&contentType=json`,{
        method:"GET",
    }
    ).then((responce)=>responce.json())
    .then((data)=>{
       console.log(data);
       let today=data.currentConditions;
      console.log(today);
       if(unit=="°C"){
        temp.innerText=today.temp;
       }else{
        temp.innerText=celciusToFahrenheit(today.temp);
       }
   currentLocation.innerText=data.resolvedAddress;
   condition.innerText=today.conditions;
   rain.innerText="Perc - "+today.precip+"%";
   uvIndex.innerText=today.uvindex;
   windSpeed.innerText=today.windspeed;
   humidity.innerText=today.humidity+"%";
 
   visibility.innerText=today.visibility;
   airQuality.innerText=today.winddir;
   measureUvIndex(today.uvindex);
   updateHumidityStatus(today.humidity);
   updateVisibilityStatus(today.visibility);
   updateAirQualityStatus(today.winddir);
   sunrise.innerText=convertTimeTo12HourFormat(today.sunrise);
   sunset.innerText=convertTimeTo12HourFormat(today.sunset)
   mainIcon.src=getIcon(today.icon);    
   changeBackground(today.icon);
   if(hourlyorWeek == "hourly"){
    updateForeCast(data.days[0].hours,unit,"day");
   }else{
    updateForeCast(data.days,unit,"week");
   }
}).catch((error)=>{
    alert("City Not found in our database");
});
    

}

  //convert celcius to fahrenheit
  function celciusToFahrenheit(temp){
    return ((temp*9) / 5 + 32).toFixed(1)
  }

  // function to get uv index status

  function measureUvIndex(uvIndex){
    if(uvIndex <= 2){
        uvStaus.innerText="Low";
    }else if(uvIndex <= 5){
        uvStaus.innerText="Moderate"
    }else if(uvIndex <= 7){
        uvStaus.innerText="High";
    }
    else if(uvIndex <= 10){
        uvStaus.innerText="Very High";
    }else{
        uvStaus.innerText="Extreme";
    }
  }

  function updateHumidityStatus(humidity){
    if(humidity <= 30){
        humidityStatus.innerText="Low";
    }else if(humidity <=60){
        humidityStatus.innerText="Moderate";
    }else{
   humidityStatus.innerText="High";
    }
  }

  function updateVisibilityStatus(visibility){
     if(visibility <= 0.3){
        visibilityStatus.innerText="Dense Fog";
     }else if(visibility <= 0.16){
        visibilityStatus.innerText="Moderate Fog";
     }else if(visibility <= 0.35){
        visibilityStatus.innerText="Light Fog";
     }else if(visibility <= 1.13){
        visibilityStatus.innerText="Very Light Fog";
     }else if(visibility <= 2.16){
        visibilityStatus.innerText="Light Mist";
     }else if(visibility <= 5.4){
        visibilityStatus.innerText="Very Light Mist";
     }else if(visibility <= 10.8){
        visibilityStatus.innerText="Clear Air";
     }else{
        visibilityStatus.innerText="Very Clear Air";
     }
  }

  function updateAirQualityStatus(airQuality){
    if(airQuality <= 50){
        airQualityStaus.innerText="Good";
    }else if(airQuality <= 100){
        airQualityStaus.innerText="Moderate";
    }else if(airQuality <= 150){
        airQualityStaus.innerText="Unhealthy for sensitive Groups";
    }else if(airQuality <= 200){
        airQualityStaus.innerText="Unhealthy";
    }else if(airQuality <= 250){
        airQualityStaus.innerText="Very Unhealthy";
    }else{
        airQualityStaus.innerText="Hazardous";
    }
  }

  function convertTimeTo12HourFormat(time){
    let hour = time.split(":")[0];
    console.log(hour);
    let minute=time.split(":")[1];
    console.log(minute);
    let ampm=hour >=12 ?"pm":"am";
   // hour = hour & 12;
    hour =hour ? hour :12;// the zero hour should be 12
    // hour =hour < 10 ? "0"+ hour :hour;// add prefix zero if less than 10
    // minute=minute<10 ? "0"+minute:minute;
    if(hour > 12){
        hour=hour-12;
       
    }else{
       
    }
    let strTime=hour+":"+minute+":"+ampm;
    return strTime;
  }

  function changeBackground(condition){
    const body=document.querySelector("body");
    let bg="";
    if(condition == "partly-cloudy-day"){
        bg= "images/pc.jpg";
    }else if(condition == "partly-cloudy-night"){
        bg="images/pcn.jpg";
    }else if(condition == "rain"){
       bg= "images/rain.jpg";
    }else if(condition == "clear-day"){
       bg= "images/cd.jpg";
    }else if(condition == "clear-night"){
        bg= "images/cn.jpg";
    }else {
       bg= "images/pc.jpg";
    }
  body.style.backgroundImage=`linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)),url(${bg})`;
}

  function getIcon(condition){
    if(condition == "partly-cloudy-day"){
        return "icons/sun/27.png";
    }else if(condition == "partly-cloudy-night"){
        return "icons/moon/15.png";
    }else if(condition == "rain"){
        return "icons/rain/39.png";
    }else if(condition == "clear-day"){
        return "icons/sun/26.png";
    }else if(condition == "clear-night"){
        return "icons/moon/10.png";
    }else {
        return "icons/sun/26.png";
    }
  }

function getDayname(date){
    let day=new Date(date);
    let days=[
        "Sunday",
       "Monday",
       "Tuesday",
       "Wednesday",
       "Thursday",
       "Friday",
       "Saturday",
    ];
    return days[day.getDay()];
}

  function getHour(time){
    let hour=time.split(":")[0];
    let min=time.split(":")[1];
    if(hour > 12){
        hour=hour-12;
        return `${hour}:${min}PM`;
    }else{
        return `${hour}:${min}AM`;
    }
  }

  function updateForeCast(data,unit,type){
    weathercards.innerHTML="";
    let day=0;
    let numcards=0;
    // 24 cards if hourly  weather and 7 week card if week
    if(type=="day"){
        numcards=24;
    }else{
        numcards=7;
    }
    for(let i=0;i<numcards;i++){
        let card=document.createElement("div");
        card.classList.add("card");

        // hour if hourly and day name if weekly
        let dayName=getHour(data[day].datetime); // tod

        if(type=="week"){
            dayName=getDayname(data[day].datetime);
        }

        let dayTemp=data[day].temp;
        if(unit=="°F"){
            dayTemp=celciusToFahrenheit(data[day].temp);
        }
        let iconCondition=data[day].icon;
        let iconSrc=getIcon(iconCondition);
        let tempunit="°C";
        if(unit=="°F"){
            tempunit="°F";
        }
        card.innerHTML=`
        <h2 class="day-name">${dayName}</h2>
        <div class="card-icon">
            <img src="${iconSrc}" alt="">
        </div>
        <div class="day-temp">
            <h2 class="temp">${dayTemp}</h2>
            <span class="temp-unit">${tempunit}</span>
    </div>`;
    weathercards.appendChild(card);
    day++;
    }
  }

  fahrenheitBtn.addEventListener("click",()=>{
    changeUnit("°F");
  });
  celciusBtn.addEventListener("click",()=>{
    changeUnit("°C");
  });

  function changeUnit(unit){
    if(currentUnit!=unit){
        currentUnit=unit;
        {
            // change unit on document
            tempunit.forEach((elem)=>{
                elem.innerText=`${unit.toUpperCase()}`;
            })
            if(unit =="°C"){
                celciusBtn.classList.add("active");
                fahrenheitBtn.classList.remove("active");
            }else{
                celciusBtn.classList.remove("active");
                fahrenheitBtn.classList.add("active");
            }
            // call get weather after chnage unit
            getWeatherData(currentCity,currentUnit,hourlyorWeek);
        }
    }
  }

  houlyBtn.addEventListener("click",()=>{
    changeTimeSpam("hourly");
  });
  weekBtn.addEventListener("click",()=>{
    changeTimeSpam("week");
  });


  function changeTimeSpam(unit){
    if(hourlyorWeek!=unit){
        hourlyorWeek=unit;
        if(unit=="hourly"){
            houlyBtn.classList.add("active");
            weekBtn.classList.remove("active");
        }else{
            houlyBtn.classList.remove("active");
            weekBtn.classList.add("active");
        }
        getWeatherData(currentCity,currentUnit,hourlyorWeek);
    }
  }


  submit.addEventListener("click",(e)=>{
  e.preventDefault();
    let location=searchTxt.value;
    if(location){
        currentCity=location;
      
        getWeatherData(currentCity,currentUnit,hourlyorWeek);
    }
  });


  // suggestion work

  let suggestion_day=[
    "India",
    "Pakistan",
    "Firozabad",
    "Agra",
    "Tudla",
    "Mathura",
    "Ambala",
    "Jharkhand",
    "Haryana",
  ];

  // sort name by accessding order
  let sort=suggestion_day.sort();

  searchTxt.addEventListener("keyup",(e)=>{

      // loop throgh above array
      removeItems();
      for(i of sort){
        // convert input to lower and compare with each string
        if(i.toLowerCase().startsWith(searchTxt.value.toLowerCase()) && searchTxt.value!=""){
            let listItem=document.createElement("li");
            listItem.classList.add("list-items");
            listItem.style.cursor="pointer";
            listItem.setAttribute("onclick","displayName('"+i+"')");
          
            // display  match part in bold
            let word="<b>"+i.substr(0,searchTxt.value.length)+"</b>";
            word+=i.substr(searchTxt.value.length);
           listItem.innerHTML=word;
           document.querySelector("#suggestion").appendChild(listItem);
        }
      }
  });

  function displayName(name){
    searchTxt.value=name;
removeItems();
  }

  function removeItems(){
    let items=document.querySelectorAll(".list-items");
   items.forEach((element) => {
        element.remove();;
    });
  }


 