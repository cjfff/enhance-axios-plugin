# enhance-axios-plugin

此模块为增强 `axios` 功能的插件，主要为 `axios`增加了几个常用方法。

方法来自 `nuxt` 最佳实践中。


## enhanceAxiosPlugin example

```js
// yarn add enhance-axios-plugin || npm i enhance-axios-plugin

import axios from 'axios';
import { enhanceAxiosPlugin } from 'enhance-axios-plugin'

const axioxInstance = axios.create({...config})

enhanceAxiosPlugin(axioxInstance)

// instance.$get
// instance.$post
// instance.$delete
// instance.$put

// 此方法默认帮我们解构了一层 data 再返回，举个例子🌰
// 一般 res.data 才是真正的，后端返回的数据


axioxInstance.get('/').then(res => {
  console.log(res.data)
})

// 使用 $get 后 res 即是后端返回数据

axioxInstance.$get('/').then(res => {
  console.log(res)
})

```


## axios-fresh-token-plugin

```js
import { axiosfreshTokenPlugin } from 'enhance-axios-plugin'


// 复用刷新 token 的逻辑
export function axiosRefreshTokenGenerator(store) {
  return axiosInstance => {
    return axiosfreshTokenPlugin(axiosInstance, {
      refreshStatus: [401],
      refreshAction: () => {
        return store.dispatch('refreshToken');
      },
      onRetry: (config, token) => {
        config.headers.Authorization = `Bearer ${token}`;
        return config;
      },
      isRefreshRequest: config => {
        // TODO: 完善判断 refreshToken 的逻辑
        return config.url.indexOf('refreshToken') > -1;
      },
      handleFreshError(error) {
        console.log(error);
      }
    });
  };
}
```
