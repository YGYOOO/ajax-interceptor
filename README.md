<img src="https://github.com/YGYOOO/ajax-interceptor/raw/master/readmeImgs/icon.png" width="300">    

修改ajax请求返回结果的chrome插件   

## 安装
地址：https://chrome.google.com/webstore/detail/ajax-interceptor/nhpjggchkhnlbgdfcbgpdpkifemomkpg
或在chrome商店搜索Ajax Interceptor


## 使用示例
<img src="https://github.com/YGYOOO/ajax-interceptor/raw/master/readmeImgs/screenshot2.png" width="700"> 

示例视频：https://youtu.be/OL87EPOEVIU


## 注意
1. 建议第一次安装完重启浏览器，或者刷新你需要使用的页面。
2. 当你不需要使用该插件时，建议把开关关上（插件icon变为灰色），以免对页面正常浏览造成影响。
3. 该插件只会在JS层面上对返回结果进行修改，即只会修改全局的XMLHTTPRequest对象和fetch方法里的返回值，进而影响页面展现。而你在chrome的devtools的network里看到的请求返回结果不会有任何变化。


## 更新说明
version 0.5：
- 修复bug：https://github.com/YGYOOO/ajax-interceptor/issues/1

version 0.4:
- fetch发起的请求也可以被修改了

version 0.3:
- 增加了JSON编辑功能 
