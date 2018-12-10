const http = require('http');
//引入自定义模块
const router = require('./router');

//创建服务器
const server = http.createServer();
//监听
server.on('request', (req, res) => {
    router(req,res);
});

server.listen(9999, () => console.log('http://localhost:9999 服务已启动'));

