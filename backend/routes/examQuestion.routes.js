import express from "express";
import { isLoggedIn, authorisedRoles } from "../middleware/auth.middleware.js";
import {
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
} from "../controllers/examQuestion.controller.js";

const router = express.Router();

// Create a new exam question (Admin only)
router.post("/", isLoggedIn, authorisedRoles('ADMIN', 'SUPER_ADMIN'), createExamQuestion);

// Get all exam questions with filtering and pagination (Admin only)
router.get("/", isLoggedIn, authorisedRoles('ADMIN', 'SUPER_ADMIN'), getAllExamQuestions);

// Get question statistics (Admin only) - MUST come before /:id route
router.get("/statistics", isLoggedIn, authorisedRoles('ADMIN', 'SUPER_ADMIN'), getQuestionStatistics);
router.get("/statistics/:courseId", isLoggedIn, authorisedRoles('ADMIN', 'SUPER_ADMIN'), getQuestionStatistics);
router.get("/statistics/:courseId/:stageId", isLoggedIn, authorisedRoles('ADMIN', 'SUPER_ADMIN'), getQuestionStatistics);
router.get("/statistics/:courseId/:stageId/:subjectId", isLoggedIn, authorisedRoles('ADMIN', 'SUPER_ADMIN'), getQuestionStatistics);

// Migration endpoint to check questions needing migration (Admin only)
router.get("/migrate/check", isLoggedIn, authorisedRoles('ADMIN', 'SUPER_ADMIN'), migrateQuestions);

// Debug endpoint to check all questions in database (Admin only)
router.get("/debug/all", isLoggedIn, authorisedRoles('ADMIN', 'SUPER_ADMIN'), debugAllQuestions);

// Simple endpoint to get all questions without filters (Admin only)
router.get("/debug/simple", isLoggedIn, authorisedRoles('ADMIN', 'SUPER_ADMIN'), getAllQuestionsSimple);

// Get exam question by ID (Admin only) - MUST come after specific routes
router.get("/:id", isLoggedIn, authorisedRoles('ADMIN', 'SUPER_ADMIN'), getExamQuestionById);

// Update exam question (Admin only)
router.put("/:id", isLoggedIn, authorisedRoles('ADMIN', 'SUPER_ADMIN'), updateExamQuestion);

// Delete exam question (Admin only)
router.delete("/:id", isLoggedIn, authorisedRoles('ADMIN', 'SUPER_ADMIN'), deleteExamQuestion);

// Toggle question active status (Admin only)
router.patch("/:id/toggle-status", isLoggedIn, authorisedRoles('ADMIN', 'SUPER_ADMIN'), toggleQuestionStatus);

// Get questions by course (Admin only)
router.get("/course/:courseId", isLoggedIn, authorisedRoles('ADMIN', 'SUPER_ADMIN'), getQuestionsByCourse);

// Bulk create questions (Admin only)
router.post("/bulk", isLoggedIn, authorisedRoles('ADMIN', 'SUPER_ADMIN'), bulkCreateQuestions);

export default router;
