$(function(){
	var canvas = $('#canvas').get(0);
	var ctx = canvas.getContext('2d');
	var canvasS = 500;
	var row = 15;
	canvas.height = canvasS;
	canvas.width = canvasS;
	var blocks = canvasS/row;
	var jiange = blocks/2;
	var lineWidth = canvasS - blocks;
	var deg = function(deg){
		return Math.PI/180*deg;
	}
	var draw = function(){
		var off = jiange + 0.5;
		//横
		ctx.save();
		ctx.beginPath();
		ctx.translate(off,off);
		for(var i = 0;i<row; i++ ){
			ctx.moveTo(0,0);
			ctx.lineTo(lineWidth,0);
			ctx.translate(0,blocks)
		}
		ctx.stroke();
		ctx.closePath();
		ctx.restore();
        //竖
		ctx.save();
		ctx.beginPath();
		ctx.translate(off,off);
		for(var i =0;i<row;i++){
			ctx.moveTo(0,0)
		    ctx.lineTo(0,lineWidth)
            ctx.translate( blocks,0 );
		}
		ctx.stroke();
		ctx.closePath();
		ctx.restore();
		//圆
		var point = [3.5*blocks + 0.5,11.5*blocks +0.5];
		for(var i = 0;i<2;i++){
			for(var j = 0;j<2;j++){
			    var x = point[i];
			    var y = point[j];
				ctx.save();
				ctx.beginPath();
		        ctx.translate(x,y);
		        ctx.arc(0,0,3,0,deg(360));
		        ctx.fill();
		        ctx.closePath();
		        ctx.restore();
			}
		}
		ctx.save();
		ctx.beginPath();
		ctx.translate(7.5*blocks + 0.5,7.5*blocks + 0.5);
		ctx.arc(0,0,3,0,deg(360));
		ctx.fill();
		ctx.closePath();
		ctx.restore();
	}
	draw();
	//棋
     All = {};
    var flag = true;
    var step = 1;    //棋谱从1开始
    var Radius = blocks/2*0.8;
		// x:1,y:2,color:1,step:1;
	var drop = function(qizi){
			ctx.save();
		    ctx.beginPath();
		    ctx.translate((qizi.x + 0.5)*blocks,(qizi.y +0.5)*blocks);
		    ctx.arc(0,0,Radius,0,(Math.PI/180)*360)
		    if(qizi.color === 1){
		    	var st=ctx.createRadialGradient(5,-5,4,0,0,15);
   st.addColorStop(0,"#ccc");
   st.addColorStop(0.7,"black");
   st.addColorStop(1,"black");
   ctx.fillStyle=st;
		    	ctx.fill();
		    	$('.back').get(0).play();
		    }else{
		    	  var gt=ctx.createRadialGradient(5,-5,2,0,0,15);
  	 gt.addColorStop(0,"#fff");
   gt.addColorStop(0.7,"#ccc");
   gt.addColorStop(1,"#ccc");
   ctx.fillStyle=gt;
		    	ctx.fill();
		    	$('.back2').get(0).play();
		    }
		    ctx.closePath();
		    ctx.restore();
		}
		var puanduan = function(qizi){
			var shuju = {};
			$.each(All,function(k,v){
				if(v.color === qizi.color){
					shuju[k] = v;
				}
			})
			var shu =1,hang =1,zuoxie = 1,youxie =1;
			var tx,ty;// (游标思想，返回原始位置)
			// |
			tx = qizi.x;ty = qizi.y;
			while (shuju [tx + '-' + (ty+1)]){
				shu ++;ty ++;
			}
			tx = qizi.x;ty = qizi.y;
			while (shuju [tx + '-' + (ty-1)]){
				shu ++;ty --;
			}
			//-
			tx = qizi.x;ty = qizi.y;
			while (shuju [(tx +1) + '-' + ty]){
				hang ++;tx ++;
			}
			tx = qizi.x;ty = qizi.y;
			while (shuju [(tx -1) + '-' + ty]){
				hang ++;tx --;
			}
			//\
			tx = qizi.x;ty = qizi.y;
			while (shuju [(tx -1) + '-' + (ty -1)]){
				zuoxie ++;tx --;ty--;
			}
			tx = qizi.x;ty = qizi.y;
			while (shuju [(tx +1) + '-' + (ty +1)]){
				zuoxie ++;tx ++;ty++;
			}
			// /
			tx = qizi.x;ty = qizi.y;
			while (shuju [(tx +1) + '-' + (ty -1)]){
				youxie ++;tx ++;ty--;
			}
			tx = qizi.x;ty = qizi.y;
			while (shuju [(tx -1) + '-' + (ty +1)]){
				youxie ++;tx --;ty++;
			}

			if( shu>=5|| hang>=5 || zuoxie>=5 || youxie>=5){
				return true;
			}
		}

		$('#canvas').on('click',function (e){
			var x = Math.floor(e.offsetX/blocks);
			var y = Math.floor(e.offsetY/blocks);
			if(All[x + '-' +y]){
		    	return;
		    }
			if( flag){
				var qizi = {x:x,y:y,color:1,step:step}
				drop(qizi)
				// flag = false;
				if( puanduan(qizi)){
					// alert("黑棋获胜")
					$('.zhezhao').show();
					$('.tips').show();
				    $('.tishi1').show();
					return;
				}
			}else{
				var qizi = {x:x,y:y,color:0,step:step}	
				drop(qizi)
				// flag = true;
				if( puanduan(qizi)){
					// alert("白棋获胜")
					$('.zhezhao').show();
					$('.tips').show();
				    $('.tishi2').show();
					return;
				}
			}
			step += 1;
			flag = !flag;
			All[x + '-' + y] = qizi;
		})
		//关闭
		$('.close').on('click',function(){
			$('.tips').hide();
			$('.zhezhao').hide();
			ctx.clearRect(0,0,canvasS,canvasS);
			draw();
		    flag = true;
		    All = {};
		    step = 1;
		})
		$('.zhezhao').on('click',function(){
			$('.zhezhao').hide();
			$('.tips').hide();
 		})
 		$('.restart').on('click',function(){
 			$('.tips').hide();
			$('.zhezhao').hide();
			ctx.clearRect(0,0,canvasS,canvasS);
			draw();
		    flag = true;
		    All = {};
		    step = 1;
		})
		//棋谱
		$('.qipu').on('click',function(){
			$('.zhezhao').hide();
			$('.tips').hide();
			$('.save').show();
			$('#canvas').off();
			ctx.save();
			ctx.font = "20px consolas";
			for( var i in All){
				if( All[i].color === 1){
					ctx.fillStyle = '#fff';
				}else{
					ctx.fillStyle = 'black';
				}
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
				ctx.fillText(All[i].step,
					(All[i].x+0.5)*blocks,
					(All[i].y+0.5)*blocks);
			}
			ctx.restore();
			var image = $('#canvas').get(0).toDataURL('image/jpg',1);
			$('.save').attr('href',image);
			$('.save').attr('download','qipu.png');
		})
})

