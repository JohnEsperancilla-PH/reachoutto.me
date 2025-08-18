#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setup() {
  console.log('🚀 Welcome to reachoutto.me setup!\n');
  
  console.log('This script will help you configure your environment variables.');
  console.log('You can find these values in your Supabase project dashboard.\n');

  const supabaseUrl = await question('Enter your Supabase Project URL: ');
  const supabaseAnonKey = await question('Enter your Supabase Anon Key: ');
  const supabaseServiceKey = await question('Enter your Supabase Service Role Key (optional, for admin features): ');

  const envContent = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseAnonKey}
${supabaseServiceKey ? `SUPABASE_SERVICE_ROLE_KEY=${supabaseServiceKey}` : '# SUPABASE_SERVICE_ROLE_KEY=your_service_role_key'}`;

  const envPath = path.join(process.cwd(), '.env.local');
  
  try {
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ Environment variables saved to .env.local');
  } catch (error) {
    console.error('\n❌ Error writing .env.local:', error.message);
    process.exit(1);
  }

  console.log('\n📋 Next steps:');
  console.log('1. Run the SQL migration in your Supabase dashboard');
  console.log('2. Copy the contents of supabase/migrations/20240101000001_initial_schema.sql');
  console.log('3. Paste and run it in your Supabase SQL Editor');
  console.log('4. Run "npm run dev" to start the development server');
  console.log('5. Visit http://localhost:3000 to see your app!');
  
  console.log('\n🎉 Setup complete! Happy coding!');
  
  rl.close();
}

setup().catch(error => {
  console.error('Setup failed:', error);
  process.exit(1);
});
