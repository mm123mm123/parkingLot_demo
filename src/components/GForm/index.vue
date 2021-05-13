<template>
  <div>
    <el-form
      size="small"
      ref="form"
      :rules="rules"
      :model="form"
      label-width="auto"
      :validate-on-rule-change="false"
      @submit.native.prevent
    >
      <div v-if="formList.length" style="max-height: 580px; overflow: auto; user-select: none;">
        <el-row>
          <el-col
            v-for="(card, index) in formList"
            :key="'formcard' + index"
            :span="card.span || 24"
          >
            <el-card style="margin: 10px;" :style="{minHeight: card.minHeight + 'px'}">
              <div v-if="card.title" slot="header" class="clearfix">
                <span>{{card.title}}</span>
              </div>
              <el-row>
                <div v-for="(item, index) in card.children" :key="item.key + index">
                  <!-- divider -->
                  <el-col :span="24" v-if="item.type === 'divider'">
                    <el-divider content-position="left">{{item.text}}</el-divider>
                  </el-col>
                  <!-- form-array -->
                  <el-col
                    :span="24"
                    v-if="item.type === 'form-array'"
                    :prop="item.key"
                    v-model="form[item.key]"
                  >
                    <el-table
                      :data="item.showTableData"
                      v-if="item.formList && item.formList.length"
                      style="width: 100%"
                    >
                      <el-table-column
                        v-for="(column, i) in item.formList"
                        :key="'tableColumn' + i"
                        :prop="column.key"
                        :label="column.label"
                        width="180"
                      >
                        <template slot-scope="scope">
                          <span>{{scope.row[column.key]}}</span>
                        </template>
                      </el-table-column>
                      <el-table-column fixed="right" label="操作" width="100">
                        <template slot-scope="scope">
                          <slot name="tableBtn" :rowIndex="scope.$index"></slot>
                        </template>
                      </el-table-column>
                    </el-table>
                    <el-link
                      style="width: 25%"
                      @click="item.iconMethods(item)"
                      v-if="item.showIcon"
                      icon="el-icon-circle-plus-outline"
                      :underline="false"
                      size="mini"
                      type="primary"
                    >{{item.iconName || '新增'}}</el-link>
                  </el-col>
                  <!-- input-array -->
                  <el-col :span="24" v-if="item.type === 'input-array'">
                    <el-form-item
                      v-for="(subItem, subIndex) in form[item.key]"
                      :label="item.label + (subIndex + 1)"
                      :key="subItem.key"
                      :prop="item.key + '.' + subIndex"
                      :rules="rules[item.key]"
                    >
                      <el-input
                        :style="{ width: '70%'}"
                        v-model="form[item.key][subIndex]"
                        @change="handleChangeEmit(item, form[item.key][subIndex])"
                        :placeholder="item.placeholder"
                        clearable
                      ></el-input>
                      <el-link
                        style="width: 25%"
                        @click.prevent="removeInput([item.key], subIndex)"
                        icon="el-icon-remove-outline"
                        :underline="false"
                        size="mini"
                        type="primary"
                      >删除</el-link>
                    </el-form-item>
                    <div style="padding-bottom: 12px;text-align: center;">
                      <el-link
                        @click.prevent="addInput([item.key])"
                        icon="el-icon-circle-plus-outline"
                        :underline="false"
                        size="mini"
                        type="primary"
                      >添加{{item.label}}</el-link>
                    </div>
                  </el-col>
                  <!-- form-array-edit -->
                  <el-col
                    :span="24"
                    v-if="item.type === 'form-array-edit'"
                    :prop="item.key"
                    v-model="form[item.key]"
                  >
                    <EditTable :formList="item.formList" />
                  </el-col>
                  <el-col
                    :span="item.span || card.itemSpan || 24"
                    v-if="!['form-array', 'divider', 'input-array'].includes(item.type) && (!defaultHidden || !(defaultHidden && defaultHidden[item.key]))"
                  >
                    <!-- link -->
                    <div style="line-height: 36px; text-align: center;">
                      <el-link
                        @click="item.iconMethods(item)"
                        v-if="item.showIcon"
                        :icon="item.icon || 'el-icon-circle-plus-outline'"
                        :underline="false"
                        size="mini"
                        type="primary"
                      >{{item.iconName || '新增'}}</el-link>
                    </div>
                    <el-form-item :label="item.label" :prop="item.key">
                      <!-- input -->
                      <el-input
                        :disabled="(defaultDisabled && defaultDisabled[item.key]) || false"
                        v-if="item.type === 'input'"
                        v-model="form[item.key]"
                        @change="handleChangeEmit(item, form[item.key])"
                        :placeholder="item.placeholder"
                        clearable
                      ></el-input>
                      <!-- input-password -->
                      <el-input
                        :disabled="(defaultDisabled && defaultDisabled[item.key]) || false"
                        v-if="item.type === 'password'"
                        v-model="form[item.key]"
                        type="password"
                        @change="handleChangeEmit(item, form[item.key])"
                        :placeholder="item.placeholder"
                        clearable
                      ></el-input>
                      <!-- input-num -->
                      <el-input-number
                        :disabled="(defaultDisabled && defaultDisabled[item.key]) || false"
                        v-if="item.type === 'input-num'"
                        v-model="form[item.key]"
                        style="width: 100%"
                        :max="item.max"
                        :min="item.min"
                        controls-position="right"
                        @change="handleChangeEmit(item, form[item.key])"
                        clearable
                      ></el-input-number>

                      <!-- textarea -->
                      <el-input
                        :disabled="(defaultDisabled && defaultDisabled[item.key]) || false"
                        v-if="item.type === 'textarea'"
                        type="textarea"
                        v-model="form[item.key]"
                        :rows="item.rows || 5"
                        :placeholder="item.placeholder"
                        @change="handleChangeEmit(item, form[item.key])"
                      ></el-input>

                      <!-- radio -->
                      <el-radio-group
                        :disabled="(defaultDisabled && defaultDisabled[item.key]) || false"
                        v-if="item.type === 'radio'"
                        @change="handleChangeEmit(item, form[item.key])"
                        v-model="form[item.key]"
                      >
                        <el-radio
                          v-for="(subItem, subIndex) in options && options[item.key] && options[item.key].length ? options && options[item.key] && options[item.key] : item.options"
                          :key="subItem.value + subIndex"
                          :label="subItem.label"
                        ></el-radio>
                      </el-radio-group>

                      <!-- 日期 -->
                      <el-date-picker
                        :disabled="(defaultDisabled && defaultDisabled[item.key]) || false"
                        v-if="item.type === 'date-picker'"
                        :placeholder="item.placeholder"
                        v-model="form[item.key]"
                        value-format="yyyy-MM-dd"
                        style="width: 100%;"
                        clearable
                      ></el-date-picker>

                      <el-date-picker
                        :disabled="(defaultDisabled && defaultDisabled[item.key]) || false"
                        v-if="item.type === 'date-picker-year'"
                        v-model="form[item.key]"
                        value-format="yyyy"
                        type="year"
                        :picker-options="item.pickerOptions || {}"
                        clearable
                      ></el-date-picker>

                      <el-date-picker
                        :disabled="(defaultDisabled && defaultDisabled[item.key]) || false"
                        v-if="item.type === 'date-picker-range'"
                        v-model="form[item.key]"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        clearable
                      ></el-date-picker>

                      <el-date-picker
                        :disabled="(defaultDisabled && defaultDisabled[item.key]) || false"
                        v-if="item.type === 'date-picker-time-range'"
                        @change="handleChangeEmit(item, form[item.key])"
                        v-model="form[item.key]"
                        type="datetimerange"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="item.pickerOptions || {}"
                        :default-time="item.defaultTime || []"
                        clearable
                      ></el-date-picker>

                      <el-date-picker
                        :disabled="(defaultDisabled && defaultDisabled[item.key]) || false"
                        v-if="item.type === 'date-time'"
                        @change="handleChangeEmit(item, form[item.key])"
                        style="width: 100%"
                        v-model="form[item.key]"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期时间"
                        default-time="12:00:00"
                        clearable
                      ></el-date-picker>

                      <el-time-picker
                        :disabled="(defaultDisabled && defaultDisabled[item.key]) || false"
                        v-if="item.type === 'el-time-picker'"
                        @change="handleChangeEmit(item, form[item.key])"
                        v-model="form[item.key]"
                        value-format="HH:mm"
                        style="width: 100%"
                        is-range
                        range-separator="至"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        placeholder="选择时间范围"
                        clearable
                      ></el-time-picker>

                      <el-time-select
                        :disabled="(defaultDisabled && defaultDisabled[item.key]) || false"
                        v-if="item.type === 'el-time-select'"
                        @change="handleChangeEmit(item, form[item.key])"
                        :placeholder="item.placeholder"
                        v-model="form[item.key]"
                        :picker-options="{
                          start: item.start || '06:00',
                          step: item.step || '00:15',
                          end: item.end || '17:00',
                          minTime: form[item.minTime] || null
                        }"
                        clearable
                      ></el-time-select>

                      <!-- checkbox -->
                      <el-checkbox-group
                        :disabled="(defaultDisabled && defaultDisabled[item.key]) || false"
                        v-if="item.type === 'checkbox'"
                        @change="handleChangeEmit(item, form[item.key])"
                        v-model="form[item.key]"
                        clearable
                      >
                        <el-checkbox
                          v-for="subItem in options && options[item.key] && options[item.key].length ? options && options[item.key] && options[item.key] : item.options"
                          :key="subItem.value"
                          :label="subItem.value"
                        >{{subItem.label}}</el-checkbox>
                      </el-checkbox-group>

                      <!-- checkbox 权限-->
                      <el-checkbox-group
                        :disabled="(defaultDisabled && defaultDisabled[item.key]) || false"
                        v-if="item.type === 'checkboxRole'"
                        v-model="form[item.key]"
                        clearable
                      >
                        <el-checkbox
                          v-for="subItem in options && options[item.key] && options[item.key].length ? options && options[item.key] && options[item.key] : item.children"
                          :key="subItem.id"
                          :label="subItem.id"
                        >
                          {{subItem.name}}
                          <!-- + {{subItem.api}} -->
                        </el-checkbox>
                      </el-checkbox-group>

                      <!-- select -->
                      <el-select
                        :disabled="(defaultDisabled && defaultDisabled[item.key]) || false"
                        :style="{ width: item.showIcon ? '60%':'100%'}"
                        v-if="item.type === 'select'"
                        v-model="form[item.key]"
                        :placeholder="form[item.placeholder]"
                        :filterable="true"
                        clearable
                        @change="handleChangeEmit(item, form[item.key])"
                      >
                        <el-option
                          v-for="(subItem) in options && options[item.key] && options[item.key].length ? options && options[item.key] && options[item.key] : item.options"
                          :label="subItem.label"
                          :value="subItem.value"
                          :key="subItem.value"
                        ></el-option>
                      </el-select>
                      <!-- select-create-->
                      <el-select
                        :disabled="(defaultDisabled && defaultDisabled[item.key]) || false"
                        :style="{ width: item.showIcon ? '60%':'100%'}"
                        v-if="item.type === 'select-create'"
                        v-model="form[item.key]"
                        :placeholder="form[item.placeholder]"
                        :filterable="true"
                        :allow-create="true"
                        @change="handleChangeEmit(item, form[item.key])"
                        clearable
                      >
                        <el-option
                          v-for="(subItem) in options && options[item.key] && options[item.key].length ? options && options[item.key] && options[item.key] : item.options"
                          :label="subItem.label"
                          :value="subItem.value"
                          :key="subItem.value"
                        ></el-option>
                      </el-select>

                      <!-- switch -->
                      <el-switch
                        :disabled="(defaultDisabled && defaultDisabled[item.key]) || false"
                        v-if="item.type === 'switch'"
                        v-model="form[item.key]"
                      ></el-switch>

                      <!--          cascader-->
                      <el-cascader
                        :disabled="(defaultDisabled && defaultDisabled[item.key]) || false"
                        v-model="form[item.key]"
                        style="width: 100%"
                        v-if="item.type==='cascader'"
                        :props="{ multiple: item.multiple, emitPath: false, checkStrictly: item.checkStrictly }"
                        @change="()=>{
                          handleChangeEmit(item, form[item.key])
                          setMaxSelect(item.key, options && options[item.key] && options[item.key].length ? options[item.key] : item.options, form[item.key], item.max)
                        }"
                        :options="options && options[item.key] && options[item.key].length ? options[item.key] : item.options"
                        clearable
                      ></el-cascader>

                      <!--            upload-->
                      <div
                        :class="(defaultDisabled && defaultDisabled[item.key]) ? '_is-disabled' : ''"
                      >
                        <el-upload
                          :disabled="(defaultDisabled && defaultDisabled[item.key]) || false"
                          :action="$api.upload"
                          :accept="item.accept"
                          list-type="picture-card"
                          ref="picture-card"
                          :before-upload="handleBeforeUpload"
                          :on-success="(a,b,c) => { handleUploadImgSuccess(a,b,c,item) }"
                          :on-remove="(a,b) => { handleUploadImgRemove(a,b,item) }"
                          :fileList="imgFileList"
                          v-if="item.type === 'upload-img'"
                          multiple
                          :limit="item.limit || 5"
                        >
                          <i class="el-icon-plus"></i>
                          <div
                            slot="tip"
                            class="el-upload__tip"
                          >{{item.tip || '只能上传jpg/png文件，且不超过500kb'}}</div>
                        </el-upload>
                        <el-upload
                          class="avatar-uploader"
                          list-type="picture-card"
                          v-if="item.type === 'upload-img-one'"
                          :disabled="(defaultDisabled && defaultDisabled[item.key]) || false"
                          :action="$api.upload"
                          :accept="item.accept"
                          :show-file-list="false"
                          :before-upload="handleBeforeUpload"
                          :on-success="(a,b,c) => { handleUploadImgSuccess(a,b,c,item) }"
                        >
                          <img v-if="item.imageUrl" :src="item.imageUrl" class="img" />
                          <i class="el-icon-plus"></i>
                          <div
                            slot="tip"
                            class="el-upload__tip"
                          >{{item.tip || '只能上传jpg/png文件，且不超过500kb'}}</div>
                        </el-upload>
                      </div>

                      <el-upload
                        :disabled="(defaultDisabled && defaultDisabled[item.key]) || false"
                        class="upload-demo"
                        :action="$api.upload"
                        :fileList="item.fileList || fileList"
                        :on-success="(a,b,c) => { handleUploadFileSuccess(a,b,c,item) }"
                        :on-remove="(a,b) => { handleUploadFileRemove(a,b,item) }"
                        v-if="item.type === 'upload-file'"
                        multiple
                      >
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div
                          slot="tip"
                          class="el-upload__tip"
                        >{{item.tip || '只能上传jpg/png文件，且不超过500kb'}}</div>
                      </el-upload>
                      <el-upload
                        :disabled="(defaultDisabled && defaultDisabled[item.key]) || false"
                        class="upload-demo"
                        :action="$api.upload"
                        :fileList="item.fileList || fileList"
                        :on-success="(a,b,c) => { handleUploadFileSuccess(a,b,c,item) }"
                        :on-remove="(a,b) => { handleUploadFileRemove(a,b,item) }"
                        v-if="item.type === 'upload-file-one'"
                        multiple
                      >
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div
                          slot="tip"
                          class="el-upload__tip"
                        >{{item.tip || '只能上传jpg/png文件，且不超过500kb'}}</div>
                      </el-upload>
                    </el-form-item>
                  </el-col>
                </div>
              </el-row>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <slot name="footer"></slot>
      <div v-if="hasFooter" style="text-align: right; margin-top: 10px; margin-right: 10px">
        <el-button @click="onCancel">{{cancelText}}</el-button>
        <el-button type="primary" @click="handleSubmit">{{submitText}}</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'GForm',
  props: {
    formList: [String, Number, Array, Object],
    options: [String, Number, Array, Object],
    defaultValue: [String, Number, Array, Object],
    defaultRules: [String, Number, Array, Object],
    defaultDisabled: [String, Number, Array, Object],
    defaultHidden: [String, Number, Array, Object],
    hasFooter: {
      type: Boolean,
      default: true
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    submitText: {
      type: String,
      default: '确定'
    },
    delayTime: {
      type: Number,
      default: 2000
    }
  },
  computed: {
  },
  watch: {
    defaultValue (val) {
      if (val) { // 如果有默认值再次赋予默认值
        this.setDefaultValue()
      }
    }
  },
  data () {
    return {
      imgFileList: [],
      fileList: [],
      form: {
      },
      rules: {
      },
      uploadImgKey: '',
      uploadFileKey: '',
      uploadUrls: [],
      timer: null,
      flag: true,
      inputForm: {}
    }
  },
  methods: {
    addInput (key) {
      this.form[key].push('')
    },
    removeInput (key, index) {
      if (index !== -1) {
        this.form[key].splice(index, 1)
      }
    },
    handleBeforeUpload (file) {
    },
    handleUploadImgSuccess (response, file, fileList, item) {
      this.imgFileList = this.filterFormFileList(this._.cloneDeep(fileList))
      this.form[this.uploadImgKey] = {
        upload: this.filterFinFileList(this._.cloneDeep(fileList))
      }
      this.handleChangeEmit(item, this.filterFinFileList(this._.cloneDeep(fileList)))
    },
    handleUploadImgRemove (file, fileList, item) {
      this.imgFileList = this.filterFormFileList(this._.cloneDeep(fileList))
      this.form[this.uploadImgKey] = {
        upload: this.filterFinFileList(this._.cloneDeep(fileList))
      }
      this.handleChangeEmit(item, this.filterFinFileList(this._.cloneDeep(fileList)))
    },
    handleUploadFileSuccess (response, file, fileList, item) {
      this.form[this.uploadFileKey] = {
        upload: this.filterFinFileList(fileList)
      }
      this.handleChangeEmit(item, this.filterFinFileList(this._.cloneDeep(fileList)))
    },
    handleUploadFileRemove (file, fileList, item) {
      this.form[this.uploadFileKey] = {
        upload: this.filterFinFileList(fileList)
      }
      this.handleChangeEmit(item, this.filterFinFileList(this._.cloneDeep(fileList)))
    },
    filterFinFileList (_fileList) { // 最终要提交的fileList
      let arr = []
      let fileList = this._.cloneDeep(_fileList)
      fileList && fileList.forEach(item => {
        if (item.response && item.response.code === 1000) {
          arr.push(item.response.urls[0])
        } else if (item.url) {
          let path = this.$api.fileUrl
          item.url = item.url.replace(path, '')
          arr.push(item)
        }
      })
      return arr
    },
    filterFormFileList (fileList) { // 挂载到form上的fileList
      let arr = []
      fileList && fileList.forEach(item => {
        if (!item.response && !item.url.includes('http')) {
          item.url = this.$api.fileUrl + item.url
          arr.push(item)
        } else {
          arr.push(item)
        }
      })
      return arr
    },
    // Cascader最大选择数量
    setMaxSelect (key, options = [], value, max) {
      if (!max) {
        return
      }
      const disable = value.length >= max
      let setCanSelect = (items) => {
        items.forEach((item, index) => {
          if (!items[index].children) {
            items[index].disabled = value.indexOf(item.value) > -1 ? false : disable
          }
          item.children && setCanSelect(item.children)
        })
        return items
      }
      this.options[key] = setCanSelect(this._.cloneDeep(options))
      this.form[key] = value.splice(0, max)
    },
    handleChangeEmit (item, value) {
      // console.log(item, value)

      const {
        key,
        label
      } = item
      const obj = {
        key,
        label,
        value,
        form: this.form,
        options: this.options
      }
      this.$emit('onChange', this._.cloneDeep(obj))
    },
    handleValidate () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          return false
        }
      })
    },
    resetForm () {
      this.$refs['form'].resetFields()
      this.imgFileList = []
      this.fileList = []
      this.$emit('resetForm')
    },
    onSubmit () {
      this.$refs['form'].validate((valid, value) => {
        console.log(this.form, value)
        // console.log(valid)
        if (valid) {
          clearTimeout(this.timer)
          if (this.flag) {
            this.$emit('onSubmit', this.form, value)
            this.flag = false
          } else {
            this.$message.warning(`您的操作过于频繁！`)
          }
          this.timer = setTimeout(() => { this.flag = true }, this.delayTime)
        } else {
          console.log(this.form)
          this.$message.error(`请检查已填写的内容`)
          console.log('error submit!!')
          return false
        }
      })
    },
    onCancel () {
      this.resetForm()
      this.$emit('onCancel')
    },
    handleSubmit () {
      this.onSubmit()
    },
    initItemList (itemList) {
      let rules = {}
      let form = {}
      itemList.forEach(item => {
        rules[item.key] = item.rule // rules 初始化
        let formInitValue = ''
        if (item.type === 'checkbox' || item.type === 'checkboxRole') { // checkbox 初始值为空数组
          formInitValue = []
        }
        if (item.type === 'switch') { // switch c初始值是布尔
          formInitValue = false
        }
        if (item.type === 'upload-img') { // 如果是图片，要拿到他的key TODO
          this.uploadImgKey = item.key
          formInitValue = {}
        }
        if (item.type === 'upload-file') { // 如果是文件，要拿到他的key TODO
          this.uploadFileKey = item.key
          formInitValue = {}
        }
        if (item.type === 'input-array') { // input-array 初始值是[]
          formInitValue = ['']
        }
        form[item.key] = formInitValue // form初始化
      })
      this.form = form
      rules = {
        ...rules,
        ...this.defaultRules
      }
      this.rules = rules
    },
    setDefaultValue () { // 设置默认值
      Object.keys(this.defaultValue).forEach(x => {
        Object.keys(this.form).forEach(y => {
          if (x === y) {
            this.form[x] = this.defaultValue[x]
            if (this.uploadImgKey === y) {
              this.imgFileList = this.filterFormFileList(this._.cloneDeep(this.defaultValue[y].upload))
            }
            if (this.uploadFileKey === y) {
              this.fileList = this.filterFormFileList(this._.cloneDeep(this.defaultValue[y].upload))
            }
          }
        })
      })
    },
    init () { // 将form 和rules根据传入的值初始化掉
      if (this.formList.length) { // 卡片式内容初始化为空
        let itemList = []
        this.formList.forEach(item => {
          itemList.push(...item.children)
        })
        this.initItemList(itemList)

        if (this.defaultValue) { // 如果有默认值再次赋予默认值
          this.setDefaultValue()
        }
      }
    },
    update (obj) { // 更新表单值
      for (const key in obj) {
        this.form[key] = obj[key]
      }
    },
  },
  created () {
    this.init()
  },
  mounted () {
    this.$refs['form'].clearValidate()
  },
  beforeDestroy () {
    this.timer && clearTimeout(this.timer)
  }
}
</script>

<style lang="less" scoped>
/deep/ .el-cascader {
  width: 100%;
}
/deep/ .el-upload-list--picture-card .el-upload-list__item {
  width: 100px;
  height: 100px;
}
/deep/ .el-upload--picture-card {
  width: 100px;
  height: 100px;
  line-height: 100px;
}
/deep/ ._is-disabled {
  cursor: not-allowed;
  div {
    cursor: not-allowed !important;
  }
  * {
    cursor: not-allowed !important;
  }
}
.avatar-uploader img.img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100px;
  height: 100px;
  border-radius: 6px;
}
</style>
