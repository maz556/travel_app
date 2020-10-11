# Travel App Project

## Overview
An asynchronous web app that accepts form input which is sent to a GeoNames API, which sends it's data to a Weatherbit and Pixabay APIs. This project utilizes Webpack, Express, Node, Sass, and Workbox.

## Extending the Project
Apart from the minimum requirements, this project also:
 - Allows the user to submit an end date and displays the duration of the planned trip
 - Broadens the search term of the Pixabay request from the destination city to the destination region/territory

## How to Run
 1. Create a .env file in the root folder with variables "GEONAMES_USER", "WEATHERBIT_KEY", and "PIXABAY_KEY"
 2. `npm i --production`
 3. `npm run build-prod`
 3. `npm start`
 4. Go to http://localhost:8081