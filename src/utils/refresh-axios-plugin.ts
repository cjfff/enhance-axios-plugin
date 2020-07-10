import { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios'

interface AxiosRefreshOptions {
  /**
   * Array[number] 需要刷新的状态码列表
   */
  refreshStatus: Number[],
  /**
   * 刷新 token 的 Promise 方法，需要返回新的 token
   */
  refreshAction: () => Promise<string>;

  /**
   * 判断是否是刷新的请求，是的话，则不走默认 config 配置
   */
  isRefreshRequest: (config: AxiosRequestConfig) => boolean;

  /**
   * 重新发送请求之前需要更新 config 配置
   */
  onRetry: (config: AxiosRequestConfig, newToken: string) => AxiosRequestConfig,

  /**
   *
   */
  shouldRefresh: (status: number) => boolean,

  /**
   * 是否在刷新
   */
  refreshing: boolean,

  /**
   * 待重新请求的列表
   */
  requests: Function[],

  /**
   * 重试次数
   */
  retryTimes: number;

  handleFreshError(error: Error): void;
}

const defaultRefreshAction = () => Promise.resolve('')
const defaultIsRefreshRequest = (config: AxiosRequestConfig) => false

const defaultOptions: AxiosRefreshOptions = {
  // Array[number] 需要刷新的状态码
  refreshStatus: [401],
  // 刷新 actions
  refreshAction: defaultRefreshAction,
  // 判断是否刷新 token 请求
  isRefreshRequest: defaultIsRefreshRequest,
  // 重新请求需要刷新 token 的请求
  onRetry: (v: AxiosRequestConfig, newToken: string) => v,

  shouldRefresh(status: any) {
    return this.refreshStatus.includes(parseInt(status, 10))
  },

  refreshing: false,

  requests: [],

  retryTimes: 3,

  handleFreshError(error) {
    console.error(error)
    throw new Error(error.toString())
  }
}



export default function axiosRefreshToken(axios: AxiosInstance, options: AxiosRefreshOptions = defaultOptions) {
  options = { ...defaultOptions, ...options }

  if (options.refreshAction === defaultRefreshAction) {
    throw new Error(
      'Auth refresh interceptor requires `options.refreshAction` to be a function that returns a promise.',
    )
  }

  if (options.isRefreshRequest === defaultIsRefreshRequest) {
    throw new Error(
      'Auth refresh interceptor requires `options.isRefreshRequest` to be a function that true or false.',
    )
  }

  // request interceptors
  axios.interceptors.request.use(config => {
    if (options.isRefreshRequest(config)) {
      return config
    }

    // 因为业务中也常常加入错误统一提示，但是对于刷新 token 并不希望出现在错误拦截
    // 所以将需要刷新的状态码划分至 response success 状态
    config.validateStatus = function (status) {
      return (status >= 200 && status < 300) || options.shouldRefresh(status)
    }

    // 让其他请求都等待 refresh 请求
    return config
  })

  // @ts-ignore
  axios.interceptors.response.handlers.unshift({
    fulfilled: (resp: AxiosResponse) => {
      const { config, status } = resp

      if (options.shouldRefresh(status)) {
        if (!options.refreshing) {
          options.refreshing = true
          // tslint:disable-next-line: no-floating-promises
          options.refreshAction()
            .then(newToken => {
              options.requests.forEach(cb => {
                cb(newToken)
              })
              options.requests = []
            })
            .catch(options.handleFreshError)
            .finally(() => {
              options.refreshing = false
            })
        }

        return new Promise(resolve => {
          options.requests.push((newToken: string) => {
            const newConfig = options.onRetry(config, newToken)

            return axios(newConfig).then(resolve)
          })
        })
      }

      return Promise.resolve(resp)
    },
    rejected: (error: Error) => {
      return Promise.reject(error)
    },
  })
}
