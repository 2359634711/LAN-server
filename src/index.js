const express = require('express');
const multiparty = require('multiparty');
const fs = require('fs');


const app = express();
const port = 3000;
app.use(express.static('public'));

app.get('/', (req, res) => res.send('Hello World!'));

const filePath = 'public/files/';

app.post('/api/upload', (req, res) => {
    const form = new multiparty.Form({
        uploadDir: filePath
    });

    form.parse(req, (err, fields, files) => {
        try {
            const inputFile = files.upload[0];
            fs.rename(inputFile.path, filePath + inputFile.originalFilename, err => {
                res.json({
                    err: 0,
                    data: {
                        msg: 'upload success'
                    }
                });
            });
        }
        catch (e) {
            res.json({
                err: 1,
                msg: '服务器解析失败',
                data: {
                    msg: '服务器解析失败'
                }
            })
        }
    });
});


app.get('/api/files', (req, res) => {
    fs.readdir(filePath, (err, files) => {
        res.json({
            err: 0,
            data: {
                list: files
            }
        }).end();
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));