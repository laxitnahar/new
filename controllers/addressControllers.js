import Address from "../models/Address.js";
import User from "../models/User.js";

// Create a new address
const addAddress = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Check if the user exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const {
      firstName,
      middleName,
      lastName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      isDefault,
    } = req.body;

    // Add validation checks here, for example:
    if (
      !firstName ||
      !lastName ||
      !phone ||
      !addressLine1 ||
      !city ||
      !state ||
      !postalCode ||
      !country
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create a new address
    const newAddress = new Address({
      user: userId,
      firstName,
      middleName,
      lastName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      isDefault,
    });

    // Save the address
    await newAddress.save();

    res
      .status(201)
      .json({ message: "Address created successfully", address: newAddress });
  } catch (error) {
    console.error("Error creating address:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all addresses of a user
const findUserAddresses = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Check if the user exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find addresses associated with the user
    const addresses = await Address.find({ user: userId });

    if (!addresses || addresses.length === 0) {
      return res
        .status(404)
        .json({ message: "No addresses found for the user" });
    }

    res.status(200).json({ addresses });
  } catch (error) {
    console.error("Error fetching user addresses:", error);

    if (error.name === "CastError") {
      // Handle invalid user ID format
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    res
      .status(500)
      .json({ message: "An error occurred while fetching user addresses" });
  }
};

// Get a specific address
const findAddressById = async (req, res) => {
  try {
    const addressId = req.params.addressId;
    const userId = req.user.userId;

    // Check if the user exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const address = await Address.findOne({ _id: addressId, user: userId });

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.status(200).json({ address });
  } catch (error) {
    console.error("Error fetching address:", error);

    if (error.name === "CastError") {
      // Handle invalid address ID format
      return res.status(400).json({ message: "Invalid address ID format" });
    }

    res
      .status(500)
      .json({ message: "An error occurred while fetching address" });
  }
};

// Update an address
const updateAddress = async (req, res) => {
  try {
    const addressId = req.params.id;
    const userId = req.user.userId;
    const {
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      isDefault,
    } = req.body;

    // Check if the user exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedFields = {
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      isDefault,
    };

    const address = await Address.findOneAndUpdate(
      { _id: addressId, user: userId },
      { $set: updatedFields },
      { new: true }
    );

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.status(200).json({ message: "Address updated successfully", address });
  } catch (error) {
    console.error("Error updating address:", error);

    if (error.name === "CastError") {
      // Handle invalid address ID format
      return res.status(400).json({ message: "Invalid address ID format" });
    }

    res
      .status(500)
      .json({ message: "An error occurred while updating address" });
  }
};

// Delete an address
const deleteAddress = async (req, res) => {
  try {
    const addressId = req.params.addressId;
    const userId = req.user.userId;

    // Check if the user exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log(addressId,"addressId")
    const deletedAddress = await Address.findOneAndDelete({
      _id: addressId,
    });

    if (!deletedAddress) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error("Error deleting address:", error);

    if (error.name === "CastError") {
      // Handle invalid address ID format
      return res.status(400).json({ message: "Invalid address ID format" });
    }

    res
      .status(500)
      .json({ message: "An error occurred while deleting address" });
  }
};

export default {
  addAddress,
  findUserAddresses,
  findAddressById,
  updateAddress,
  deleteAddress,
};
