const Company = require('../models/Company');

// Get all companies
const getCompanies = async (req, res) => {
    try {
        const companies = await Company.find();
        res.json(companies);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Add a new company
const addCompany = async (req, res) => {
    try {
        const {
            name,
            location,
            linkedInProfile,
            emails,
            phoneNumbers,
            comments,
            communicationPeriodicity,
            customRecurrence
        } = req.body;

        // Validate required fields
        if (!name || !location) {
            return res.status(400).json({ message: 'Name and Location are required' });
        }

        // Validate communication periodicity (ensure a valid selection is made)
        if (!communicationPeriodicity) {
            return res.status(400).json({ message: 'Communication Periodicity is required' });
        }

        // If "Custom..." is selected, validate the custom recurrence fields
        if (communicationPeriodicity === 'Custom...' && !customRecurrence) {
            return res.status(400).json({ message: 'Custom Recurrence is required for custom periodicity' });
        }

        // Create the new company
        const newCompany = new Company({
            name,
            location,
            linkedInProfile,
            emails,
            phoneNumbers,
            comments,
            communicationPeriodicity,
            customRecurrence: communicationPeriodicity === 'Custom...' ? customRecurrence : null, // Store recurrence only if custom is selected
        });

        const savedCompany = await newCompany.save();
        res.status(201).json(savedCompany); // Return the created company object
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update an existing company
const updateCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            location,
            linkedInProfile,
            emails,
            phoneNumbers,
            comments,
            communicationPeriodicity,
            customRecurrence
        } = req.body;

        // Validate communication periodicity during update (same logic as creation)
        if (!communicationPeriodicity) {
            return res.status(400).json({ message: 'Communication Periodicity is required' });
        }

        // If "Custom..." is selected, validate the custom recurrence fields
        if (communicationPeriodicity === 'Custom...' && !customRecurrence) {
            return res.status(400).json({ message: 'Custom Recurrence is required for custom periodicity' });
        }

        // Find and update the company
        const updatedCompany = await Company.findByIdAndUpdate(
            id,
            {
                name,
                location,
                linkedInProfile,
                emails,
                phoneNumbers,
                comments,
                communicationPeriodicity,
                customRecurrence: communicationPeriodicity === 'Custom...' ? customRecurrence : null, // Store recurrence only if custom is selected
            },
            { new: true } // Return updated company
        );

        // If no company is found, return an error
        if (!updatedCompany) {
            return res.status(404).json({ message: 'Company not found' });
        }

        res.json(updatedCompany); // Return the updated company object
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getCompanies,
    addCompany,
    updateCompany
};
