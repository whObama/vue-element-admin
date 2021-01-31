<template>
  <div id="playWnd"
       class="playWnd"
       v-html='playWndHtml'></div>
</template>

<script>
// 基于视频WEB插件_Win32 V1.3.0做的修改

import { JSEncrypt } from 'js-encrypt'
import { WebControl } from 'web-control'
import moment from 'moment'

export default {
  data () {
    return {
      oWebControl: null, // 插件对象
      bIE: (!!window.ActiveXObject || 'ActiveXObject' in window), // 是否为IE浏览器
      pubKey: '', // 公钥
      playWndHtml: '', // 提示内容
      iLastCoverLeft: 0,
      iLastCoverTop: 0,
      iLastCoverRight: 0,
      iLastCoverBottom: 0,
      initCount: 0 // 尝试启动插件的次数，3次失败后不再尝试
    }
  },
  props: {
    webControlCustom: {
      type: Object,
      default: () => { }
    }
  },
  methods: {
    initWebControl () {
      // 监听resize事件，使插件窗口尺寸跟随DIV窗口变化
      window.addEventListener('resize', () => {
        if (this.oWebControl != null) {
          this.oWebControl.JS_Resize(this.webControlCustom.playWndWidth, this.webControlCustom.playWndHeight)
          this.setWndCover()
        }
      })

      // 监听滚动条scroll事件，使插件窗口跟随浏览器滚动而移动
      window.addEventListener('scroll', () => {
        if (this.oWebControl != null) {
          this.oWebControl.JS_Resize(this.webControlCustom.playWndWidth, this.webControlCustom.playWndHeight)
          this.setWndCover()
        }
      })

      // 标签关闭
      window.addEventListener('upload', () => {
        // 此处请勿调反初始化
        if (this.oWebControl != null) {
          this.oWebControl.JS_HideWnd() // 先让窗口隐藏，规避可能的插件窗口滞后于浏览器消失问题
          this.oWebControl.JS_Disconnect().then(() => { // 断开与插件服务连接成功
          }, () => { // 断开与插件服务连接失败
          })
        }
      })

      // ISC标签页切换
      window.addEventListener('message', this.receiveMessage, false)
      this.webControlOption = {
        ...this.webControlOption,
        ...this.webControlCustom
      }
      this.initPlugin()
    },
    // 创建播放实例
    initPlugin () {
      this.oWebControl = new WebControl({
        szPluginContainer: 'playWnd', // 指定容器id
        iServicePortStart: 15900, // 指定起止端口号，建议使用该值
        iServicePortEnd: 15909,
        szClassId: '23BF3B0A-2C56-4D97-9C03-0CB103AA8F11', // 用于IE10使用ActiveX的clsid
        cbConnectSuccess: () => { // 创建WebControl实例成功
          this.oWebControl.JS_StartService('window', { // WebControl实例创建成功后需要启动服务
            dllPath: './VideoPluginConnect.dll' // 值"./VideoPluginConnect.dll"写死
          }).then(() => { // 启动插件服务成功
            this.oWebControl.JS_SetWindowControlCallback({ // 设置消息回调
              cbIntegrationCallBack: this.cbIntegrationCallBack
            })
            this.oWebControl.JS_CreateWnd('playWnd', this.webControlCustom.playWndWidth, this.webControlCustom.playWndHeight).then(() => { // JS_CreateWnd创建视频播放窗口，宽高可设定
              // 这里是为了解决ISC框架下，窗口偏移的问题，其中68是顶部栏的高度值
              // if (process.env.NODE_ENV !== 'development') {
              //   this.oWebControl.JS_SetDocOffset({ left: 160, top: 80 })
              // }
              this.init() // 创建播放实例成功后初始化
            })
          }, () => { // 启动插件服务失败
          })
        },
        cbConnectError: () => { // 创建WebControl实例失败
          this.oWebControl = null
          this.playWndHtml = '插件未启动，正在尝试启动，请稍候...'
          WebControl.JS_WakeUp('VideoWebPlugin://') // 程序未启动时执行error函数，采用wakeup来启动程序
          this.initCount++
          if (this.initCount < 3) {
            setTimeout(() => {
              this.initPlugin()
            }, 3000)
          } else {
            this.playWndHtml = '插件启动失败，请检查插件是否安装！<a href="https://open.hikvision.com/download/5c67f1e2f05948198c909700?type=10">视频插件下载</a>，如果链接无法下载,请到成果物中查找安装!'
          }
        },
        cbConnectClose: (bNormalClose) => {
          // 异常断开：bNormalClose = false
          // 正常断开：bNormalClose = true
          console.log('cbConnectClose')
          this.oWebControl = null
        }
      })
    },

    // 推送消息
    cbIntegrationCallBack (oData) {
      this.showCBInfo(JSON.stringify(oData.responseMsg))
    },

    // 显示回调信息
    showCBInfo (szInfo, type) {
      console.log(moment().format('YYYY-MM-DD HH:mm:ss:SSS') + ' ' + szInfo)
    },

    // 初始化
    init () {
      this.getPubKey(() => {
        /// /////////////////////////////// 请自行修改以下变量值  ////////////////////////////////////
        const argument = {
          appkey: this.webControlCustom.appkey, // 综合安防管理平台提供的appkey，必填
          secret: this.setEncrypt(this.webControlCustom.secret), // 综合安防管理平台提供的secret，必填
          ip: this.webControlCustom.serverIp, // 综合安防管理平台IP地址，必填
          playMode: this.webControlCustom.playMode || 1, // 初始播放模式：0-预览，1-回放
          enableHTTPS: this.webControlCustom.enableHTTPS || 1, // 是否启用HTTPS协议与综合安防管理平台交互，是为1，否为0
          port: this.webControlCustom.port || 443, // 综合安防管理平台端口，若启用HTTPS协议，默认443
          snapDir: 'D:\\SnapDir', // 抓图存储路径
          videoDir: 'D:\\VideoDir', // 紧急录像或录像剪辑存储路径
          layout: this.webControlCustom.layout || '1x1', // 布局
          encryptedFields: 'secret', // 加密字段，默认加密领域为secret
          showToolbar: this.webControlCustom.showToolbar || 1, // 是否显示工具栏，0-不显示，非0-显示
          showSmart: this.webControlCustom.showSmart || 1, // 是否显示智能信息（如配置移动侦测后画面上的线框），0-不显示，非0-显示
          buttonIDs: '0,16,256,257,258,259,260,512,513,514,515,516,517,768,769' // 自定义工具条按钮
        }
        /// /////////////////////////////// 请自行修改以上变量值  ////////////////////////////////////

        this.oWebControl.JS_RequestInterface({
          funcName: 'init',
          argument: JSON.stringify(argument)
        }).then((oData) => {
          this.oWebControl.JS_Resize(this.webControlCustom.playWndWidth, this.webControlCustom.playWndHeight) // 初始化后resize一次，规避firefox下首次显示窗口后插件窗口未与DIV窗口重合问题
          if (argument.playMode === 0) {
            this.handleStartPreview() // 打开后自动预览播放
          } else if (argument.playMode === 1) {
            this.handleStartPlayback() // 打开后自动回放
          }
        })
      })
    },

    // 反初始化
    uninit () {
      this.oWebControl.JS_RequestInterface({
        funcName: 'uninit'
      }).then(function (oData) {
        this.showCBInfo(JSON.stringify(oData ? oData.responseMsg : ''))
      })
    },

    // 获取公钥
    getPubKey (callback) {
      this.oWebControl.JS_RequestInterface({
        funcName: 'getRSAPubKey',
        argument: JSON.stringify({
          keyLength: 1024
        })
      }).then((oData) => {
        if (oData.responseMsg.data) {
          this.pubKey = oData.responseMsg.data
          callback()
        }
      })
    },

    // RSA加密
    setEncrypt (value) {
      var encrypt = new JSEncrypt()
      encrypt.setPublicKey(this.pubKey)
      return encrypt.encrypt(value)
    },

    // 设置窗口裁剪，当因滚动条滚动导致窗口需要被遮住的情况下需要JS_CuttingPartWindow部分窗口
    setWndCover () {
      var iWidth = document.body.clientWidth // $(window).width();
      var iHeight = document.body.clientHeight // $(window).height();
      var oDivRect = document.getElementById('playWnd').getBoundingClientRect()

      var iCoverLeft = (oDivRect.left < 0) ? Math.abs(oDivRect.left) : 0
      var iCoverTop = (oDivRect.top < 0) ? Math.abs(oDivRect.top) : 0
      var iCoverRight = (oDivRect.right - iWidth > 0) ? Math.round(oDivRect.right - iWidth) : 0
      var iCoverBottom = (oDivRect.bottom - iHeight > 0) ? Math.round(oDivRect.bottom - iHeight) : 0

      iCoverLeft = (iCoverLeft > this.webControlCustom.playWndWidth) ? this.webControlCustom.playWndWidth : iCoverLeft
      iCoverTop = (iCoverTop > this.webControlCustom.playWndHeight) ? this.webControlCustom.playWndHeight : iCoverTop
      iCoverRight = (iCoverRight > this.webControlCustom.playWndWidth) ? this.webControlCustom.playWndWidth : iCoverRight
      iCoverBottom = (iCoverBottom > this.webControlCustom.playWndHeight) ? this.webControlCustom.playWndHeight : iCoverBottom

      this.oWebControl.JS_RepairPartWindow(0, 0, this.webControlCustom.playWndWidth + 1, this.webControlCustom.playWndHeight) // 多1个像素点防止还原后边界缺失一个像素条
      if (iCoverLeft !== 0) {
        this.oWebControl.JS_CuttingPartWindow(0, 0, iCoverLeft, this.webControlCustom.playWndHeight)
      }
      if (iCoverTop !== 0) {
        this.oWebControl.JS_CuttingPartWindow(0, 0, this.webControlCustom.playWndWidth + 1, iCoverTop) // 多剪掉一个像素条，防止出现剪掉一部分窗口后出现一个像素条
      }
      if (iCoverRight !== 0) {
        this.oWebControl.JS_CuttingPartWindow(this.webControlCustom.playWndWidth - iCoverRight, 0, iCoverRight, this.webControlCustom.playWndHeight)
      }
      if (iCoverBottom !== 0) {
        this.oWebControl.JS_CuttingPartWindow(0, this.webControlCustom.playWndHeight - iCoverBottom, this.webControlCustom.playWndWidth, iCoverBottom)
      }
    },

    // 视频预览功能
    handleStartPreview () {
      if (this.oWebControl) this.showWnd()
      else this.initPlugin()
      // 注意：预览的playMode为 0
      const argument = {
        cameraIndexCode: this.webControlCustom.cameraIndexCode, // 获取输入的监控点编号值，必填
        streamMode: this.webControlCustom.streamMode || 0, // 主子码流标识, 0主码流，1子码流
        transMode: this.webControlCustom.transMode || 1, // 传输协议，0UDP，1TCP
        gpuMode: this.webControlCustom.gpuMode || 0, // 是否启用GPU硬解，0不启用，1启用
        wndId: this.webControlCustom.wndId || -1 // 默认为空闲窗口回放（在2x2以上布局下可指定播放窗口）
      }
      this.oWebControl.JS_RequestInterface({
        funcName: 'startPreview',
        argument: JSON.stringify(argument)
      })
    },

    // 停止全部预览
    handleStopAllPreview () {
      this.oWebControl.JS_RequestInterface({
        funcName: 'stopAllPreview'
      })
      this.hideWnd()
    },

    // 视频回放功能
    handleStartPlayback () {
      if (this.oWebControl) this.showWnd()
      else this.initPlugin()
      // 注意：回放的playMode为 1
      const argument = {
        cameraIndexCode: this.webControlCustom.cameraIndexCode, // 监控点编号，必填
        startTimeStamp: Math.floor(moment(this.webControlCustom.startTime, 'YYYY-MM-DD HH:mm:ss:SSS').valueOf() / 1000).toString(), // 录像查询开始时间戳，单位：秒，必填
        endTimeStamp: Math.floor(moment(this.webControlCustom.endTime, 'YYYY-MM-DD HH:mm:ss:SSS').valueOf() / 1000).toString(), // 录像结束开始时间戳，单位：秒，必填
        recordLocation: this.webControlCustom.recordLocation || 1, // 录像存储类型：0-中心存储，1-设备存储
        transMode: this.webControlCustom.transMode || 1, // 传输协议：0-UDP，1-TCP
        gpuMode: this.webControlCustom.gpuMode || 0, // 是否启用GPU硬解，0-不启用，1-启用
        wndId: this.webControlCustom.wndId || -1 // 可指定播放窗口（在2x2以上布局下可指定播放窗口）
      }
      this.oWebControl.JS_RequestInterface({
        funcName: 'startPlayback',
        argument: JSON.stringify(argument)
      })
    },

    // 停止全部回放
    handleStopAllPlayback () {
      this.oWebControl.JS_RequestInterface({
        funcName: 'stopAllPlayback'
      })
      this.hideWnd()
    },

    // 显示窗口
    showWnd () {
      this.oWebControl.JS_ShowWnd()
    },

    // 隐藏窗口
    hideWnd () {
      this.oWebControl.JS_HideWnd()
    },

    // 销毁插件窗口
    destroyWnd () {
      this.oWebControl.JS_DestroyWnd().then(() => {
        console.log('JS_DestroyWnd')
      }, () => {
        console.log('JS_DestroyWnd error')
      })
    },

    // 停用插件
    stopControl () {
      if (!this.oWebControl) return
      // this.handleStopAllPreview()
      // this.handleStopAllPlayback()
      this.destroyWnd()
      this.oWebControl = null
    },

    // ISC的tab页切换处理
    receiveMessage (event) {
      let data = event.data || '{}'
      try {
        data = JSON.parse(data)
        if (data.method === 'hideTabCallback' || data.argument.isExtend) {
          // 切离该页面时执行，先隐藏窗口，规避可能的插件窗口滞后于浏览器消失问题
          this.oWebControl && this.hideWnd()
        } else if (data.method === 'showTabCallback' || !data.argument.isExtend) {
          this.oWebControl && this.showWnd()
        }
      } catch (e) {
        console.error(e)
      }
    }
  },
  created () {
    window.addEventListener('upload', () => {
      if (this.oWebControl != null) {
        this.oWebControl.JS_HideWnd()
        this.oWebControl.JS_Disconnect().then(() => {
          // 断开与插件服务连接成功
        }, () => {
          // 断开与插件服务连接失败
        })
      } else {
      }
    })
  },
  beforeDestroy () {
    this.stopControl()
  }
}
</script>

<style lang="scss" scoped>
</style>
