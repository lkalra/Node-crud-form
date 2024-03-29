const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const slugify = require("slugify");


const app = express();
const PORT = process.env.PORT || 8000;
main().catch((err) => console.log(err));

app.use(cors());
app.use(bodyParser.json());

async function main() {
    try {
      await mongoose.connect(
        "mongodb+srv://admin:admin@cluster0.6hn7fqs.mongodb.net/form"
      );
    } catch (err) {
      console.log(err);
    }
    console.log("database connected");
}

const formDataSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },

    Address: {
        type: String,
        required: true,
    },
    empID: String
});
  
const FormData = mongoose.model("FormData", formDataSchema);

//Create
app.post("/api/form", async (req, res) => {
    const { name, email, phone, Address, empID } = req.body;
  
    const newFormData = new FormData({
      name,
      email,
      phone,
      Address,
      empID
    });
    console.log(newFormData);
    let result = await newFormData.save().catch((err) => console.log(err));
    if (result) {
      res.status(201).send("Data saved successfully");
      console.log(result);
    } else {
      res.status(500)
    }
  });

//Read
app.get("/api/form", async (req, res) => {
    try {
      let result = await FormData.find().catch((err) => console.log(err));
      if (result) {
        res.status(200).send({ data: result, msg: "Fetched data" });
      }
    } catch (err) {
      res.status(500).send("Something went wrong");
    }
});

//Read by id
app.get("/api/form/:slug", async (req, res) => {
    try {
      const category = await FormData.findOne({ slug: req.params.slug });
      res.status(200).send({
        success: true,
        message: "Get SIngle Id SUccessfully",
        category,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error While getting Single Id",
      });
    }
});

//update user
app.put("/api/update/:slug", async (req, res) => {
    try {
      const { name, email, address, phone,empID } = req.body;
      const user = await FormData.findById(req.params.slug);
      const updatedUser = await FormData.findByIdAndUpdate(
        req.params.slug,
        {
          name: name || user.name,
          email: email || user.email,
          phone: phone || user.phone,
          address: address || user.Address,
          empID: empID || user.empID,
        },
        { new: true }
      );
      res.status(200).send({
        success: true,
        message: "User Updated SUccessfully",
        updatedUser,
      });
    } catch (error) {
      console.log(error);
      res.status(400).send({
        success: false,
        message: "Error WHile Update profile",
        error,
      });
    }
  });

//Delete
app.delete("/api/delete/:slug", async (req, res) => {
    try {
      await FormData.findByIdAndDelete(req.params.slug);
      res.status(200).send({
        success: true,
        message: "Product Deleted successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error while deleting product",
        error,
      });
    }
});


app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`);
});
