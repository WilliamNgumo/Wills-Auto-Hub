const { error } = require("console");
const express = require("express");
const path = require("path");
const { json } = require("stream/consumers");

const app = express();

app.use("/static", express.static(path.resolve(__dirname, "frontend", "static")));

app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "index.html"));
});

app.listen(process.env.PORT ||3000, () => console.log("server running..."));


//(NOTE FOR VIEWERS) This is for the search Api function using car quiryAPI and for image im using unsplash to get images for the cars  

function searchcar() {
    let query = document.getElementById('searchInput').ariaValueMax.trim();
    if (!query) {
        alert("enter car make and model");
        return;
    }
    fetch(`https://www.carqueryapi.com/api/0.3/?callback=?&cmd=getTrims&make=${query}&model=${query}`)
    .then(response => response.text())
    .then(data => {
        data = JSON.parse(data.replace("/**/","").slice(1, -1));
        let output = document.getElementById('output');
        if (data.Trims.length === 0) {
            output.innerHTML = "<p>Details not found.</p>";
            return;
        }
        let car = data.trim[0];
        let imageUrl = `https://source.unsplash.com/400x300/?${car.make_display} ${car.model_name},car`;

        output.innerHTML = `
                        <p><strong>Make:</strong> ${car.make_display}</p>
                        <p><strong>Model:</strong> ${car.model_name}</p>
                        <p><strong>Year:</strong> ${car.model_year}</p>
                        <p><strong>Body Type:</strong> ${car.model_body}</p>
                        <p><strong>Engine Type:</strong> ${car.model_engine_type}</p>
                        <p><strong>Horsepower:</strong> ${car.model_engine_power_ps} PS</p>
                        <button onclick="saveCar('${car.make_display}', '${car.model_name}')">Save Car</button>
                        <img src="${imageUrl}" alt="${car.make_display} ${car.model_name}" />
                    `;
    })
    .catch(error => console.error('Error fetching car details:', error));
}