const template = require('art-template');
const fs = require('fs');
const path = require('path');
const mime = require('mime');
const url = require('url');
const queryString = require('querystring');

module.exports = {

    showIndex(req, res) {
        readData(data => {
            data.list.sort((a, b) => b.id - a.id); //排序
            let str = template(path.join(__dirname, 'views', 'index.html'), data); //渲染数据
            res.end(str); //返回给浏览器进行解析 
        });
    },
    showDetails(req, res) {
        let id = url.parse(req.url, true).query.id; //获取id
        readData(data => {
            data = data.list.find(v => v.id == id);
            let str = template(path.join(__dirname, 'views', 'details.html'), data);
            res.end(str);
        })
    },
    showSubmit(req, res) {
        fs.readFile(path.join(__dirname, 'views', 'submit.html'), (err, data) => {
            if (err) {
                return console.log('读取失败', err);
            }
            res.end(data);
        })
    },
    showStatic(req, res) {
        fs.readFile(path.join(__dirname, req.url), (err, data) => {
            if (err) {
                return console.log('读取失败', err);
            }
            //设置mime类型
            res.setHeader('content-type', mime.getType(req.url));
            res.end(data);
        })
    },
    getAdd(req, res) {
        // 1- 获取前端传递的表单数据
        // 2- 取出data.json中数据，转成数组
        // 3- 向新数据添加到数组中
        // 4- 数组转成json格式 写入到data.json文件中
        // 5- 跳转到首页，看到添加的结果     
        let info = url.parse(req.url, true).query;
        //2.取出data。json中的数据，转成数组
        readData(data => {
            //给新数据加id
            info.id = data.list[data.list.length - 1].id + 1;
            //把新数据加到数组中
            data.list.push(info);
            //数组传成字符串 写入到data.json文件中
            data = JSON.stringify(data, null, 2);
            //写入到文件
            writeData(data, () => {
                //跳转到首页
                res.statusCode = 302;
                res.setHeader('location', '/index');
                res.end();
            })
        })
    },
    postAdd(req, res) {
        // post方式获取表单提交的数据 
        // 只要前端以post方式请求服务器，就会触发data事件， 在data事件的回调函数中，chunk 就是本次请求传递数据 
        // data事件有可能触发多次， 数量比较大的情况
        let info = '';
        req.on('data', (chunk) => {
            info += chunk;
        });
        req.on('end', () => {
            info = queryString.parse(info);
            //取出data.json中的数据，转成数组
            readData(data => {
                //给新添加的数据添加id
                info.id = data.list[data.list.length - 1].id + 1;
                data.list.push(info); //把新数组添加到数组中去
                data = JSON.stringify(data, null, 2); //转成json字符串
                //数组转成json格式 写入到data，json文件中去
                writeData(data, () => {
                    //跳转到首页 需要先设置状态码
                    res.statusCode = 302;
                    res.setHeader('location', '/index');
                    res.end();
                })
            })
        })
    },
    notFound(req, res) {
        res.setHeader('content-type', 'text/html;charset=utf-8'); //设置编码
        res.end('404-页面未找到！');
    }

}
//封装读取数据的方法
function readData(callback) {
    fs.readFile(path.join(__dirname, 'data', 'data.json'), 'utf-8', (err, data) => {
        if (err) {
            return console.log('读取失败', err);
        }
        data = JSON.parse(data); //将读取的json字符串转成对象       
        callback && callback(data);
    })
};
//封装写入数据的方法
function writeData(data, callback) {
    fs.writeFile(path.join(__dirname, 'data', 'data.json'), data, (err) => {
        if (err) {
            return console.log('写入失败', err);
        }
        callback && callback();
    })
};