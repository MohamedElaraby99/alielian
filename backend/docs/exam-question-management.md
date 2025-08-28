# Exam Question Management System

## Overview
The Exam Question Management System allows administrators to create, manage, and organize exam questions for both training and final exams. This system provides a comprehensive interface for managing questions with various difficulty levels, categories, and metadata.

## Features

### Backend Features
- **CRUD Operations**: Create, read, update, and delete exam questions
- **Bulk Operations**: Create multiple questions at once
- **Advanced Filtering**: Filter questions by course, lesson, exam type, difficulty, category, and status
- **Search Functionality**: Full-text search across questions and explanations
- **Statistics**: Get comprehensive statistics about questions
- **Validation**: Comprehensive validation for all question fields
- **Image Support**: Upload and manage images for questions

### Frontend Features
- **Admin Dashboard**: Complete dashboard for managing exam questions
- **Question Creation/Editing**: Modal-based interface for creating and editing questions
- **Advanced Filters**: Multiple filter options with real-time search
- **Bulk Actions**: Select and perform actions on multiple questions
- **Statistics Display**: Visual statistics cards showing question metrics
- **Responsive Design**: Mobile-friendly interface
- **Real-time Updates**: Live updates when questions are modified

## API Endpoints

### Base URL: `/api/v1/exam-questions`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create a new exam question | Admin/Super Admin |
| GET | `/` | Get all exam questions with filtering | Admin/Super Admin |
| GET | `/:id` | Get exam question by ID | Admin/Super Admin |
| PUT | `/:id` | Update exam question | Admin/Super Admin |
| DELETE | `/:id` | Delete exam question | Admin/Super Admin |
| PATCH | `/:id/toggle-status` | Toggle question active status | Admin/Super Admin |
| GET | `/exam/:courseId/:lessonId/:examId/:examType` | Get questions by exam | Admin/Super Admin |
| POST | `/bulk` | Bulk create questions | Admin/Super Admin |
| GET | `/statistics/:courseId?` | Get question statistics | Admin/Super Admin |

## Data Model

### ExamQuestion Schema
```javascript
{
  course: ObjectId,           // Reference to Course
  lessonId: String,           // Lesson ID
  lessonTitle: String,        // Lesson title
  unitId: String,             // Unit ID (optional)
  unitTitle: String,          // Unit title (optional)
  examId: String,             // Exam ID
  examTitle: String,          // Exam title
  examType: String,           // 'training' or 'final'
  question: String,           // Question text
  options: [String],          // Array of answer options
  correctAnswer: Number,      // Index of correct answer
  explanation: String,        // Explanation of correct answer
  image: String,              // Image URL (optional)
  numberOfOptions: Number,    // Number of options (2-6)
  difficulty: String,         // 'easy', 'medium', 'hard'
  category: String,           // Question category
  tags: [String],             // Question tags
  points: Number,             // Points for correct answer (1-10)
  timeLimit: Number,          // Time limit in seconds (10-300)
  isActive: Boolean,          // Question status
  createdBy: ObjectId,        // Creator user ID
  lastModifiedBy: ObjectId,   // Last modifier user ID
  createdAt: Date,            // Creation timestamp
  updatedAt: Date             // Last update timestamp
}
```

## Usage Examples

### Creating a Question
```javascript
const questionData = {
  courseId: "course_id",
  lessonId: "lesson_id",
  examId: "exam_id",
  examType: "training",
  question: "What is the capital of France?",
  options: ["London", "Berlin", "Paris", "Madrid"],
  correctAnswer: 2,
  explanation: "Paris is the capital and largest city of France.",
  difficulty: "easy",
  category: "Geography",
  tags: ["capital", "france", "europe"],
  points: 1,
  timeLimit: 30
};
```

### Filtering Questions
```javascript
const filters = {
  courseId: "course_id",
  examType: "final",
  difficulty: "medium",
  isActive: true,
  search: "mathematics"
};
```

### Bulk Creating Questions
```javascript
const questions = [
  {
    courseId: "course_id",
    lessonId: "lesson_id",
    examId: "exam_id",
    examType: "training",
    question: "Question 1...",
    options: ["A", "B", "C", "D"],
    correctAnswer: 0,
    // ... other fields
  },
  // ... more questions
];
```

## Frontend Components

### ExamQuestionDashboard
Main dashboard component for managing exam questions. Features:
- Question listing with pagination
- Advanced filtering and search
- Bulk actions
- Statistics display
- Create/Edit/Delete operations

### CreateExamQuestionModal
Modal component for creating and editing questions. Features:
- Course/Lesson/Exam selection
- Question text input
- Options management
- Image upload
- Metadata configuration
- Form validation

## Security
- All endpoints require admin or super admin authentication
- Input validation on both frontend and backend
- File upload restrictions (image types, size limits)
- XSS protection through proper sanitization

## Performance
- Database indexes on frequently queried fields
- Pagination for large datasets
- Efficient aggregation queries for statistics
- Optimized image handling

## Future Enhancements
- Question import/export functionality
- Question templates
- Advanced analytics and reporting
- Question difficulty auto-calculation
- Integration with learning management system
- Question versioning and history
- Collaborative question editing
- Question bank sharing between courses

## Troubleshooting

### Common Issues
1. **Image upload fails**: Check file size (max 5MB) and format (jpg, png, gif)
2. **Options validation error**: Ensure all options are filled and correct answer index is valid
3. **Course/Lesson not found**: Verify the course and lesson exist and are accessible
4. **Permission denied**: Ensure user has admin or super admin role

### Error Codes
- `400`: Bad Request - Invalid input data
- `401`: Unauthorized - Authentication required
- `403`: Forbidden - Insufficient permissions
- `404`: Not Found - Resource not found
- `500`: Internal Server Error - Server-side error

## Contributing
When adding new features or modifying existing ones:
1. Update the data model documentation
2. Add appropriate validation
3. Update API documentation
4. Add frontend components if needed
5. Write tests for new functionality
6. Update this documentation
