const express = require('express');
const multiparty = require('multiparty');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

const uploadPath = path.join(__dirname, 'upload/');
const filePath = path.join(uploadPath, 'files/');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(uploadPath));

let chatRoom = [];
let chatId = 0;

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
            });
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


app.get('/api/chatsubmit', (req, res) => {
    chatRoom.unshift({
        text: req.query.text,
        id: chatId++,
        date: new Date().getTime()
    });
    res.json({
        err: 0,
        data: {
            msg: 'success'
        }
    }).end();
});
app.get('/api/chatList', (req, res) => {
    res.json({
        err: 0,
        data: {
            list: chatRoom
        }
    }).end();
});

app.get('/404(.html)?', (req, res) => {
    res.end('404');
});

app.get('/*', (req, res) => {
    if (/\.html$/.test(req.url)) {
        res.redirect('/404');
        return;
    }
    res.redirect(req.url + '.html');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
