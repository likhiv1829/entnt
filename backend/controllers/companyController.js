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
    try {
        const { name, address, phone } = req.body;

        // Validate input
        if (!name || !address || !phone) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newCompany = new Company({
            name,
            address,
            phone
        });

        const savedCompany = await newCompany.save();
        res.status(201).json(savedCompany);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getCompanies,
    addCompany
};