/*
replace_items.jsx
(c)2008 www.seuzo.jp
選択している２つのページアイテムの位置を入れ替えます。

・History
2007-03-18	ver.0.1	とりあえず。「replace_items.jsx」「replace_items_GUI_setting.jsx」という名前でリリース。[http://d.hatena.ne.jp/seuzo/20080316/1205641922:title=選択している２つのページアイテムの位置を入れ替え - 名もないテクノ手]
2009-04-24	ver.0.2	InDesign CS4対応。「swap_items.jsx」「swap_items_GUI_setting.jsx」という名前に変更。スプレッドが回転表示しているときは、処理を中止するようにした。ページアイテムの重なり順を正しく動作するように修正した。
*/


////////////////////////////////////////////設定
const my_position = "left-top"; //オブジェクト揃え原点（left-top, right-top, left-bottom, right-bottom）
const my_replace_index = false; //オブジェクトの重なり順序（階層）も入れ替えるかどうか
const my_replace_layer = false; //レイヤーも入れ替えるかどうか



////////////////////////////////////////////エラー処理 
function myerror(mess) { 
  if (arguments.length > 0) { alert(mess); }
  exit();
}

////////////////////////////////////////////スプレッドの回転角度を得る 
function get_spread_rotation(spread_orPage_obj) {
	if (spread_orPage_obj instanceof Spread) {
		var my_document = spread_orPage_obj.parent;
		var my_page = spread_orPage_obj.pages[0];
	} else if (spread_orPage_obj instanceof Page) {
		var my_document = spread_orPage_obj.parent.parent;
		var my_page = spread_orPage_obj.parent.pages[0];
	} else {
		return false;
	}
	
	var my_org_ruler_origin = false;//
	if (my_document.viewPreferences.rulerOrigin != RulerOrigin.PAGE_ORIGIN) {
		my_old_ruler_origin = my_document.viewPreferences.rulerOrigin;
		my_document.viewPreferences.rulerOrigin = RulerOrigin.PAGE_ORIGIN;
	}
	var my_org_zeroPoint = false;
	if (my_document.zeroPoint != [0, 0]) {
		my_old_zeroPoint = my_document.zeroPoint;
		my_document.zeroPoint = [0,0];
	}

	var my_page_bounds = my_page.bounds;
	var my_angle = -1;
	if((my_page_bounds[0] == 0) && (my_page_bounds[1] == 0)) {
		my_angle = 0;
	} else if ((my_page_bounds[0] == 0) && (my_page_bounds[3] == 0)) {
		my_angle = 90;
	} else if ((my_page_bounds[2] == 0) && (my_page_bounds[3] == 0)) {
		my_angle = 180;
	} else if ((my_page_bounds[1] == 0) && (my_page_bounds[2] == 0)) {
		my_angle = 270;
	}

	if(my_org_ruler_origin) {my_document.viewPreferences.rulerOrigin = my_old_ruler_origin}
	if(my_org_zeroPoint) {my_document.zeroPoint = my_old_zeroPoint}
	return my_angle;
}

////////////////////////////////////////////オブジェクトの座標と幅、高さを得る 
function get_bounds(my_obj) {
	var tmp_hash = new Array();
	var my_obj_bounds = my_obj.visibleBounds; //オブジェクトの大きさ（線幅を含む）
	tmp_hash["y1"] = my_obj_bounds[0];
	tmp_hash["x1"] = my_obj_bounds[1];
	tmp_hash["y2"] = my_obj_bounds[2];
	tmp_hash["x2"] = my_obj_bounds[3];
	tmp_hash["w"] = tmp_hash["x2"] - tmp_hash["x1"]; //幅
	tmp_hash["h"] = tmp_hash["y2"] - tmp_hash["y1"]; //高さ
	return tmp_hash; //ハッシュで値を返す
}

////////////////////////////////////////////与えられたオブジェクトのレイヤー内かつスプレッド内の重なり順を得る
//results  [Layer, pageItems, index]
function get_stackindex_in_layer(my_pageitem_obj) {
	var my_layer = my_pageitem_obj.itemLayer;
	var my_spread = my_pageitem_obj.parent.parent;//pageItem's parent is Page, Page's parent is Spread.
	var my_items = my_spread.pageItems.everyItem().getElements().slice(0);
	var tmp_array = new Array();
	for (var i = 0; i < my_items.length; i++) {
		if (my_items[i].itemLayer == my_layer) {
			tmp_array.push(my_items[i]);
		}
	}
	var tmp_index = -1;//if return -1 is error.
	for (var j = 0; j < tmp_array.length; j++) {
		if (tmp_array[j] == my_pageitem_obj) {tmp_index = j; break;}
	}
	return [my_layer, tmp_array, tmp_index];
}


////////////////////////////////////////////オブジェクトの階層順を変える（最前面は0）
function change_index(my_obj, my_index) {
	my_obj.bringToFront();//まず最前面にする
	//my_indexの回数分、my_objを背面に送る
	for (var i = 0; i < my_index; i++) {
		my_obj.sendBackward();
	}
}

			

////////////////////////////////////////////以下実行ルーチン
if (app.documents.length == 0) {myerror("ドキュメントが開かれていません")}
var my_document = app.activeDocument;
var my_selection = my_document.selection;
if (my_selection.length != 2) {myerror("2つのオブジェクトを選択してください")}

//スプレッドが回転していたら、エラーで中止。ver6.0（InDesign CS4）以上
if (parseInt(app.version) <= 6) {
	var my_spread = app.layoutWindows[0].activeSpread;
	if (get_spread_rotation(my_spread) != 0) {myerror("スプレッドが回転しています。元に戻してから実行してください。")};
}

//オブジェクト種類の検査
for(var i = 0; i < my_selection.length; i++) {
	if (!("Rectangle, Group, Oval, Polygon, TextFrame".match(my_selection[i].reflect.name))) {
		 myerror("ページアイテムを選択してください");
	}
	if (my_selection[i].locked) {
		myerror("ページアイテムがロックされています");
	}
	if (my_selection[i].parent.reflect.name != "Page") {
		myerror("独立したページアイテムを選んでください");
	}
}
var my_obj_A = my_selection[0];
var my_obj_B = my_selection[1];

//ページルーラーの開始位置が「スプレッド」以外になっていたら、「スプレッド」に一時的に変更
var my_ruler_origin = false;//初期値はfalse
if (my_document.viewPreferences.rulerOrigin != 1380143983) {
	my_ruler_origin = my_document.viewPreferences.rulerOrigin;//現在の設定を保存
	my_document.viewPreferences.rulerOrigin = 1380143983;//「スプレッド」に一時的に変更
}
	
//オブジェクトの大きさ（線幅を含む）
var my_bounds_A = get_bounds(my_obj_A);
var my_bounds_B = get_bounds(my_obj_B);

//位置の入れ替え
//obj.move([x1, y1])
if (my_position == "left-top") {
	my_obj_A.move([my_bounds_B["x1"], my_bounds_B["y1"]]);
	my_obj_B.move([my_bounds_A["x1"], my_bounds_A["y1"]]);
} else if (my_position == "right-top") {
	my_obj_A.move([my_bounds_B["x2"] - my_bounds_A["w"], my_bounds_B["y1"]]);
	my_obj_B.move([my_bounds_A["x2"] - my_bounds_B["w"], my_bounds_A["y1"]]);
} else if (my_position == "left-bottom") {
	my_obj_A.move([my_bounds_B["x1"], my_bounds_B["y2"] - my_bounds_A["h"]]);
	my_obj_B.move([my_bounds_A["x1"], my_bounds_A["y2"] - my_bounds_B["h"]]);
} else if (my_position == "right-bottom") {
	my_obj_A.move([my_bounds_B["x2"] - my_bounds_A["w"], my_bounds_B["y2"] - my_bounds_A["h"]]);
	my_obj_B.move([my_bounds_A["x2"] - my_bounds_B["w"], my_bounds_A["y2"] - my_bounds_B["h"]]);
}

//ページルーラー設定の復帰
if (my_ruler_origin) {
	my_document.viewPreferences.rulerOrigin = my_ruler_origin;
}

//レイヤーの入れ替え
if (my_replace_layer) {
	var tmp_layer_A = my_obj_A.itemLayer;
	var tmp_layer_B = my_obj_B.itemLayer;
	my_obj_A.itemLayer = tmp_layer_B;
	my_obj_B.itemLayer = tmp_layer_A;
}

//オブジェクトの重なり順序（階層）を入れ替え
if (my_replace_index) {
	var my_index_A = get_stackindex_in_layer(my_obj_A);
	var my_index_B = get_stackindex_in_layer(my_obj_B);
	if (my_index_A[0] != my_index_B[0]) {myerror("異なるレイヤーのオブジェクトは重なり順を入れ替えできません。重なり順は変更しないで終了します。")}
	change_index(my_obj_A, my_index_B[2]);
	change_index(my_obj_B, my_index_A[2]);
}

