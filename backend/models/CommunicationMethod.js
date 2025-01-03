const mongoose = require('mongoose');

const communicationSchema = new mongoose.Schema({
    companyId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Company', 
        required: true 
    },
    communicationType: {
        type: String,
        required: true
    },
    communicationDate: {
        type: Date,
        required: true
    },
    notes: {
        type: String
    },
    communicationPeriodicity: {
        type: String, 
        enum: ['weekly', 'monthly', 'daily', 'yearly', 'custom'], // Added additional periodicities
        default: 'monthly'
    },
    customRecurrence: {
        type: Object, // Stores custom recurrence logic if needed
        default: null,
        description: 'Custom recurrence pattern if communicationPeriodicity is custom',
        validate: {
            validator: function(v) {
                // Ensure customRecurrence object has necessary fields if periodicity is custom
                if (this.communicationPeriodicity === 'custom' && (!v || !v.interval || !v.numOccurrences)) {
                    return false;
                }
                return true;
            },
            message: 'Custom recurrence must have interval and numOccurrences fields when periodicity is custom.'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Optional: Add indexes for frequently queried fields (e.g., companyId, communicationDate)
communicationSchema.index({ companyId: 1, communicationDate: 1 });

// You can add pre or post hooks here if needed, for example, to handle cleanup or other actions.

module.exports = mongoose.model('Communication', communicationSchema);
