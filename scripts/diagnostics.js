#!/usr/bin/env node

// Simple diagnostic script to test Supabase connection and performance
import { createClient } from './lib/supabase/client.js'

async function runDiagnostics() {
  console.log('🔍 Running reachoutto.me diagnostics...\n')
  
  try {
    // Test 1: Environment variables
    console.log('1. Checking environment variables...')
    const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
    const hasKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    console.log(`   ✅ SUPABASE_URL: ${hasUrl ? 'Present' : '❌ Missing'}`)
    console.log(`   ✅ SUPABASE_ANON_KEY: ${hasKey ? 'Present' : '❌ Missing'}`)
    
    if (!hasUrl || !hasKey) {
      console.log('   ❌ Missing required environment variables')
      return
    }
    
    // Test 2: Supabase connection
    console.log('\n2. Testing Supabase connection...')
    const supabase = createClient()
    const start = performance.now()
    
    const { data, error } = await supabase
      .from('users')
      .select('count', { count: 'exact', head: true })
    
    const duration = performance.now() - start
    
    if (error) {
      console.log(`   ❌ Connection failed: ${error.message}`)
      return
    }
    
    console.log(`   ✅ Connected successfully (${duration.toFixed(2)}ms)`)
    console.log(`   📊 Users in database: ${data?.length || 0}`)
    
    // Test 3: Auth performance
    console.log('\n3. Testing auth performance...')
    const authStart = performance.now()
    const { data: authData, error: authError } = await supabase.auth.getSession()
    const authDuration = performance.now() - authStart
    
    console.log(`   ✅ Auth check completed (${authDuration.toFixed(2)}ms)`)
    console.log(`   👤 Session status: ${authData?.session ? 'Active' : 'None'}`)
    
    // Performance recommendations
    console.log('\n📈 Performance Analysis:')
    if (duration > 1000) {
      console.log('   ⚠️  Database queries are slow (>1s). Consider:')
      console.log('      - Adding database indexes')
      console.log('      - Optimizing queries')
      console.log('      - Using connection pooling')
    } else if (duration > 500) {
      console.log('   ⚠️  Database queries are moderate (>500ms)')
    } else {
      console.log('   ✅ Database performance is good')
    }
    
    if (authDuration > 500) {
      console.log('   ⚠️  Auth checks are slow (>500ms)')
    } else {
      console.log('   ✅ Auth performance is good')
    }
    
  } catch (error) {
    console.log(`❌ Diagnostic failed: ${error.message}`)
  }
}

export default runDiagnostics
