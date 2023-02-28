
const mongoose = require("mongoose");
const cities = require("./cities")
const { places, descriptors } = require("./seedHelper")
const Campground = require("../models/campground")

mongoose.set("strictQuery", true);

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true,
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () =>{
    console.log("Database connected!")
})

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const randomCity = Math.floor(Math.random() * 1000);
        const randomPrice = Math.floor(Math.random() * 69) + 420;
        const campground = new Campground ({
            author: '63fcfc93b590db2f5ed094a1',
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[randomCity].city}, ${cities[randomCity].state}`,
            price: randomPrice,
            images: [
                {
                    url: 'https://res.cloudinary.com/dctljv6wq/image/upload/v1677602744/YelpCamp/hvuihmfqouxjhhqab91o.jpg',
                    filename: 'YelpCamp/hvuihmfqouxjhhqab91o'
                }
            ],
            description: "Is Camp!"
        });
        await campground.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});