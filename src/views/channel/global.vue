<template>
  <span style="margin-right: 5px">
    <el-button :loading="loading" icon="el-icon-setting" type="text" size="small" style="margin-left: 5px" @click="initForm">
      渠道佣金
    </el-button>
    <el-dialog
      :visible="dialogVisible"
      :before-close="handleClose"
      title="设置全局渠道佣金"
      width="400px">
      <el-form ref="global" :model="global" :rules="ruleGlobal" label-width="100px">
        <el-form-item label="年期" prop="period">
          <el-select v-model="global.period" style="width: 100%">
            <el-option
              v-for="item in totalYear"
              :key="item"
              :label= "`${item}年`"
              :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item v-if="global.period" label="自定义年期" prop="userDefined">
          <el-select v-if="global.period" v-model="global.userDefined" style="width: 100%">
            <el-option
              v-for="item in generateDefinedYear"
              :key="item"
              :label= "`${item}年`"
              :value="item"/>
          </el-select>
        </el-form-item>
        <el-form-item
          v-for="item in getUserDefined"
          :label="item.label"
          :key="item.id"
          :prop="`commissionRates.${item.value}`"
          :rules="[
            {required: true, message: '请输入佣金率', trigger: 'blur'},
            {type: 'number', message: '佣金率必须为数字', trigger: ['blur', 'change']}
          ]"
        >
          <el-input v-model.number="global.commissionRates[item.value]">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button :loading="loading" type="primary" @click="handleSubmit">提交</el-button>
      </div>
    </el-dialog>
  </span>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex'
const _ = require('lodash')
export default {
  data() {
    return {
      dialogVisible: false,
      global: {
        period: '',
        userDefined: '',
        commissionRates: []
      },
      totalYear: _.range(1, 16),
      ruleGlobal: {
        period: [{ required: true, message: '姓名必须填', trigger: 'blur' }],
        userDefined: [{ required: true, message: '账号必须填', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters(['loading']),
    generateDefinedYear() {
      return _.range(1, this.global.period + 1)
    },
    getUserDefined() {
      const result = []
      // this.global.commissionRates = []
      if (this.global.userDefined === 1) {
        result.push({ label: `第1年`, value: 1 })
      } else {
        for (let i = 0; i < this.global.userDefined; i++) {
          if (i === this.global.userDefined - 1) {
            result.push({ label: `${i} 年之后`, value: i })
          } else {
            result.push({ label: `第${i + 1}年`, value: i })
          }
        }
      }
      return result
    }
  },
  methods: {
    initForm() {
      this.dialogVisible = true
      // this.$api.user.fetchUserList({role: 2}).then(res => {
      //   this.users = res.data.list
      //   this.dialogVisible = true
      // })
    },
    handleClose() {
      this.$refs['global'].resetFields()
      this.dialogVisible = false
    },
    handleSubmit() {
      this.$refs['global'].validate((valid) => {
        if (valid) {
          console.log('................')
          // this.$api.user.addUser(this.account).then(_ => {
          //   this.$message({
          //     message: '操作成功',
          //     type: 'success',
          //     duration: 5 * 1000
          //   })
          //   this.$store.dispatch('FetchUserList', { role: 2 })
          //   this.handleClose()
          // })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss">

</style>
