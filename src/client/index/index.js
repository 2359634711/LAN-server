/**
 * @file index.js
 * @author 2359634711
 * @description 入口文件
 */

import './index.css';

const timer = ((flag = false) => cb => {
    if (flag) {
        return cb && cb();
    }
    setTimeout(() => {
        flag = true;
        cb && cb();
    }, 1e3);
})();

function httpRequest(opt, cb, progressCb) {
    const xmlhttp = new XMLHttpRequest();
    const formData = opt.formData;
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            cb(null, xmlhttp.responseText);
        }
    };
    const onUpload = xmlhttp.upload;
    onUpload.onprogress = progressCb;
    xmlhttp.open(opt.method, opt.url, true);
    if (opt.method === 'post') {
        xmlhttp.setRequestHeader('X-Request-With', 'XMLHttpRequest');
    }
    xmlhttp.send(formData);
}
httpRequest({
    method: 'get',
    url: '/api/files'
}, (err, res) => {
    const data = JSON.parse(res);
    const {list} = data.data;
    let wrapDom = document.createElement('div');
    list.forEach((v, i) => {
        const link = document.createElement('a');
        link.href = '/files/' + v;
        link.innerText = v;
        wrapDom.appendChild(link);
        wrapDom.appendChild(document.createElement('br'));
    });
    let filesWrap = document.getElementById('files-wrap');
    filesWrap.innerHTML = '';
    filesWrap.appendChild(wrapDom);

});
// document.getElementById('file-dom').onchange = upload;
function upload(file) {
    const fileDom = document.getElementById('file-dom');
    try {
        file = file || fileDom.files[0];
    }
    catch (e) {
        console.log(e);
    }
    const formData = new FormData();
    formData.append('upload', file);
    httpRequest({
        method: 'post',
        url: '/api/upload',
        formData
    }, (err, res) => {
        try {
            let data = JSON.parse(res);
            if (data.err) {
                return setProgress(0), alert('上传失败：' + data.msg);
            }
        }
        catch (e) {
            return setProgress(0), alert('JSON解析错误' + res);
        }
        timer(() => {
            alert('上传完毕');
            location.reload();
        });
    }, ev => {
        const progress = ev.loaded / ev.total * 100;
        setProgress(progress);
    });
}

setProgress(0);

function dropInit() {
    const dropWrap = document.getElementById('drop-wrap-dom');
    dropWrap.addEventListener('dragenter', e => {
        dropWrap.style.borderColor = '#ccc';
        dropWrap.style.backgroundColor = 'gray';
    });
    dropWrap.addEventListener('dragleave', e => {
        dropWrap.style.backgroundColor = 'transparent';
    });
    dropWrap.addEventListener('dragover', e => {
        e.stopPropagation();
        e.preventDefault();
    });

    dropWrap.addEventListener('drop', e => {
        dropWrap.style.backgroundColor = 'transparent';  
        e.stopPropagation();
        e.preventDefault();
        const files = [];
        [].forEach.call(e.dataTransfer.files, file => {
            files.push(file);
        }, false);
        upload(files[0]);
    });
}
dropInit();
function setProgress(progress) {
    const progressDom = document.getElementById('loaded-dom');
    progressDom.style.width = `${progress}%`;
    const progressFontDom = document.querySelectorAll('.font');
    progressFontDom.forEach((v, i) => {
        v.innerText = `${progress}%`;
    });
}
