const express=require("express");
//引入连接池
const pool=require("../pool.js");
//创建路由器
var router=express.Router();

//添加路由
//1.商品列表路由
router.get("/list",function(req,res){
	//1.1获取数据并验证
	if(!req.query.pno){
		req.query.pno=1;
	}
	if(!req.query.size){
		req.query.size=9;
	}
	var pno=Number(req.query.pno);
	var size=Number(req.query.size);
	var start=(pno-1)*size;
	pool.query(`SELECT lid,price,title FROM xz_laptop	LIMIT ?,?`,[start,size],function(err,result){
		if(err) throw err;
		if(result.length>0){
			res.send({
				code:200,
				msg:result
			});
		}else{
			res.send({
				code:401,
				msg:"select err"
			});
		}
	});
});

//2.商品详情
router.get("/detail",function(req,res){
	if(!req.query.lid){
		res.send({
			code:401,
			msg:"lid required"
		});
		return;
	}
	var lid=parseInt(req.query.lid);
	pool.query(`SELECT * FROM xz_laptop WHERE lid=?`,[lid],function(err,result){
		if(err) throw err;
		if(result.length>0){
			res.send({
				code:200,
				msg:"select suc"
			});
		}else{
			res.send({
				code:301,
				msg:"select err"
			});
		}
	});
});

//3.商品删除
router.get("/delete",function(req,res){
	if(!req.query.lid){
		res.send({
			code:401,
			msg:"lid required"
		});
		return;
	}
	var lid=parseInt(req.query.lid);
	pool.query(`DELETE FROM xz_laptop WHERE lid=?`,[lid],function(err,result){
		if(err) throw err;
		if(result.affectedRows>0){
			res.send({
				code:200,
				msg:"delete suc"
			});
		}else{
			res.send({
				code:301,
				msg:"delete err"
			});
		}
	});
});


//4.商品添加
router.post("/add",function(req,res){
	var obj=req.body;
	//console.log(obj)
	//类型转换
	obj.family_id=parseInt(obj.family_id);
	obj.price=parseFloat(obj.price);
	obj.shelf_time=parseInt(obj.shelf_time);
	obj.sold_count=parseInt(obj.sold_count);
	obj.is_onsale=parseInt(obj.is_onsale);
	var count=400;//初始化返回码
	for(var key in obj){
		count++;
		if(!obj[key]){
			res.send({
				code:count,
				msg:key+" required"
			});
			return;
		}	
	}
	pool.query(`INSERT INTO xz_laptop SET ?`,[obj],function(err,result){
		if(err) throw err;
		if(result.affectedRows>0){
			res.send({
				code:200,
				msg:"add suc"
			});
		}
	});
});


//导出router
module.exports=router;