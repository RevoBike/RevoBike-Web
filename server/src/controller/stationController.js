const Station = require('../models/Station');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');


exports.getAllStations = catchAsync(async (req, res, next) => {
    const stations = await Station.find().populate('available_bikes');
    res.status(200).json({ success: true, data: stations });
});


exports.getStationById = catchAsync(async (req, res, next) => {
    const station = await Station.findById(req.params.id).populate('available_bikes');

    if (!station) {
        return next(new AppError('Station not found', 404));
    }

    res.status(200).json({ success: true, data: station });
});


exports.addStation = catchAsync(async (req, res, next) => {
    const { name, location, totalSlots } = req.body;

    const station = await Station.create({ name, location, totalSlots });

    res.status(201).json({ success: true, data: station });
});


exports.updateStation = catchAsync(async (req, res, next) => {
    const { name, location, totalSlots } = req.body;

    const updatedStation = await Station.findByIdAndUpdate(
        req.params.id,
        { name, location, totalSlots },
        { new: true, runValidators: true }
    );

    if (!updatedStation) {
        return next(new AppError('Station not found', 404));
    }

    res.status(200).json({ success: true, data: updatedStation });
});


exports.deleteStation = catchAsync(async (req, res, next) => {
    const station = await Station.findByIdAndDelete(req.params.id);

    if (!station) {
        return next(new AppError('Station not found', 404));
    }

    res.status(200).json({ success: true, message: 'Station deleted successfully' });
});
