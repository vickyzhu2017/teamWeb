function test(){
    this.exec = function(route, req, res){

		// var url = require('url');
		// console.log(route);
		// //方法一arg => aa=001&bb=002
		// var arg1 = url.parse(req.url).query;
		// //方法二arg => { aa: '001', bb: '002' }
		// var arg2 = url.parse(req.url, true).query;
		// console.log(arg1);
		// console.log(arg2);

		// var testUrl =  'http://localhost:8888/select?aa=001&bb=002';
		// var p = URL.parse(testUrl); 
		// console.log(p.href); //取到的值是：http://localhost:8888/select?aa=001&bb=002
		// console.log(p.protocol); //取到的值是：http: 
		// console.log(p.hostname);//取到的值是：locahost
		// console.log(p.host);//取到的值是：localhost:8888
		// console.log(p.port);//取到的值是：8888
		// console.log(p.path);//取到的值是：/select?aa=001&bb=002
		// console.log(p.hash);//取到的值是：null 
		// console.log(p.query);// 取到的值是：aa=001
		// console.log(p.pathname);//取到的值是：/select




		var jade = require('jade');

		// 渲染文件
		jade.renderFile('./test/testjade.jade',{
			foo: 1,
			pageTitle: '页面',
			youAreUsingJade:'true'
		}, function(err, html){
			// console.log(err);
			// console.log(html);

			res.statusCode = 200;
	        res.setHeader('Content-Type', 'text/html');
	        res.end(html);
		});
    }

}


module.exports = new test();




