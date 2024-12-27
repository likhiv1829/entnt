// backend/routes/companyRoutes.js
const express = require('express');
const router = express.Router();
const Company = require('../models/Company');

// Get all companies
router.get('/companies', async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Add a new company
router.post('/companies', async (req, res) => {
  try {
    const newCompany = new Company(req.body);
    await newCompany.save();
    res.status(201).json(newCompany);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
