[English](./README.md) | 简体中文

<img src="https://github.com/YGYOOO/ajax-interceptor/raw/master/readmeImgs/Ajax_Modifier.png" width="220">   

[![](https://img.shields.io/chrome-web-store/v/nhpjggchkhnlbgdfcbgpdpkifemomkpg.svg?logo=Google%20Chrome&logoColor=white&color=blue&style=flat-square)](https://chrome.google.com/webstore/detail/ajax-interceptor/nhpjggchkhnlbgdfcbgpdpkifemomkpg) 
[![](https://img.shields.io/chrome-web-store/stars/nhpjggchkhnlbgdfcbgpdpkifemomkpg.svg?logo=Google%20Chrome&logoColor=white&color=blue&style=flat-square)](https://chrome.google.com/webstore/detail/nhpjggchkhnlbgdfcbgpdpkifemomkpg) 
[![](https://img.shields.io/chrome-web-store/users/nhpjggchkhnlbgdfcbgpdpkifemomkpg.svg?logo=Google%20Chrome&logoColor=white&color=blue&style=flat-square)](https://chrome.google.com/webstore/detail/ajax-interceptor/nhpjggchkhnlbgdfcbgpdpkifemomkpg)    

[![](https://img.shields.io/github/followers/YGYOOO.svg?label=Follow&style=social)](https://github.com/YGYOOO)
[![](https://img.shields.io/badge/Follow%20@卧槽竟然是YGY的微博--brightgreen.svg?logo=Sina%20Weibo&style=social)](https://weibo.com/u/5352731024)
[![](https://img.shields.io/badge/Follow%20@YGYOOO--brightgreen.svg?logo=Twitter&style=social)](https://twitter.com/YGYOOO)

一个可以修改页面中任意Ajax的请求或返回值的Chrome插件，可用于调试/排查页面上的问题，或在开发时mock数据。（当然你也可以用其它一些工具如Charles修改网络请求的返回值，但操作繁琐，该插件方便很多，且不会对Chrome之外造成影响）   

## 安装
chrome商店地址（推荐，自动更新。需翻墙）：https://chrome.google.com/webstore/detail/ajax-interceptor/nhpjggchkhnlbgdfcbgpdpkifemomkpg   

（若无法访问chrome商店，可以下载本项目到，在chrome://extensions/中打开开发者模式，选择“加载已解压的扩展程序”加载本项目）

## 使用示例
<img src="https://github.com/YGYOOO/ajax-interceptor/raw/master/readmeImgs/screenshot2.png" width="700"> 

示例视频：https://weibo.com/tv/v/HlVZD8cR9?fid=1034:4352275389595232


## 注意
1. 使用该插件时，建议关闭浏览器缓存（devtools -> network -> disable cache）![image](https://github.com/YGYOOO/ajax-interceptor/assets/15754991/ddac6f23-dbdf-4234-881f-60bb36178d67) ，可以提高页面刚加载完成时发出的ajax请求的拦截成功率。
2. 当你不需要使用该插件时，建议把开关关上<img width="202" alt="image" src="https://github.com/YGYOOO/ajax-interceptor/assets/15754991/80247f0b-4b97-4d92-b4b9-f93b16bc257c">，以免对页面正常浏览造成影响。
3. 该插件只会在JS层面上对返回结果进行修改，即只会修改全局的XMLHTTPRequest对象和fetch方法里的返回值，进而影响页面展现。而你在chrome的devtools的network里看到的请求返回结果不会有任何变化。


## 更新说明
version 1.5.3:
- 添加请求url自动补全的功能，以此修复部分请求无法拦截的问题

version 1.5.2:
- 修复了onload不拦截的问题

version 1.5.1:
- 新增专业模式，支持用户编码修改请求headers、payload以及响应
- 支持非200状态码的响应修改
- 添加强提醒，用于提示devtools相关设置
- 优化普通模式下的UI

version 1.4.1:
- 新增拦截匹配method的功能
- 新增设置面板显示位置，提供悬浮和devtools两种位置
- 优化新用户的使用体验（支持首次安装页面不刷新自动置入脚本）
- 修复监听器报错的问题

version 0.7:
- 新增单个URL开关功能：https://github.com/YGYOOO/ajax-interceptor/issues/7

version 0.5：
- 修复bug：https://github.com/YGYOOO/ajax-interceptor/issues/1

version 0.4:
- fetch发起的请求也可以被修改了

version 0.3:
- 增加了JSON编辑功能 
