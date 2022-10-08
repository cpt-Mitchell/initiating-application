<template>
<transition name="slideup">
  <div class="department-picker-container" v-show="pickerShow">
    <picker v-if="pickerDisplay" :selected="selected" :multiple="multiple" @close="pickerShow=false" @submit="getResult"></picker>
  </div>
</transition>
</template>

<script>
import Picker from './picker'
export default {
  props: {
    multiple: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    selected: {
      type: Array,
      default: function () {
        return []
      }
    },
    display: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      pickerDisplay: false,
      pickerShow: false
    }
  },
  watch: {
    pickerShow(val) {
      if (!val) {
        setTimeout(() => {
          this.pickerDisplay = false
          this.$emit('close')
        }, 50)
      }
    },
    display(val) {
      if (val) {
        this.pickerDisplay = val
        setTimeout(() => {
          this.pickerShow = true
        }, 150)
      }
    }
  },
  methods: {
    getResult(result) {
      this.$emit('result', result)
    }
  },
  components: {
    Picker
  },
  mounted() {
    this.pickerDisplay = this.display
  }
}
</script>

<style lang="less" scoped>
.department-picker-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100vh;
  background: #fff;
  z-index: 8888;
}
</style>
