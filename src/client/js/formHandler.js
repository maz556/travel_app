const locationP = document.getElementById("location");
const startDateP = document.getElementById("start-date");
const countdownP = document.getElementById("countdown");
const lengthP = document.getElementById("length");
const temperatureP = document.getElementById("temperature");
const weatherDescP = document.getElementById("weather-desc");
const locationImg = document.getElementById("location-photo");

function textValid(locationText, startDateText, endDateText) {
    let issues = "";
    // check if locationText is not null or just whitespace
    if (!(locationText && /\S/.test(locationText))) {
        issues += " - The given location text is empty!\n";
    }
    // check if dateText is in the right format
    if (!/\d{4}(-\d{2}){2}/.test(startDateText)) {
        issues += " - The given start date is not in the right format (YYYY-MM-DD)!\n";
    }
    if (!/\d{4}(-\d{2}){2}/.test(endDateText)) {
        issues += " - The given end date is not in the right format (YYYY-MM-DD)!\n";
    }
    if (issues) {
        alert(`Please edit and resubmit the information:\n${issues}`);
        return false;
    }
    return true;
}

function getDateFromString(dateString) {
    const dateArray = dateString.split("-");
    return new Date(
        parseInt(dateArray[0], 10),
        parseInt(dateArray[1], 10) - 1,
        parseInt(dateArray[2], 10),
    );
}

async function handleSubmit(event) {
    event.preventDefault();
    const {
        "location-input": { value: locationText },
        "start-date-input": { value: startDateText },
        "end-date-input": { value: endDateText },
        "country-input": { value: countryCode },
    } = event.target.elements;
    if (!textValid(locationText, startDateText, endDateText)) return;
    const startDate = getDateFromString(startDateText);
    const endDate = getDateFromString(endDateText);
    const tripLength = (endDate.getTime() - startDate.getTime()) / 86400000;
    const daysUntil = Math.ceil((startDate.getTime() - (new Date()).getTime()) / 86400000);
    if (daysUntil < 0) {
        alert("The given end date is before the start date!");
        return;
    }
    if (daysUntil > 16) {
        alert("The given start date is too far away from today!");
        return;
    }
    console.log("::: Form Submitted :::");
    let resp;
    try {
        resp = await fetch("/api/makeTrip", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                locationText, countryCode, startDate, endDate, daysUntil,
            }),
        });
        if (!resp.ok) throw new Error(resp.statusText);
    } catch (err) {
        alert(await resp.text());
        return;
    }
    const data = await resp.json();
    const dateText = new Date(data.startDate).toDateString();
    locationP.innerHTML = `<b>Location:</b> ${data.city}, ${data.region}`;
    startDateP.innerHTML = `<b>Start date:</b> ${dateText}`;
    countdownP.innerHTML = `<b>Days left:</b> ${daysUntil} days`;
    lengthP.innerHTML = `<b>Trip length:</b> ${tripLength} days`;
    temperatureP.innerHTML = `<b>Temperature (High/Low):</b> ${data.highTemp}˚F, ${data.lowTemp}˚F`;
    weatherDescP.innerHTML = `<b>Weather:</b> ${data.weatherDesc}`;
    locationImg.src = data.imageURL;
}

export { handleSubmit as default };
