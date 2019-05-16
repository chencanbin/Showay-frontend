import store from '@/store'
import { homePageConfig } from '@/utils/constant'

/**
 * @param {Array} value
 * @returns {Boolean}
 * @example see @/views/permission/directive.vue
 */
export default function checkPermission(value) {
  if (value && value instanceof Array && value.length > 0) {
    const roles = store.getters && store.getters.roles
    const permissionRoles = value
    const hasPermission = roles.some(role => {
      return permissionRoles.includes(role.id)
    })

    if (!hasPermission) {
      return false
    }
    return true
  } else {
    console.error(`need roles! Like v-permission="['admin','editor']"`)
    return false
  }
}

export function hasPermission(id) {
  const actions = store.getters && store.getters.actions
  return actions.some(action => {
    return action.id === id
  })
}

export function hasStatItems(id) {
  const statItems = store.getters && store.getters.statItems
  return statItems.some(statItem => {
    return statItem.id === id
  })
}

export function hasPaymentStatuses(id) {
  const paymentStatuses = store.getters && store.getters.paymentStatuses
  return paymentStatuses.some(paymentStatuse => {
    return paymentStatuse.id === id
  })
}

export function hasRole(id) {
  const roles = store.getters && store.getters.roles
  return roles.some(role => {
    return role.id === id
  })
}

export function showHomePage(id) {
  let homePageSettings = []
  if (store.getters && !store.getters.homePageSetting) {
    homePageSettings = getAllHomePageConfig()
    return homePageSettings.some(homePageSetting => {
      return homePageSetting.id === id
    })
  }
  if (store.getters && store.getters.homePageSetting) {
    homePageSettings = store.getters.homePageSetting
    return homePageSettings.some(homePageSetting => {
      return homePageSetting === id
    })
  }
}

export function getAllHomePageConfig() {
  const result = homePageConfig.filter(item => {
    let flag = true
    if (item.permissions) {
      item.permissions.forEach(permission => {
        if (!hasStatItems(permission)) {
          flag = false
        }
      })
    }
    if (item.roles) {
      item.roles.forEach(role => {
        if (!hasRole(role)) {
          flag = false
        }
      })
    }
    return flag
  })
  return result
}
