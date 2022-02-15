
const express = require("express");
const mongoose = require("mongoose");
const { findById } = require("./models/products");
const Product = require("./models/products");
require("dotenv").config();
mongoose.connect(process.env.MONGO_URL,	{ useNewUrlParser: true, useUnifiedTopology: true },
	)
	.then(() => console.log("Connexion à MongoDB réussie !"))
	.catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();
app.use(express.json());
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content, Accept, Content-Type, Authorization",
	);
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, DELETE, PATCH, OPTIONS",
	);
	next();
});
// create product
app.post("/api/products", (req, res, next) => {
	const product = new Product({
		...req.body
	});
	product.save()
		.then((product) => res.status(201).json({ product }))
		.catch((error) => res.status(400).json({ error }));
});
// get product
app.get("/api/products/:id", (req, res, next) => {
	Product.findOne({ _id: req.params.id })
		.then((product) => res.status(200).json({product}))
		.catch((error) => res.status(404).json({ error }));
});
// modif product
app.put("/api/products/:id", (req, res, next) => {
	Product.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
		.then(() => res.status(200).json({ message: "Objet Modifié !" }))
		.catch((error) => res.status(400).json({ error }));
});
// delete product
app.delete("/api/products/:id", (req, res, next) => {
	Product.deleteOne({ _id: req.params.id })
		.then(() => res.status(200).json({ message: "Deleted !" }))
		.catch((error) => res.status(400).json({ error }));
});
// get products
app.get("/api/products", (req, res, next) => {
	Product.find()
		.then((products) => res.status(200).json({products}))
		.catch((error) => res.status(400).json({ error }));
});

// log express
app.use((req, res, next) => {
	console.log("Requête reçue !");
	next();
});
app.use((req, res, next) => {
	res.status(201);
	next();
});
app.use((req, res, next) => {
	res.json({ message: "Votre requête a bien été reçue !" });
	next();
});
app.use((req, res, next) => {
	console.log("Réponse envoyée avec succès !");
});
module.exports = app;
