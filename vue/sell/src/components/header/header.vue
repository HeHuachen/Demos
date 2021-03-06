<template>
  <div class="header">
    <!-- 商家 -->
    <div class="content-wrap">
      <div class="avatar">
        <img :src="seller.avatar" width="64" height="64">
      </div>
      <!-- 商家简介&优惠入口 -->
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">
          {{seller.description}}/{{seller.deliveryTime}}分钟送达
        </div>
        <div v-if="seller.supports" class="support">
          <icon :iconType="seller.supports[4].type" :iconSize="1"></icon>
          <span class="text">{{seller.supports[4].description}}</span>
        </div>
        <div v-if="seller.supports" class="support-count" @click="showDetail">
          <span class="count">{{seller.supports.length}}个</span>
          <i class="icomoon icon-keyboard_arrow_right"></i>
        </div>
      </div>
    </div>
    <!-- 公告 -->
    <div class="bulletin-wrap" @click="showDetail">
      <span class="bulletin-title"></span>
      <span class="bulletin-text">{{seller.bulletin}}</span>
      <i class="icomoon icon-keyboard_arrow_right"></i>
    </div>
    <!-- 头部背景图 -->
    <div class="background">
      <img :src="seller.avatar" width="100%" height="100%">
    </div>
    <!-- 弹出层 -->
    <transition name="fade">
      <div class="detail" v-show="detailShow">
        <div class="detail-wrap clearfix">
          <div class="detail-main">
            <h1 class="name">{{seller.name}}</h1>
            <!-- 评心 -->
            <div class="star-wrap">
              <star :size="48" :score="seller.score"></star>
            </div>
            <div class="title">
              <div class="line"></div>
              <div class="text">优惠信息</div>
              <div class="line"></div>
            </div>
            <!-- 优惠信息 -->
            <ul v-if="seller.supports" class="supports">
              <li class="support-item" v-for="(item, index) in seller.supports" :key="item.id">
                <icon :iconType="seller.supports[index].type" :iconSize="2"></icon>
                <span class="text">{{seller.supports[index].description}}</span>
              </li>
            </ul>
            <div class="title">
              <div class="line"></div>
              <div class="text">商家公告</div>
              <div class="line"></div>
            </div>
            <!-- 商家公告 -->
            <div class="bulletin">
              <p class="content">{{seller.bulletin}}</p>
            </div>
          </div>
        </div>
        <!-- 弹出层关闭 -->
        <div class="detail-close">
          <i class="icomoon icon-close" @click="hideDetail"></i>
        </div>
      </div>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
import star from '@/components/star/star';
import icon from '@/components/icon/icon';

export default {
  props: {
    seller: {
      type: Object
    }
  },
  data() {
    return {
      detailShow: false
    };
  },
  methods: {
    showDetail() {
      this.detailShow = true;
    },
    hideDetail() {
      this.detailShow = false;
    }
  },
  components: {
    star,
    icon
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixin'

.header
  position: relative
  color: #ffffff
  background: rgba(7, 17, 27, 0.5)
  overflow: hidden
  .content-wrap
    position: relative
    padding: 24px 12px 18px 24px
    font-size: 0
    .avatar
      display: inline-block
      vertical-align: top
      img
        border-radius: 2px
    .content
      display: inline-block
      margin-left: 16px
      .title
        margin: 2px 0 8px 0
        .brand
          display: inline-block
          vertical-align: top
          width: 30px
          height: 18px
          bg-image('brand')
          background-size: 30px 18px
          background-repeat: no-repeat
        .name
          margin-left: 6px
          font-size: 16px
          font-weight: bold
          line-height: 18px
      .description
        margin-bottom: 10px
        line-height: 12px
        font-size: 12px
      .support
        .icon
          vertical-align: top
          width: 12px
          height: 12px
          margin-right: 4px
          background-size: 12px 12px
        .text
          font-size: 10px
          line-height: 12px
    .support-count
      position: absolute
      right: 12px
      bottom: 14px
      height: 24px
      padding: 0 8px
      line-height: 24px
      border-radius: 14px
      background: rgba(0, 0, 0, 0.2)
      text-align: center
      .count
        vertical-align: top
        font-size: 10px
      .icomoon
        margin-left: 2px
        font-size: 10px
        line-height: 24px
  .bulletin-wrap
    position: relative
    height: 28px
    padding: 0 22px 0 12px
    line-height: 28px
    white-space: nowrap
    overflow: hidden
    text-overflow: ellipsis
    background: rgba(7, 17, 27, 0.2)
    .bulletin-title
      display: inline-block
      width: 22px
      height: 12px
      margin-top: 8px
      vertical-align: top
      bg-image('bulletin')
      background-size: 22px 12px
      background-repeat: no-repeat
    .bulletin-text
      vertical-align: top
      font-size: 10px
    .icomoon
      position: absolute
      right: 12px
      top: 8px
      font-size: 10px
  .background
    position: absolute
    left: 0
    top: 0
    width: 100%
    height: 100%
    z-index: -1
    filter: blur(10px)
    img
      object-fit: cover
  .detail
    position: fixed
    top: 0
    left: 0
    z-index: 100
    width: 100%
    height: 100%
    overflow: auto
    background: rgba(7, 17, 27, 0.8)
    backdrop-filter: blur(10px)
    &.fade-enter-active, &.fade-leave-active
      transition: all 0.5s
    &.fade-enter, &.fade-leave-to
      opacity: 0
      background: rgba(7, 17, 27, 0)
    .detail-wrap
      width: 100%
      min-height: 100%
      .detail-main
        margin-top: 64px
        padding-bottom: 64px
        .name
          line-height: 16px
          text-align: center
          font-size: 16px
          font-weight: 700
        .star-wrap
          margin-top: 18px
          padding: 2px 0
          text-align: center
        .title
          display: flex
          width: 80%
          margin: 28px auto 24px
          align-items: center
          .line
            flex: 1
            position: relative
            border-1px(rgba(255, 255, 255, 0.2))
          .text
            padding: 0 12px
            font-size: 14px
            font-weight: 700
            line-height: 14px
        .supports
          width: 80%
          margin: 0 auto
          .support-item
            margin-bottom: 12px
            padding: 0 12px
            font-size: 0
            &:last-child
              margin-bottom: 0
            .icon
              width: 16px
              height: 16px
              vertical-align: top
              margin-right: 6px
              background-size: 16px 16px
            .text
              font-size: 12px
              font-weight: 200
              line-height: 16px
        .bulletin
          width: 80%
          margin: 0 auto
          .content
            padding: 0 12px
            font-size: 12px
            line-height: 20px
            font-weight: 200
    .detail-close
      position: relative
      width: 32px
      height: 32px
      margin: -64px auto 0
      clear: both
      font-size: 32px
      color: rgba(255, 255, 255, 0.5)
</style>