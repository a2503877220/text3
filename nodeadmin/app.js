// 引入模块
const http=require("http");
const express=require("express");
const routerProduct=require("./router/product");
// 创建服务器
var app=express();
var server=http.createServer(app);
server.listen(3008);
// 配置静态目录
app.use(express.static("./public"));
// 加载相应模块
app.use("/product",routerProduct);  
