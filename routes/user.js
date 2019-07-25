const express=require("express");
//引入连接池模块
const pool=require("../pool.js");
//创建路由器对象
var router=express.Router();


//添加路由
//1.用户注册
router.post("/reg",function(req,res){
	//1.1获取post请求数据
	var obj=req.body;
	console.log(obj);
	//1.2验证数据是否为空
	if(!obj.uname){
		res.send({//人为规定
			code:401,
			msg:"uname required"
		});
		return;//阻止往后执行
	}else if(!obj.upwd){
		res.send({
			code:402,
			msg:"upwd required"
		});
		return;
	}else if(!obj.email){
		res.send({
			code:403,
			msg:"email required"
		});
		return;
	}else if(!obj.phone){
		res.send({
			code:404,
			msg:"phone required"
		});
		return;
	}

	//1.3执行SQL语句
	pool.query(`INSERT INTO xz_user SET ?`,[obj],function(err,result){
		if(err) throw err;
		if(result.affectedRows>0){
			res.send({
				code:200,
				msg:"register suc"
			});
		}
	});
});

//2.用户登录
router.post("/login",function(req,res){
	//2.1获取数据
	var obj=req.body;
	console.log(obj);
	//2.2验证数据不为空
	if(!obj.uname){
		res.send({	//显示一个json格式的数据
			code:401,
			msg:"uname required"
		});
		return;//阻止往后执行
	}else if(!obj.upwd){
		res.send({
			code:402,
			msg:"upwd required"
		});
		return;
	}
	//2.3执行SQL语句
	//查找用户和密码同时满足的数据
	pool.query(`SELECT * FROM xz_user WHERE uname=? AND upwd=?`,[obj.uname,obj.upwd],function(err,result){
		if(err) throw err;
		//console.log(result);
		if(result.length){
			res.send({
				code:200,
				msg:"login suc"
			});
		}else{
			res.send({
				code:301,
				msg:"login err"
			});
		}
	});
});

//3.用户检索
router.get("/detail",function(req,res){
	//3.1获取数据
	//console.log(req.query);
	var obj=req.query;
	//3.2验证是否为空
	if(!obj.uid){
		res.send({
			code:401,
			msg:"uid required"
		});
		return;
	}
	//3.3执行SQL语句
	pool.query(`SELECT * FROM xz_user WHERE uid=?`,[obj.uid],function(err,result){
		if(err) throw err;
		//判断是否检索到用户，如果检索到，把该用户的对象响应到浏览器，否则响应检索不到
		if(result.length){
			res.send(result[0]);
		}else{
			res.send({
				code:301,
				msg:"can not found"
			});
		}
	});
});
//4.修改用户信息
router.get("/update",function(req,res){
	//4.1获取数据
	var obj=req.query;
	//4.2验证是否为空（批量验证）
	//遍历对象，获取每个属性值
	var count=400;
	for(var key in obj){
		count++;
		//如果属性值为空，则提示属性名是必须的
		if(!obj[key]){
			res.send({
				code:count,
				msg:key+" required"
			});
			return;
		}
	}
	//4.3执行SQL语言
	/*
	pool.query(`UPDATE xz_user SET email=?,phone=?,user_name=?,gender=? WHERE uid=?`,[obj.email,obj.phone,obj.user_name,obj.gender,obj.uid],function(err,result){
		if(err) throw err;
		if(result.affectedRows>0){
			res.send("修改成功");
		}else{
			res.send("修改失败");
		}
	});
	*/
	pool.query(`UPDATE xz_user SET ? WHERE uid=?`,[obj,obj.uid],function(err,result){
		if(err) throw err;
		if(result.affectedRows>0){
			res.send({
				code:200,
				msg:"update suc"
			});
		}else{
			res.send({
				code:401,
				msg:"update err"
			});
		}
	});
});
//5.分页查询
router.get("/list",function(req,res){
	//5.1获取数据
	var obj1=req.query;
	//5.2验证数据是否为空，转整型
	var obj2=new Object();
	var pno=parseInt(obj1.pno);
	var size=parseInt(obj1.size);
	//console.log(obj2);
	if(!pno){
		pno=1;
	}
	if(!size){
		size=3;
	}
	//5.3计算start值
	var start=0;
	start=(pno-1)*size;
	//5.4执行SQL语句
	pool.query(`SELECT * FROM xz_user LIMIT ?,?`,[start,size],function(err,result){
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

//6.删除用户
router.get("/delete",function(req,res){
	//6.1获取数据
	var uid=Number(req.query.uid);
	//6.2验证数据
	if(!uid){
		res.send({
			code:401,
			msg:"uid required"
		});
		return;
	}
	//6.3执行SQL语句
	pool.query(`DELETE FROM xz_user WHERE uid=?`,[uid],function(err,result){
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

//导出路由器对象
module.exports=router;