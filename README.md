# WebRTC Bitrate control

功能： 
- 1、默认不启用带宽设置 
- 2、启用带宽设置
    - 设置answer sdp b=AS值
    - 设置answer sdp b=TIAS值
    
- 3、如果startBitrate有值，则设置offer sdp  起始码率x-google-start-bitrate和优先H264编码




# 说明

选取是否设置带宽值：如果启用的话，需要填写要设置的ASBitrate或TIASBitrate，至少填写一个：

- ASBitrate 有值，则在answer sdp 添加b=AS行
- TIASBitrate 有值，则在answer sdp 添加b=TIAS行
- ASBitrate 和 TIASBitrate 都有值，则在answer sdp 同时添加b=AS行和b=TIAS行
- startBitrate有值，则在offer sdp的a=rtpmap行添加  x-google-start-bitrate=设置


二、demo 测试通过修改SDP来限制WebRTC的带宽

demo 地址：https://ouchunrun.github.io/WebRTC-bandwidth-limit/



（一）启用带宽设置

使用说明：

启用带宽设置
输入ASBitrate、TIASBitrate设置值
点击Get media、connect
查看右侧video TIASBitrate，如下图


![f94b55cafbcd213b3b69983b320dbd6b.png](https://i.loli.net/2019/12/13/gNXM93dJTHe4IQq.png)

chrome://webrtc-internals/ 效果查看：

![f8648ce7db4d839b3b90a5194551b144.png](https://i.loli.net/2019/12/13/Q26j8b7oNvFqBiR.png)



（二）对比不启用带宽设置效果，如图：
![656cf15dc6de209c08625280938c8894.png](https://i.loli.net/2019/12/13/OZCV23csGEprzRx.png)


chrome://webrtc-internals/ 效果查看：

![58b0d0799a115246875b73fdd30ce2b5.png](https://i.loli.net/2019/12/13/CZzqlc4oKf6pjkE.png)