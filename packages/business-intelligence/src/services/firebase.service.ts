import * as admin from 'firebase-admin';

/**
 * Firebase Service - Read-only connection to Firebase
 * Handles initialization and provides access to Firestore
 */
export class FirebaseService {
  private static instance: FirebaseService;
  private app: admin.app.App;
  private db: admin.firestore.Firestore;

  private constructor() {
    // Initialize Firebase Admin SDK
    if (!admin.apps.length) {
      const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
      const hasValidPath = serviceAccountPath &&
                          serviceAccountPath !== '/path/to/serviceAccountKey.json' &&
                          serviceAccountPath.trim().length > 0;

      if (hasValidPath) {
        // Use service account file path
        this.app = admin.initializeApp({
          credential: admin.credential.cert(serviceAccountPath!),
        });
      } else if (process.env.FIREBASE_PROJECT_ID &&
                 process.env.FIREBASE_CLIENT_EMAIL &&
                 process.env.FIREBASE_PRIVATE_KEY) {
        // Use individual environment variables
        this.app = admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          }),
        });
      } else {
        // Fallback to default credentials (for Cloud environments)
        this.app = admin.initializeApp();
      }
    } else {
      this.app = admin.apps[0] as admin.app.App;
    }

    this.db = this.app.firestore();

    // Configure Firestore settings
    this.db.settings({
      ignoreUndefinedProperties: true,
    });
  }

  /**
   * Get singleton instance of FirebaseService
   */
  public static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  /**
   * Get Firestore database instance (read-only access)
   */
  public getDb(): admin.firestore.Firestore {
    return this.db;
  }

  /**
   * Get a reference to a collection
   */
  public collection(collectionName: string): admin.firestore.CollectionReference {
    return this.db.collection(collectionName);
  }

  /**
   * Helper to convert Firestore timestamp to Date
   */
  public timestampToDate(timestamp: admin.firestore.Timestamp | Date | undefined): Date {
    if (!timestamp) {
      return new Date();
    }
    if (timestamp instanceof Date) {
      return timestamp;
    }
    return timestamp.toDate();
  }

  /**
   * Health check - verify Firebase connection
   */
  public async healthCheck(): Promise<boolean> {
    try {
      // Try to read from a collection (doesn't matter if it exists)
      await this.db.collection('_health_check').limit(1).get();
      return true;
    } catch (error) {
      console.error('Firebase health check failed:', error);
      return false;
    }
  }
}

export default FirebaseService.getInstance();
