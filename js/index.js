/**
 * Created by DragonBaby on 2017/7/3.
 */

(function(win){
   //建立气泡父类
    var bubble = win.bubble = function(r,x,y){
        this.r = r;
        this.x = x;
        this.y = y;
    };

    var _blue_ = bubble.blue = function (r,x,y) {
        bubble.call(this, r, x, y);
        this.type = "blue";
        this.timer = null;
    };
    _blue_.prototype =new bubble();
    bubble.blue.prototype  = {
        run :function () {
            console.log("run");
        }
    };


    var _pink_ = bubble.pink = function(r,x,y){
        bubble.call(this,r,x,y);
        this.elem = null;
        this.type = "pink";
    };
    _pink_.prototype = new bubble();
    bubble.pink.prototype = {
        init :function (id) {
            this.elem  = document.getElementById(id);
            this.top = this.elem.offsetTop - this.elem.clientHeight/2;
            this.left = this.elem.offsetLeft - this.elem.clientWidth/2;
            console.log(this);
            this.bind();
        },
        bind : function () {
            var _this = this;
            this.elem.addEventListener("mousemove",function(e){
                _this.move_bind(e);
            },false)
        },
        move_bind : function(e){
            e= e||window.event;
            var _x = parseInt(e.pageX)-this.left;
            var _y = parseInt(e.pageY)-this.top;
            if(_x <= 0 + this.r) {_x = this.r;}
            if(_x >= g_data.wrap.width - this.r) {_x = g_data.wrap.width - this.r;}
            if(_y <= 0 + this.r) {_y = this.r;}
            if(_y >= g_data.wrap.height - this.r) {_y = g_data.wrap.height - this.r;}
            this.x = _x;
            this.y = _y;
            bubbelTounch();
            // draw(this.r,_x,_y,"pink");
        }
    };


    var bubbelTounch = function(){
        for(var i=0;i<g_data.bule.length;i++){
            var x_x = Math.abs(g_data.pink.x-g_data.bule[i].x);
            var y_y = Math.abs(g_data.pink.y-g_data.bule[i].y)
            var rang = Math.sqrt(x_x*x_x+y_y*y_y);
            if(rang<g_data.bule[i].r+g_data.pink.r){
                alert("碰到");
            }
        }
    };



})(window);


(function () {

    var cs = document.getElementById("bubble-box");
    var cxt = cs.getContext("2d");
    var img_pink = new Image();
    var img_blue = new Image();
    img_pink.src = 'img/pink.png';
    img_blue.src = 'img/blue.png';

    var  draw = function (bel) {
        cxt.strokeStyle = "red";
        cxt.lineWidth = "2";

        var _x_ = bel.x-bel.r;
        var _y_ = bel.y-bel.r;
        //绘制圆
        // cxt.beginPath();
        // cxt.arc(bel.x,bel.y,bel.r,0,2*Math.PI);
        if(bel.type == 'pink'){
            cxt.drawImage(img_pink,_x_,_y_,bel.r*2,bel.r*2);
        }
        if(bel.type == 'blue'){
            cxt.drawImage(img_blue,_x_,_y_,bel.r*2,bel.r*2);
            if(_x_ < 0){                //若超过边界则显示越界的部分
                cxt.drawImage(img_blue,_x_+g_data.wrap.width,_y_,bel.r*2,bel.r*2);
            }
            if(_x_ > g_data.wrap.width-g_data.max_r*2){
                cxt.drawImage(img_blue,_x_-g_data.wrap.width,_y_,bel.r*2,bel.r*2);
            }
            if(_y_ < 0){                //若超过边界则显示越界的部分
                cxt.drawImage(img_blue,_x_,_y_+g_data.wrap.height,bel.r*2,bel.r*2);
            }
            if(_y_ > g_data.wrap.width-g_data.max_r*2){
                cxt.drawImage(img_blue,_x_,_y_-g_data.wrap.height,bel.r*2,bel.r*2);
            }
        }
        // cxt.drawImage(img_pink,0,0,100,100);
        // cxt.stroke();
    };


    draw.update = function () {
        cxt.clearRect(0,0,1000,600);
        draw(g_data.pink);
        for(var i in g_data.bule){
            draw(g_data.bule[i]);
        }

    };
    window.draw = draw;
})();



(function () {
    var  data  = window.g_data= {"wrap":{}};

    //定义作用区域宽度和高度
    var width = data.wrap.width = 1000;
    var height = data.wrap.height = 600;
    var max_r = data.max_r = 50;



    //屏幕中央坐标为  width/2  height/2
    var  cc = new bubble.pink(max_r,width/2-max_r,height/2-max_r);
    data.pink = cc;
    data.bule = createBlue();
    cc.init("bubble-wrap");
    flashMap(60,draw.update);



})();



//解决js原生定时器不准的方法
function flashMap(fps,callback) {
    var previous = new Date();
    var acc = 0;
    var dt = 1000/fps;

    function loop() {
        var current = new Date();
        var passed = current - previous;
        previous = current;
        acc += passed;
        while(acc >= dt){    //若相差时间大于一个帧时间 就一直执行刷新动画
            if(typeof(callback) == 'function'){
                callback();
            }
        acc -= dt;
        }
    }

    //原生定时器启动
    setInterval(loop,1000/fps)

}



//创建随机个数的蓝泡泡
function  createBlue(){
    var list = new Array();
    var num = 15;
    var max_r = (g_data.max_r/10);   //定义最大半径系数
    var width_num = g_data.wrap.width/(g_data.max_r*2);
    var height_num = g_data.wrap.height/(g_data.max_r*2);
    var _temp = new Array(width_num*height_num);
    var rand_num = Math.floor(Math.random()*max_r*2)*10;

    for(var i = 0;i<_temp.length;i++){       //定义一个备用数组
        _temp[i] = null;
    }
    for(var i=0;i<num;i++){
        var grid  = null;
        do{
            grid = Math.floor((Math.random()*_temp.length));
        }while(_temp[grid] != null||
            (grid>=(height_num/2-2)*width_num+(width_num/2-2)&&grid<=(height_num/2-2)*width_num+(width_num/2+1))||
            (grid>=(height_num/2-1)*width_num+(width_num/2-2)&&grid<=(height_num/2-1)*width_num+(width_num/2+1))||
            (grid>=(height_num/2)*width_num+(width_num/2-2)&&grid<=(height_num/2)*width_num+(width_num/2+1))||
            (grid>=(height_num/2+1)*width_num+(width_num/2-2)&&grid<=(height_num/2+1)*width_num+(width_num/2+1)));

        _temp[grid] = 0;
        var _x_ = grid%width_num;
        var _y_ = Math.floor(grid/width_num);
        // console.log(_x_+'    '+_y_+'   grid:'+ grid);
        list[i] = new bubble.blue(
            (Math.floor(Math.random()*(max_r)))*10+10,        //半径r
            (_x_*g_data.max_r*2+50)+rand_num,                 //x坐标
            (_y_*g_data.max_r*2+50)+rand_num                  //y坐标
        )
    }

    _temp = null;
    return list;

}



