// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...
import { AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios'

export interface AxiosEnhanceInstance extends AxiosInstance {
  $request<T = any, R = AxiosResponse<T>>(config: AxiosRequestConfig): Promise<R>;
  $get<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<T>;
  $delete<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R>;
  $head<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R>;
  $options<T = any, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R>;
  $post<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  $put<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  $patch<T = any, R = AxiosResponse<T>>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
}

const METHODS = [
  "request",
  "delete",
  "get",
  "head",
  "options",
  "post",
  "put",
  "patch"
]

function enhanceAxios(axios: AxiosInstance): AxiosEnhanceInstance {
  METHODS.forEach((method) => {

    (axios as any)[`$${method}`] = function () {
      return this[method].apply(this, arguments).then((res: AxiosResponse) => res && res.data);
    };
  })
  return axios as AxiosEnhanceInstance;
}


export default enhanceAxios
