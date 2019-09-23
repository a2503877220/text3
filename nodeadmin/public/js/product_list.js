//1.发送ajax请求返回数据，渲染页面
//  1.创建一个函数loadProduct(pno,pageSize)
//    ajax请求  路径product/list  
//请求回来console.log(result)
function loadProduct(pno,pageSize){
    $.ajax({
        url:"product/list",
        type:"get",
        data:{pno:pno,pageSize:pageSize},
        success:(result)=>{
            // console.log(result);
            //创建tr td 里面渲染内容
            //把数据库的数据拼接，拿出来，然后拆分，最后组成字符语句，放入html()输出
            var html="";
            for(var key of result.data){
                html+=`      <tr>
                                <td><input type="checkbox" class="pselall"></td>
                                <td>${key.lid}</td>
                                <td>${key.title}</td>
                                <td>${key.os}</td>
                                <td>${key.spec}</td>
                                <td>${key.lname}</td>
                                <td>${key.price}</td>
                                <td>
                                <a href="${key.lid}" class="btn-del">删除</a>
                                <a href="${key.lname}" data-price="${key.price}" data-lid="${key.lid}" class="btn-update">更新</a>
                                <a href="">详情</a>
                                </td>
                            </tr>`
             }
            $("#tbody1").html(html);    //输出
            var html1="";
            var pageCount=parseInt(result.pageCount);
            var pno=parseInt(result.pno);
            if(pno-2>0){
                html1+=`<li><a href="${pno-2}">${pno-2}</li>`
            }
            if(pno-1>0){
                html1+=`<li><a href="${pno-1}">${pno-1}</li>`
            }
            html1+=`<li><a href="${pno}">${pno}</li>`
            if(pno+1<pageCount){
                html1+=`<li><a href="${pno+1}">${pno+1}</li>`
            }
            if(pno+2<pageCount){
                html1+=`<li><a href="${pno+2}">${pno+2}</li>`
            }
            $("#pagination").html(html1);
        }
    })
}
loadProduct(1,5);
//修改
$("#tbody1").on("click",".btn-update",function(e){
    e.preventDefault();
    var lname=$(this).attr("href");
    var price=$(this).attr("data-price");
    var lid=$(this).attr("data-lid");
    $("[data-action='update-ok']").data("lid",lid);
    // console.log(lname);
    // console.log(lid);
    // console.log(price);
    $(".pname").html(lname);
    $(".input-price").val(price);
    $(".update-jumbotron").show();
    $("[data-action='update-ok']").click(function(){   
        var lid = $(this).data("lid");
        console.log(lid);
        var price=$(".input-price").val();
        console.log(price);
        $.ajax({
            url:"product/update",
            type:"get",
            data:{price:price,lid:lid},
            success:(result)=>{
                console.log(result);
                if(result.code>0){
                    alert(result.msg)   
                    location.reload();
                }else{
                    alert(result.msg);
                }
            }
        })
    })
    $(".txt-btn a:last-child").click(function(){
        $(".update-jumbotron").hide();
    })

})
//删除
$("#tbody1").on("click",".btn-del",function(){
    event.preventDefault();
    var lid=parseInt($(this).attr("href"))
    if(window.confirm(`是否选择删除此行?`)){
        $.ajax({
            url:"product/del",
            type:"get",
            data:{lid:lid},
            success:(result)=>{
                console.log(result);
                if(result.code>0){
                    alert(result.msg)   
                    location.reload();
                }else{
                    alert(result.msg);
                }
            }
        })
    }

})


//功能：按钮点击请求当前页数据显示
$("#pagination").on("click","li>a",function(e){
        e.preventDefault();
        var pno=$(this).attr("href");
        loadProduct(pno,5);
})
//功能：全选点击事件实现
//1.点击全选按钮，所有商品复选框都选中
//  全选取消，所有商品的复选框都取消
//2.点击所有商品的复选框，判断是否都选择，如果全部选中，
//  全选按钮同时选中，否则即使一个未选中，全选取消


$(".selAll").click(function(){
    var sel=$(this).prop("checked");
    $(".pselall").prop("checked",sel);
})

$("#tbody1").on("click",".pselall",function(){
    var psel=$(this).prop("checked")
    var number=$(".pselall").length;
    console.log(number)
    if(!psel){
        $(".selAll").prop("checked",false)
    }
    else if($(".pselall:checked").length==number){
        $(".selAll").prop("checked",true);
    }
})