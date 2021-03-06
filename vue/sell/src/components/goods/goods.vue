<template>
  <div>
    <div class="goods">
      <div class="menu-wrap" ref="menuWrap">
        <ul>
          <li v-for="(item, index) in goods" :key="index" class="menu-item border-1px" :class="{'current':currentIndex == index}" @click="selectMenu(index)" ref="menuList">
            <span class="text">
              <icon v-show="item.type>0" :iconType="item.type" :iconSize="3"></icon>
              {{item.name}}
            </span>
          </li>
        </ul>
      </div>
      <div class="foods-wrap" ref="foodsWrap">
        <ul>
          <li v-for="(item, index) in goods" class="food-list" :key="index" ref="foodList">
            <h1 class="title">{{item.name}}</h1>
            <ul>
              <li v-for="(food, index) in item.foods" class="food-item border-1px" :key="index" @click="selectFood(food)">
                <div class="icon">
                  <img width="57" height="57" :src="food.icon">
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="count">月售{{food.sellCount}}份</span>
                    <span>好评率{{food.rating || 0}}%</span>
                  </div>
                  <div class="price">
                    <span class="now">￥{{food.price}}</span>
                    <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                  </div>
                  <div class="control-wrap">
                    <cartcontrol @add="addFood" :food="food"></cartcontrol>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <shopcart ref="shopcart" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice" :select-foods="selectFoods"></shopcart>
    </div>
    <food @add="addFood" :food="selectedFood" ref="food"></food>
  </div>
</template>

<script type="text/ecmascript-6">
import icon from '@/components/icon/icon';
import shopcart from '@/components/shopcart/shopcart';
import cartcontrol from '@/components/cartcontrol/cartcontrol';
import food from '@/components/food/food';
import BScroll from 'better-scroll';

const ERR_OK = 0;

export default {
  props: {
    seller: {
      type: Object
    }
  },
  data() {
    return {
      goods: [],
      listHeight: [],
      scrollY: 0,
      selectedFood: {}
    };
  },
  computed: {
    currentIndex() {
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i];
        let height2 = this.listHeight[i + 1];
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          this._followScroll(i);
          return i;
        }
      }
      return 0;
    },
    selectFoods() {
      let foodsArr = [];
      this.goods.forEach(good => {
        good.foods.forEach(food => {
          if (food.count) {
            foodsArr.push(food);
          }
        });
      });
      return foodsArr;
    }
  },
  created() {
    this.$http.get('/api/goods').then(response => {
      response = response.body;
      if (response.errno === ERR_OK) {
        this.goods = response.data;
        this.$nextTick(() => {
          this._initScroll();
          this._calculateHeight();
        });
      }
    });
  },
  methods: {
    selectMenu(index) {
      let foodList = this.$refs.foodList;
      let el = foodList[index];
      this.foodsScroll.scrollToElement(el, 300);
    },
    _initScroll() {
      this.menuScroll = new BScroll(this.$refs.menuWrap, {
        observeDOM: false,
        click: true
      });
      this.foodsScroll = new BScroll(this.$refs.foodsWrap, {
        observeDOM: false,
        probeType: 3,
        click: true
      });
      this.foodsScroll.on('scroll', pos => {
        this.scrollY = Math.abs(Math.round(pos.y));
      });
    },
    _calculateHeight() {
      let foodList = this.$refs.foodList;
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i];
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    },
    _followScroll(index) {
      let menuList = this.$refs.menuList;
      let el = menuList[index];
      this.menuScroll.scrollToElement(el, 300, 0, -110);
    },
    addFood(target) {
      this._drop(target);
    },
    _drop(target) {
      this.$nextTick(() => {
        this.$refs.shopcart.drop(target);
      });
    },
    selectFood(food) {
      this.selectedFood = food;
      this.$refs.food.show();
    }
  },
  components: {
    icon,
    shopcart,
    cartcontrol,
    food
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixin'

.goods
  display: flex
  position: absolute
  top: 174px
  left: 0
  bottom: 46px
  width: 100%
  overflow: hidden
  .menu-wrap
    flex: 0 0 80px
    width: 80px
    background: #f3f5f7
    .menu-item
      display: flex
      width: 56px
      height: 54px
      padding: 0 12px
      font-size: 0
      line-height: 14px
      border-1px(rgba(7, 17, 27, 0.2))
      align-items: center
      &:last-child
        border-none()
      &.current
        position: relative
        margin-top: -1px
        padding-top: 1px
        z-index: 10
        background: #ffffff
        border-none()
        .text
          font-weight: 700
      .icon
        vertical-align: top
        width: 12px
        height: 12px
        margin-right: -2px
        background-size: 12px 12px
      .text
        width: 56px
        font-size: 12px
  .foods-wrap
    flex: 1
    .title
      height: 26px
      padding-left: 14px
      line-height: 26px
      border-left: 2px solid #d9dde1
      font-size: 12px
      color: rgb(147, 153, 159)
      background: #f3f5f7
    .food-item
      display: flex
      margin: 18px
      padding-bottom: 18px
      border-1px(rgba(7, 17, 27, 0.2))
      &:last-child
        padding-bottom: 0
        border-none()
      .icon
        flex: 0 0 57px
        margin-right: 10px
      .content
        flex: 1
        .name
          margin: 2px 0 8px
          height: 14px
          line-height: 14px
          font-size: 14px
          color: rgb(7, 17, 27)
        .desc, .extra
          line-height: 10px
          font-size: 10px
          color: rgb(147, 153, 159)
        .desc
          margin-bottom: 8px
          line-height: 12px
        .extra
          .count
            margin-right: 9px
        .price
          font-weight: 700
          line-height: 24px
          .now
            margin-right: 0px
            font-size: 14px
            font-weight: 700
            color: rgb(240, 20, 20)
          .old
            text-decoration: line-through
            font-size: 10px
            font-weight: 700
            color: rgb(147, 153, 159)
        .control-wrap
          position: absolute
          right: 0
          bottom: 12px
</style>