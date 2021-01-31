<template>
  <div :id="id" :class="className" :style="{height:height,width:width}">
    <div class="div-empty-text" v-if="mianPersonData.length <= 0">
      暂无数据记录
    </div>
    <div class="face-content" v-else>
      <ul>
        <li class="pic-container" v-for="item in mianPersonData" :key="item.id" @click="$router.push(mianPersonRouter)">
          <div>
            <div class="pic-box">
              <img :src="item.bgkUrl" alt="">
              <div class="pic-title">
                <span class="pic-text">现场抓拍图</span>
              </div>
            </div>
            <div class="text-content">
              <p class="time">
                {{ item.captureTime ? item.captureTime.substring(0, 10) + ' ' +item.captureTime.substring(11, 19) : ''}}
              </p>
              <p>{{ item.cameraName }}</p>
            </div>
          </div>
          <div class="circle">
            <span class="precent">{{(item.similary).toFixed(1)}}%</span>
          </div>
          <div>
            <div class="pic-box pic-zhua">
              <img :src="item.personUrl" alt="">
              <div class="pic-title">
                <span class="pic-text">比对人脸图</span>
              </div>
            </div>
            <div class="text-content">
              <p class="time">{{ item.faceGroupName }}</p>
              <p>{{ item.personName }}</p>
            </div>
          </div>

        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    className: {
      type: String,
      default: 'importantPerson'
    },
    id: {
      type: String,
      default: 'importantPerson'
    },
    width: {
      type: String,
      default: '376px'
    },
    height: {
      type: String,
      default: '749px'
    },
    mianPersonData: {
      type: Array
    },
    mianPersonRouter: {
      type: String
    }
  },
  data () {
    return {
    }
  }
}
</script>
<style lang="scss">
@import "~@/styles/variables.scss";
.importantPerson {
  position: relative;
  min-width: 376px;
  .div-empty-text {
    position: absolute;
    top: 30px;
    left: 50%;
    transform: translate(-50%, 0);
    color: #{$textColor3};
    font-size: 16px;
  }
  .pic-container {
    position: relative;
    display: flex;
    justify-content: space-between;
    border: 1px solid #{$textColor1};
    margin-bottom: 20px;
    .pic-box {
      position: relative;
      width: 160px;
      height: 175px;
      img {
        width: 100%;
        height: 100%;
      }
      .pic-title {
        position: absolute;
        bottom: 0px;
        // margin: 0 5px;
        left: 0;
        width: 160px;
        height: 24px;
        background-color: rgba(0, 0, 0, 0.2);
      }
      .pic-text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 12px;
        color: #fff;
      }
    }
    .circle {
      position: absolute;
      top: 38%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background-color: #188ff6;
      .precent {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 14px;
        color: #fff;
      }
    }
    .text-content {
      background-color: #fff;
      line-height: 24px;
      font-size: 14px;
      color: #{$textColor5};
      padding: 6px 10px;
    }
    &:hover {
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.5);
    }
  }
  li:nth-last-child(1) {
    margin-bottom: 0;
  }
}
</style>