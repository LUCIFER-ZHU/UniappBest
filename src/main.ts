// 引入 Vue Query 相关依赖
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'
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
 * 创建 QueryClient 实例
 * @description 配置 Vue Query 的查询客户端，用于管理服务端状态
 * @returns {QueryClient} 返回配置好的 QueryClient 实例
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 设置查询的默认配置
      staleTime: 5 * 60 * 1000, // 5分钟内数据被认为是新鲜的
      gcTime: 10 * 60 * 1000, // 10分钟后清理缓存
      retry: 3, // 失败时重试3次
      refetchOnWindowFocus: false, // 窗口聚焦时不重新获取数据
    },
  },
})

/**
 * 创建Vue应用实例
 * @description 创建并配置Vue应用，包括状态管理、路由拦截、请求拦截、全局组件等
 * @returns {object} 返回包含app实例的对象
 */
export function createApp() {
  const app = createSSRApp(App)

  // 注册状态管理
  app.use(store)
  // 注册 Vue Query 插件
  app.use(VueQueryPlugin, { queryClient })
  // 注册路由拦截器
  app.use(routeInterceptor)
  // 注册请求拦截器
  app.use(requestInterceptor)

  // 异步注册全局组件 - 在应用启动时自动注册
  registerComponents(app).catch((error) => {
    console.error('注册全局组件时发生错误:', error)
  })

  return {
    app,
  }
}
