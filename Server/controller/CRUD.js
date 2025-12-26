const { Product,User,Negotiate,Notification} = require('../models/database');
const bcrypt = require('bcrypt');

// Registration
async function postRegistration(req,res) {
    // console.log("post Registratiton");
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
        return res.status(200).json({msg:"Success",user})
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

async function sentNegotiationRequest(req, res) {
  try {
    const { buyerId, sellerId, productId, negotiatedprice } = req.body;

    // console.log("Sent Negotiation request", buyerId, sellerId, productId, negotiatedprice);

    if (!buyerId || !sellerId || !productId) {
      return res.status(400).json({ msg: "Missing buyerId, sellerId, or productId" });
    }

    if (buyerId === sellerId) {
      return res.status(401).json({ msg: "No negotiation possible with yourself" });
    }

    if (negotiatedprice == 0) {
      return res.status(402).json({ msg: "Invalid negotiation amount" });
    }

    // Use let because we may reassign it
    let negotiation = await Negotiate.findOne({ buyerId, sellerId, productId });

    if (!negotiation) {
      negotiation = await Negotiate.create({
        buyerId,
        sellerId,
        productId,
        offeredPrice: negotiatedprice,
        status: "pending",
      });
    } else {
      negotiation = await Negotiate.findByIdAndUpdate(
        negotiation._id,
        {
          $set: {
            offeredPrice: negotiatedprice,
            status: "pending",
          },
        },
        { new: true }
      );
    }

    // Notifications
    await handleNotification({
      sellerId,
      buyerId,
      negotiationId: negotiation._id,
      sentBy: "buyer",
      status: "sent",
    });

    return res.status(200).json({
      msg: "The negotiation initiative has been taken",
      negotiation,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ err: "Server error", error });
  }
}



async function recievedNegotiationRequest(req,res){ // Server will send this negotiation info to seller
    try{
        const {sellerId} = req.query;
        // console.log("recievde negociation ",sellerId);
         if (!sellerId) return res.status(400).json({ msg: "Seller ID is required" });
         
        const negotiations = await Negotiate.find({ sellerId, status: "pending" })
        .populate("buyerId", "name")
        .populate("productId", "productName pricePerKg");

        if (negotiations.length === 0)   return res.status(404).json({ msg: "No negotiation requests found" });
        return res.status(200).json(negotiations)
    }catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server error", error });
  }
    
}

async function sentNegotiationResponse(req,res) {
    try{
        const {sellerId,buyerId,status,reoffer,productId}  = req.body

        // console.log(" Sent nego response",sellerId,buyerId,status,reoffer,productId)

        if (!sellerId || !buyerId || !productId)  return res.status(400).json({ msg: "Missing sellerId, buyerId, or productId" });
        
        const negotiation = await Negotiate.findOne({ sellerId, buyerId, productId });
        if (!negotiation) return res.status(404).json({ msg: "Negotiation not found" });


        if(status === 'rejected') negotiation.status = 'rejected';
        
        else if( status === 'pending' && Number(reoffer) > 0){
            negotiation.status= 'pending',
            negotiation.reoffer= reoffer
            negotiation.finalPrice = reoffer;                   
        }                  
        else if( status === 'accepted'){
            negotiation.status='accepted',
            negotiation.finalPrice=negotiation.offeredPrice                
        }
        else return res.status(400).json({msg:"Negotiation Failed"})
        await negotiation.save()
        await handleNotification({
            sellerId,
            buyerId,
            negotiationId:negotiation._id,
            sentBy: 'seller',
            status: 'sent'
        });
        return res.status(200).json({ msg: "Negotiation updated", negotiation });  
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Server error", error });
  }
}

async function recievedNegotiationResponse(req,res){
    try{
        const { buyerId } = req.query;
        console.log("Nego to buyer",buyerId);
        if (!buyerId) return res.status(400).json({ msg: "Buyer ID required" });
        
        const products = await Negotiate.find({buyerId})
        .populate("sellerId","name")
        .populate("productId","productName pricePerKg")

        if(products.length === 0) return res.status(400).json({msg:"Negotiation error"})
            return res.status(200).json(products)
    }catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Server error", error });
    } 
}

// Create notification (called internally, no req/res here)
async function handleNotification({ sellerId, buyerId, negotiationId, sentBy, status }) {
  try {
    if (!sellerId || !buyerId || !negotiationId || !sentBy) {
      console.log("Missing fields for notification");
      return null;
    }

    const data = await Notification.create({
      sellerId,
      buyerId,
      negotiationId,
      sentBy,
      status: status || "sent",
      updatedAt: Date.now(),
    });

    return data;
  } catch (error) {
    console.error("Notification error:", error);
    return null;
  }
}

// Fetch / update notifications
async function captureNotifications(req, res) {
  const { id, sentBy } = req.body;

  try {
    if (!id || !sentBy) {
      return res.status(400).json({ msg: "Missing fields" });
    }

    const filter = sentBy === "seller"
      ? { sellerId: id }
      : { buyerId: id };

    const data = await Notification.find(filter)
      .populate("negotiationId", "status offeredPrice reoffer")
      .populate("sellerId", "name")
      .populate("buyerId", "name")
      .sort({ updatedAt: -1 });

    if (!data || data.length === 0) {
      return res.status(404).json({ msg: "No notifications found" });
    }

    // Mark notifications as received
    await Notification.updateMany(filter, { status: "received" });

    return res.status(200).json(data);

  } catch (error) {
    console.error("Error capturing notifications:", error);
    return res.status(500).json({ msg: "Server error" });
  }
}

// POST /api/auth/getproduct
async function handleAcceptedOffers(req, res) {
  const { buyerId } = req.body;

  if (!buyerId) {
    return res.status(400).json({ msg: "Missing Buyer Id" });
  }

  try {
    const accepted = await Negotiate.find({
      buyerId,
      status: "accepted"
    })
      .populate("productId")   // <- IMPORTANT
      .populate("sellerId", "name");

    return res.status(200).json(accepted);
  } catch (error) {
    console.error("Accepted fetch error:", error);
    return res.status(500).json({ msg: "Server error" });
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
    handleLogin,showProduct,sentNegotiationRequest,recievedNegotiationRequest,sentNegotiationResponse,recievedNegotiationResponse,handleNotification,captureNotifications,handleAcceptedOffers
}