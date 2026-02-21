import { db } from '@/lib/db';
import { projects, research } from '@/lib/db/schema';

async function testDatabaseConnection() {
  try {
    console.log('🔌 Testing Neon Database Connection...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Set' : '❌ Not set');
    
    // Test 1: Fetch projects
    console.log('\n📋 Test 1: Fetching Projects...');
    const projectsData = await db.select().from(projects).limit(5);
    console.log(`✅ Projects: Found ${projectsData.length} records`);
    
    // Test 2: Fetch research
    console.log('\n📚 Test 2: Fetching Research...');
    const researchData = await db.select().from(research).limit(5);
    console.log(`✅ Research: Found ${researchData.length} records`);
    
    console.log('\n🎉 Database Integration Status: SUCCESS');
    console.log('✅ Neon database is properly connected');
    
    return {
      status: 'success',
      projectsCount: projectsData.length,
      researchCount: researchData.length
    };
  } catch (error: any) {
    console.error('\n❌ Database Integration Status: FAILED');
    console.error('Error:', error.message);
    return {
      status: 'error',
      error: error.message
    };
  }
}

testDatabaseConnection();
