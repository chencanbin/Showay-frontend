export default {
  route: {
    home: '首页',
    product: '产品',
    company: '保险公司',
    commission: '佣金',
    client: '客户',
    channel: '渠道',
    document: '文档',
    report: '报表',
    system: '系统',
    user: '用户',
    role: '角色'
  },
  action: {
    add: '添加',
    edit: '修改',
    del: '删除'
  },
  common: {
    action: '操作',
    add: '添加',
    delete: '删除',
    edit: '修改',
    view: '查看',
    export: '导出',
    success: '操作成功',
    prompt: '提示',
    confirmButton: '确定',
    cancelButton: '取消',
    submitButton: '提交',
    saveButton: '保存',
    year: '第{0}年',
    after_i_year: '第{0}年之后',
    after_15_year: '15年以后',
    tooltip: {
      close: '窗口即将关闭, 是否放弃编辑?'
    }
  },
  navbar: {
    logOut: '退出登录',
    screenfull: '全屏',
    theme: '换肤',
    size: '布局大小'
  },
  login: {
    title: '系统登录',
    logIn: '登录',
    username: '账号',
    password: '密码'
  },
  user: {
    table_header: {
      name: '姓名',
      account: '账号',
      role: '权限',
      create_time: '创建时间'
    },
    form_label: {
      name: '姓名',
      account: '账号',
      role: '角色'
    },
    dialog_title: {
      add: '创建用户',
      edit: '编辑用户'
    }
  },

  product: {
    company: {
      table_header: {
        acronym: '公司缩写',
        name: '公司名',
        level: '级别',
        creationDay: '创建时间',
        action: '操作'
      },
      set: {
        add_title: '添加公司',
        edit_title: '编辑公司',
        name_en: '公司名(英文)',
        name_zh: '公司名(中文)',
        acronym: '公司缩写',
        secondary: '二级供应商',
        verify_message: {
          name_en: '公司名(英文)必须填',
          name_zh: '公司名(中文)必须填',
          acronym: '公司缩写必须填'
        }
      },
      tooltip: {
        delete: '此操作将永久删除该供应商, 是否继续?'
      }
    },
    commission: {
      table_header: {
        company_name: '供应商',
        effectiveDate: '生效时间',
        status: '状态',
        unpublished: '未发布',
        published: '已发布',
        modified: '有改动'
      },
      search_placeholder: '搜索(供应商)',
      tooltip: {
        delete: '此操作将永久删除该策略表, 是否继续?',
        export: '导出的部分不包含未发布的内容, 是否继续导出?'
      },
      commission_table: {
        title: '佣金策略表({0})',
        text: '{0}佣金策略表',
        search_placeholder: '请输入搜索内容',
        basic_tab: '基础佣金表',
        override_tab: 'Override佣金表',
        overall_tab: '总佣金表',
        override_setting: '设置Override',
        edit_status: {
          modifying: '正在修改.....',
          saving: '正在保存.....',
          latest_save: '最近保存 {0}'
        },
        col_header: {
          product_name: '产品名称',
          ENG_name: 'ENG name',
          product_id: '产品编号',
          period: '年期',
          ffyap: 'FFYAP'
        }
      },
      view: {
        basic_tab: '基础佣金表',
        overall_tab: '总佣金表',
        table_header: {
          acronym: '编号',
          name: '产品名称(中文)',
          enName: '产品名称(英文)',
          period: '年期'
        },
        title: '{0} 佣金表',
        year: '第{0}年',
        after_15_year: '15年以后'
      },
      add: {
        title: '添加佣金表',
        company: '供应商',
        search_company_placeholder: '请选择供应商',
        latest_template: '以最新佣金表为模板',
        blank_template: '空白佣金表',
        company_rule_message: '请选择供应商'
      }
    },
    channel: {
      search_channel_placeholder: '搜索 (姓名 | 账号)',
      table_header: {
        name: '用户名',
        account: '账号',
        superior: '上级',
        create_time: '创建时间',
        effectiveDate: '有效时间',
        remarks: '备注'
      },
      policy_button: '渠道策略',
      tooltip: {
        delete: '此操作将永久删除该渠道账号, 是否继续?'
      },
      view: {
        title: '渠道佣金预览',
        company: '供应商',
        product: '产品名称'
      },
      set_channel_commission: {
        add_title: '编辑渠道佣金策略表',
        edit_title: '添加渠道佣金策略表',
        name: '公司 / 产品',
        term: '年期',
        save_dialog_title: '渠道佣金生效时间 / 备注',
        effectiveDate: '生效时间',
        remarks: '备注',
        remarks_placeholder: '请输入备注',
        tooltip: {
          close: '是否需要关闭次页面?'
        },
        add_policy: {
          title: '添加渠道佣金策略',
          type: '类型',
          all: '所有',
          company: '供应商',
          product: '产品',
          term: '年期',
          year: '{0}年',
          userDefined: '自定义年期',
          remarks: '备注',
          company_placeholder: '请选择公司',
          product_placeholder: '请选择产品',
          term_placeholder: '请选择年期',
          commission_rate_placeholder: '请输入佣金率',
          verify_message: {
            type: '请选择策略类型',
            term: '年期必须选',
            userDefined: '自定义年期必须选'
          }
        }
      },
      set: {
        add_title: '创建渠道',
        edit_title: '编辑渠道',
        name: '用户名',
        account: '账号',
        superior: '上级',
        superior_placeholder: '请选择账户上级',
        verify_message: {
          name: '姓名必须填',
          account: '账号必须填'
        }
      }
    }
  },
  client: {
    info: {
      search_placeholder: '搜索(客户姓名 | 证件号)',
      name: '客户姓名',
      idNumber: '证件号',
      locale: '国籍',
      sex: '性别',
      birthday: '出生日期',
      phone: '电话号码',
      email: '电子邮箱',
      male: '男',
      female: '女',
      commonly_use_country: '常用国家',
      all_country: '所有国家',
      tooltip: {
        delete: '此操作将永久删除该客户, 是否继续?'
      },
      set: {
        add_title: '添加客户资料',
        edit_title: '编辑客户资料',
        verify_message: {
          name: '请输入客户姓名',
          idNumber: '请输入证件号',
          email: '请输入正确的邮箱地址'
        }
      }
    },
    insurance_policy: {
      number: '保单号',
      submitDate: '申请日期',
      policyStatus: '保单状态',
      applicant_name: '申请人',
      beneficiary_name: '受保人',
      company_name: '保险公司',
      product_name: '产品',
      sn: '内部编号',
      channel_name: '渠道',
      agent_name: '签单员',
      amountInsured: '保额',
      premium: '保费',
      premiumPlan: '续费计划',
      issueDate: '生效时间',
      riderBenefits: '副险列表',
      riderBenefits_product: '产品',
      riderBenefits_amountInsured: '保费',
      riderBenefits_premium: '保额',
      detail_title: '保险详情',
      tooltip: {
        delete: '此操作将永久删除该保单, 是否继续?',
        reset: '此操作将重置保单, 是否继续?'
      },
      set: {
        add_title: '添加保单',
        edit_title: '编辑保单',
        placeholder: {
          number: '请输入保单号',
          submitDate: '选择日期',
          policyStatus: '请选择保单状态',
          applicant_name: '请选择申请人',
          beneficiary_name: '请选择受保人',
          currency: '请选中币种',
          company_name: '请选择公司',
          product_name: '请输入产品名或产品编号',
          sn: '请输入内部编号',
          channel_name: '请选择渠道',
          agent_name: '请选择签单员',
          amountInsured: '请输入保额',
          premium: '请输入保费',
          premiumPlan: '请选择续保计划',
          issueDate: '选择日期'
        }
      }
    }
  }
}
