const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  number: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  role: { type: String, enum: ['buyer', 'seller'], required: true },
}, {
  timestamps: true
});

const productSchema = new mongoose.Schema({
    categoryName: { type: String, required: true },             // Product category
    productName: { type: String, required: true },              // Name of the product
    seedName:{type:String,required:true},
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to seller
    quantity: { type: Number, required: true },                 // Quantity available
    dateofHarvest: { type: String},                // Date of harvest
    dateofExpiry: { type: String},                // Date of expiry
    pricePerKg: { type: Number, required: true },               // Price per kilogram
    address: { type: String, required: true },                  // Address of the seller
    description:{type:String},
    photo: { type: String},                    // URL or path to the product photo                  
  }, {
    timestamps: true
});

// const transportSchema = new mongoose.Schema({
//     transportAvailability: { type: Boolean, required: true }, // Availability status
//     vehicleNo: { type: String, required: true, unique: true }, // Unique vehicle number
//     driverLicenceNo: { type: String, required: true, unique: true }, // Unique driver license number
//     productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Reference to product
//     sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to seller
//     buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to buyer
//     transportFee: { type: Number, required: true }, // Fee for the transport service
//   }, {
//     timestamps: true // Automatically includes `createdAt` and `updatedAt` fields
// });

// const historySchema = new mongoose.Schema({
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Refers to either a buyer or seller
//     operationType: { type: String, enum: ['buy', 'sell'], required: true }, // Defines the type of operation
//     productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Refers to the product
//     quantity: { type: Number, required: true }, // Quantity of product involved in the operation
//     price: { type: Number, required: true }, // Price of the transaction
//     timestamp: { type: Date, default: Date.now }, // Logs the time of operation
//   });
  

// const paymentSchema = new mongoose.Schema({
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Refers to the user making the payment
//     transportId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transport', required: true }, // Refers to the transport service
//     amountPaid: { type: Number, required: true }, // Total amount paid
//     transportFee: { type: Number, required: true }, // Fee for transport
//     returnStatus: { type: Boolean, default: false }, // Indicates if the payment has been refunded
//     timeOfPayment: { type: String, required: true }, // Time of the payment (e.g., "12:34 PM")
//     dateOfPayment: { type: Date, default: Date.now, required: true }, // Date of the payment
//     methodOfPayment: { 
//       type: String, 
//       enum: ['online', 'cash'], 
//       required: true 
//     }, // Payment method: online or cash
//   }, {
//     timestamps: true // Includes `createdAt` and `updatedAt` fields automatically
// });
  


const User = mongoose.model('User',userSchema);
const Product = mongoose.model('Product',productSchema);
// const Transport = mongoose.model('Transport',transportSchema);
// const History = mongoose.model('History', historySchema);
// const Payment = mongoose.model('Payment', paymentSchema);


module.exports = {
    User,
    Product,
    // Transport,
    // History,Payment,
}