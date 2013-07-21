function main(){
    var no = 0;
    var i = 0;
    $(".colorbar").each(function(){ $(this).attr("no",i++); });
    i = 0;

    // ブラウザによって丸い色見本の位置が左にずれるので、ずれた分右にずらす
    var left = $(".colorbar:last").position().left+$(".colorbar:last").width()+20;
    var move = $(".view0").position().left - left;
    move = move < 0 ? move * -1 : 0;
    $(".view").each(
	function(){ 
	    $(this).attr("no",i++);
	    if (move) $(this).css("left", $(this).position().left + move);
	}
    );
    
    SetColor(0,"#e6cc00");
    SetColor(1,"#ff7799");
    SetColor(2,"#e6e1b9");
    SetColor(3,"#ffcc99");
    SetColor(4,"#ff7700");
    SetColor(5,"#e6f000");
    SetColor(6,"#a0cc00");
    $(".colorbar:eq(0)").css("border", "solid 6px #000");

    $(".colorbar").click(
	function(){
	    $(".colorbar").css("border", "solid 6px #fff");
	    $(this).css("border", "solid 6px #000");
	    no = $(this).attr("no");
	}
    );
    $(".view").click(
	function(){
	    $(".colorbar[no="+$(this).attr("no")+"]").trigger("click");
	}
    );
    $(".picker").ColorPicker({
	onSubmit:function(hsb,hex,rgb,el){
	    $(el).ColorPickerHide();
	    SetColor(no,"#"+hex);
	},
	onBeforeShow:function(){
	    $(this).parent().trigger("click");
	    var target = $(".colorbar:eq("+no+")");
	    $(this).ColorPickerSetColor(target.attr("hex") ? target.attr("hex") : "#e32222");
	}
    });
    $(".dark").click(
	function(){
	    $(this).parent().trigger("click");
	    var hsv = HEXtoHSV($(".colorbar:eq("+no+")").attr("hex"));
	    hsv.s += 10;
	    hsv.v -= 10;
	    if (hsv.s>255) hsv.s=255;
	    if (hsv.v<0) hsv.v=0;
	    SetColor(no,HSVtoHEX(hsv.h,hsv.s,hsv.v));
	}
    );
    $(".light").click(
	function(){
	    $(this).parent().trigger("click");
	    var hsv = HEXtoHSV($(".colorbar:eq("+no+")").attr("hex"));
	    hsv.s -= 10;
	    hsv.v += 10;
	    if (hsv.s<0) hsv.s=0;
	    if (hsv.v>255) hsv.v=255;
	    SetColor(no,HSVtoHEX(hsv.h,hsv.s,hsv.v));
	}
    );
    $("#random").click(
	function(){
	    $("#fixparet").prop("checked", false);
	    var r,g,b;
	    for (var i=0;i<=6;i++){
		r = Math.floor(Math.random() * 256);
		g = Math.floor(Math.random() * 256);
		b = Math.floor(Math.random() * 256);
		SetColor(i,RGBtoHEX(r,g,b));
	    }
	}
    );
    function SetColor(aNo, aHex){
	var target = $(".colorbar:eq("+aNo+")"); 
	var rgb = HEXtoRGB(aHex);
	if (!rgb) return;
        var hsv = RGBtoHSV(rgb.r,rgb.g,rgb.b);
	$(target).css("background",aHex);
	$(target).css("color", (rgb.r*3)+(rgb.g*6)+rgb.b>=1275 ? "#000" : "#fff");
	$(target).attr("hex",aHex);
	$("p",target).html(
	    "<b>"+aNo+"</b>"
	    +"<br />"+aHex
	    +"<br />[R] "+rgb.r
	    +"<br />[G] "+rgb.g
	    +"<br />[B] "+rgb.b
	    +"<br />[H] "+hsv.h
	    +"<br />[S] "+hsv.s
	    +"<br />[V] "+hsv.v);

	$(".view:eq("+aNo+")").css("background",aHex);
	if (aNo != 0) return;
	if ($("#fixparet").prop("checked") && $(".samplecolor li").length) return;

	$(".samplecolor li").remove();
	var step = 10;
	var n = 0;
	var hex;
	while (n <= 255) {
	    hex = RGBtoHEX(n,rgb.g,rgb.b);
	    $("#sampleR").append("<li style='background:"+hex+"' hex='"+hex+"'></li>");
	    n += step;
	}
	n = 0;
	while (n <= 255) {
	    hex = RGBtoHEX(rgb.r,n,rgb.b);
	    $("#sampleG").append("<li style='background:"+hex+"' hex='"+hex+"'></li>");
	    n += step;
	}
	n = 0;
	while (n <= 255) {
	    hex = RGBtoHEX(rgb.r,rgb.g,n);
	    $("#sampleB").append("<li style='background:"+hex+"' hex='"+hex+"'></li>");
	    n += step;
	}
	var h = hsv.h;
	n = 0;
	while (n <= 360) {
	    hex = HSVtoHEX(h, hsv.s, hsv.v);
	    $("#sampleH").append("<li style='background:"+hex+"' hex='"+hex+"'></li>");
            h += step;
	    n += step;
	}
	n = 0;
	while (n <= 260) {
	    hex = HSVtoHEX(hsv.h, n, hsv.v);
	    $("#sampleS").append("<li style='background:"+hex+"' hex='"+hex+"'></li>");
	    n += step;
	}
	n = 0;
	while (n <= 260) {
	    hex = HSVtoHEX(hsv.h, hsv.s, n);
	    $("#sampleV").append("<li style='background:"+hex+"' hex='"+hex+"'></li>");
	    n += step;
	}
	$(".samplecolor li").click(
	    function(){
		SetColor(no, $(this).attr("hex"));
		$("li:contains('"+no+"')").text("");
		$(this).text(no);
	    }
	);	
    }
    /* 引用：元サイト見つからず */
    function HEXtoRGB(aHex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(aHex);
	return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
	} : null;
    }
    function RGBtoHEX(r,g,b) {
	var r1 = r;
	var g1 = g;
	var b1 = b;
	if (r1<0) r1=0;
	if (r1>255) r1=255;
	if (g1<0) g1=0;
	if (g1>255) g1=255;
	if (b1<0) b1=0;
	if (b1>255) b1=255;
	var r1 = r1.toString(16);
	var g1 = g1.toString(16);
	var b1 = b1.toString(16);
	if (r1.length == 1) r1 = "0"+r1;
	if (g1.length == 1) g1 = "0"+g1;
	if (b1.length == 1) b1 = "0"+b1;
	return "#"+r1+g1+b1;
    }
    function HSVtoHEX(h,s,v) {
	var rgb = HSVtoRGB(h,s,v);
	return RGBtoHEX(rgb.r, rgb.g, rgb.b);
    }
    function HEXtoHSV(aHex){
	var rgb = HEXtoRGB(aHex);
	return RGBtoHSV(rgb.r, rgb.g, rgb.b);
    }

    /** 引用：http://d.hatena.ne.jp/ja9/20100903/1283504341
     * RGB配列 を HSV配列 へ変換します
     *
     * @param   {Number}  r         red値   ※ 0～255 の数値
     * @param   {Number}  g         green値 ※ 0～255 の数値
     * @param   {Number}  b         blue値  ※ 0～255 の数値
     * @param   {Boolean} coneModel 円錐モデルにするか
     * @return  {Object}  {h, s, v} ※ h は 0～360の数値、s/v は 0～255 の数値
     */
    function RGBtoHSV (r, g, b, coneModel) {
	var h, // 0..360
	s, v, // 0..255
	max = Math.max(Math.max(r, g), b),
	min = Math.min(Math.min(r, g), b);

	// hue の計算
	if (max == min) {
	    h = 0; // 本来は定義されないが、仮に0を代入
	} else if (max == r) {
	    h = 60 * (g - b) / (max - min) + 0;
	} else if (max == g) {
	    h = (60 * (b - r) / (max - min)) + 120;
	} else {
	    h = (60 * (r - g) / (max - min)) + 240;
	}

	while (h < 0) {
	    h += 360;
	}

	// saturation の計算
	if (coneModel) {
	    // 円錐モデルの場合
	    s = max - min;
	} else {
	    s = (max == 0)
		? 0 // 本来は定義されないが、仮に0を代入
		: (max - min) / max * 255;
	}

	// value の計算
	v = max;

	return {'h': Math.round(h), 's': Math.round(s), 'v': Math.round(v)};
    }
    /** 引用：http://d.hatena.ne.jp/ja9/20100903/1283504341
      * HSV配列 を RGB配列 へ変換します
      *
      * @param   {Number}  h         hue値        ※ 0～360の数値
      * @param   {Number}  s         saturation値 ※ 0～255 の数値
      * @param   {Number}  v         value値      ※ 0～255 の数値
      * @return  {Object}  {r, g, b} ※ r/g/b は 0～255 の数値
      */
    function HSVtoRGB (h, s, v) {
	var r, g, b; // 0..255

	while (h < 0) {
	    h += 360;
	}

	h = h % 360;

	// 特別な場合 saturation = 0
	if (s == 0) {
	    // → RGB は V に等しい
	    v = Math.round(v);
	    return {'r': v, 'g': v, 'b': v};
	}

	s = s / 255;

	var i = Math.floor(h / 60) % 6,
	f = (h / 60) - i,
	p = v * (1 - s),
	q = v * (1 - f * s),
	t = v * (1 - (1 - f) * s)

	switch (i) {
	case 0 :
	    r = v;  g = t;  b = p;  break;
	case 1 :
	    r = q;  g = v;  b = p;  break;
	case 2 :
	    r = p;  g = v;  b = t;  break;
	case 3 :
	    r = p;  g = q;  b = v;  break;
	case 4 :
	    r = t;  g = p;  b = v;  break;
	case 5 :
	    r = v;  g = p;  b = q;  break;
	}

	return {'r': Math.round(r), 'g': Math.round(g), 'b': Math.round(b)};
    }
}