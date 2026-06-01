import http from 'http';

const data = JSON.stringify({
  firstName: 'Fasih Test',
  email: 'fasihmunir12@gmail.com'
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/newsletter/subscribe',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  let responseData = '';
  res.on('data', (chunk) => {
    responseData += chunk;
  });
  res.on('end', () => {
    console.log('Body:', responseData);
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.write(data);
req.end();
