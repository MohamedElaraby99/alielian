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

const setupStagesAndCategories = async () => {
  try {
    console.log('📚 Setting up stages and stage categories...');
    
    // First, create sample stages
    const stageDefinitions = [
      // Primary stages
      { name: '1 ابتدائي', status: 'active' },
      { name: '2 ابتدائي', status: 'active' },
      { name: '3 ابتدائي', status: 'active' },
      { name: '4 ابتدائي', status: 'active' },
      { name: '5 ابتدائي', status: 'active' },
      { name: '6 ابتدائي', status: 'active' },
      
      // Preparatory stages
      { name: '1 إعدادي', status: 'active' },
      { name: '2 إعدادي', status: 'active' },
      { name: '3 إعدادي', status: 'active' },
      
      // Secondary stages
      { name: '1 ثانوي', status: 'active' },
      { name: '2 ثانوي', status: 'active' },
      { name: '3 ثانوي', status: 'active' }
    ];
    
    console.log('📝 Creating stages...');
    const createdStages = [];
    
    for (const stageDef of stageDefinitions) {
      // Check if stage already exists
      let stage = await Stage.findOne({ name: stageDef.name });
      
      if (stage) {
        console.log(`✅ Stage already exists: ${stageDef.name}`);
        createdStages.push(stage);
      } else {
        stage = await Stage.create(stageDef);
        console.log(`✅ Created stage: ${stageDef.name}`);
        createdStages.push(stage);
      }
    }
    
    console.log(`\n📊 Created/Found ${createdStages.length} stages`);
    
    // Now create stage categories and assign stages
    const categoryDefinitions = [
      {
        name: 'المرحلة الابتدائية',
        description: 'المراحل الدراسية من الصف الأول إلى السادس الابتدائي',
        stages: createdStages.filter(s => s.name.includes('ابتدائي')).map(s => s._id)
      },
      {
        name: 'المرحلة الإعدادية',
        description: 'المراحل الدراسية من الصف الأول إلى الثالث الإعدادي',
        stages: createdStages.filter(s => s.name.includes('إعدادي')).map(s => s._id)
      },
      {
        name: 'المرحلة الثانوية',
        description: 'المراحل الدراسية من الصف الأول إلى الثالث الثانوي',
        stages: createdStages.filter(s => s.name.includes('ثانوي')).map(s => s._id)
      }
    ];
    
    console.log('\n📝 Creating stage categories...');
    
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
    
    console.log('\n✅ Stages and stage categories setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Error setting up stages and categories:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
  }
};

// Run the setup
setupStagesAndCategories();
