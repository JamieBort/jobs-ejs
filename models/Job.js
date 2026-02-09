// ./models/Job.js
// Mongoose schema and model for jobs, including fields like company, position, status, and createdBy.

const mongoose = require("mongoose"); // Imports Mongoose library to define schemas and interact with MongoDB

// Defines the schema for job documents (It defines the shape of the collection in MondgoDB.)
const JobSchema = new mongoose.Schema(
	{
		company: {
			type: String, // Field type is a string
			required: [true, "Please provide company name"], // Ensures company is provided when creating a job
			maxlength: 50, // Limits company name to 50 characters
		},
		position: {
			type: String, // Field type is a string
			required: [true, "Please provide position"], // Ensures position is provided when creating a job
			maxlength: 100, // Limits position name to 100 characters
		},
		status: {
			type: String, // Field type is a string
			enum: ["interview", "declined", "pending"], // Restricts values to specific options
			default: "pending", // Sets default status to "pending" if none is provided
		},
		createdBy: {
			type: mongoose.Types.ObjectId, // Stores a reference to a User document
			ref: "User", // Specifies the referenced model for population
			required: [true, "Please provide user"], // Ensures each job is associated with a user
		},
	},
	{ timestamps: true }, // Automatically adds createdAt and updatedAt fields to the schema
);

module.exports = mongoose.model("Job", JobSchema); // Creates and exports the Job model for database operations
