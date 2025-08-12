import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from './models/course.model.js';
import Stage from './models/stage.model.js';
import StageCategory from './models/stageCategory.model.js';
import User from './models/user.model.js';

dotenv.config();

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI_ATLAS || process.env.MONGO_URI_COMPASS || process.env.MONGO_URI_COMMUNITY || "mongodb://localhost:27017/alielian_database";
mongoose.connect(mongoUri)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const testCourseFiltering = async () => {
  try {
    console.log('🧪 Testing course filtering by stage and category...\n');

    // Get all stage categories
    const categories = await StageCategory.find({}).populate('stages', 'name');
    console.log('📚 Available stage categories:');
    categories.forEach(cat => {
      console.log(`  - ${cat.name}: ${cat.stages.map(s => s.name).join(', ')}`);
    });

    // Get all stages with their categories
    const stages = await Stage.find({}).populate('category', 'name');
    console.log('\n📝 Available stages with categories:');
    stages.forEach(stage => {
      console.log(`  - ${stage.name}: ${stage.category?.name || 'No category'}`);
    });

    // Get all courses with their stages and categories
    const courses = await Course.find({})
      .populate('stage', 'name')
      .populate('category', 'name')
      .populate('instructor', 'name');
    
    console.log('\n📖 Available courses:');
    courses.forEach(course => {
      console.log(`  - ${course.title}: Stage=${course.stage?.name}, Category=${course.category?.name}`);
    });

    // Test filtering for a specific user
    const users = await User.find({}).populate('stage');
    if (users.length > 0) {
      const testUser = users[0];
      console.log(`\n👤 Testing filtering for user: ${testUser.fullName || testUser.email}`);
      console.log(`   User stage: ${testUser.stage?.name || 'No stage assigned'}`);
      
      if (testUser.stage) {
        // Get user's stage with category
        const userStage = await Stage.findById(testUser.stage._id).populate('category');
        console.log(`   User stage category: ${userStage.category?.name || 'No category'}`);
        
        // Simulate the filtering logic
        let query = {};
        query.stage = testUser.stage._id;
        
        if (userStage.category) {
          query.category = userStage.category._id;
        }
        
        console.log(`\n🎯 Query for this user:`, JSON.stringify(query, null, 2));
        
        const filteredCourses = await Course.find(query)
          .populate('stage', 'name')
          .populate('category', 'name')
          .populate('instructor', 'name');
        
        console.log(`\n📚 Courses that would be shown to this user (${filteredCourses.length} courses):`);
        filteredCourses.forEach(course => {
          console.log(`  - ${course.title}: Stage=${course.stage?.name}, Category=${course.category?.name}`);
        });
        
        // Show courses that would NOT be shown
        const allCourses = await Course.find({})
          .populate('stage', 'name')
          .populate('category', 'name');
        
        const excludedCourses = allCourses.filter(course => 
          !filteredCourses.some(fc => fc._id.toString() === course._id.toString())
        );
        
        if (excludedCourses.length > 0) {
          console.log(`\n❌ Courses that would NOT be shown to this user (${excludedCourses.length} courses):`);
          excludedCourses.forEach(course => {
            console.log(`  - ${course.title}: Stage=${course.stage?.name}, Category=${course.category?.name}`);
          });
        }
      } else {
        console.log('   User has no stage assigned - would see all courses');
      }
    }

    console.log('\n✅ Course filtering test completed!');

  } catch (error) {
    console.error('❌ Error testing course filtering:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
};

// Run the test
testCourseFiltering();
