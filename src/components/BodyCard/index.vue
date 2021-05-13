<template>
  <div class="bodyCard">
    <el-card class="box-card">
      <div class="bodyCard-title" slot="header">
        {{title}}
        <div class="bodyCard-btns">
          <slot name="btn" :data="data"></slot>
        </div>
      </div>
      <div v-if="type=='item'">
        <el-row :gutter="20">
          <el-col
            v-for="(item,i) of data.label"
            :key="`item_${i}`"
            :span="item.span || data.span || 8"
          >
            <div class="infoBox">
              <span class="infoBox-label">{{item.label}}</span>
              <span>:</span>
              <span class="infoBox-value" v-if="item.tag">
                <GTag :data="data.data[item.prop]"></GTag>
              </span>
              <el-tooltip
                v-else-if="data.data[item.prop] && data.data[item.prop].length && data.data[item.prop].length > 20"
                class="item"
                effect="dark"
                :content="data.data[item.prop]"
                placement="top"
              >
                <span class="infoBox-value">{{data.data[item.prop] | StringStr(20)}}</span>
              </el-tooltip>
              <span class="infoBox-value" v-else>{{data.data[item.prop] | StringStr(20)}}</span>
            </div>
          </el-col>
        </el-row>
        <slot name="slot-cont"></slot>
      </div>
      <div v-if="type=='table'" style="padding: 20px">
        <GTable :tableLabel="info.label" :tableData="info && info.tableData">
          <template #renderButton="data">
            <slot name="btns" :slotName="data.slotName"></slot>
          </template>
        </GTable>
      </div>
      <div v-if="type=='memo'" style="padding: 20px;">
        <div class="bodyCard-text" v-html="data.data ? data.data : '暂无备注'"></div>
      </div>
      <div v-if="type==='img'">
        <slot name="img-cont"></slot>
        <div style="padding: 0 20px 20px">
          <div v-if="data.data && $utils.isType(data.data, 'Array') && data.data.length">
            <img
              style="max-width: 300px; max-height: 200px; margin-right: 20px"
              :key="'img'+ index"
              v-for="(item, index) in data.data"
              :src="item"
              @click="handleOpenImg(item)"
            />
          </div>
          <div v-else-if="data.data && $utils.isType(data.data, 'String') && data.data">
            <img
              style="max-width: 300px; max-height: 200px; margin-right: 20px"
              :src="data.data"
              @click="handleOpenImg(data.data)"
            />
          </div>

          <None v-else type="pic" text="暂无图片" />
        </div>
      </div>
      <div v-if="type==='slot'">
        <slot name="slot-cont"></slot>
      </div>
    </el-card>

    <el-dialog
      custom-class="dialog-image"
      title="查看图片"
      v-if="showPicVisible"
      :visible.sync="showPicVisible"
      :modal="false"
      width="940px"
    >
      <img style="min-width: 500px; max-width: 900px;" :src="imageUrl" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'BodyCard',
  components: {
  },
  props: [
    'type', 'data'
  ],
  data () {
    return {
      title: this.data.title,
      info: this.data.info,
      showPicVisible: false,
      imageUrl: null
    }
  },
  methods: {
    handleOpenImg (url) {
      // window.open(url)
      this.imageUrl = url
      this.showPicVisible = true
    }
  },
  mounted () {
    // console.log(this.data);

    this.info && this.info.tableData && this.info.tableData.forEach(arr => {
      for (var i in arr) {
        arr[i] = arr[i] === undefined || arr[i] === null ? '-' : arr[i]
      }
    })
  }
}
</script>

<style lang="less" scoped>
@import '~@assets/style/index.less';
.bodyCard {
  width: ~'calc(100% - 32px)';
  margin: 16px 16px 0 16px;
  background: #fff;
  .box-card {
    /deep/ .el-card__header,
    /deep/ .el-card__body {
      padding: 8px 12px;
    }
  }

  .bodyCard-title {
    .title-style;
    position: relative;
    .bodyCard-btns {
      position: absolute;
      right: 0px;
      top: 0px;
    }
  }
  .infoBox {
    height: 40px;
    line-height: 40px;
    box-sizing: border-box;
    padding: 0 16px;
    .ellipsis;
    .infoBox-label {
      font-size: 16px;
      color: @text-color;
    }
    .infoBox-value {
      margin-left: 5px;
      font-size: 14px;
      color: @text-color-light;
      display: inline-block;
    }
  }
  .bodyCard-text {
    width: 100%;
  }

  &:after {
    content: '';
    display: block;
    clear: both;
  }

  .dialog-image {
    img {
      display: block;
      margin: 0 auto;
    }
  }
}
</style>
