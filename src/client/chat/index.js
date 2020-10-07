
import {httpRequest} from '../utils/utils';

import './chat.css';

const input = document.createElement('textarea');
const btn = document.createElement('div');
const root = document.createElement('div');
const chatWrap = document.createElement('div');

function getChatList() {
    return new Promise((resolve, reject) => {
        httpRequest({
            url: '/api/chatList',
            method: 'get'
        }, (err, res) => {
            try {
                let data = JSON.parse(res);
                if (data.err) {
                    return reject(data.msg);
                }
                return resolve(data.data.list);
            }
            catch (e) {
                return reject(e);
            }
        });
    });
}
function fetchParseChatData() {
    getChatList().then(list => {
        const wrap = document.createDocumentFragment();
        list.forEach((v, i) => {
            const div = document.createElement('div');
            div.innerText = new Date(v.date) + '\n' + v.text + '\n\n';
            wrap.appendChild(div);
        });
        chatWrap.innerHTML = '';
        chatWrap.appendChild(wrap);
    });
}



function bindEvent() {
    btn.addEventListener('click', () => {
        const text = input.value;
        httpRequest({
            url: `/api/chatsubmit?text=${text}`,
            method: 'get'
        }, () => fetchParseChatData());
    });
}


function parseDom() {
    btn.setAttribute('class', 'btn');
    btn.innerText = '提交';
    root.appendChild(input);
    root.appendChild(btn);
    root.appendChild(chatWrap);
    document.body.appendChild(root);
}



function init() {
    fetchParseChatData();
    bindEvent();
    parseDom();
}


init();
