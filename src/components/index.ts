import type { App } from 'vue'
import { defineAsyncComponent } from 'vue'

/**
 * 异步组件映射配置
 * @description 定义需要全局注册的异步组件及其导入路径
 */
const asyncComponents = {
  // 测试组件 - 用于演示异步组件加载
  Test: () => import('./test/test.vue'),
}

/**
 * 同步组件映射配置
 * @description 定义需要全局注册的同步组件及其导入路径
 */
const syncComponents = {
  // Test2组件 - 同步导入，立即可用
  Test2: () => import('./test2/test2.vue'),
}

/**
 * 注册全局组件（支持同步和异步两种方式）
 * @description 将配置的组件注册到Vue应用实例中，支持同步和异步两种注册方式
 * @param {App} app - Vue应用实例
 * @returns {Promise<void>} 返回Promise，表示注册完成
 * @example
 * ```typescript
 * import { registerComponents } from '@/components'
 *
 * const app = createSSRApp(App)
 * await registerComponents(app)
 * ```
 */
export async function registerComponents(app: App): Promise<void> {
  // 注册异步组件 - 使用defineAsyncComponent包装
  Object.entries(asyncComponents).forEach(([name, importFn]) => {
    app.component(name, defineAsyncComponent(importFn))
  })

  // 注册同步组件 - 直接导入并注册
  const syncComponentPromises = Object.entries(syncComponents).map(async ([name, importFn]) => {
    try {
      const component = await importFn()
      // 判断是否为ES模块导出，获取default属性
      const componentDefinition = component.default || component
      app.component(name, componentDefinition)
    }
    catch (error) {
      console.error(`注册同步组件 ${name} 时发生错误:`, error)
    }
  })

  // 等待所有同步组件注册完成
  await Promise.all(syncComponentPromises)
}

/**
 * 导出组件配置用于类型提示
 * @description 提供所有组件名称的类型定义，便于在模板中使用时获得类型提示
 */
export type ComponentNames = keyof typeof asyncComponents | keyof typeof syncComponents
