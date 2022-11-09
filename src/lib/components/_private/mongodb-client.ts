import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env['NODE_ENV'] === 'development') {
	const MONGODB_URI = process.env['DEV_MONGODB_URI'];

	const options = {
		useUnifiedTopology: true,
		useNewUrlParser: true,
		tlsAllowInvalidHostnames: true,
		tlsAllowInvalidCertificates: true
	};

	if (!MONGODB_URI) {
		throw new Error('Please add your Mongo URI to .env.local');
	}

	// In development mode, use a global variable
	// so that the value is preserved across module reloads
	// caused by HMR (Hot Module Replacement).
	// if (!global._mongoClientPromise) {
	// 	client = new MongoClient(MONGODB_URI, options);
	// 	client.connect();
	// }
	client = new MongoClient(MONGODB_URI, options);
	clientPromise = client.connect();
} else {
	const MONGODB_URI = process.env['MONGODB_URI'];

	const options = {
		useUnifiedTopology: true,
		useNewUrlParser: true,
		tlsAllowInvalidHostnames: true,
		tlsAllowInvalidCertificates: true
	};

	if (!MONGODB_URI) {
		throw new Error('Please add your Mongo URI to .env.local');
	}

	// In production mode, it's best to
	// not use a global variable.
	client = new MongoClient(MONGODB_URI, options);
	clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise.
// By doing this in a separate module,
// the client can be shared across functions.
export default clientPromise;
