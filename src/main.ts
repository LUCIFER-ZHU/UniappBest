import { VueQueryPlugin } from '@tanstack/vue-query'
import { createSSRApp } from 'vue'
// 引入异步组件注册函数
import { registerComponents } from '@/components'
import App from './App.vue'
import { requestInterceptor } from './http/interceptor'
import { routeInterceptor } from './router/interceptor'

import store from './store'
import '@/style/index.scss'
import 'virtual:uno.css'

/**
 * 创建Vue应用实例
 * @description 创建并配置Vue应用，包括状态管理、路由拦截、请求拦截、全局组件等
 * @returns {object} 返回包含app实例的对象
 */
export function createApp() {
  const app = createSSRApp(App)

  // 注册状态管理
  app.use(store)
  // 注册路由拦截器
  app.use(routeInterceptor)
  // 注册请求拦截器
  app.use(requestInterceptor)
  // 注册Vue Query插件
  app.use(VueQueryPlugin)

  // 异步注册全局组件 - 在应用启动时自动注册
  registerComponents(app).catch((error) => {
    console.error('注册全局组件时发生错误:', error)
  })

  return {
    app,
  }
}
