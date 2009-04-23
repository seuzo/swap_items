/*
swap_items_GUI_setting.jsx
(c)2008 www.seuzo.jp
swap_itemsのための環境設定GUI
「swap_items.jsx」と同じ階層に置いておく必要があります。


・History
2008-03-18	ver.0.1	とりあえず。「replace_items_GUI_setting.jsx」という名前でリリース
*/

////////////////////////////////////////////設定
const TARGET_FILE_NAME = "swap_items.jsx"; //書き換えるスクリプト名

////////////////////////////////////////////エラー処理 
function myerror(mess) { 
  if (arguments.length > 0) { alert(mess); }
  exit();
}

////////////////////////////////////////////カレントスクリプトのフルパスを得る 
function get_my_script_path() {
	try {
		return  app.activeScript;
	} catch (myError) {
		return File (myError.fileName);
	}
}

////////////////////////////////////////////ファイルの内容を読み込んで返す 
function read_file(my_read_file_path) {
	var my_file_obj = new File(my_read_file_path);
	if (!(my_file_obj.exists)) {myerror("ファイルがありません\n" + my_read_file_path)};
	if(my_file_obj.open("r")) {
		var tmp_str = my_file_obj.read();
		my_file_obj.close();
	} else {
		myerror("ファイルが開けません\n" + my_read_file_path);
	}
	return tmp_str;
}

////////////////////////////////////////////データをファイルに書き込む 
function write_file(my_write_file_path, my_data) {
	var my_file_obj = new File(my_write_file_path);
	//if (!(my_file_obj.exists)) {myerror("ファイルがありません\n" + my_write_file_path)};
	if(my_file_obj.open("w")) {
		my_file_obj.write(my_data);
		my_file_obj.close();
	} else {
		myerror("ファイルが開けません\n" + my_write_file_path);
	}
}

////////////////////////////////////////////リスト内を正規表現検索してindexを得る。 ヒットしなければfalseを返す
function search_index_list(my_list, search_regex) {
	var search_regex = RegExp(search_regex);
	var search_result = false;
	for (var i = 0; i < my_list.length; i++) {
		if (my_list[i].match(search_regex)) {
			search_result = i;
			break;
		}
	}
	return search_result;
}

////////////////////////////////////////////引数strが "true" または "false" の時のみ真偽値を返す
function str2boolean (str) {
	var str ;
	if ((str === "true") || (str === "false")) {
		return eval(str);
	} else {
		//alert(str + " is not boolean.");
		myerror("プログラムが壊れています。\n" + str + " is not boolean.");
	}
}





////////////////////////////////////////////以下実行ルーチン
var my_script_path = get_my_script_path();//このスクリプトのフルパス名
var my_script_folder = File (my_script_path).parent;//コンテナフォルダ
var my_file_path = my_script_folder + "/" + TARGET_FILE_NAME;//ターゲットのファイルパス
var my_str = read_file(my_file_path);//内容を得る

//現在の設定を得る
my_str.match (/^(const my_position ?= ?")([^"]+)/im);
var my_position = RegExp.$2;
my_str.match (/^(const my_replace_index ?= ?)([^; ]+)/im);
var my_replace_index = RegExp.$2;
my_str.match (/^(const my_replace_layer ?= ?)([^; ]+)/im);
var my_replace_layer = RegExp.$2;

//設定のチェック
var my_position_list = ["left-top", "right-top", "left-bottom", "right-bottom"];
var my_position_index = search_index_list(my_position_list, my_position);
if (my_position_index === false) {myerror("プログラムが壊れています。Not search index of position list.")}
my_replace_index = str2boolean(my_replace_index);
my_replace_layer = str2boolean(my_replace_layer);


////////////////ダイアログ
var my_dialog = app.dialogs.add({name:"swap_items環境設定", canCancel:true});
with(my_dialog) {
	with(dialogColumns.add()) {
		//staticTexts.add({staticLabel:"swap_itemsの設定をしてください"});// プロンプト
		with(borderPanels.add()) {
			with(dialogColumns.add()){
				staticTexts.add({staticLabel:"アイテムの移動基準点："});
				var my_popup = dropdowns.add({stringList:my_position_list, selectedIndex:my_position_index});// ポップアップメニュー
			}
		}
		with (borderPanels.add()) {
			with(dialogRows.add()){
				var check_01 = checkboxControls.add({staticLabel:"オブジェクトの重なり順序（階層）を入れ替える", checkedState:my_replace_index});
			}
			with(dialogRows.add()){
				var check_02 = checkboxControls.add({staticLabel:"レイヤーを入れ替える", checkedState:my_replace_layer});
			}
		}
	}
}
//ダイアログの結果を得る
if (my_dialog.show() == true) {
	my_popup = my_popup.selectedIndex;
	my_position = my_position_list[my_popup];
	my_replace_index = check_01.checkedState;
	my_replace_layer = check_02.checkedState;
	//正常にダイアログを片付ける
	my_dialog.destroy();
} else {
	// ユーザが「キャンセル」をクリックしたので、メモリからダイアログボックスを削除
	my_dialog.destroy();
	myerror();
}


//設定の置換
my_str = my_str.replace (/^(const my_position ?= ?")([^" \s]+)/im, "$1" + my_position);
my_str = my_str.replace (/^(const my_replace_index ?= ?)([^; \s]+)/im, "$1" + my_replace_index);
my_str = my_str.replace (/^(const my_replace_layer ?= ?)([^; \s]+)/im, "$1" + my_replace_layer);

//ファイルの書き込み
write_file(my_file_path, my_str);