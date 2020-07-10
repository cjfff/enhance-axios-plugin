// import { AxiosfreshTokenPlugin } from "../src/index"
import axios from 'axios';
import * as Koa from 'koa'
import * as Router from 'koa-router'


const PORT = 1998;
const url = `http://127.0.0.1:${PORT}`
const app = new Koa();
const router = new Router();

router.get('/user', (ctx) => {
  console.log(ctx.headers);
  ctx.status = 401
})
  .post('/freshToken', (ctx) => {
    ctx.body = 'new Token'
  })


app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(1998);

const instance = axios.create({
  baseURL: 'http://127.0.0.1:1998'
})

instance.get('/user').then(res => {
  console.log(res);
})
