<script lang="ts" setup>
import { isApp, isAppAndroid, isAppHarmony, isAppIOS, isAppPlus, isH5, isMpWeixin, isWeb } from '@uni-helper/uni-env'
import { http } from '@/http/http'
import { LOGIN_PAGE } from '@/router/config'
import { useTokenStore } from '@/store'
import { tabbarStore } from '@/tabbar/store'
import RequestComp from './components/request.vue'
import VBindCss from './components/VBindCss.vue'

definePage({
  style: {
    navigationBarTitleText: '关于',
  },
  // 登录授权(可选)：跟以前的 needLogin 类似功能，但是同时支持黑白名单，详情请见 arc/router 文件夹
  excludeLoginPath: false,
})

const tokenStore = useTokenStore()
// 浏览器打印 isH5为true, isWeb为false，大家尽量用 isH5
console.log({ isApp, isAppAndroid, isAppHarmony, isAppIOS, isAppPlus, isH5, isMpWeixin, isWeb })

function gotoLogin() {
  if (tokenStore.hasLogin) {
    uni.showToast({
      title: '已登录，不能去登录页',
      icon: 'none',
    })
    return
  }
  uni.navigateTo({
    url: `${LOGIN_PAGE}?redirect=${encodeURIComponent('/pages/about/about?a=1&b=2')}`,
  })
}
function logout() {
  // 清空用户信息
  tokenStore.logout()
  // 执行退出登录逻辑
  uni.showToast({
    title: '退出登录成功',
    icon: 'success',
  })
}

function gotoTabbar() {
  uni.switchTab({
    url: '/pages/index/index',
  })
}
// #region setTabbarBadge
function setTabbarBadge() {
  tabbarStore.setTabbarItemBadge(1, 100)
}
// #endregion

function gotoAlova() {
  uni.navigateTo({
    url: '/pages/about/alova',
  })
}
function gotoVueQuery() {
  uni.navigateTo({
    url: '/pages/about/vue-query',
  })
}
function gotoSubPage() {
  uni.navigateTo({
    url: '/pages-sub/demo/index',
  })
}

// uniLayout里面的变量通过 expose 暴露出来后可以在 onReady 钩子获取到（onLoad 钩子不行）
const uniLayout = ref()
onLoad(() => {
  console.log('onLoad:', uniLayout.value) // onLoad: undefined
})
onReady(() => {
  console.log('onReady:', uniLayout.value) // onReady: Proxy(Object)
  console.log('onReady:', uniLayout.value.testUniLayoutExposedData) // onReady: testUniLayoutExposedData
})
// 结论：第一次通过onShow获取不到，但是可以通过 onReady获取到，后面就可以通过onShow获取到了
onShow(() => {
  console.log('onShow:', uniLayout.value) // onReady: Proxy(Object)
  console.log('onShow:', uniLayout.value?.testUniLayoutExposedData) // onReady: testUniLayoutExposedData
})

const uniKuRoot = ref()
// 结论：(同上）第一次通过onShow获取不到，但是可以通过 onReady获取到，后面就可以通过onShow获取到了
onReady(() => {
  console.log('onReady uniKuRoot exposeRef', uniKuRoot.value?.exposeRef)
})
onShow(() => {
  console.log('onShow uniKuRoot exposeRef', uniKuRoot.value?.exposeRef)
})

/**
 * 发送微信小程序订阅消息
 * @description 仅在微信小程序端可用：先申请用户订阅（requestSubscribeMessage），随后调用后端接口发送消息。
 * @throws {Error} 当非微信小程序环境、模板ID缺失、或请求失败时会抛出错误
 * @returns {Promise<void>} 无返回值
 */
async function sendMpMessage(): Promise<void> {
  // 仅小程序端可用
  if (!isMpWeixin) {
    uni.showToast({ icon: 'none', title: '仅微信小程序端可用' })
    return
  }

  // 从环境变量读取模板ID，支持多个用逗号分隔
  const rawTplIds = import.meta.env.VITE_WEAPP_SUBSCRIBE_TPL_IDS as string | undefined
  const tmplIds = (rawTplIds || '').split(',').map(s => s.trim()).filter(Boolean)
  console.log(11, rawTplIds, tmplIds)

  if (!tmplIds.length) {
    uni.showModal({
      title: '缺少模板ID',
      content: '请在 env/.env.development 配置 VITE_WEAPP_SUBSCRIBE_TPL_IDS="tpl_id1,tpl_id2"',
      showCancel: false,
    })
    return
  }

  try {
    // 1) 申请用户订阅
    const subRes = await uni.requestSubscribeMessage({ tmplIds })
    // 解析用户同意的模板（值为 'accept'）
    const acceptedTplIds = tmplIds.filter(id => (subRes as any)[id] === 'accept')
    if (!acceptedTplIds.length) {
      uni.showToast({ icon: 'none', title: '用户未同意订阅' })
      return
    }

    // 2) 调用后端发送订阅消息（接口路径示例，按后端实际路由调整）
    //    后端应根据当前登录用户或传入的 openid 完成发送
    await http.post<any>(
      '/wx/subscribe/send',
      {
        templateId: acceptedTplIds[0],
        // 示例：业务数据由后端模板映射处理
        payload: {
          // title: '您的订单已发货',
          // time: dayjs().format('YYYY-MM-DD HH:mm'),
        },
      },
    )

    uni.showToast({ icon: 'success', title: '消息已发送' })
  }
  catch (error: any) {
    // 组件内请求需使用 try-catch 做兜底提示
    console.error('发送订阅消息失败:', error)
    uni.showToast({ icon: 'none', title: error?.message || '发送失败' })
    throw error
  }
}
</script>

<template root="uniKuRoot">
  <!-- page-meta 使用范例 -->
  <page-meta page-style="overflow: auto" />
  <view>
    <view class="mt-8 text-center text-xl text-gray-400">
      请求调用、unocss、static图片
    </view>
    <view class="my-2 text-center">
      <image src="/static/images/avatar.jpg" class="h-100px w-100px" />
    </view>
    <view class="my-2 text-center">
      当前是否登录：{{ tokenStore.hasLogin }}
    </view>
    <view class="m-auto max-w-600px flex items-center">
      <button class="mt-4 w-40 text-center" @click="gotoLogin">
        点击去登录页
      </button>
      <button class="mt-4 w-40 text-center" @click="logout">
        点击退出登录
      </button>
    </view>
    <button class="mt-4 w-60 text-center" @click="setTabbarBadge">
      设置tabbarBadge
    </button>
    <RequestComp />
    <VBindCss />
    <view class="mb-6 h-1px bg-#eee" />
    <view class="text-center">
      <button type="primary" size="mini" class="w-160px" @click="gotoAlova">
        前往 alova 示例页面
      </button>
    </view>
    <view class="text-center">
      <button type="primary" size="mini" class="w-160px" @click="gotoTabbar">
        切换tabbar
      </button>
    </view>
    <view class="text-center">
      <button type="primary" size="mini" class="w-160px" @click="gotoVueQuery">
        vue-query 示例页面
      </button>
    </view>
    <view class="text-center">
      <button type="primary" size="mini" class="w-160px" @click="gotoSubPage">
        前往分包页面
      </button>
    </view>
    <view class="text-center">
      <button type="primary" size="mini" class="w-160px" @click="sendMpMessage">
        小程序通知消息
      </button>
    </view>
    <view class="mt-6 text-center text-sm">
      <view class="inline-block w-80% text-gray-400">
        为了方便脚手架动态生成不同UI模板，本页的按钮统一使用UI库无关的原生button
      </view>
    </view>
    <view class="h-6" />
  </view>
</template>
