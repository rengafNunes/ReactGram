const mongoose = require("mongoose")
const {Schema} = mongoose;

const photoSchema = new Schema({
    image: String,
    titile: String,
    likes: Array,
    coments: Array,
    userId: mongoose.ObjectId,
    userName: String,
}, 
{
    timestamps: true,
}
);

const Photo = mongoose.model("Photo", photoSchema);

module.exports = Photo;