/**
 * Firebase Discovery Script
 * This script will:
 * 1. Test Firebase connection
 * 2. List all collections
 * 3. Sample documents to understand schema
 * 4. Identify what data exists
 */

import * as dotenv from 'dotenv';
import * as admin from 'firebase-admin';

// Load environment variables
dotenv.config();

async function discoverFirebase() {
  console.log('🔍 Starting Firebase Discovery...\n');

  // Initialize Firebase
  try {
    console.log('📡 Initializing Firebase Admin SDK...');

    // Check which credentials are available
    const hasServiceAccountPath = !!process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
    const hasProjectId = !!process.env.FIREBASE_PROJECT_ID;
    const hasClientEmail = !!process.env.FIREBASE_CLIENT_EMAIL;
    const hasPrivateKey = !!process.env.FIREBASE_PRIVATE_KEY;

    console.log('\n🔑 Credential Check:');
    console.log(`   Service Account Path: ${hasServiceAccountPath ? '✅' : '❌'}`);
    console.log(`   Project ID: ${hasProjectId ? '✅' : '❌'}`);
    console.log(`   Client Email: ${hasClientEmail ? '✅' : '❌'}`);
    console.log(`   Private Key: ${hasPrivateKey ? '✅' : '❌'}`);

    if (!hasServiceAccountPath && (!hasProjectId || !hasClientEmail || !hasPrivateKey)) {
      console.error('\n❌ Error: No Firebase credentials found!');
      console.error('Please set either:');
      console.error('  - FIREBASE_SERVICE_ACCOUNT_PATH, or');
      console.error('  - FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY');
      process.exit(1);
    }

    let credential;
    if (hasServiceAccountPath && process.env.FIREBASE_SERVICE_ACCOUNT_PATH !== '/path/to/serviceAccountKey.json') {
      console.log(`\n📂 Using service account file: ${process.env.FIREBASE_SERVICE_ACCOUNT_PATH}`);
      credential = admin.credential.cert(process.env.FIREBASE_SERVICE_ACCOUNT_PATH!);
    } else if (hasProjectId) {
      console.log(`\n🔐 Using environment variables for project: ${process.env.FIREBASE_PROJECT_ID}`);
      credential = admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID!,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || '',
      });
    }

    admin.initializeApp({ credential });

    const db = admin.firestore();
    console.log('✅ Firebase initialized successfully!\n');

    // List all collections
    console.log('📚 Discovering Collections...\n');
    const collections = await db.listCollections();

    if (collections.length === 0) {
      console.log('⚠️  No collections found in the database.');
      console.log('This could mean:');
      console.log('  - Database is empty');
      console.log('  - Service account lacks permissions');
      console.log('  - Wrong Firebase project');
      return;
    }

    console.log(`Found ${collections.length} collection(s):\n`);

    // Examine each collection
    for (const collection of collections) {
      console.log(`\n${'='.repeat(70)}`);
      console.log(`📁 Collection: ${collection.id}`);
      console.log(`${'='.repeat(70)}`);

      // Get document count and sample
      const snapshot = await collection.limit(3).get();
      console.log(`   Documents: ${snapshot.size} (showing first 3)`);

      if (snapshot.empty) {
        console.log('   ⚠️  Collection is empty');
        continue;
      }

      let docIndex = 0;
      snapshot.forEach((doc) => {
        docIndex++;
        console.log(`\n   📄 Document ${docIndex}: ${doc.id}`);
        const data = doc.data();

        // Show field names and types
        console.log('   Fields:');
        Object.keys(data).forEach(key => {
          const value = data[key];
          let type: string = typeof value;

          if (value === null) {
            type = 'null';
          } else if (value && typeof value.toDate === 'function') {
            type = 'Timestamp';
          } else if (Array.isArray(value)) {
            type = `array[${value.length}]`;
          } else if (typeof value === 'object') {
            type = `object{${Object.keys(value).join(', ')}}`;
          }

          // Show a preview of the value
          let preview = '';
          if (type === 'string' && value.length > 50) {
            preview = value.substring(0, 47) + '...';
          } else if (type === 'Timestamp') {
            preview = value.toDate().toISOString();
          } else if (Array.isArray(value)) {
            preview = `[${value.slice(0, 3).join(', ')}${value.length > 3 ? ', ...' : ''}]`;
          } else if (typeof value === 'object' && value !== null) {
            preview = JSON.stringify(value).substring(0, 50);
          } else {
            preview = String(value);
          }

          console.log(`      - ${key}: ${type} = ${preview}`);
        });
      });
    }

    console.log(`\n${'='.repeat(70)}`);
    console.log('\n✅ Discovery Complete!\n');

    // Summary and recommendations
    console.log('📊 Summary:');
    console.log(`   Total Collections: ${collections.length}`);
    collections.forEach(c => console.log(`      - ${c.id}`));

    console.log('\n💡 Next Steps:');
    console.log('   1. Review the collections and their schemas above');
    console.log('   2. Compare with expected structure in SETUP.md');
    console.log('   3. Identify any schema adjustments needed');
    console.log('   4. We can update the Business Intelligence types to match your data');

  } catch (error: any) {
    console.error('\n❌ Error during discovery:', error.message);

    if (error.code === 'ENOENT') {
      console.error('\n💡 File not found. Check that FIREBASE_SERVICE_ACCOUNT_PATH points to a valid file.');
    } else if (error.message.includes('Permission denied')) {
      console.error('\n💡 Permission denied. Ensure your service account has Firestore access.');
    } else if (error.message.includes('Project ID')) {
      console.error('\n💡 Invalid project ID. Check your Firebase credentials.');
    }

    console.error('\nFull error:', error);
    process.exit(1);
  }
}

discoverFirebase();
