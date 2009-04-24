ソフト名：swap_items.jsx 0.2
ライセンス：GNU GPLv3
転載条件：メールにて確認
　　作者：市川せうぞー／(c)2008-2009 Seuzo Ichikawa
動作環境：MacOS X10.5.6、InDesign CS4_J（6.0.1）
開発環境：Mac Pro Quad 3GHz（Intel）、ExtendScript Toolkit
開発言語：JavaScript
圧縮方法：zip
コメント：

**何をするスクリプトか？
選択している２つのページアイテムの位置を入れ替えます。
簡単な使い方説明：
http://www.youtube.com/watch?v=Kn_6PjI-Djs


**同梱ファイル3Files
Readme.txt	このファイルです。とにかく最初によんでください。
swap_items.jsx	スクリプト本体です。
swap_items_GUI_setting.jsx	環境設定のためのスクリプト。


**使用条件
このスクリプトが正常に動作する環境は以下の通りです。Windows環境でも動作する可能性がありますが未検証です。
-MacOS X10.5.6
-InDesign CS4_J（6.0.1）


**ダウンロード
[http://www.seuzo.jp/st/scripts_InDesignCS4/index.html#swap_items]
gitをお使いの方はこちら：
[http://github.com/seuzo/swap_items/]


**インストール
「swap_items.jsx」と「swap_items_GUI_setting.jsx」を
/Applications/Adobe InDesign CS3/Scripts/Scripts Panel/
または
~/Library/Preferences/Adobe InDesign/Version 5.0-J/Scripts/Scripts Panel/
にコピーしてください。エイリアスを入れておくだけでもかまいません。
スクリプトパレットから使用します。

「swap_items.jsx」と「swap_items_GUI_setting.jsx」は同じフォルダ階層に置いておいてください。
「swap_items.jsx」の名前を変更する場合は、「swap_items_GUI_setting.jsx」の18行目あたりにある
const TARGET_FILE_NAME = "swap_items.jsx";
でスクリプト名を編集してください。



**使用方法
+「ウインドウ」メニューから「スクリプティング」ー「スクリプト」を選択し、スクリプトパレットを出します。
+ページアイテムを２つ選択します。
+スクリプトパレットから、スクリプト「swap_items.jsx」をダブルクリックします。ショートカットを割り当てておくとさらに便利。


**設定
スクリプトパレットから「swap_items_GUI_setting.jsx」をダブルクリックしてください。
「アイテムの移動基準点」ポップアップから「left-top」「right-top」「left-bottom」「right-bottom」のいずれかを選んでください。例えば「left-top」を選ぶと、それぞれのアイテムの左上を移動基準点として認識します。
「オブジェクトの重なり順序（階層）を入れ替える」チェックボックスにチェックを入れると、異動先のアイテムが持っていたオブジェクトの重なり順（アレンジ）を入れ替えるようになります。たくさんのページアイテムを持つページ上でこのチェックを有効にすると、処理が遅くなる可能性があります。
「レイヤーを入れ替える」チェックボックスにチェックを入れると、それぞれの所属レイヤーを入れ替えるようになります。
「swap_items_GUI_setting.jsx」はスクリプト「swap_items.jsx」そのものを書き換えます。そのため、まれに「swap_items.jsx」が破損することがあります。そのような場合は再度ダウンロードしてください。


**既知の不具合、またはToDo


**免責事項
-本アプリケーションはInDesignにおける作業効率支援なのであって、処理結果を保証するものではありません。かならず確認をされることをおすすめします。
-このツールを使用する上でデータの破損などのあらゆる不具合・不利益については一切の責任を負いかねますのでご了解ください。
-このツールはすべてのMacintoshとMac OS上で動作をするという確認をとっていませんし、事実上出来ません。したがって、動作を保証するものではありません。


**ライセンス
GNU GPLv3
http://sourceforge.jp/projects/opensource/wiki/licenses%252FGNU_General_Public_License_version_3.0


**履　歴
2007-03-18	ver.0.1	とりあえず。「replace_items.jsx」「replace_items_GUI_setting.jsx」という名前でリリース。[http://d.hatena.ne.jp/seuzo/20080316/1205641922:title=選択している２つのページアイテムの位置を入れ替え - 名もないテクノ手]
2009-04-24	ver.0.2	InDesign CS4対応。「swap_items.jsx」「swap_items_GUI_setting.jsx」という名前に変更。スプレッドが回転表示しているときは、処理を中止するようにした。ページアイテムの重なり順を正しく動作するように修正した。
2009-04-24	ver.0.2.1	ダイアログを出す前にUserInteractionLevels.interactWithAllとした。




市川せうぞー
http://www.seuzo.jp/
