export function httpRequest(opt, cb, progressCb) {
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
