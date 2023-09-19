import ContactUs from "../models/ContactUs.js";

// Get all contact messages
const getAllContactMessages = async (req, res) => {
	try {
		const contactMessages = await ContactUs.find();
		res.json(contactMessages);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Failed to get contact messages" });
	}
};

// Get a single contact message by ID
const getContactMessageById = async (req, res) => {
	try {
		const { id } = req.params;
		const contactMessage = await ContactUs.findById(id);

		if (!contactMessage) {
			return res.status(404).json({ error: "Contact message not found" });
		}

		res.json(contactMessage);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Failed to get contact message" });
	}
};

// Create a new contact message
const createContactMessage = async (req, res) => {
	try {
		const { name, email, subject, message } = req.body;
		const contactMessage = new ContactUs({ name, email, subject, message });
		const createdMessage = await contactMessage.save();
		res.status(201).json(createdMessage);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Failed to create contact message" });
	}
};

// Update an existing contact message
const updateContactMessage = async (req, res) => {
	try {
		const { id } = req.params;
		const { name, email, subject, message } = req.body;
		const updatedMessage = await ContactUs.findByIdAndUpdate(
			id,
			{ name, email, subject, message },
			{ new: true }
		);

		if (!updatedMessage) {
			return res.status(404).json({ error: "Contact message not found" });
		}

		res.json(updatedMessage);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Failed to update contact message" });
	}
};

// Delete a contact message
const deleteContactMessage = async (req, res) => {
	try {
		const { id } = req.params;
		const deletedMessage = await ContactUs.findByIdAndDelete(id);

		if (!deletedMessage) {
			return res.status(404).json({ error: "Contact message not found" });
		}

		res.json({ message: "Contact message deleted successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Failed to delete contact message" });
	}
};

export default {
	getAllContactMessages,
	getContactMessageById,
	createContactMessage,
	updateContactMessage,
	deleteContactMessage,
};
