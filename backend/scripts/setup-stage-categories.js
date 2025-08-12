import mongoose from 'mongoose';
import dotenv from 'dotenv';
import StageCategory from '../models/stageCategory.model.js';
import Stage from '../models/stage.model.js';

dotenv.config();

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI_ATLAS || process.env.MONGO_URI_COMPASS || process.env.MONGO_URI_COMMUNITY || "mongodb://localhost:27017/alielian_database";
mongoose.connect(mongoUri)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const setupStageCategories = async () => {
  try {
    console.log('📚 Setting up stage categories...');
    
    // First, get all existing stages
    const stages = await Stage.find({});
    console.log(`📊 Found ${stages.length} existing stages:`, stages.map(s => s.name));
    
    if (stages.length === 0) {
      console.log('❌ No stages found. Please create stages first.');
      return;
    }
    
    // Create category definitions
    const categoryDefinitions = [
      {
        name: 'المرحلة الابتدائية',
        description: 'المراحل الدراسية من الصف الأول إلى السادس الابتدائي',
        stages: stages.filter(s => s.name.includes('ابتدائي') || s.name.includes('1') || s.name.includes('2') || s.name.includes('3') || s.name.includes('4') || s.name.includes('5') || s.name.includes('6')).map(s => s._id)
      },
      {
        name: 'المرحلة الإعدادية',
        description: 'المراحل الدراسية من الصف الأول إلى الثالث الإعدادي',
        stages: stages.filter(s => s.name.includes('إعدادي') || s.name.includes('7') || s.name.includes('8') || s.name.includes('9')).map(s => s._id)
      },
      {
        name: 'المرحلة الثانوية',
        description: 'المراحل الدراسية من الصف الأول إلى الثالث الثانوي',
        stages: stages.filter(s => s.name.includes('ثانوي') || s.name.includes('10') || s.name.includes('11') || s.name.includes('12')).map(s => s._id)
      }
    ];
    
    // Create or update categories
    for (const catDef of categoryDefinitions) {
      if (catDef.stages.length === 0) {
        console.log(`⚠️  No stages found for category: ${catDef.name}`);
        continue;
      }
      
      console.log(`📝 Creating/updating category: ${catDef.name} with ${catDef.stages.length} stages`);
      
      // Check if category exists
      let category = await StageCategory.findOne({ name: catDef.name });
      
      if (category) {
        // Update existing category
        category.stages = catDef.stages;
        category.description = catDef.description;
        await category.save();
        console.log(`✅ Updated category: ${catDef.name}`);
      } else {
        // Create new category
        category = await StageCategory.create(catDef);
        console.log(`✅ Created category: ${catDef.name}`);
      }
      
      // Update stages to reference this category
      for (const stageId of catDef.stages) {
        await Stage.findByIdAndUpdate(stageId, { category: category._id });
      }
    }
    
    // Show final result
    const allCategories = await StageCategory.find({}).populate('stages', 'name status');
    console.log('\n🎯 Final stage categories setup:');
    allCategories.forEach(cat => {
      console.log(`\n📚 ${cat.name}:`);
      cat.stages.forEach(stage => {
        console.log(`  - ${stage.name} (${stage.status})`);
      });
    });
    
    console.log('\n✅ Stage categories setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Error setting up stage categories:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
};

// Run the setup
setupStageCategories();
