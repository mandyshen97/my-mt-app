import Koa from "koa";
const consola = require("consola");
const { Nuxt, Builder } = require("nuxt");

// 引入mongoose
import mongoose from "mongoose";
// 处理和post相关的请求的包
import bodyParser from "koa-parser";
// 操作session的包
import session from "koa-generic-session";
import Redis from "koa-redis";
// 美观 格式化
import json from "koa-json";
import dbConfig from './dbs/config'
import passport from './interface/utils/passport'
import users from './interface/users'

const app = new Koa();
// 设置IP和端口
const host = process.env.HOST || "127.0.0.1";
const port = process.env.PORT || 3000;
// 设置签名的 Cookie 密钥
app.keys = ["mt", "keyskeys"]; 
// 当 app.proxy 设置为 true 时(信任代理头字段)，支持 X-Forwarded-Host
app.proxy = true; 
app.use(
  session({
    key: "mt",
    prefix: "mt:uid",
    store: new Redis()
  })
);
// 扩展类型的配置
app.use(bodyParser({
  extendTypes: ['json','form','text']
}))
// 美化
app.use(json())

// 连接数据库
// dbs:'mongodb://127.0.0.1:27017/student',
// mongoose.connect(dbConfig.dbs, {
//   useNewUrlParser:true,
//   useCreateIndex:true
// })

// passport 相关配置
app.use(passport.initialize())
app.use(passport.session())

// Import and Set Nuxt.js options
const config = require("../nuxt.config.js");
config.dev = app.env !== "production";

async function start() {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config);

  const {
    host = process.env.HOST || "127.0.0.1",
    port = process.env.PORT || 3000
  } = nuxt.options.server;

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  } else {
    await nuxt.ready();
  }

  // 引入路由(注意位置)，放置在这里，要不然可能会失效
  app.use(users.routes()).use(users.allowedMethods())


  app.use(ctx => {
    ctx.status = 200;
    ctx.respond = false; // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx; // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res);
  });

  app.listen(port, host);
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  });
}

start();
