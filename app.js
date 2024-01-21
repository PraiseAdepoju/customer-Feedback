const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const PORT = 4000;

mongoose.connect("mongodb://localhost:27017/feedback-db");

app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

const feedbackSchema = new mongoose.Schema({
	name: String,
	email: String,
	rating: { type: Number, min: 1, max: 5 },
	feedback: String,
	createdAt: { type: Date, default: Date.now },
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

app.get("/", (req, res) => {
	// Read the HTML file and send it as a response
	const indexPath = `${__dirname}/public/index.html`;
	fs.readFile(indexPath, "utf8", (err, data) => {
		if (err) {
			console.error(err);
			res.status(500).send("Internal Server Error");
		} else {
			res.send(data);
		}
	});
});

app.post("/submit-feedback", async (req, res) => {
	try {
		const { name, email, feedback, rating } = req.body;
		console.log(req.body);

		// Validate input (you can add more validation if needed)

		// Create a new feedback entry
		const newFeedback = new Feedback({
			name,
			email,
			feedback,
			rating,
		});

		// Save the feedback to the database
		await newFeedback.save();
		res.json({ success: true });
	} catch (error) {
		console.error(error);
		res.status(500).send("Internal Server Error");
	}
});

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
