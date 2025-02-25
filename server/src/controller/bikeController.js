const Bike = require('../models/Bike');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');


exports.getAllBikes = catchAsync(async (req, res, next) => {
    const bikes = await Bike.find();
    res.status(200).json({ success: true, data: bikes });
});


exports.getBikeById = catchAsync(async (req, res, next) => {
    const bike = await Bike.findById(req.params.id);
    if (!bike) {
        return next(new AppError('Bike not found', 404));
    }
    res.status(200).json({ success: true, data: bike });
});


exports.addBike = catchAsync(async (req, res, next) => {
    const { bikeId, latitude, longitude } = req.body;

    if (!bikeId || latitude === undefined || longitude === undefined) {
        return next(new AppError('Missing required bike data', 400));
    }

    const newBike = await Bike.create({
        bikeId,
        status: 'available',
        currentLocation: {
            type: 'Point',
            coordinates: [longitude, latitude],
        },
    });

    res.status(201).json({ success: true, data: newBike });
});


exports.deleteBike = catchAsync(async (req, res, next) => {
    const bike = await Bike.findByIdAndDelete(req.params.id);
    if (!bike) {
        return next(new AppError('Bike not found', 404));
    }

    res.status(200).json({ success: true, message: 'Bike deleted' });
});


exports.updateBikeLocation = catchAsync(async (req, res, next) => {
    const { bikeId, latitude, longitude } = req.body;

    if (!bikeId || latitude === undefined || longitude === undefined) {
        return next(new AppError('Missing required data', 400));
    }

    const updatedBike = await Bike.findByIdAndUpdate(
        bikeId,
        {
            currentLocation: {
                type: 'Point',
                coordinates: [longitude, latitude],
            },
        },
        { new: true, runValidators: true }
    );

    if (!updatedBike) {
        return next(new AppError('Bike not found', 404));
    }

    //real-time update to all connected bikes
    const io = req.app.get('socketio');
    io.emit('bikeLocationUpdated', {
        bikeId,
        latitude,
        longitude,
    });

    res.status(200).json({ success: true, message: 'Location updated successfully', data: updatedBike });
});
