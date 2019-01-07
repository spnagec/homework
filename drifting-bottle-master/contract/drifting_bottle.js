"use strict";

/**
 * 
 * @param {*} text 
 * 保存数据
 */
var BottleItem = function(text) {
	if (text) {
		var obj = JSON.parse(text);
        this.id = obj.id;     
        this.author = obj.author;
        this.time = obj.time;
	} else {
	    this.id = "";
	    this.author = "";
        this.time = "";
	}
};
BottleItem.prototype = {
	toString: function () {
		return JSON.stringify(this);
	}
};

/**
 * 
 * @param {*} text 
 * 保存信息数据
 * 信息数据中寸有id作为外键，可以根据id找到所有的信息
 */
var MessageItem = function(text){
    if(text){
        var obj = JSON.parse(text);
        this.id = obj.id;
        this.author = obj.author;
        this.time = obj.time;
        this.value = obj.value;
        this.bottleId = obj.bottleId;
    }else{
        this.id = "";
        this.author = "";
        this.time = obj.time;
        this.value = obj.value;
        this.bottleId = obj.bottleId;
    }
};
MessageItem.prototype = {
    toString: function () {
		return JSON.stringify(this);
	}
}




var DriftingBottle = function () {
    //用来存储
    LocalContractStorage.defineMapProperty(this, "bottles", {
        parse: function (text) {
            return new BottleItem(text);
        },
        stringify: function (o) {
            return o.toString();
        }
    });
    
    //保存id
    LocalContractStorage.defineProperty(this,"bottleIdMap");
    
    //的数量
    LocalContractStorage.defineProperty(this, "size");
    
    LocalContractStorage.defineMapProperty(this,"messages",{
        parse: function(text){
            return new MessageItem(text);
        },
        stringify: function(o){
            return o.toString();
        }
    })

};


/**
 * 随机字符串
 * 
 * (Number(Math.random().toString().substr(2) + Date.now())/7).toString(36).slice(0,12)
 */
DriftingBottle.prototype = {
    init: function () {
        // todo
        this.size = 0;
    },

    /**
     * 
     * @param {*} message
     *  
     */
    sendBottle ( message) {

        console.log('>>>>contract<<<<',message);
        var index = this.size;
       

        message = message.trim();
        if ( message === ""){
            throw new Error("empty key / value");
        }
        if (message.length > 128){
            throw new Error("key / value exceed limit length")
        }

        var from = Blockchain.transaction.from;

        var bottleItem = new BottleItem();
        bottleItem.author = from;
        var bottleId = (Number(Math.random().toString().substr(2) + Date.now())/7).toString(36).slice(0,12);
        bottleItem.id = bottleId;
        var time = new Date().getTime();
        bottleItem.time = time;

        this.bottles.put(bottleId, bottleItem);
        this.bottleIdMap.set(index, bottleId);
        this.size +=1;



        var messageItem = new MessageItem();
        messageItem.author = from;
        var msgId = (Number(Math.random().toString().substr(2) + Date.now())/7).toString(36).slice(0,12);
        messageItem.id = msgId;
        messageItem.time = time;
        messageItem.value = message;
        messageItem.bottleId = bottleId;
        this.messages.put(msgId,messageItem);

    },
    /**
     * 
     * @param {*} message 
     * @param {*} bottleId 
     * 响应
     */
    responseBottle(message,bottleId){
        var messageItem = new MessageItem();
        var from = Blockchain.transaction.from;
        messageItem.author = from;
        var msgId = (Number(Math.random().toString().substr(2) + Date.now())/7).toString(36).slice(0,12);
        messageItem.id = msgId;
        messageItem.time = time;
        messageItem.value = message;
        messageItem.bottleId = bottleId;
        this.messages.put(msgId,messageItem);
    },
    len:function(){
        return this.size;
    },
    pickBottle:function(){
        var randomIndex = Math.floor(Math.random() * this.size);
        var bottleId = this.bottleIdMap.get(randomIndex);
        var bottle = this.bottles.get(bottleId);

        var message = this.messages.get(bottle.id);
        return {
            bottle: bottle,
            message: message
        }
    }
};
module.exports = DriftingBottle;