<template>
  <div class="list" :class="className">
    <el-card v-if="$slots.card && className === 'column'" class="list-card">
      <slot name="card"></slot>
    </el-card>

    <el-card
      v-if="($slots.button && className === 'column') || $slots['search-items']"
      class="list-header"
      :class="{show: show}"
    >
      <div v-if="className === 'column' && $slots.button" class="button">
        <slot name="button"></slot>
      </div>
      <div class="search" v-if="$slots['search-items']">
        <div class="search-title">
          <div @click="show = !show">
            <span>{{`${show ? '收起' : '展开'}筛选`}}</span>
            <i
              class="icon"
              v-if="className === 'column'"
              :class="show ? 'el-icon-arrow-up': 'el-icon-arrow-down'"
            ></i>
          </div>
        </div>

        <el-collapse-transition>
          <div v-show="show" class="search-content">
            <el-divider></el-divider>
            <div>
              <slot name="search-items"></slot>
            </div>
          </div>
        </el-collapse-transition>
      </div>
    </el-card>

    <div class="list-content">
      <el-card v-if="$slots.card && className === 'row'" class="list-card">
        <slot name="card"></slot>
      </el-card>
      <el-card class="list-main">
        <div v-if="className === 'row' && $slots.button" class="button">
          <slot name="button"></slot>
        </div>

        <div class="table" v-if="$slots.table">
          <el-divider v-if="className === 'row' && ($slots.button)"></el-divider>
          <slot name="table"></slot>
        </div>
        <slot></slot>
      </el-card>
    </div>

    <el-drawer
      v-if="showInfo"
      :title="infoTitle"
      custom-class="drawer-info"
      :visible.sync="infoVisible"
      size="1186px"
      direction="rtl"
    >
      <div class="info-header">
        <div class="headerCard">
          <el-card class="box-card" shadow="never">
            <div class="headerCard-title">
              <Icons v-if="infoHeader.icon" :type="infoHeader.icon" />
              <span>{{infoHeaderTitle | StringStr(25)}}</span>
            </div>

            <div class="headerCard-btns">
              <div class="btnBox" v-for="(item, i) in infoHeaderBtns" :key="`info_btn_${i}`">
                <el-button type="text" :disabled="item.disabled" @click="open(i)">
                  <Icons :type="item.icon" />
                  <span class="headerCard-btn-name">{{item.name}}</span>
                </el-button>
              </div>
            </div>
            <slot name="headerCardSlot" :data="infoHeader.data"></slot>
          </el-card>
        </div>
      </div>

      <div class="info-body">
        <slot name="infoBody" :infoVisible="infoVisible" :data="currentData"></slot>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  components: {
  },
  props: {
    className: {
      type: String,
      default: 'column'
    },
    // showInfo: {
    //   type: Boolean,
    //   default: true
    // },
    infoTitle: {
      type: String
    },
    infoHeader: {
      type: Object,
    },
  },
  data () {
    return {
      show: false,
      infoVisible: false,
      bodyHeight: 0,
      infoHeaderTitle: '',
      infoHeaderBtns: {},
      currentData: {}
    }
  },
  watch: {
    infoVisible (value) {
      if (!value) {
        this.initBtns()
        this.currentData = {}
      }
    }
  },
  computed: {
    showInfo () {
      return !!this.infoHeader
    }
  },
  methods: {
    open (key) {
      this.$emit('handleInfoBtn', key)
    },
    openInfo () {
      this.infoVisible = true
    },
    closeInfo () {
      this.infoVisible = false
    },
    setInfoHeaderTitle (value = '-') {
      this.infoHeaderTitle = value
    },
    initBtns () {
      this.infoHeaderBtns = this._.cloneDeep(this.infoHeader.button)
    },
    // 设置按钮禁用状态
    setBtnState (name, state = true) {
      this.infoHeaderBtns[name].disabled = !state
    },
    setCurrentData (data) {
      this.currentData = data
    },
    getCurrentData () {
      return this.currentData
    },
    initInfo () {
      this.infoHeader.title && this.setInfoHeaderTitle(this.infoHeader.title)
      this.initBtns()
    }
  },
  beforeCreate () {
  },
  created () {
    this.showInfo && this.initInfo()
  },
  mounted () {

  }
}
</script>

<style lang="less">
@import '~@assets/style/index.less';

.list {
  width: 100%;
  padding: 12px;
  overflow: auto;

  .el-divider {
    margin: 8px 0;
  }

  &-card,
  &-header,
  &-main {
    .el-card__header,
    .el-card__body {
      padding: 8px 0;
    }
  }

  &-card,
  &-header {
    margin-bottom: 12px;
  }

  &-header {
    .search {
      @title-height: 36px;
      margin-top: -@title-height;

      &-title {
        display: inline-block;
        line-height: @title-height;
        height: @title-height;
        cursor: pointer;
        padding: 0 12px;
        user-select: none;

        span {
          color: @blue;
        }

        .icon {
          padding-left: 8px;
        }
      }

      &-item {
        &:not(:nth-child(1))::before {
          content: '';
          display: block;
          border-top: 1px dashed #ddd;
          margin: 6px 0;
        }

        label {
          display: inline-block;
          width: 100px;
          text-align: right;
          padding-right: 12px;
        }
      }
    }
  }

  &-content {
    flex: 1;
  }

  &-main {
    flex: 1;
    overflow: hidden;

    .table {
      .el-divider {
        margin: 8px 0 0 0;
      }
    }
  }

  &-header,
  &-content {
    display: flex;
    flex-direction: column;

    .button {
      padding: 4px 12px;
      display: flex;
      justify-content: flex-end;
    }
  }

  .card {
    display: flex;
    justify-items: center;
    justify-content: space-evenly;
  }

  &.row {
    display: flex;
    height: 100%;
    flex-direction: row;

    .list-header {
      margin-bottom: 0;
      margin-right: 12px;
      width: 50px;
      position: relative;
      &.show {
        width: 350px;
      }
      &:not(.show) .search-title {
        writing-mode: vertical-lr;
        height: auto;
        .center-align;
      }
      .search {
        width: 350px;
        margin-top: 0;
      }
    }
    .list-content {
      overflow: hidden;
    }
    .list-main .el-card__body {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: auto;
    }
  }

  .drawer-info {
    .el-drawer__header {
      padding: 0;
      text-align: center;
      height: 44px;
      line-height: 44px;
      font-size: 18px;
      color: @text-color;
      border-bottom: 1px solid #c0c4d3;
      margin-bottom: 0px;
    }

    .el-drawer__body {
      background: #eee;
      overflow: hidden;
      display: flex;
      flex-direction: column;

      .info-body {
        flex: 1;
        overflow: auto;
      }
    }
  }

  // 弹窗body
  .drawer-body {
    overflow: auto;
    padding-bottom: 8px;
  }

  .headerCard {
    .box-card {
      min-height: 56px;

      .el-card__body {
        padding: 0;
        position: relative;
      }

      .headerCard-title {
        font-size: 24px;
        height: 56px;
        line-height: 56px;
        padding-left: 25px;

        i {
          margin-right: 10px;
        }
      }

      .headerCard-btns {
        height: 100%;
        width: 520px;
        position: absolute;
        right: 16px;
        top: 0;
        display: flex;
        justify-content: flex-end;

        .btnBox {
          height: 100%;
          line-height: 56px;
          cursor: pointer;
          margin: 0 12px;

          i {
            margin-right: 4px;
          }
        }
      }
    }
  }
}
</style>
