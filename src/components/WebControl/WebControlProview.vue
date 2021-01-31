<template>
  <div :id="webControlOption.playWndId" class="playWnd" v-if="showWeb" v-html='webControlOption.playWndHtml'></div>
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
      bIE: (!!window.ActiveXObject || 'ActiveXObject' in window),
      pubKey: '',
      iLastCoverLeft: 0,
      iLastCoverTop: 0,
      iLastCoverRight: 0,
      iLastCoverBottom: 0,
      initCount: 0,
      activeCameraIndexCodes: [],
      webControlOption: {
        playWndId: 'playWnd',
        playWndWidth: 1355,
        playWndHeight: 810,
        offsetLeft: 0,
        offsetTop: 0,
        playWndHtml: '',
        appkey: '',
        secret: '',
        serverIp: '',
        // cameraIndexCode: '',
        startTime: '',
        endTime: '',
        playMode: 0,
        enableHTTPS: 1,
        port: 443,
        layout: '2x2',
        snapDir: 'D:\\SnapDir',
        videoDir: 'D:\\VideoDir',
        encryptedFields: 'secret',
        showToolbar: 1,
        showSmart: 1,
        buttonIDs: '0,16,256,257,258,259,260,512,513,514,515,516,517,768,769',
        streamMode: 0,
        transMode: 1,
        gpuMode: 0,
        wndId: -1
      },
      showWeb: true
    }
  },
  props: {
    webControlCustom: {
      type: Object,
      default: () => { }
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
  methods: {
    initWebControl () {
      window.addEventListener('resize', () => {
        if (this.oWebControl != null) {
          this.oWebControl.JS_Resize(this.webControlOption.playWndWidth, this.webControlOption.playWndHeight)
          this.setWndCover()
        }
      })

      window.addEventListener('scroll', () => {
        if (this.oWebControl != null) {
          this.oWebControl.JS_Resize(this.webControlOption.playWndWidth, this.webControlOption.playWndHeight)
          this.setWndCover()
        }
      })

      window.addEventListener('upload', () => {
        if (this.oWebControl != null) {
          this.oWebControl.JS_HideWnd()
          this.oWebControl.JS_Disconnect().then(() => {
            // 断开与插件服务连接成功
          }, () => {
            // 断开与插件服务连接失败
          })
        }
      })

      window.addEventListener('message', this.receiveMessage, false)

      this.webControlOption = {
        ...this.webControlOption,
        ...this.webControlCustom
      }
      this.initPlugin()
    },
    // 初始化插件
    initPlugin () {
      this.oWebControl = new WebControl({
        szPluginContainer: this.webControlOption.playWndId,
        iServicePortStart: 15900,
        iServicePortEnd: 15909,
        szClassId: '23BF3B0A-2C56-4D97-9C03-0CB103AA8F11', // 用于IE10使用ActiveX的clsid
        cbConnectSuccess: () => {
          this.oWebControl.JS_StartService('window', {
            dllPath: './VideoPluginConnect.dll' // 值"./VideoPluginConnect.dll"写死
          }).then(() => {
            this.oWebControl.JS_SetWindowControlCallback({
              cbIntegrationCallBack: this.cbIntegrationCallBack
            })
            let flag = this.oWebControl.bFreeze
            if (!flag) {
              this.oWebControl.JS_CreateWnd(this.webControlOption.playWndId, this.webControlOption.playWndWidth, this.webControlOption.playWndHeight).then(() => {
                if (this.oWebControl) {
                  this.oWebControl.JS_SetDocOffset({ left: this.webControlOption.offsetLeft, top: this.webControlOption.offsetTop })
                  this.init()
                } else {
                  this.showWeb = false
                  return
                }
              })
            } else {
              return
            }

          }, () => {
          })
        },
        cbConnectError: () => {
          this.oWebControl = null
          this.webControlOption.playWndHtml = '插件未启动，正在尝试启动，请稍候...'
          WebControl.JS_WakeUp('VideoWebPlugin://')
          this.initCount++
          if (this.initCount < 3) {
            setTimeout(() => {
              this.initPlugin()
            }, 3000)
          } else {
            this.webControlOption.playWndHtml = '插件启动失败，请检查插件是否安装！<a href="https://open.hikvision.com/download/5c67f1e2f05948198c909700?type=10">，视频插件下载</a>,如果链接无法下载,请到成果物中查找安装!'
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
      if (oData.responseMsg.type === 2) {
        const { result, cameraIndexCode } = JSON.parse(oData.responseMsg.msg)
        if (result === 768) { // 开始播放
          this.activeCameraIndexCodes.push(cameraIndexCode)
        } else if (result === 816) { // 播放结束
          const index = this.activeCameraIndexCodes.indexOf(cameraIndexCode)
          index >= 0 && this.activeCameraIndexCodes.splice(index, 1)
        }
      }
    },
    // 显示回调信息
    showCBInfo (szInfo, type) {
      console.log(moment().format('YYYY-MM-DD HH:mm:ss:SSS') + ' ' + szInfo)
    },

    init () {
      this.getPubKey(() => {
        /// /////////////////////////////// 请自行修改以下变量值  ////////////////////////////////////
        const { appkey, secret, serverIp, playMode, enableHTTPS, port, snapDir, videoDir, layout, encryptedFields, showToolbar, showSmart, buttonIDs } = this.webControlOption
        const argument = {
          appkey: appkey,
          secret: this.setEncrypt(secret),
          ip: serverIp,
          playMode: playMode,
          enableHTTPS: enableHTTPS,
          port: port,
          snapDir: snapDir,
          videoDir: videoDir,
          layout: layout,
          encryptedFields: encryptedFields,
          showToolbar: showToolbar,
          showSmart: showSmart,
          buttonIDs: buttonIDs
        }
        console.log(argument)
        /// /////////////////////////////// 请自行修改以上变量值  ////////////////////////////////////
        this.oWebControl.JS_RequestInterface({
          funcName: 'init',
          argument: JSON.stringify(argument)
        }).then((oData) => {
          this.oWebControl.JS_Resize(this.webControlOption.playWndWidth, this.webControlOption.playWndHeight) // 初始化后resize一次，规避firefox下首次显示窗口后插件窗口未与DIV窗口重合问题
        })
      })
    },
    // 反初始化
    uninit () {
      if (!this.oWebControl) return
      this.oWebControl.JS_RequestInterface({
        funcName: 'uninit'
      }).then((oData) => {
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
      let encrypt = new JSEncrypt()
      encrypt.setPublicKey(this.pubKey)
      return encrypt.encrypt(value)
    },
    // 设置窗口裁剪，当因滚动条滚动导致窗口需要被遮住的情况下需要JS_CuttingPartWindow部分窗口
    setWndCover () {
      const playWndWidth = this.webControlOption.playWndWidth
      const playWndHeight = this.webControlOption.playWndHeight
      const iWidth = document.body.clientWidth // $(window).width();
      const iHeight = document.body.clientHeight // $(window).height();
      const oDivRect = document.getElementById(this.webControlOption.playWndId).getBoundingClientRect()

      let iCoverLeft = (oDivRect.left < 0) ? Math.abs(oDivRect.left) : 0
      let iCoverTop = (oDivRect.top < 0) ? Math.abs(oDivRect.top) : 0
      let iCoverRight = (oDivRect.right - iWidth > 0) ? Math.round(oDivRect.right - iWidth) : 0
      let iCoverBottom = (oDivRect.bottom - iHeight > 0) ? Math.round(oDivRect.bottom - iHeight) : 0

      iCoverLeft = (iCoverLeft > playWndWidth) ? playWndWidth : iCoverLeft
      iCoverTop = (iCoverTop > playWndHeight) ? playWndHeight : iCoverTop
      iCoverRight = (iCoverRight > playWndWidth) ? playWndWidth : iCoverRight
      iCoverBottom = (iCoverBottom > playWndHeight) ? playWndHeight : iCoverBottom

      this.oWebControl.JS_RepairPartWindow(0, 0, playWndWidth + 1, playWndHeight)
      if (iCoverLeft !== 0) {
        this.oWebControl.JS_CuttingPartWindow(0, 0, iCoverLeft, playWndHeight)
      }
      if (iCoverTop !== 0) {
        this.oWebControl.JS_CuttingPartWindow(0, 0, playWndWidth + 1, iCoverTop)
      }
      if (iCoverRight !== 0) {
        this.oWebControl.JS_CuttingPartWindow(playWndWidth - iCoverRight, 0, iCoverRight, playWndHeight)
      }
      if (iCoverBottom !== 0) {
        this.oWebControl.JS_CuttingPartWindow(0, playWndHeight - iCoverBottom, playWndWidth, iCoverBottom)
      }
    },
    // 视频预览
    handleStartPreview (preObj) {
      if (this.oWebControl) {
      } else {
        this.initPlugin()
      }
      const { streamMode, transMode, gpuMode, wndId } = this.webControlOption
      if (preObj && preObj.indexCodes && preObj.indexCodes.length > 0) {
        if (preObj.noteType === 'nodelist') {
          this.oWebControl.JS_RequestInterface({
            funcName: 'stopAllPreview'
          }).then((oData) => {
            this.activeCameraIndexCodes = []
            preObj.indexCodes.forEach((cameraIndexCode, index) => {
              if (this.activeCameraIndexCodes.includes(cameraIndexCode)) {
                this.$message('当前监控点正在播放中')
              } else {
                const argument = {
                  cameraIndexCode: cameraIndexCode,
                  streamMode: streamMode || 0,
                  transMode: transMode || 1,
                  gpuMode: gpuMode || 0,
                  wndId: index + 1
                }
                this.oWebControl.JS_RequestInterface({
                  funcName: 'startPreview',
                  argument: JSON.stringify(argument)
                })
              }
            })
          })
        } else {
          const cameraIndexCode = preObj.indexCodes[0]
          // if (this.activeCameraIndexCodes.includes(cameraIndexCode)) {
          //   this.$message('当前监控点正在播放中')
          // } else {
          const argument = {
            cameraIndexCode: cameraIndexCode,
            streamMode: streamMode || 0,
            transMode: transMode || 1,
            gpuMode: gpuMode || 0,
            wndId: wndId || -1
          }
          this.oWebControl.JS_RequestInterface({
            funcName: 'startPreview',
            argument: JSON.stringify(argument)
          })
          // }
        }
      }
    },
    // 停止预览
    handleStopAllPreview () {
      this.oWebControl.JS_RequestInterface({
        funcName: 'stopAllPreview'
      })
    },
    // 抓图
    handleSnapPic () {
      const argument = {
        name: 'D:\\SnapDir\\test.jpg'
      }
      this.oWebControl.JS_RequestInterface({
        funcName: 'snapShot',
        argument: JSON.stringify(argument)
      })
    },
    // 字符叠加
    handleSetOSDText () {
      const argument = {
        text: '温度：50\n 湿度：38',
        x: 5,
        y: 25
      }
      this.oWebControl.JS_RequestInterface({
        funcName: 'drawOSD',
        argument: JSON.stringify(argument)
      })
    },

    showWnd () {
      this.oWebControl.JS_ShowWnd()
    },

    hideWnd () {
      this.oWebControl.JS_HideWnd()
    },

    destroyWnd () {
      this.oWebControl.JS_DestroyWnd().then(() => {
        console.log('JS_DestroyWnd')
      }, () => {
        console.log('JS_DestroyWnd error')
      })
    },

    stopControl () {
      if (!this.oWebControl) return
      // this.handleStopAllPreview()
      this.destroyWnd()
      this.oWebControl = null
    },

    receiveMessage (event) {
      let data = event.data || '{}'
      try {
        data = JSON.parse(data)
        if (data.method === 'hideTabCallback' || data.argument.isExtend) {
          this.oWebControl && this.hideWnd()
        } else if (data.method === 'showTabCallback' || !data.argument.isExtend) {
          this.oWebControl && this.showWnd()
        }
      } catch (e) {
        console.log(e)
      }
    }
  },
  beforeDestroy () {
    // this.stopControl()
    var that = this
    setTimeout(() => {
      that.stopControl()
    }, 300)
    // this.stopControl()
  }
}
</script>

<style lang="scss" scoped>
.playWnd {
  width: 100%;
  height: 100%;
}
</style>
