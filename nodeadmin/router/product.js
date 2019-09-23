// 引入模块
const express=require("express");
const qs = require("querystring")
// 创建路由对象
var router=express.Router();
const pool=require("../pool");
// 添加各种应用/list 分页显示产品列表
router.get("/list",(req,res)=>{
    // 获取参数 pno  pageSize
    var pno=req.query.pno  || 1;  //当前页
    var pageSize=req.query.pageSize||8;  //页大小
    // console.log(pno);
    // console.log(pageSize);
    // res.send("ok");
    // 正则表达式
    var reg=/^\d{1,}$/;
    if(!reg.test(pno)){
        res.json({code:-1,msg:"页面参数有误"})
    }else{
        if(!reg.test(pageSize)){
            res.json({code:-1,msg:"页面参数有误"})
        }
    }
    var output={};
    output.pno=pno;
    output.pageSize=pageSize;
    var progress=0;//记录sql语句完成的进度
    // 从链接池中获取链接
    // 创建sql语句获取数据内容   总记录数
    pool.getConnection((err,conn)=>{
        if(err) throw err;
        var sql="SELECT count(lid) AS c FROM xz_laptop";
        conn.query(sql,(err,result)=>{
            console.log(result); 
            var total = result[0].c;
            output.pageCount = Math.ceil(total / pageSize);
            progress+=50;
            if(progress==100){
               res.json(output);
            }
        })
        conn.release();
    })
    // 创建sql数据内容          当前页的内容
    
    pool.getConnection((err,conn)=>{
        if(err)throw err;
        var sql="SELECT lid,title,price,spec,lname,os FROM xz_laptop LIMIT ?,?"
        pageSize=parseInt(pageSize);
        var offset=(pno-1)*pageSize;
        conn.query(sql,[offset,pageSize],(err,result)=>{
            console.log(result);
            output.data=result;
            progress += 50;
            if (progress == 100) {
                res.json(output);
            }
        })
        conn.release();
    })
})

// res.json("产品列表")
router.get("/del",(req,res)=>{
    //获取参数
    //正则表达式验证
    //从链接池中获取连接
    //创建sql语句并发送，判断是否删除成功
     var lid = parseInt(req.query.lid); //当前页 //页大小
    var reg=/^\d{1,}$/; 
    if(!reg.test(lid)){
        res.json({code:-1,msg:"页面参数有误"})
    }
    pool.getConnection((err,conn)=>{
        if(err) throw err;
        var sql="DELETE FROM xz_laptop WHERE lid=?";
        // pageSize=parseInt(pageSize);
        // pno=parseInt(pno);
        // var offset=(pno-1)
        conn.query(sql,[lid],(err,result)=>{
            if (err) throw err
            if (result.affectedRows>0) {
                //>0代表：删除了数据；code>0成功，<0失败
                res.json({
                    code: 1,
                    msg: "删除成功"
                })
            } else {
                res.json({
                    code: -1,
                    msg: "删除失败"
                })
            }
        })
        conn.release();
    })

})

router.get("/update",(req,res)=>{
    var lid=parseInt(req.query.lid);
    var price=parseFloat(req.query.price);
    var reg=/^\d{1,}$/;
    if(!reg.test(lid)){
        res.json({code:-1,msg:"页面参数有误"})
        return ;
    }
    var regprice=/^\d{1,}(.\d{1,}?$)/
        if(!regprice.test(price)){
            res.json({code:-1,msg:"页面参数有误"})
            return ;
    }
    pool.getConnection((err,conn)=>{
        if(err) throw err;
        var sql="UPDATE xz_laptop SET price=? WHERE lid=?"
        conn.query(sql,[price,lid],(err,result)=>{
            if (err) throw err
            if (result.affectedRows > 0) {
                //>0代表：更新了数据；code>0成功，<0失败
                res.json({
                    code: 1,
                    msg: "更新成功"
                })
            } else {
                res.json({
                    code: -1,
                    msg: "更新失败"
                })
            }
        })
    })
})

// 将路由对象导出
module.exports=router;