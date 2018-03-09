<template>
  <span class="icon" :class="iconClass"></span>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    iconType: {
      type: Number
    },
    iconSize: {
      type: Number
    }
  },
  computed: {
    iconClass() {
      return this.classMap[this.iconType] + '-' + this.iconSize;
    }
  },
  created() {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixin'

.icon
  display: inline-block
  background-repeat: no-repeat
  &.decrease-1
    bg-image('decrease_1')
  &.discount-1
    bg-image('discount_1')
  &.guarantee-1
    bg-image('guarantee_1')
  &.invoice-1
    bg-image('invoice_1')
  &.special-1
    bg-image('special_1')
  &.decrease-2
    bg-image('decrease_2')
  &.discount-2
    bg-image('discount_2')
  &.guarantee-2
    bg-image('guarantee_2')
  &.invoice-2
    bg-image('invoice_2')
  &.special-2
    bg-image('special_2')
  &.decrease-3
    bg-image('decrease_3')
  &.discount-3
    bg-image('discount_3')
  &.guarantee-3
    bg-image('guarantee_3')
  &.invoice-3
    bg-image('invoice_3')
  &.special-3
    bg-image('special_3')
</style>