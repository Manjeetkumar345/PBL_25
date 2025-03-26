const { Product,Transport,User,Payment,History} = require('../models/database');
const bcrypt = require('bcrypt');

// Registration
async function postRegistration(req,res) {
    console.log("post Registratiton");
    try{
        const newBody = req.body;
        if(!newBody.name|| !newBody.email  || !newBody.number || !newBody.address || !newBody.role){
            return res.status(404).json({msg:"All feilds are required"});
        }

        const hashedPassword = await bcrypt.hash(newBody.password, 10);

        const user = await User.create({
            name : newBody.name,
            email : newBody.email,
            password: hashedPassword,
            number:newBody.number,
            role : newBody.role,
            address: newBody.address,
        })
        console.log(user);
        return res.status(200).json({msg:"Success"})
    }catch(error){
        if (error.code === 11000) { // Duplicate key error
            return res.status(400).json({ msg: "Email or phone number already exists" });
          }
        console.error("Error in handlePostID:", error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
}
 /// Login

async function handleLogin(req, res) {
    try {
        const { name, password } = req.body;
        // Validate input fields
        if (!name ) {
            return res.status(404).json({ msg: "All fields are required" });
        }
         const user = await User.findOne({ name: name }); // Assuming 'nameat' corresponds to 'name'
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ msg: "Invalid password" });
        }
        // Respond with success
        return res.status(200).json({ msg: "Login Successful" ,role:user.role,_id:user._id});
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
}
 // Sell Product

async function postSellProduct(req, res) {
    try {
        const newBody = req.body;
        console.log(newBody);
        // Check if all required fields are provided
        if (!newBody.category || !newBody.name || !newBody.seller_id || 
            !newBody.quantity || !newBody.price || !newBody.address) {
            return res.status(400).json({ msg: "All fields are required" });
        }

        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({ msg: "Product image is required" });
        }

        // Create a new Product record
        await Product.create({
            categoryName: newBody.category,
            productName: newBody.name,
            seedName:newBody.seedname,
            sellerId: newBody.seller_id,
            quantity: newBody.quantity,
            dateofHarvest: newBody.harvest,
            dateofExpiry: newBody.expiry,
            pricePerKg: newBody.price,
            address: newBody.address,
            photo: req.file.path, // Store the path to the uploaded file
        });

        return res.status(201).json({ 
            msg: "Product record created successfully",
            imagePath: req.file.path 
        });
    } catch (error) {
        console.error("Error in postProduct:", error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
}


async function getProduct(req, res) {
    try {
        const { categoryName, productName } = req.query;

        console.log("Crud1",categoryName,productName);
        
        
        if (!categoryName || !productName) {
            return res.status(400).json({ message: "Category and productName are required" });
        }

        
        // Filter by productName
        const result = await Product.find({ 
        categoryName: { $regex: new RegExp(categoryName, 'i') },
        productName: { $regex: new RegExp(productName, 'i') }
        });
        console.log("Crud.js",result)
        if (result.length === 0) {
            return res.status(404).json({ message: "No products found matching the criteria" });
        }
        
        return res.json(result);
    } catch (error) {
        console.error("Error in getProduct:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

// Modified showProduct function to find by sellerId
async function showProduct(req, res) {
    try {
        const { seller_id } = req.query; // Get seller_id from query params
        
        if (!seller_id) return res.status(400).json({ msg: "Seller ID parameter is required" });

        // Find all products with matching sellerId
        const products = await Product.find({ sellerId: seller_id })
          .populate('sellerId') // Populate seller details if needed
          .exec();

        if (!products || products.length === 0) {
            return res.status(404).json({ msg: "No products found for this seller" });
        }
    
        return res.status(200).json(products); 
    } catch(error) {
        console.error("Error In Getting Products:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
// async function postTransport(req, res) {
//     try {
//         const newBody = req.body;
//         // Check if all required fields are provided
//         if (!newBody.transportAvailability || !newBody.vehicleNo || !newBody.driverLicenceNo || !newBody.productId || !newBody.sellerId || !newBody.buyerId || !newBody.transportFee) {
//             return res.status(404).json({ msg: "All fields are required" });
//         }

//         // Create a new Transport record
//         await Transport.create({
//             transportAvailability: newBody.transportAvailability,
//             vehicleNo: newBody.vehicleNo,
//             driverLicenceNo: newBody.driverLicenceNo,
//             productId: newBody.productId,
//             sellerId: newBody.sellerId,
//             buyerId: newBody.buyerId,
//             transportFee: newBody.transportFee,
//         });

//         return res.status(201).json({ msg: "Transport record created successfully" });
//     } catch (error) {
//         console.error("Error in postTransport:", error);
//         return res.status(500).json({ msg: "Internal Server Error" });
//     }
// }


// async function postHistory(req, res) {
//     try {
//         const newBody = req.body;
//         // Check if all required fields are provided
//         if (!newBody.operation || !newBody.quantity || !newBody.price || !newBody.productId) {
//             return res.status(404).json({ msg: "All fields are required" });
//         }

//         // Create a new History record
//         await History.create({
//             operation: newBody.operation,
//             quantity: newBody.quantity,
//             price: newBody.price,
//             productId: newBody.productId,
//         });

//         return res.status(201).json({ msg: "History record created successfully" });
//     } catch (error) {
//         console.error("Error in postHistory:", error);
//         return res.status(500).json({ msg: "Internal Server Error" });
//     }
// }

// async function postPayment(req, res) {
//     try {
//         const newBody = req.body;
//         // Check if all required fields are provided
//         if (!newBody.userId || !newBody.transportId || !newBody.amountPaid || !newBody.transportFee || !newBody.returnStatus || !newBody.timeOfPayment || !newBody.dateOfPayment || !newBody.methodOfPayment) {
//             return res.status(404).json({ msg: "All fields are required" });
//         }

//         // Create a new Payment record
//         await Payment.create({
//             userId: newBody.userId,
//             transportId: newBody.transportId,
//             amountPaid: newBody.amountPaid,
//             transportFee: newBody.transportFee,
//             returnStatus: newBody.returnStatus,
//             timeOfPayment: newBody.timeOfPayment,
//             dateOfPayment: newBody.dateOfPayment,
//             methodOfPayment: newBody.methodOfPayment,
//         });

//         return res.status(201).json({ msg: "Payment record created successfully" });
//     } catch (error) {
//         console.error("Error in postPayment:", error);
//         return res.status(500).json({ msg: "Internal Server Error" });
//     }
// }


// Get request 

async function getUser(req, res) {
    try {
        const result = await User.findById(req.params.id);
        if (result.length === 0) {
            return res.status(404).json({ message: "No users found in the database" });
        }
        return res.json(result);
    } catch (error) {
        console.error("Error in getAllUsers:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

async function getTransport(req, res) {
    try {
        const result = await Transport.findById(req.params.id);
        if (result.length === 0) {
            return res.status(404).json({ message: "No transport records found in the database" });
        }
        return res.json(result);
    } catch (error) {
        console.error("Error in getAllTransport:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

async function getHistory(req, res) {
    try {
        const result = await History.findById(req.params.id); // By id
        if (result.length === 0) {
            return res.status(404).json({ message: "No history records found in the database" });
        }
        return res.json(result);
    } catch (error) {
        console.error("Error in getAllHistory:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

async function getPayment(req, res) {
    try {
        const result = await Payment.findById(req.params.id); // By id
        if (result.length === 0) {
            return res.status(404).json({ message: "No payments found in the database" });
        }
        return res.json(result);
    } catch (error) {
        console.error("Error in getAllPayments:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}




module.exports = {
    postRegistration,postSellProduct,
    // postTransport,postHistory,postPayment,
    getUser,getProduct,getTransport,getHistory,getPayment,
    handleLogin,showProduct,

}