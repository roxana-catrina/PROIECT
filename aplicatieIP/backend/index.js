const http = require('http');
const mongoose = require('mongoose');
require('dotenv').config();

const PORT = process.env.PORT || 8083;
const DATABASE_NAME = process.env.DATABASE_NAME || 'Vitalium';

// Așteaptă conexiunea la MongoDB înainte de a porni serverul
mongoose.connect(process.env.MONGODB_URI, {
    dbName: DATABASE_NAME,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
})
.then(() => {
    console.log(`Connected to MongoDB database: ${DATABASE_NAME}`);
    startServer();
})
.catch(err => {
    console.error('Could not connect to MongoDB:', err);
    process.exit(1);
});

function startServer() {
    const server = http.createServer(async (req, res) => {
        // CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Credentials', 'true');

        if (req.method === 'OPTIONS') {
            res.writeHead(204);
            res.end();
            return;
        }

        console.log('Received request for:', req.url);

        const getCollectionData = async (collectionName) => {
            try {
                // Verifică explicit conexiunea
                if (mongoose.connection.readyState !== 1) {
                    throw new Error('Database connection is not ready');
                }

                const db = mongoose.connection.db;
                if (!db) {
                    throw new Error('Database instance is not available');
                }

                console.log(`Attempting to fetch ${collectionName}...`);
                const collection = db.collection(collectionName);
                
                if (!collection) {
                    throw new Error(`Collection ${collectionName} not found`);
                }

                const data = await collection.find({}, { projection: { _class: 0 } }).toArray();
                console.log(`Found ${data.length} documents in ${collectionName}`);
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: true,
                    [collectionName]: data,
                    total: data.length
                }));
            } catch (error) {
                console.error(`Error in getCollectionData:`, error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    success: false,
                    error: `Error fetching ${collectionName}`,
                    details: error.message
                }));
            }
        };

        // Request handling
        if (req.method === 'GET') {
            switch(req.url) {
                case '/api/patients':
                    await getCollectionData('patients');
                    break;
                
                case '/api/doctors':
                    await getCollectionData('doctors');
                    break;
                
                case '/api/users':
                    await getCollectionData('users');
                    break;
                
                case '/api/sensors':
                    await getCollectionData('sensors');
                    break;
                
                case '/api/alerts':
                    await getCollectionData('alerts');
                    break;
                
                case '/api/recommendations':
                    await getCollectionData('recommendations');
                    break;

                default:
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Not Found' }));
            }
            return;
        }

        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Method Not Allowed' }));
    });

    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}