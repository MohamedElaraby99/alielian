import ExamQuestion from "../models/examQuestion.model.js";
import Course from "../models/course.model.js";
import AppError from "../utils/error.utils.js";

// Async handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Create a new exam question
const createExamQuestion = asyncHandler(async (req, res) => {
    const {
        stageId,
        subjectId,
        courseId,
        question,
        options,
        correctAnswer,
        explanation,
        image,
        numberOfOptions,
        difficulty
    } = req.body;

    const userId = req.user._id || req.user.id;

    // Validate required fields
    if (!stageId || !subjectId || !courseId || !question || !options || correctAnswer === undefined) {
        throw new AppError("Missing required fields", 400);
    }

    // Verify that stage, subject, and course exist
    const Stage = (await import('../models/stage.model.js')).default;
    const Subject = (await import('../models/subject.model.js')).default;
    const Course = (await import('../models/course.model.js')).default;

    const stage = await Stage.findById(stageId);
    const subject = await Subject.findById(subjectId);
    const course = await Course.findById(courseId);

    if (!stage) {
        throw new AppError("Stage not found", 404);
    }
    if (!subject) {
        throw new AppError("Subject not found", 404);
    }
    if (!course) {
        throw new AppError("Course not found", 404);
    }

    // Validate options array
    if (!Array.isArray(options) || options.length < 2) {
        throw new AppError("At least 2 options are required", 400);
    }

    // Validate correct answer index
    if (correctAnswer < 0 || correctAnswer >= options.length) {
        throw new AppError("Invalid correct answer index", 400);
    }

    // Create the exam question
    const examQuestion = new ExamQuestion({
        stage: stageId,
        subject: subjectId,
        course: courseId,
        question,
        options,
        correctAnswer,
        explanation: explanation || '',
        image: image || '',
        numberOfOptions: numberOfOptions || options.length,
        difficulty: difficulty || 'medium',
        createdBy: userId,
        lastModifiedBy: userId
    });

    await examQuestion.save();

    res.status(201).json({
        success: true,
        message: "Exam question created successfully",
        data: examQuestion
    });
});

// Get all exam questions with filtering and pagination
const getAllExamQuestions = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 20,
        stageId,
        subjectId,
        courseId,
        difficulty,
        isActive,
        search,
        sortBy = 'createdAt',
        sortOrder = 'desc'
    } = req.query;

    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    if (stageId && stageId !== '') filter.stage = stageId;
    if (subjectId && subjectId !== '') filter.subject = subjectId;
    if (courseId && courseId !== '') filter.course = courseId;
    if (difficulty && difficulty !== '') filter.difficulty = difficulty;
    if (isActive !== undefined && isActive !== '') filter.isActive = isActive === 'true';

    // Add text search if provided
    if (search && search !== '') {
        filter.$or = [
            { question: { $regex: search, $options: 'i' } },
            { explanation: { $regex: search, $options: 'i' } }
        ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Debug: Log the filter and query
    console.log('=== DEBUG: getAllExamQuestions ===');
    console.log('Filter object:', JSON.stringify(filter, null, 2));
    console.log('Sort object:', JSON.stringify(sort, null, 2));
    console.log('Skip:', skip, 'Limit:', parseInt(limit));
    
    const questions = await ExamQuestion.find(filter)
        .populate('stage', 'name')
        .populate('subject', 'title')
        .populate('course', 'title instructor')
        .populate('createdBy', 'fullName username')
        .populate('lastModifiedBy', 'fullName username')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit));

    console.log('Found questions:', questions.length);
    console.log('Questions data:', questions.map(q => ({
        id: q._id,
        question: q.question.substring(0, 30) + '...',
        stage: q.stage,
        subject: q.subject,
        course: q.course
    })));

    const total = await ExamQuestion.countDocuments(filter);
    console.log('Total count with filter:', total);
    
    // Also check total without filter
    const totalAll = await ExamQuestion.countDocuments({});
    console.log('Total count without filter:', totalAll);
    console.log('=== END DEBUG ===');

    // Get summary statistics
    const stats = await ExamQuestion.aggregate([
        { $match: filter },
        {
            $group: {
                _id: null,
                totalQuestions: { $sum: 1 },
                easyQuestions: { $sum: { $cond: [{ $eq: ["$difficulty", "easy"] }, 1, 0] } },
                mediumQuestions: { $sum: { $cond: [{ $eq: ["$difficulty", "medium"] }, 1, 0] } },
                hardQuestions: { $sum: { $cond: [{ $eq: ["$difficulty", "hard"] }, 1, 0] } },
                activeQuestions: { $sum: { $cond: ["$isActive", 1, 0] } },
                inactiveQuestions: { $sum: { $cond: ["$isActive", 0, 1] } }
            }
        }
    ]);

    const summaryStats = stats[0] || {
        totalQuestions: 0,
        easyQuestions: 0,
        mediumQuestions: 0,
        hardQuestions: 0,
        activeQuestions: 0,
        inactiveQuestions: 0
    };

    res.status(200).json({
        success: true,
        data: questions,
        pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalResults: total,
            resultsPerPage: parseInt(limit)
        },
        statistics: summaryStats
    });
});

// Get exam question by ID
const getExamQuestionById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const question = await ExamQuestion.findById(id)
        .populate('stage', 'name')
        .populate('subject', 'title')
        .populate('course', 'title instructor')
        .populate('createdBy', 'fullName username')
        .populate('lastModifiedBy', 'fullName username');

    if (!question) {
        throw new AppError("Exam question not found", 404);
    }

    res.status(200).json({
        success: true,
        data: question
    });
});

// Update exam question
const updateExamQuestion = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;

    const question = await ExamQuestion.findById(id);
    if (!question) {
        throw new AppError("Exam question not found", 404);
    }

    // Validate options if provided
    if (req.body.options) {
        if (!Array.isArray(req.body.options) || req.body.options.length < 2) {
            throw new AppError("At least 2 options are required", 400);
        }

        // Validate correct answer index if provided
        if (req.body.correctAnswer !== undefined) {
            if (req.body.correctAnswer < 0 || req.body.correctAnswer >= req.body.options.length) {
                throw new AppError("Invalid correct answer index", 400);
            }
        }
    }

    // Update fields
    const updateData = {
        ...req.body,
        lastModifiedBy: userId
    };

    const updatedQuestion = await ExamQuestion.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
    ).populate('stage', 'name')
     .populate('subject', 'title')
     .populate('course', 'title instructor')
     .populate('createdBy', 'fullName username')
     .populate('lastModifiedBy', 'fullName username');

    res.status(200).json({
        success: true,
        message: "Exam question updated successfully",
        data: updatedQuestion
    });
});

// Delete exam question
const deleteExamQuestion = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const question = await ExamQuestion.findById(id);
    if (!question) {
        throw new AppError("Exam question not found", 404);
    }

    await ExamQuestion.findByIdAndDelete(id);

    res.status(200).json({
        success: true,
        message: "Exam question deleted successfully"
    });
});

// Toggle question active status
const toggleQuestionStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;

    const question = await ExamQuestion.findById(id);
    if (!question) {
        throw new AppError("Exam question not found", 404);
    }

    question.isActive = !question.isActive;
    question.lastModifiedBy = userId;

    await question.save();

    res.status(200).json({
        success: true,
        message: `Question ${question.isActive ? 'activated' : 'deactivated'} successfully`,
        data: question
    });
});

// Get questions by course
const getQuestionsByCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const { isActive = 'true' } = req.query;

    const filter = {
        course: courseId,
        isActive: isActive === 'true'
    };

    const questions = await ExamQuestion.find(filter)
        .populate('stage', 'name')
        .populate('subject', 'title')
        .populate('course', 'title instructor')
        .sort({ createdAt: 1 });

    res.status(200).json({
        success: true,
        data: questions,
        count: questions.length
    });
});

// Bulk create questions
const bulkCreateQuestions = asyncHandler(async (req, res) => {
    const { questions } = req.body;
    const userId = req.user._id || req.user.id;

    if (!Array.isArray(questions) || questions.length === 0) {
        throw new AppError("Questions array is required", 400);
    }

    const createdQuestions = [];

    for (const questionData of questions) {
        const {
            stageId,
            subjectId,
            courseId,
            question,
            options,
            correctAnswer,
            explanation,
            image,
            numberOfOptions,
            difficulty,
            category,
            tags,
            points,
            timeLimit
        } = questionData;

        // Validate required fields
        if (!stageId || !subjectId || !courseId || !question || !options || correctAnswer === undefined) {
            throw new AppError(`Missing required fields for question: ${question}`, 400);
        }

        // Validate options array
        if (!Array.isArray(options) || options.length < 2) {
            throw new AppError(`At least 2 options are required for question: ${question}`, 400);
        }

        // Validate correct answer index
        if (correctAnswer < 0 || correctAnswer >= options.length) {
            throw new AppError(`Invalid correct answer index for question: ${question}`, 400);
        }

        // Create the exam question
        const examQuestion = new ExamQuestion({
            stage: stageId,
            subject: subjectId,
            course: courseId,
            question,
            options,
            correctAnswer,
            explanation: explanation || '',
            image: image || '',
            numberOfOptions: numberOfOptions || options.length,
            difficulty: difficulty || 'medium',
            category: category || '',
            tags: tags || [],
            points: points || 1,
            timeLimit: timeLimit || 60,
            createdBy: userId,
            lastModifiedBy: userId
        });

        await examQuestion.save();
        createdQuestions.push(examQuestion);
    }

    res.status(201).json({
        success: true,
        message: `${createdQuestions.length} exam questions created successfully`,
        data: createdQuestions
    });
});

// Get question statistics
const getQuestionStatistics = asyncHandler(async (req, res) => {
    const { courseId, stageId, subjectId } = req.params;



    const filter = {};
    
    // Validate ObjectIds if provided
    if (courseId && courseId !== 'undefined') {
        if (!courseId.match(/^[0-9a-fA-F]{24}$/)) {
            throw new AppError("Invalid course ID format", 400);
        }
        filter.course = courseId;
    }
    
    if (stageId && stageId !== 'undefined') {
        if (!stageId.match(/^[0-9a-fA-F]{24}$/)) {
            throw new AppError("Invalid stage ID format", 400);
        }
        filter.stage = stageId;
    }
    
    if (subjectId && subjectId !== 'undefined') {
        if (!subjectId.match(/^[0-9a-fA-F]{24}$/)) {
            throw new AppError("Invalid subject ID format", 400);
        }
        filter.subject = subjectId;
    }

    const stats = await ExamQuestion.aggregate([
        { $match: filter },
        {
            $group: {
                _id: null,
                totalQuestions: { $sum: 1 },
                easyQuestions: { $sum: { $cond: [{ $eq: ["$difficulty", "easy"] }, 1, 0] } },
                mediumQuestions: { $sum: { $cond: [{ $eq: ["$difficulty", "medium"] }, 1, 0] } },
                hardQuestions: { $sum: { $cond: [{ $eq: ["$difficulty", "hard"] }, 1, 0] } },
                activeQuestions: { $sum: { $cond: ["$isActive", 1, 0] } },
                inactiveQuestions: { $sum: { $cond: ["$isActive", 0, 1] } }
            }
        }
    ]);

    const summaryStats = stats[0] || {
        totalQuestions: 0,
        easyQuestions: 0,
        mediumQuestions: 0,
        hardQuestions: 0,
        activeQuestions: 0,
        inactiveQuestions: 0
    };

    // Get stage distribution
    const stageStats = await ExamQuestion.aggregate([
        { $match: filter },
        { $group: { _id: "$stage", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]);

    // Get subject distribution
    const subjectStats = await ExamQuestion.aggregate([
        { $match: filter },
        { $group: { _id: "$subject", count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]);

    res.status(200).json({
        success: true,
        data: {
            summary: summaryStats,
            stageDistribution: stageStats,
            subjectDistribution: subjectStats
        }
    });
});

// Migration function to fix questions without stage/subject
const migrateQuestions = asyncHandler(async (req, res) => {
    const questions = await ExamQuestion.find({
        $or: [
            { stage: { $exists: false } },
            { subject: { $exists: false } },
            { stage: null },
            { subject: null }
        ]
    });

    res.status(200).json({
        success: true,
        message: `Found ${questions.length} questions that need migration`,
        data: {
            questionsNeedingMigration: questions.length,
            questions: questions.map(q => ({
                id: q._id,
                question: q.question.substring(0, 50) + '...',
                hasStage: !!q.stage,
                hasSubject: !!q.subject,
                hasCourse: !!q.course
            }))
        }
    });
});

// Debug endpoint to check all questions in database
const debugAllQuestions = asyncHandler(async (req, res) => {
    const allQuestions = await ExamQuestion.find({});
    
    res.status(200).json({
        success: true,
        message: `Found ${allQuestions.length} total questions in database`,
        data: {
            totalQuestions: allQuestions.length,
            questions: allQuestions.map(q => ({
                id: q._id,
                question: q.question.substring(0, 50) + '...',
                stage: q.stage,
                subject: q.subject,
                course: q.course,
                isActive: q.isActive,
                createdAt: q.createdAt
            }))
        }
    });
});

// Simple endpoint to get all questions without filters (for debugging)
const getAllQuestionsSimple = asyncHandler(async (req, res) => {
    const questions = await ExamQuestion.find({})
        .populate('stage', 'name')
        .populate('subject', 'title')
        .populate('course', 'title')
        .sort({ createdAt: -1 });
    
    res.status(200).json({
        success: true,
        message: `Found ${questions.length} questions`,
        data: questions
    });
});

export {
    createExamQuestion,
    getAllExamQuestions,
    getExamQuestionById,
    updateExamQuestion,
    deleteExamQuestion,
    toggleQuestionStatus,
    getQuestionsByCourse,
    bulkCreateQuestions,
    getQuestionStatistics,
    migrateQuestions,
    debugAllQuestions,
    getAllQuestionsSimple
};
