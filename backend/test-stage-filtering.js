import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Stage from './models/stage.model.js';
import StageCategory from './models/stageCategory.model.js';

dotenv.config();

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI_ATLAS || process.env.MONGO_URI_COMPASS || process.env.MONGO_URI_COMMUNITY || "mongodb://localhost:27017/alielian_database";
mongoose.connect(mongoUri)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const testStageFiltering = async () => {
  try {
    console.log('🧪 Testing stage filtering by category...\n');

    // Get all stage categories with their stages
    const categories = await StageCategory.find({}).populate('stages', 'name');
    console.log('📚 Available stage categories with their stages:');
    categories.forEach(cat => {
      console.log(`\n🎯 Category: ${cat.name}`);
      if (cat.stages && cat.stages.length > 0) {
        cat.stages.forEach(stage => {
          console.log(`  - ${stage.name}`);
        });
      } else {
        console.log('  - No stages assigned');
      }
    });

    // Test filtering logic (simulating frontend behavior)
    console.log('\n🔍 Testing filtering logic for each category:');
    categories.forEach(cat => {
      console.log(`\n📋 For category "${cat.name}":`);
      if (cat.stages && cat.stages.length > 0) {
        console.log('  Available stages:');
        cat.stages.forEach(stage => {
          console.log(`    ✅ ${stage.name}`);
        });
      } else {
        console.log('  ⚠️  No stages available');
      }
    });

    // Get all stages with their categories
    const stages = await Stage.find({}).populate('category', 'name');
    console.log('\n📝 All stages with their categories:');
    stages.forEach(stage => {
      console.log(`  - ${stage.name}: ${stage.category?.name || 'No category'}`);
    });

    console.log('\n✅ Stage filtering test completed!');
    console.log('\n💡 Frontend will now:');
    console.log('  1. Show all categories in the category dropdown');
    console.log('  2. When a category is selected, only show stages from that category');
    console.log('  3. Disable stage dropdown until a category is selected');
    console.log('  4. Clear stage selection if category changes');

  } catch (error) {
    console.error('❌ Error testing stage filtering:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
};

// Run the test
testStageFiltering();
