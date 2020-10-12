import express from "express";
import fetch from "node-fetch";
import { urlencoded, json } from "body-parser";
import cors from "cors";
import { config } from "dotenv";

const projectData = {};
const app = express();

// Middleware
// Here we are configuring express to use body-parser as middle-ware.
app.use(urlencoded({ extended: false }));
app.use(json());

// Cors for cross origin allowance
app.use(cors());

app.use(express.static("dist-client"));

console.log(__dirname);

config();
const geoNamesUser = process.env.GEONAMES_USER;
const weatherbitKey = process.env.WEATHERBIT_KEY;
const pixabayKey = process.env.PIXABAY_KEY;

// designates what port the app will listen to for incoming requests
if (!module.parent) {
    app.listen(8081, () => {
        console.log("Example app listening on port 8081!");
    });
}

app.get("/test", (req, res) => {
    res.send({ msg: "This is a test response" });
});

function getGeoNamesURL(data) {
    return "http://api.geonames.org/postalCodeSearchJSON?"
    + `placename=${data.locationText}&country=${data.countryCode}`
    + `&username=${geoNamesUser}&maxRows=1`;
}

function getWeatherbitURL() {
    return "http://api.weatherbit.io/v2.0/forecast/daily?"
    + `lat=${projectData.lat}&lon=${projectData.lng}&key=${weatherbitKey}`
    + `&units=I&days=${projectData.daysUntil + 1}`;
}

function getPixabayURL(useCity = true) {
    const cityQuery = useCity ? `${projectData.city}+` : "";
    return `https://pixabay.com/api/?key=${pixabayKey}&q=${cityQuery}${projectData.region}&image_type=photo`;
}

async function pixabyGetRequest(useCity = true) {
    console.log("Getting image results from Pixabay...");
    const pixabayResp = await fetch(getPixabayURL(useCity));
    console.log("Pixabay response received!\n");
    const pixabayData = await pixabayResp.json();
    if (pixabayData.total > 0) {
        projectData.imageURL = pixabayData.hits[0].webformatURL;
        return;
    }
    if (useCity) {
        console.log(`No image results found for ${projectData.city}, ${projectData.region}!\n`
      + `Broadening image search query to all of ${projectData.region}.`);
        await pixabyGetRequest(false);
    }
}

app.post("/api/makeTrip", async (req, res) => {
    try {
        ({
            startDate: projectData.startDate,
            endDate: projectData.endDate,
            daysUntil: projectData.daysUntil,
        } = req.body);
        console.log("Sending submission to GeoNames API...");
        const geoNamesResp = await fetch(getGeoNamesURL(req.body), {
            method: "POST",
        });
        console.log("GeoNames response received!\n");
        ({
            postalCodes: {
                0: {
                    placeName: projectData.city,
                    adminName1: projectData.region,
                    countryCode: projectData.countryCode,
                    lat: projectData.lat,
                    lng: projectData.lng,
                },
            },
        } = await geoNamesResp.json());
    } catch (err) {
        let msg;
        if (err.constructor === TypeError) {
            res.status(422);
            msg = "No location data found by GeoNames! Ensure all informations is correct!";
        } else {
            res.status(500);
            msg = err.message;
        }
        res.send(msg);
        return;
    }
    try {
        console.log("Getting weather data from Weatherbit...");
        const weatherbitResp = await fetch(getWeatherbitURL());
        console.log("Weatherbit response received!\n");
        ({
            data: {
                [projectData.daysUntil]: {
                    high_temp: projectData.highTemp,
                    low_temp: projectData.lowTemp,
                    weather: { description: projectData.weatherDesc },
                },
            },
        } = await weatherbitResp.json());
        await pixabyGetRequest();
        res.send(projectData);
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
});

export { app as default };
