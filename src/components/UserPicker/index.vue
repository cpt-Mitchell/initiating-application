<template>
  <transition name="slideup">
    <div class="user-picker-container" v-show="pickerShow">
      <picker
        v-if="pickerDisplay"
        :deptKeyWord="deptKeyWord"
        :companyCode="companyCode"
        :currentCompany="currentCompany"
        :searchBelongCompany="searchBelongCompany"
        :justWorker="justWorker"
        :selected="selected"
        :multiple="multiple"
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
    currentCompany: {
      type: String,
      default: function() {
        return ''
      }
    },
    multiple: {
      type: Boolean,
      default: function() {
        return false
      }
    },
    searchBelongCompany: {
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
    justWorker: {
      type: Boolean,
      default: function() {
        return false
      }
    },
    display: {
      type: Boolean,
      required: true
    },
    companyCode: {
      type: String,
      default: () => ''
    },
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
.user-picker-container {
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
