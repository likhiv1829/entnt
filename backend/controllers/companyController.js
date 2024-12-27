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

// Add a company
const addCompany = async (req, res) => {
    const {
        name,
        industry,
        location = '', // Default empty string if not provided
        linkedin = '',
        emails = [], // Default empty array if not provided
        phoneNumbers = [],
        comments = '',
        communicationPeriodicity = 'Monthly', // Default periodicity
    } = req.body;

    try {
        // Validate required fields
        if (!name || !industry) {
            return res.status(400).json({ message: 'Name and industry are required.' });
        }

        // Create a new company instance
        const company = new Company({
            name,
            industry,
            location,
            linkedin,
            emails,
            phoneNumbers,
            comments,
            communicationPeriodicity,
        });

        // Save the company to the database
        await company.save();

        // Respond with the created company
        res.status(201).json(company);
    } catch (err) {
        console.error('Error adding company:', err);
        res.status(400).json({ message: err.message });
    }
};

module.exports = { getCompanies, addCompany };