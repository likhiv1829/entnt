const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: String,
  location: String,
  linkedInProfile: String,
  emails: String,
  phoneNumbers: String,
  comments: String,
  communicationPeriodicity: { type: Number, default: 14 },  // Default value of 14 days
});

const Company = mongoose.model('Company', companySchema);

module.exports = Company;
