# Obsidian MiniTable Plugin

This is a plugin for Obsidian (https://obsidian.md).

It allows you to define a _Codeblock prefix_, _Column separator_, _Header prefix_, and _Footer prefix_ for tables.

A table might look something like this, where `*` is a header row prefix:
<pre>
```minitable
* A | B | C | D
  1 | 2 | 3 | 4
```
</pre>

Using another codeblock prefix and `,` as column separator:
<pre>
```mt
1,2,3,4
5,6,7,8
```
</pre>

Even pure whitespaces are supported:
<pre>
```minitable
   a   e   i  o   u
   ア  エ  イ  オ  ウ
k  カ  ケ  キ  コ  ク
s  サ  セ  シ  ソ  ス
t  タ  テ  チ  ト  ツ
n  ナ  ネ  ニ  ノ  ヌ
h  ハ  ヘ  ヒ  ホ  フ
m  マ  メ  ミ  モ  ム
y  ヤ  　  　  ヨ  ユ
r  ラ  レ  リ  ロ  ル
w  ワ  ヱ  ヰ  ヲ
```
</pre>
