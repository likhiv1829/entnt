const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  linkedInProfile: { type: String },
  emails: { type: [String], required: true },
  phoneNumbers: { type: [String] },
  comments: { type: String },
  communicationPeriodicity: { type: Number, default: 14 },
  communications: [
    {
      type: { type: String, required: true }, // E.g., Email, Call, Meeting
      date: { type: Date, required: true },
      notes: { type: String },
      highlight: { type: String, default: 'upcoming' }, // upcoming, completed, etc.
    }
  ],
});

const Company = mongoose.model('Company', companySchema);
module.exports = Company;
