const express = require('express');
const mongoose = require('mongoose');
const Company = require('../models/Company');

const router = express.Router();

// Get all companies
router.get('/companies', async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch companies.' });
  }
});

// Get details of a specific company by ID
router.get('/companies/:id', async (req, res) => {
  const { id } = req.params;

  // Check if the ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid company ID.' });
  }

  try {
    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({ error: 'Company not found.' });
    }
    res.status(200).json(company);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch company details.' });
  }
});

// Add a new company
router.post('/companies', async (req, res) => {
  const { name, location, linkedInProfile, emails, phoneNumbers, comments, communicationPeriodicity } = req.body;

  // Ensure required fields are provided
  if (!name || !location || !emails) {
    return res.status(400).json({ error: 'Name, location, and emails are required.' });
  }

  try {
    const newCompany = new Company({
      name,
      location,
      linkedInProfile,
      emails,
      phoneNumbers,
      comments,
      communicationPeriodicity: communicationPeriodicity || 14, // Default to 14 days
    });

    const savedCompany = await newCompany.save();
    res.status(201).json(savedCompany);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add company.' });
  }
});

// Update an existing company (e.g., adding communication details)
router.put('/companies/:id', async (req, res) => {
  const { id } = req.params;
  const { name, location, linkedInProfile, emails, phoneNumbers, comments, communicationPeriodicity } = req.body;

  // Validate company ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid company ID.' });
  }

  try {
    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({ error: 'Company not found.' });
    }

    // Update the company details
    company.name = name || company.name;
    company.location = location || company.location;
    company.linkedInProfile = linkedInProfile || company.linkedInProfile;
    company.emails = emails || company.emails;
    company.phoneNumbers = phoneNumbers || company.phoneNumbers;
    company.comments = comments || company.comments;
    company.communicationPeriodicity = communicationPeriodicity || company.communicationPeriodicity;

    const updatedCompany = await company.save();
    res.status(200).json(updatedCompany);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update company.' });
  }
});

// Add a new communication for a company
router.post('/companies/:id/communications', async (req, res) => {
  const { id } = req.params;
  const { type, date, notes, highlight } = req.body;

  // Validate company ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid company ID.' });
  }

  try {
    const company = await Company.findById(id);
    if (!company) {
      return res.status(404).json({ error: 'Company not found.' });
    }

    const newCommunication = { type, date, notes, highlight: highlight || 'upcoming' };
    company.communications.push(newCommunication);

    const updatedCompany = await company.save();
    res.status(201).json(updatedCompany);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add communication.' });
  }
});

// Update a communication for a specific company
router.put('/companies/:companyId/communications/:commId', async (req, res) => {
  const { companyId, commId } = req.params;
  const { type, date, notes, highlight } = req.body;

  // Validate company ID and communication ID
  if (!mongoose.Types.ObjectId.isValid(companyId) || !mongoose.Types.ObjectId.isValid(commId)) {
    return res.status(400).json({ error: 'Invalid company or communication ID.' });
  }

  try {
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ error: 'Company not found.' });
    }

    const communicationIndex = company.communications.findIndex((comm) => comm._id.toString() === commId);
    if (communicationIndex === -1) {
      return res.status(404).json({ error: 'Communication not found.' });
    }

    // Update the communication
    company.communications[communicationIndex] = {
      ...company.communications[communicationIndex],
      type: type || company.communications[communicationIndex].type,
      date: date || company.communications[communicationIndex].date,
      notes: notes || company.communications[communicationIndex].notes,
      highlight: highlight || company.communications[communicationIndex].highlight,
    };

    const updatedCompany = await company.save();
    res.status(200).json(updatedCompany);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update communication.' });
  }
});
router.delete('/companies/:id', async (req, res) => {
  const { id } = req.params;

  // Validate company ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid company ID.' });
  }

  try {
    const company = await Company.findByIdAndDelete(id);
    if (!company) {
      return res.status(404).json({ error: 'Company not found.' });
    }
    res.status(200).json({ message: 'Company deleted successfully.' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete company.' });
  }
});

module.exports = router;
