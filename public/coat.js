const options = {
    enableHighAccuracy: false,
    timeout: 15000,
    maximumAge: 0,
};

navigator.geolocation.getCurrentPosition(success, error, options);

function success(position) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&hourly=temperature_2m,precipitation&timezone=GMT&forecast_days=1`;
    console.log(position.coords.latitude + " " + position.coords.longitude);

    ;(async () => {
        const temp = await getTemperature(url);
        const rain = await isRainy(url);
        console.log(temp); console.log(rain);

        if (temp >= 18 && !rain) {
            document.getElementById('message').innerHTML ="Don't need a coat mate. Enjoy!";
        }else if (temp >=18 && rain) {
            document.getElementById('message').innerHTML ="At least bring an umbrella.";
        } else if (temp < 18) {
            document.getElementById('message').innerHTML ="Bring a coat mate it's "+temp.toFixed(2)+" C";
        }
    })()
}

function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
    document.getElementById('message').innerHTML ="Couldn't get the data :(";
}

async function getData(url) {
    const response = await fetch(url);

    return response.json();
}

async function getTemperature(url){
    const average = array => array.reduce((a, b) => a + b) / array.length;

    const data = await getData(url); console.log(data);
    const avg = average(data.hourly.temperature_2m);
    return avg;
}

async function isRainy(url){
    const data = await getData(url);
    
    if(data.hourly.precipitation.some(e => e!=0)){
        return true;
    }else{
        return false;
    }
}