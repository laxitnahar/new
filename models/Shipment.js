import mongoose from "mongoose";

const shipmentSchema = new mongoose.Schema({
  order_id: { type: String, required: true },
  shipment_order_id: { type: String, required: true },
  order_date: { type: Date, required: true },
  billing_customer_name: { type: String, required: true },
  billing_address: { type: String, required: true },
  billing_pincode: { type: String, required: true },
  billing_state: { type: String, required: true },
  billing_country: { type: String, required: true },
  billing_phone: { type: String, required: true },
  billing_last_name: { type: String, required: true },
  shipping_is_billing: { type: Boolean, required: true },
  order_status: {
    type: String,
    enum: [
      "Pending",
      "Success",
      "In Transit",
      "Out for Delivery",
      "Failed",
      "Cancel",
      "Completed",
    ],
    default: "In Transit",
  },
  order_items: [
    {
      name: { type: String, required: true },
      sku: { type: String, required: true },
      units: { type: Number, required: true },
      selling_price: { type: Number, required: true },
    },
  ],
  payment_method: { type: String, required: true },
  sub_total: { type: Number, required: true },
  length: { type: Number, required: true },
  breadth: { type: Number, required: true },
  height: { type: Number, required: true },
  weight: { type: Number, required: true },
  shipRocket_data: {
    order_id: { type: String },
    shipment_id: { type: String },
    status: { type: String },
    status_code: { type: Number },
    onboarding_completed_now: { type: Number },
    awb_code: { type: String },
    courier_company_id: { type: String },
    courier_name: { type: String },
  },
});

const Shipment = mongoose.model("Shipment", shipmentSchema);

export default Shipment;
