const express = require('express');
const router = express.Router();
const CommunicationMethod = require('../models/CommunicationMethod');

// Get all communication methods
router.get('/communication-methods', async (req, res) => {
  try {
    const methods = await CommunicationMethod.find();
    res.json(methods);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Add a new communication method
router.post('/communication-methods', async (req, res) => {
  try {
    const newMethod = new CommunicationMethod(req.body);
    await newMethod.save();
    res.status(201).json(newMethod);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Edit a communication method (PUT)
router.put('/communication-methods/:id', async (req, res) => {
  try {
    const updatedMethod = await CommunicationMethod.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedMethod);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Delete a communication method (DELETE)
router.delete('/communication-methods/:id', async (req, res) => {
  try {
    await CommunicationMethod.findByIdAndDelete(req.params.id);
    res.status(200).send({ message: 'Communication method deleted successfully' });
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
