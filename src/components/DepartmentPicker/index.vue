<template>
  <transition name="slideup">
    <div class="department-picker-container" v-show="pickerShow">
      <picker
        v-if="pickerDisplay"
        :selected="selected"
        :multiple="multiple"
        :companyCode="companyCode"
        :deptKeyWord="deptKeyWord"
        @close="pickerShow = false"
        @submit="getResult"
      ></picker>
    </div>
  </transition>
</template>

<script>
import Picker from './picker'
export default {
  props: {
    multiple: {
      type: Boolean,
      default: function() {
        return false
      }
    },
    selected: {
      type: Array,
      default: function() {
        return []
      }
    },
    display: {
      type: Boolean,
      required: true
    },
    // 所要查询的公司范围(例如：查华劲人纸品和赣州纸业，则传"011,004"，查询本公司代码为"1")
    companyCode: {
      type: String,
      default: () => ''
    },
    // 根据部门关键字查询范围(例如：只查询带"厂"字部门及其下级，则传"厂")
    deptKeyWord: {
      type: String,
      default: () => ''
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
