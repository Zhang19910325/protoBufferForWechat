/**
 * Created by zhangmiao on 2018/3/15.
 */


const app = getApp();
//var AwesomeMessage;
var util = require('../weichatPb/src/util.js');
var protobuf = require('../weichatPb/protobuf.js');
app.globalData._protobuf = protobuf;

//awesome
var  awesomeConfig = require('./awesome');
var AwesomeRoot = protobuf.Root.fromJSON(awesomeConfig);

var AwesomeMessage = AwesomeRoot.lookupType("AwesomeMessage");
//awesome

//testProto
var testProtoConfig  = require('./testProto');
var testProtoRoot = protobuf.Root.fromJSON(testProtoConfig);

var Simple1 = testProtoRoot.lookup('jspb.test.Simple1');

function getMessageFromJspbTest(messageName){
    return testProtoRoot.lookup('jspb.test.' + messageName);
}
//testProto


var testMap = {};
function printDump (className, obj,buffer){
    console.log(className,obj,"\n buffer",buffer);
}
function testIt (testName, testProcess){
    testMap[testName] = testProcess;
}

function testWithName(testName){
    var testProcess = testMap[testName];
    console.warn("现在测试:",testName);
    testProcess ? testProcess() : console.warn('没有'+testName+'的测试过程');
}

function testAll(){
    for (var testName in testMap){
        if(!testMap.hasOwnProperty(testName)) continue;
        testWithName(testName)
    }
}

function test1 () {
    var payload = {awesomeField: "我是test1"};
    var message = AwesomeMessage.create(payload);
    var buffer = AwesomeMessage.encode(message).finish();
    console.log("buffer", buffer);
    var deMessage = AwesomeMessage.decode(buffer);
    console.log("deMessage", deMessage);
}

function test2 () {
    var payload = {awesomeField: "我是test2"};
    var message = AwesomeMessage.fromObject(payload);
    var buffer = AwesomeMessage.encode(message).finish();
    console.log("buffer", buffer);
    var deMessage = AwesomeMessage.decode(buffer);
    console.log("deMessage", deMessage);
}


function test3(){
    var simple1 = Simple1.create();
    //assertObjectEquals()
    simple1['aString'] = 'foo';
    simple1.aRepeatedString = ['1', '2'];
    simple1.aBoolean = true;
    var buffer = simple1.encode().finish();
    printDump('encode simple1',simple1,buffer);

    var deMessage = Simple1.decode(buffer);
    printDump('decode simple1',deMessage,buffer);

}




testIt('test1', test1);
testIt('test2', test2);
testIt('test3', test3);
//测试testEmptyProto
testIt('testEmptyProto', function(){
    var Empty = getMessageFromJspbTest('Empty');

    var empty1 = Empty.create();
    //var empty2 = Empty.create();

    console.log('empty1 to Object', empty1.toObject());
});


//测试testExtensions
testIt('testExtensions', function(){
    var IsExtension = getMessageFromJspbTest('IsExtension');
    var extension = IsExtension.create();
    extension.ext1 = 'ext1fieldhgvfgfjghf';
    //isExtension

    console.log('extension:', extension);

    var HasExtensions = getMessageFromJspbTest('HasExtensions');
    var hasExtensions = HasExtensions.create();
    hasExtensions.str1 = 'v1';
    hasExtensions.str2 = 'v2';
    hasExtensions.str3 = 'v3';
    hasExtensions['.jspb.test.IsExtension.extField'] = extension;


    var buffer = hasExtensions.encode().finish();
    printDump('encode hasExtensions', hasExtensions, buffer);

    var deMessage = HasExtensions.decode(buffer);
    printDump('decode hasExtensions', deMessage, buffer);
});

testIt('testTopLevelEnum', function(){
    var EnumContainer = getMessageFromJspbTest('EnumContainer');
    var response = EnumContainer.create();
    response.outerEnum = 'FOO';

    var buffer = response.encode().finish();
    printDump('encode EnumContainer', response, buffer);

    var deMessage = EnumContainer.decode(buffer);
    printDump('decode EnumContainer', deMessage, buffer);
});

testIt('testByteStrings', function(){
    var DefaultValues = getMessageFromJspbTest('DefaultValues');
    var data = DefaultValues.create();
    //data.bytesField = enbase64('中');
    data.bytesField = 'some_bytes';//这中间最好填入二进制流数组

    var buffer = data.encode().finish();
    printDump('encode DefaultValues', data, buffer);

    var deMessage = DefaultValues.decode(buffer);
    printDump('decode DefaultValues', deMessage, buffer);

    console.log(util.byteToString(deMessage.bytesField))
    //console.log(deMessage.bytesField)
});

testIt('testComplexConversion', function(){
    var data  = {
        aString : "a",
        aNestedMessage :{
            anInt : 11
        },
        aRepeatedMessage : [{
            anInt : 22
        }, {
            anInt : 33
        }],
        aRepeatedString : ['s1', 's2'],
        anOutOfOrderBool : 1

    };

    var Complex = getMessageFromJspbTest('Complex');

    var  foo = Complex.create(data);

    var buffer = foo.encode().finish();
    printDump('encode Complex', foo, buffer);


    var deMessage = Complex.decode(buffer);
    printDump('decode Complex', deMessage, buffer);

});

testIt('testMissingFields', function(){
    var Complex = getMessageFromJspbTest('Complex');

    var  foo = Complex.create({
    });

    printDump('missing Complex', foo);
    printDump('object Complex', foo.toObject());
});

testIt('testNestedComplexMessage',function(){
    var Complex  = getMessageFromJspbTest('OuterMessage.Complex');
    var msg = Complex.create();
    msg.innerComplexField = 5;

    var buffer = msg.encode().finish();
    printDump('encode ComplexMessage', msg, buffer);


    var deMessage = Complex.decode(buffer);
    printDump('decode ComplexMessage', deMessage, buffer);
});

testIt('testSpecialCases', function(){
    var SpecialCases = getMessageFromJspbTest('SpecialCases');

    var special = SpecialCases.create({
        normal:'normal',
        default: 'default',
        function : 'function',
        var : 'var'
    });

    var buffer = special.encode().finish();
    printDump('encode SpecialCases', special, buffer);

    var deMessage = SpecialCases.decode(buffer);
    printDump('decode SpecialCases', deMessage, buffer);
});

testIt('testDefaultValues', function(){
    var DefaultValues = getMessageFromJspbTest('DefaultValues');

    var defaultString = "default<>\'\"abc";

    var expectedObject = {
        stringField: defaultString,
        boolField: true,
        intField: 11,
        enumField: 13,
        emptyField: '',
        bytesField: 'moo'
    };

    var response = DefaultValues.create();

    console.log('boolField:' , response['boolField'],'测试结果', response['boolField'] == expectedObject['boolField']);
    console.log('intField:' , response['intField'],'测试结果', response['intField'] == expectedObject['intField']);
    console.log('enumField:' , response['enumField'],'测试结果', response['enumField'] == expectedObject['enumField']);
    console.log('emptyField:' , response['emptyField'],'测试结果', response['emptyField'] == expectedObject['emptyField']);
    console.log('bytesField:' , util.byteToString(response['bytesField']),'测试结果', util.byteToString(response['bytesField']) == expectedObject['bytesField']);

    //todo 这里pbjs 转出来的json有bug 对应的json为:{"default": "default<>abc"} ,应该为  {"default": "default<>\'\"abc"}
    //todo ~~~~(>_<)~~~~ 需要提bug给 protobuf.js  url:https://github.com/dcodeIO/protobuf.js 下面测试通过是我自己改了json后的结果
    console.log('stringField:' , response['stringField'],'测试结果' ,response['stringField'] == expectedObject['stringField'], expectedObject['stringField']);

});

testIt('testGroups', function(){
    var TestGroup = getMessageFromJspbTest('TestGroup');
    var RepeatedGroup = getMessageFromJspbTest('TestGroup.RepeatedGroup');
    var RequiredGroup = getMessageFromJspbTest('TestGroup.RequiredGroup');
    var Simple2 = getMessageFromJspbTest('Simple2');





    var group = TestGroup.create();
    var someGroup = RepeatedGroup.create();
    var requiredGroup = RequiredGroup.create();
    var simple2 = Simple2.create();

    someGroup.id = 'g1';
    someGroup.someBool = [true, false];

    requiredGroup.id = '';


    simple2.aString = "";
    simple2.aRepeatedString = [];

    group.repeatedGroup = [someGroup];
    group.requiredGroup = requiredGroup;
    group.requiredSimple = simple2;


    var buffer = group.encode().finish();
    printDump('encode Group', group, buffer);

    var deMessage = TestGroup.decode(buffer);
    printDump('decode Group', deMessage, buffer);
});

testIt('testInitializeMessageWithSingleValueSetInOneof', function(){
    var TestMessageWithOneof = getMessageFromJspbTest('TestMessageWithOneof');
    //var PartialOneof = getMessageFromJspbTest('TestMessageWithOneof.PartialOneof');

    var message = TestMessageWithOneof.create({
        pone : 'x',
        pthree : 'y'
    });


    message.partialOneof = 'pone';//指定有效属性,不然都会生效
    console.log("message partialOneof:", message.partialOneof);
    console.log("message.pone:", message['pone']);
    console.log("message.pthree:", message['pthree']);


    var buffer = message.encode().finish();
    printDump('encode TestMessageWithOneof', message, buffer);

    var deMessage = TestMessageWithOneof.decode(buffer);
    printDump('decode TestMessageWithOneof', deMessage.toObject(), buffer);
});



testAll();
//testWithName('');