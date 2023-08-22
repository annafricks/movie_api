const http = require('http');
const fs = require('fs');
const url = require('url');

http.createServer((request, response) => {
    let parsedUrl = new URL(request.url, `http://${request.headers.host}`);

    let filePath = '';

    if (parsedUrl.pathname.includes('documentation')) {
        filePath = __dirname + '/documentation.html';
    } else {
        filePath = __dirname + '/index.html';
    }

    fs.appendFile('log.txt', `URL: ${parsedUrl.href}\nTimestamp: ${new Date()}\n\n`, (err) => {
        if (err) {
            console.log('append error:', err);
        } else {
            console.log('msg appended');
        }
    });

    fs.readFile(filePath, (err, data) => {
        if (err) {
            throw err;
        }
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.write(data);
        response.end('hello node');
    });
})

.listen(8080, () => {
    console.log('My test server is running on Port 8080');
});
