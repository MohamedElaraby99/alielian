import mongoose from 'mongoose';
import dotenv from 'dotenv';
import StageCategory from '../models/stageCategory.model.js';
import Stage from '../models/stage.model.js';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Create sample stage categories
const createSampleStageCategories = async () => {
  try {
    console.log('📚 Creating sample stage categories...');
    
    // First, get all existing stages
    const stages = await Stage.find({});
    console.log(`📊 Found ${stages.length} existing stages`);
    
    // Create category definitions
    const categoryDefinitions = [
      {
        name: 'المرحلة الابتدائية',
        description: 'المراحل الدراسية من الصف الأول إلى السادس الابتدائي',
        stages: stages.filter(s => s.name.includes('ابتدائي')).map(s => s._id),
        status: 'active'
      },
      {
        name: 'المرحلة الإعدادية',
        description: 'المراحل الدراسية من الصف الأول إلى الثالث الإعدادي',
        stages: stages.filter(s => s.name.includes('إعدادي')).map(s => s._id),
        status: 'active'
      },
      {
        name: 'المرحلة الثانوية',
        description: 'المراحل الدراسية من الصف الأول إلى الثالث الثانوي',
        stages: stages.filter(s => s.name.includes('ثانوي')).map(s => s._id),
        status: 'active'
      },
      {
        name: 'المرحلة الجامعية',
        description: 'المراحل الدراسية من السنة الأولى إلى الرابعة الجامعية',
        stages: stages.filter(s => s.name.includes('جامعة')).map(s => s._id),
        status: 'active'
      }
    ];
    
    // Create categories
    for (const catDef of categoryDefinitions) {
      if (catDef.stages.length > 0) {
        const existingCategory = await StageCategory.findOne({ name: catDef.name });
        if (!existingCategory) {
          const category = await StageCategory.create(catDef);
          console.log(`✅ Created category: ${category.name} with ${catDef.stages.length} stages`);
        } else {
          console.log(`⏭️ Category already exists: ${catDef.name}`);
        }
      } else {
        console.log(`⚠️ No stages found for category: ${catDef.name}`);
      }
    }
    
    // Update stages to include category references
    console.log('🔄 Updating stages with category references...');
    
    for (const catDef of categoryDefinitions) {
      if (catDef.stages.length > 0) {
        const category = await StageCategory.findOne({ name: catDef.name });
        if (category) {
          await Stage.updateMany(
            { _id: { $in: catDef.stages } },
            { category: category._id }
          );
          console.log(`✅ Updated ${catDef.stages.length} stages with category: ${catDef.name}`);
        }
      }
    }
    
    console.log('✅ Sample stage categories creation completed!');
  } catch (error) {
    console.error('❌ Error creating stage categories:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
};

// Run the script
createSampleStageCategories();
