微信小程序可用的Protobuf（含demo）
=====================

**Protobuf：**
一种轻便高效的结构化数据存储格式，平台无关、语言无关、可扩展，可用于通讯协议和数据存储等领域;

**微信小程序：**
基于微信平台的小程序


***此库意义：***
在微信小程序中Function 和 eval 相关的动态执行代码方式都给屏蔽了，以致google官方Protobuf不能正常使用；针对以上问题，修改了dcodeIO 的protobuf.js部分实现方式，以致微信小程序中运行protobuf.js。


安装以及使用
---------
* 1、首先下载本代码，将其中weichatPb文件夹加入到你的小程序项目中
* 2、安装pbjs工具
	
	* 基于node.js，首先安装protobufjs
	
	```
	$ npm install -g protobufjs
	```
	会出现
	
	```
	/usr/local/lib
	└─┬ protobufjs@6.8.6 
	  ├── @protobufjs/aspromise@1.1.2 
	  ├── @protobufjs/base64@1.1.2 
	  ├── @protobufjs/codegen@2.0.4 
	  ├── @protobufjs/eventemitter@1.1.0 
	  ├── @protobufjs/fetch@1.1.0 
	  ├── @protobufjs/float@1.0.2 
	  ├── @protobufjs/inquire@1.1.0 
	  ├── @protobufjs/path@1.1.2 
	  ├── @protobufjs/pool@1.1.0 
	  ├── @protobufjs/utf8@1.1.0 
	  ├── @types/long@3.0.32 
	  ├── @types/node@8.9.5 
	  └── long@4.0.0 

	```
	证明安装成功
	
	* 接着安装 pbjs需要的库 命令行执行下“pbjs”就ok
	
	```
	$ pbjs
	```
	
	会出现
	
	```
	-t, --target     Specifies the target format. Also accepts a path to require a custom target.

                   json          JSON representation
                   json-module   JSON representation as a module
                   proto2        Protocol Buffers, Version 2
                   proto3        Protocol Buffers, Version 3
                   static        Static code without reflection (non-functional on its own)
                   static-module Static code without reflection as a module

  	-p, --path       Adds a directory to the include path.

  	-o, --out        Saves to a file instead of writing to stdout.

  	--sparse         Exports only those types referenced from a main file (experimental).

  	Module targets only:

  	-w, --wrap       Specifies the wrapper to use. Also accepts a path to require a custom wrapper.

                   	default   Default wrapper supporting both CommonJS and AMD
                   	commonjs  CommonJS wrapper
                   	amd       AMD wrapper
                   	es6       ES6 wrapper (implies --es6)
                   	closure   A closure adding to protobuf.roots where protobuf is a global

  	--dependency     Specifies which version of protobuf to require. Accepts any valid module id

  	-r, --root       Specifies an alternative protobuf.roots name.

  	-l, --lint       Linter configuration. Defaults to protobuf.js-compatible rules:

                   	eslint-disable block-scoped-var, no-redeclare, no-control-regex, no-prototype-builtins

  	--es6            	Enables ES6 syntax (const/let instead of var)

  	Proto sources only:

  	--keep-case      Keeps field casing instead of converting to camel case.

  	Static targets only:

  	--no-create      Does not generate create functions used for reflection compatibility.
  	--no-encode      Does not generate encode functions.
  	--no-decode      Does not generate decode functions.
  	--no-verify      Does not generate verify functions.
  	--no-convert     Does not generate convert functions like from/toObject
  	--no-delimited   Does not generate delimited encode/decode functions.
  	--no-beautify    Does not beautify generated code.
  	--no-comments    Does not output any JSDoc comments.

  	--force-long     Enfores the use of 'Long' for s-/u-/int64 and s-/fixed64 fields.
  	--force-number   Enfores the use of 'number' for s-/u-/int64 and s-/fixed64 fields.
  	--force-message  Enfores the use of message instances instead of plain objects.
	
	```
	
	证明安装成功
	
* 3、接下来我们使用pbjs 转换一下.proto文件

	*  我们先准备一份awesome.proto文件，内容如下
	
	```
	// awesome.proto
	syntax = "proto3";

	message AwesomeMessage {
    	string awesome_field = 1; // becomes awesomeField
	}
	
	```
	*	接下来我们来转换awesome.proto文件	
	```
	$ pbjs -t json awesome.proto > awesome.json
	```
	*  这时我们会得到一个awesome.json文件，内容如下

	```json
	{
 	 "nested": {
 	 	"AwesomeMessage": {
      		"fields": {
        	  "awesomeField": {
          	   "type": "string",
          	   "id": 1
        	  }
      	   }
        }
  	  }
	}
	```
	*  但此时的json文件我们不能直接使用，不过我们可以将json对象取出放到小程序项目当中去，比如在小程序项目中新建一个awesome.js，内容为

	
	```js
	module.exports = {
    	"nested": {
        	"AwesomeMessage": {
            	"fields": {
                "awesomeField": {
                    "type": "string",
                    "id": 1
               }
            }
         }
       }
	};
	```

* 4、此时总算到我们使用该文件的时候了，我们在项目中新建一个js文件（需要在项目中require该文件），其内容如下


```js
var protobuf = require('../weichatPb/protobuf.js'); //引入protobuf模块
var  awesomeConfig = require('./awesome.js');//加载awesome.proto对应的json
var AwesomeMessage = AwesomeRoot.lookupType("AwesomeMessage");//这就是我们的Message类

var payload = {awesomeField: "我是test1"};
var message = AwesomeMessage.create(payload);
var buffer = AwesomeMessage.encode(message).finish();
console.log("buffer", buffer);
var deMessage = AwesomeMessage.decode(buffer);
console.log("deMessage", deMessage);

```

结语
----
附件中有我的测试demo小程序编辑器打开后，直接在控制台就可以看到我的测试过程，测试代码在testProtocoBuffer.js中。
如果您对于该工具库有更好的提升欢迎提出，如果您在使用中发现bug或者有疑惑也可以反馈，我都会解答的  (*^__^*) 嘻嘻……

