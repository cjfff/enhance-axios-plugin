# enhance-axios-plugin

此模块为增强 `axios` 功能的插件，主要为 `axios`增加了几个常用方法。

方法来自 `nuxt` 最佳实践中。


## example

```js
// yarn add enhance-axios-plugin || npm i enhance-axios-plugin

import axios from 'axios';
import enhanceAxios from 'enhance-axios-plugin'

const instance = enhanceAxios(axios.create({...config}))

// instance.$get
// instance.$post
// instance.$delete
// instance.$put

// 此方法默认帮我们解构了一层 data 再返回，举个例子🌰
// 一般 res.data 才是真正的，后端返回的数据


instance.get('/').then(res => {
  console.log(res.data)
})

// 使用 $get 后 res 即是后端返回数据

instance.$get('/').then(res => {
  console.log(res)
})

```
