const Communication = require('../models/Communication');

// Log a new communication
exports.logCommunication = async (req, res) => {
    try {
        const { companyId, communicationType, communicationDate, notes } = req.body;
        const newCommunication = new Communication({
            companyId,
            communicationType,
            communicationDate,
            notes,
        });

        await newCommunication.save();
        res.status(201).json(newCommunication);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get communications for a company
exports.getCommunications = async (req, res) => {
    try {
        const communications = await Communication.find({ companyId: req.params.companyId });
        res.status(200).json(communications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};