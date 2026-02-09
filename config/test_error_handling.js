import http from 'http';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.API_KEY;

const options = {
    hostname: 'localhost',
    port: 8080,
    path: '/api/auth/register',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
    }
};

const makeRequest = () => {
    return new Promise((resolve) => {
        const req = http.request(options, (res) => {
            console.log(`Status: ${res.statusCode}`);

            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                console.log(`Response Body: ${data}`);

                try {
                    const json = JSON.parse(data);
                    if (res.statusCode === 400 && json.ok === false && json.data === null) {
                        console.log("✅ Error handling test passed!");
                        resolve(true);
                    } else {
                        console.log("❌ Error handling test failed.");
                        resolve(false);
                    }
                } catch (e) {
                    console.log("❌ Failed to parse JSON.");
                    resolve(false);
                }
            });
        });

        req.on('error', (e) => {
            console.error(`Error: ${e.message}`);
            resolve(false);
        });

        // Send empty body to trigger "Debes ingresar todos los datos" error (400)
        req.write(JSON.stringify({}));
        req.end();
    });
};

makeRequest();
