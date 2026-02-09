import http from 'http';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from current directory
dotenv.config();

const apiKey = process.env.API_KEY;

if (!apiKey) {
    console.error("❌ ERROR: API_KEY not found in environment variables (or .env file).");
    process.exit(1);
} else {
    console.log(`ℹ️  Loaded API_KEY (length: ${apiKey.length})`);
}

const options = {
    hostname: 'localhost',
    port: 8080,
    path: '/api/status-check-middleware', // Arbitrary path
    method: 'GET',
    headers: {}
};

const makeRequest = (name, headers, expectedStatus) => {
    return new Promise((resolve) => {
        const reqOptions = { ...options, headers };
        const req = http.request(reqOptions, (res) => {
            console.log(`[${name}] Status: ${res.statusCode} (Expected: ${expectedStatus})`);

            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === expectedStatus) {
                    console.log(`✅ ${name} passed.`);
                    resolve(true);
                } else {
                    console.log(`❌ ${name} failed.`);
                    console.log(`   Headers sent: ${JSON.stringify(headers)}`);
                    console.log(`   Response Body: ${data}`);
                    resolve(false);
                }
            });
        });
        req.on('error', (e) => {
            console.error(`[${name}] Error: ${e.message}`);
            resolve(false);
        });
        req.end();
    });
};

async function runTests() {
    console.log("Starting verification...");

    // Test 1: No API Key
    const test1 = await makeRequest('No API Key', {}, 401);

    // Test 2: Wrong API Key
    const test2 = await makeRequest('Wrong API Key', { 'x-api-key': 'wrong-key-123' }, 401);

    // Test 3: Correct API Key
    // We expect 404 because the path /api/status-check-middleware likely doesn't exist.
    // If we get 401, the key was rejected.
    // If we get 404 (or 200), the key was accepted (middleware passed).
    const test3 = await makeRequest('Correct API Key', { 'x-api-key': apiKey }, 404);

    if (test1 && test2 && test3) {
        console.log("🎉 All tests passed!");
    } else {
        console.log("⚠️ Some tests failed.");
        process.exit(1);
    }
}

runTests();
