const mongoose = require("mongoose");

async function connect() {
  await mongoose.connect(
    "mongodb+srv://varshadeogaria:JDghEs7mtIHfmXLe@cluster0.8hnod.mongodb.net/coursera-app"
  );
}

connect();
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true, // Automatically converts to lowercase
    trim: true, // Removes whitespace
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // Ensures the password is at least 6 characters long
  },
  firstname: {
    type: String,
    required: true,
    trim: true, // Trims the space from both ends
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
  },
});

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    minlength: 10, // Ensures the description is at least 10 characters
  },
  price: {
    type: Number,
    required: true,
    min: 0, // Ensures price is a positive value
  },
  imageUrl: {
    type: String,
    required: true,
    match: /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i, // Validates image URL
  },
  creator_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin", // Reference to the creator (which is a User)
    required: true,
  },
});

const courseModel = mongoose.model("Courses", courseSchema);
module.exports = courseModel;

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  firstname: {
    type: String,
    required: true,
    trim: true,
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
  },
});

const adminModel = mongoose.model("Admin", adminSchema);
module.exports = adminModel;

const purchasesSchema = new mongoose.Schema({
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course", // Reference to the Course model
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course", // Reference to the Course model
    required: true,
  },
});

const purchasesModel = mongoose.model("Purchases", purchasesSchema);
module.exports = purchasesModel;
