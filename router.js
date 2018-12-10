const handler = require('./handler');
//给module.exports 赋值一个函数  ，函数可以接受参数
module.exports = function (req, res) {
    if (req.url.startsWith('/index') || req.url === '/') { //首页
        handler.showIndex(req, res);
    } else if (req.url.startsWith('/details')) { //详情页
        handler.showDetails(req, res);
    } else if (req.url.startsWith('/submit')) { //提交页
        handler.showSubmit(req, res);
    } else if (req.url.startsWith('/assets')) { //静态资源
        handler.showStatic(req, res);
    } else if (req.url.startsWith('/add') && req.method == "GET") { //get添加页面
        handler.getAdd(req, res);

    } else if (req.url.startsWith('/add') && req.method == "POST") { //post-add
        handler.postAdd(req, res);
    } else {
        handler.notFound(req, res);
    }
}