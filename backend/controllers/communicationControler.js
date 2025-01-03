const Communication = require('../models/Communication');

// Log a new communication with optional periodicity
exports.logCommunication = async (req, res) => {
    try {
        const { companyId, communicationType, communicationDate, notes, communicationPeriodicity, customRecurrence } = req.body;

        const newCommunication = new Communication({
            companyId,
            communicationType,
            communicationDate,
            notes,
            communicationPeriodicity, // New field to handle recurring communications
        });

        // If the communication is recurring, create multiple communications
        if (communicationPeriodicity) {
            let recurringDate = new Date(communicationDate);
            let numOccurrences = 12; // Default number of occurrences (12 months for example)

            if (customRecurrence) {
                // Handle custom recurrence (e.g., every 2 weeks)
                numOccurrences = customRecurrence.numOccurrences || 12;
            }

            for (let i = 0; i < numOccurrences; i++) {
                const recurringCommunication = new Communication({
                    companyId,
                    communicationType,
                    communicationDate: recurringDate.toISOString(),
                    notes,
                    communicationPeriodicity,
                });

                // Increment the recurringDate based on the periodicity (e.g., weekly, monthly, custom)
                if (communicationPeriodicity === 'weekly') {
                    recurringDate.setDate(recurringDate.getDate() + 7); // Add 7 days for weekly recurrence
                } else if (communicationPeriodicity === 'monthly') {
                    recurringDate.setMonth(recurringDate.getMonth() + 1); // Add 1 month for monthly recurrence
                } else if (communicationPeriodicity === 'daily') {
                    recurringDate.setDate(recurringDate.getDate() + 1); // Add 1 day for daily recurrence
                } else if (communicationPeriodicity === 'yearly') {
                    recurringDate.setFullYear(recurringDate.getFullYear() + 1); // Add 1 year for yearly recurrence
                } else if (customRecurrence && customRecurrence.type === 'custom') {
                    // Handle custom recurrence (e.g., every 2 weeks)
                    recurringDate.setDate(recurringDate.getDate() + (customRecurrence.interval || 14)); // Add custom interval (e.g., 2 weeks)
                }

                await recurringCommunication.save();
            }
            res.status(201).json({ message: 'Recurring communications created successfully' });
        } else {
            // If no periodicity is specified, create a single communication
            await newCommunication.save();
            res.status(201).json(newCommunication);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get communications for a company, including periodic ones
exports.getCommunications = async (req, res) => {
    try {
        const communications = await Communication.find({ companyId: req.params.companyId });
        res.status(200).json(communications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update communication details, including periodicity logic
exports.updateCommunication = async (req, res) => {
    try {
        const { communicationId, communicationType, communicationDate, notes, communicationPeriodicity } = req.body;
        const communication = await Communication.findById(communicationId);

        if (!communication) {
            return res.status(404).json({ message: 'Communication not found' });
        }

        communication.communicationType = communicationType;
        communication.communicationDate = communicationDate;
        communication.notes = notes;
        communication.communicationPeriodicity = communicationPeriodicity;

        await communication.save();
        res.status(200).json(communication);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a communication
exports.deleteCommunication = async (req, res) => {
    try {
        const { communicationId } = req.params;
        const communication = await Communication.findByIdAndDelete(communicationId);

        if (!communication) {
            return res.status(404).json({ message: 'Communication not found' });
        }

        res.status(200).json({ message: 'Communication deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
