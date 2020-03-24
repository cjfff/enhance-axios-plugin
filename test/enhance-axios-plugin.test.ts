import enhanceAxios, { AxiosEnhanceInstance } from "../src/enhance-axios-plugin"
import axios from 'axios';
import * as Koa from 'koa'
import * as Router from 'koa-router'

const TYPES = {
  GET_SUCCESS: 'GET_SUCCESS',
  POST_SUCCESS: 'POST_SUCCESS',
  DELETE_SUCCESS: 'DELETE_SUCCESS',
  PUT_SUCCESS: 'PUT_SUCCESS',
}

const PORT = 9999;
const url = `http://127.0.0.1:${PORT}`
const app = new Koa();
const router = new Router();

router.get('/', (ctx) => {
  ctx.body = TYPES.GET_SUCCESS
})
  .post('/', (ctx) => {
    ctx.body = TYPES.POST_SUCCESS
  })
  .delete('/', (ctx) => {
    ctx.body = TYPES.DELETE_SUCCESS
  })
  .put('/', (ctx) => {
    ctx.body = TYPES.PUT_SUCCESS
  })

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(9999);

const instance = enhanceAxios(axios.create())

test('axios.$get', async () => {
  const data = await instance.$get(url)
  expect(data).toBe(TYPES.GET_SUCCESS)
})

test('axios.$post', async () => {
  const data = await instance.$post(url)
  expect(data).toBe(TYPES.POST_SUCCESS)
})

test('axios.$put', async () => {
  const data = await instance.$put(url)
  expect(data).toBe(TYPES.PUT_SUCCESS)
})

test('axios.$delete', async () => {
  const data = await instance.$delete(url)
  expect(data).toBe(TYPES.DELETE_SUCCESS)
})
