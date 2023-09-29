English | [简体中文](./README-zh.md)   

<img src="https://github.com/YGYOOO/ajax-interceptor/raw/master/readmeImgs/Ajax_Modifier.png" width="220">   

[![](https://img.shields.io/chrome-web-store/v/nhpjggchkhnlbgdfcbgpdpkifemomkpg.svg?logo=Google%20Chrome&logoColor=white&color=blue&style=flat-square)](https://chrome.google.com/webstore/detail/ajax-interceptor/nhpjggchkhnlbgdfcbgpdpkifemomkpg) 
[![](https://img.shields.io/chrome-web-store/stars/nhpjggchkhnlbgdfcbgpdpkifemomkpg.svg?logo=Google%20Chrome&logoColor=white&color=blue&style=flat-square)](https://chrome.google.com/webstore/detail/nhpjggchkhnlbgdfcbgpdpkifemomkpg) 
[![](https://img.shields.io/chrome-web-store/users/nhpjggchkhnlbgdfcbgpdpkifemomkpg.svg?logo=Google%20Chrome&logoColor=white&color=blue&style=flat-square)](https://chrome.google.com/webstore/detail/ajax-interceptor/nhpjggchkhnlbgdfcbgpdpkifemomkpg)    

[![](https://img.shields.io/github/followers/YGYOOO.svg?label=Follow&style=social)](https://github.com/YGYOOO)
[![](https://img.shields.io/badge/Follow%20@卧槽竟然是YGY的微博--brightgreen.svg?logo=Sina%20Weibo&style=social)](https://weibo.com/u/5352731024)
[![](https://img.shields.io/badge/Follow%20@YGYOOO--brightgreen.svg?logo=Twitter&style=social)](https://twitter.com/YGYOOO)

A chrome extension for modifing any ajax requests or responses easily. You can use it to debug errors or mock data.

## Install
https://chrome.google.com/webstore/detail/ajax-interceptor/nhpjggchkhnlbgdfcbgpdpkifemomkpg   

## Example
<img src="https://github.com/YGYOOO/ajax-interceptor/raw/master/readmeImgs/screenshot2.png" width="700"> 

Example video：https://www.youtube.com/watch?v=OL87EPOEVIU

## Notes
1. It is recommended to disable cache(devtools -> network -> disable cache) ![image](https://github.com/YGYOOO/ajax-interceptor/assets/15754991/ea89f065-56da-4c1b-8287-92fe88faeba3) when using this chrome extension.
2. It is recommended to turn off this extension<img width="202" alt="image" src="https://github.com/YGYOOO/ajax-interceptor/assets/15754991/ba83ac30-39e5-46c6-9c04-2989e9819120"> when you are not using it.
3. This extension only overrides the response data in the XMLHTTPRequest object as well as the fetch method. The "original" response which you can see in DevTools' "Network" panel will not be changed.

## Release Notes
version 1.5.3:
- add request url autofill to fix matching issues

version 1.5.2:
- fix not intercepting in the onload situation 

version 1.5.1:
- add advanced modes for users to encode and modify request headers, request payloads, and responses
- support responses with the non-200 status
- add strong tips to remind users of settings related to the devtools
- optimize the user interface

version 1.4.1:
- add feature of matched methods  
- add setting of panel positions, including suspended position and devtools position
- optimize the user experience for new users
- fix listener rejected error
