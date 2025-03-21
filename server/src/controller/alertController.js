const Alert = require("../models/Alert");
const catchAsync = require("../utils/catchAsync");

//Get all alerts (For Admins & SuperAdmins)
exports.getAllAlerts = catchAsync(async (req, res) => {
    if (req.user.role !== "Admin" && req.user.role !== "SuperAdmin") {
        return res.status(403).json({ 
            success: false, 
            message: "Unauthorized" 
        });
    }

    const alerts = await Alert.find().populate("user bike", "name email bikeId");
    res.status(200).json({ 
        success: true, 
        count: alerts.length, 
        data: alerts 
    });
});

//Get alerts for a specific user
exports.getUserAlerts = catchAsync(async (req, res) => {
    const userId = req.user._id;
    const alerts = await Alert.find({ user: userId }).sort({ timestamp: -1 });

    res.status(200).json({ 
        success: true, 
        count: alerts.length, 
        data: alerts 
    });
});
