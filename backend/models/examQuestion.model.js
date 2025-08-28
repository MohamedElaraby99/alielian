import { model, Schema } from "mongoose";

const examQuestionSchema = new Schema({
    stage: {
        type: Schema.Types.ObjectId,
        ref: 'Stage',
        required: true
    },
    subject: {
        type: Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    question: {
        type: String,
        required: [true, 'Question is required'],
        minLength: [10, 'Question must be at least 10 characters'],
        maxLength: [1000, 'Question should be less than 1000 characters']
    },
    options: [{
        type: String,
        required: true,
        minLength: [1, 'Option cannot be empty'],
        maxLength: [500, 'Option should be less than 500 characters']
    }],
    correctAnswer: {
        type: Number,
        required: [true, 'Correct answer index is required'],
        min: [0, 'Correct answer index must be 0 or greater'],
        validate: {
            validator: function(value) {
                return value < this.options.length;
            },
            message: 'Correct answer index must be within options range'
        }
    },
    explanation: {
        type: String,
        default: '',
        maxLength: [1000, 'Explanation should be less than 1000 characters']
    },
    image: {
        type: String,
        default: ''
    },
    numberOfOptions: {
        type: Number,
        default: 4,
        min: [2, 'Minimum 2 options required'],
        max: [6, 'Maximum 6 options allowed']
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lastModifiedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Indexes for better query performance
examQuestionSchema.index({ stage: 1, subject: 1, course: 1 });
examQuestionSchema.index({ stage: 1 });
examQuestionSchema.index({ subject: 1 });
examQuestionSchema.index({ course: 1 });
examQuestionSchema.index({ difficulty: 1 });
examQuestionSchema.index({ isActive: 1 });
examQuestionSchema.index({ question: 'text', explanation: 'text' });

// Virtual for getting the correct answer text
examQuestionSchema.virtual('correctAnswerText').get(function() {
    return this.options[this.correctAnswer] || '';
});

// Ensure virtual fields are serialized
examQuestionSchema.set('toJSON', { virtuals: true });
examQuestionSchema.set('toObject', { virtuals: true });

// Pre-save middleware to validate options length matches numberOfOptions
examQuestionSchema.pre('save', function(next) {
    if (this.options.length !== this.numberOfOptions) {
        return next(new Error('Number of options must match numberOfOptions field'));
    }
    next();
});

const ExamQuestion = model("ExamQuestion", examQuestionSchema);

export default ExamQuestion;
