const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const port = 3000;
const app = express();

//To scrape data on pokemon website
const URL = "https://pokemondb.net/pokedex/national";
const data = [];

axios(URL).then((response) => {
    const htmlParser = response.data;
    const $ = cheerio.load(htmlParser);

    $(".infocard", htmlParser).each(async function() {
        const image = $(this).find(".img-sprite").attr("src"); // use class name
        const name = $(this).find(".ent-name").text();

        data.push({image, name});

        // Download and save the image
        if (image) {
            // Create the 'images' directory if it doesn't exist
            const imagesDirectory = path.join(__dirname, 'images');
            if (!fs.existsSync(imagesDirectory)) {
                fs.mkdirSync(imagesDirectory);
            }
            const imageName = name.toLowerCase().replace(/\s+/g, '_') + path.extname(image);
            const imagePath = path.join(__dirname, 'images', imageName);
            const imageResponse = await axios.get(image, { responseType: 'stream' }); // Make an HTTP GET request to the image's URL with the responseType option set to 'stream.' 
            const writer = fs.createWriteStream(imagePath); // Create a writable stream using the fs module
            
            imageResponse.data.pipe(writer); // Pipe(transfer) the data stream from the Axios response (imageResponse.data) to the writer stream (writer). 

            writer.on('finish', () => {
                console.log("Image saved successfully!");
            });
        }
    });

}).catch((error) => console.log(error));

app.listen(port, console.log("Server running!"));