// models/Company.js

const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  details: String,
  location: String,
  linkedInProfile: String,
  emails: String,
  phoneNumbers: String,
  comments: String,
  communicationPeriodicity: { type: Number, default: 14 },
});

module.exports = mongoose.model('Company', companySchema);
