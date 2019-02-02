import Vue from 'vue'
import VueI18n from 'vue-i18n'
import Cookies from 'js-cookie'
import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'// element-ui lang
import elementZhHkLocale from 'element-ui/lib/locale/lang/zh-TW'// element-ui lang
import enLocale from './en'
import zhLocale from './zh_CN'
import zhHkLocale from './zh_TW'

Vue.use(VueI18n)

const messages = {
  en: {
    ...enLocale,
    ...elementEnLocale
  },
  'zh-CN': {
    ...zhLocale,
    ...elementZhLocale
  },
  'zh-TW': {
    ...zhHkLocale,
    ...elementZhHkLocale
  }
}

const i18n = new VueI18n({
  // set locale
  // options: en | zh_CN | zh_TW
  locale: Cookies.get('language') || 'en',
  // set locale messages
  messages
})

export default i18n
