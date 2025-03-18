// const { error } = require("console");
const express = require("express");
const path = require("path");
const { json, text } = require("stream/consumers");
const mongoose = require("mongoose")
const cors = require('cors'); 

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/carDealership")
.then(() => console.log("Connected to MongoDB"))
.catch(error => console.error("MongoDB connection error:", error));


const carSchema = new mongoose.Schema({
    make: String,
    model: String,
});
const Car = mongoose.model("Car", carSchema);

app.use("/static", express.static(path.resolve(__dirname, "frontend", "static")));

app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "index.html"));
});



app.get('/api/getSavedCars', async (req, res) => {
    try {
        const cars = await Car.find();  
        if (!cars || cars.length === 0) {
            return res.status(404).json({ error: "No cars found" });
        }
        res.json(cars);  
    } catch (error) {
        console.error("Error fetching saved cars:", error);
        res.status(500).json({ error: "Failed to fetch saved cars" });
    }
});


app.post('/api/saveCar', async (req, res) => {
    try {
        const { make, model } = req.body;  
        const car = new Car({ make, model });
        await car.save();
        res.status(200).json({ message: 'Car saved successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save car' });
    }
});

app.delete('/api/deleteCar/:id', async (req, res) => {
    try {
        const carId = req.params.id;
        const result = await Car.findByIdAndDelete(carId);
        if (!result) {
            return res.status(404).json({ message: 'Car not found' });
        }
        res.status(200).json({ message: 'Car deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete car' });
    }
});

app.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));


//(NOTE FOR VIEWERS) This is for the search Api function using car quiryAPI and for image im using unsplash to get images for the cars  

