<template>
  <span>
    <el-button type="primary" @click="initForm" >添加客户</el-button>
    <el-dialog
      v-el-drag-dialog
      :visible="dialogVisible"
      :before-close="handleClose"
      title="添加客户资料"
      width="450px">
      <el-form ref="client" :model="client" :rules="rule" label-width="100px">
        <el-form-item label="客户姓名:" prop="name">
          <el-input v-model="client.name"/>
        </el-form-item>
        <el-form-item label="证件号:" prop="idNumber">
          <el-input v-model="client.idNumber"/>
        </el-form-item>
        <el-form-item label="性别:" prop="sex">
          <el-radio-group v-model="client.sex">
            <el-radio :label="0">男</el-radio>
            <el-radio :label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="国籍:" prop="locale">
          <el-select v-model="client.locale" placeholder="请选择国籍" filterable style="width: 100%">
            <el-option-group v-for="group in country" :key="group.label" :label="group.label">
              <el-option
                v-for="item in group.options"
                :key="item.code"
                :label="item[language]"
                :value="item.code"/>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="出生日期:" prop="birthday">
          <el-date-picker
            v-model="client.birthday"
            style="width: 100%"
            type="date"
            placeholder="选择日期"/>
        </el-form-item>
        <el-form-item label="电话号码:" prop="phone">
          <el-input v-model="client.phone"/>
        </el-form-item>
        <el-form-item label="电子邮件:" prop="email">
          <el-input v-model="client.email"/>
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
import { mapGetters, mapState } from 'vuex'
import { country } from '@/utils/country'
import elDragDialog from '@/directive/el-dragDialog'
import Cookies from 'js-cookie'
export default {
  directives: { elDragDialog },
  data() {
    return {
      language: 'en',
      country: [{
        label: '常用国家',
        options: [{ 'code': 'CN', 'zh-TW': '中國', 'en': 'China', 'zh-CN': '中国' },
          { 'code': 'HK', 'zh-TW': '香港', 'en': 'Hong Kong', 'zh-CN': '香港' }]
      }, {
        label: '所有国家',
        options: country
      }],
      dialogVisible: false,
      client: {
        name: '',
        idNumber: '',
        sex: 0,
        locale: '',
        birthday: '',
        phone: '',
        email: ''
      },
      rule: {
        name: [{ required: true, message: '请输入客户姓名', trigger: 'blur' }],
        idNumber: [{ required: true, message: '请输入证件号', trigger: 'blur' }],
        email: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }]
      }
    }
  },
  computed: {
    ...mapGetters(['loading']),
    ...mapState({ companyList: state => state.company.companyList.list })
  },
  methods: {
    initForm() {
      this.language = Cookies.get('language') || 'zh-CN'
      this.dialogVisible = true
    },
    handleClose() {
      this.$refs['client'].resetFields()
      this.dialogVisible = false
    },
    handleSubmit() {
      this.$refs['client'].validate((valid) => {
        if (valid) {
          this.$api.client.createClient(this.client).then(_ => {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 5 * 1000
            })
            this.$store.dispatch('client/FetchClientList', {})
            this.handleClose()
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
