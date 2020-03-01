import Router from "koa-router";
// 借助 Redis，实现当用户a和用户b同时发送验证码的时候，能够将用户名与验证码对应上
import Redis from "koa-redis";
// Redis 的作用：
// 在邮箱验证的时候，除了在邮箱部分开启smpt（注册的smpt服务），还需要在node上安装一个对应的应用程序nodemailer
import nodeMailer from "nodemailer";

let router = new Router({
  // 定义一个前缀
  prefix: "/users"
});
// 声明变量获取redis客户端
let Store = new Redis().client;
/**
 * 给客户发送验证码的接口
 */
router.post("/verify", async ctx => {
  let username = ctx.request.body.username;
  // 验证请求是否过于频繁

  console.log(Store,'Store')
  const saveExpire = await Store.hget(`nodemail:${username}`, "expire");
  // 拦截，避免频繁的刷哪个接口：一定时间内再次点击，只执行一次：函数节流
  if (saveExpire && new Date().getTime() - saveExpire < 0) {
    // 设置返回的内容
    ctx.body = {
      code: -1,
      msg: "请求过于频繁"
    };
    return false;
  }
  // 开启一个SMTP连接池
  let transporter = nodeMailer.createTestAccount({
    host: Email.smtp.host,
    //   端口465和587用于电子邮件客户端到电子邮件服务器通信 - 发送电子邮件。
    //   端口465用于smtps SSL加密在任何SMTP级别通信之前自动启动。
    //   端口587用于msa
    port: 587,
    // secure:true   --> for port 465
    // secure:false  --> for port 587
    secure: false,
    // 创建smtp服务
    // 在dbs中config.js文件中配置的参数
    auth: {
      user: Email.smtp.user,
      pass: Email.smtp.pass
    }
  });
  // 对外发送哪些信息，以及接收方式是什么
  let ko = {
    // 设置验证码是什么
    code: Email.smtp.code(),
    // 每发送一次验证码就设置一个过期时间
    expire: Email.smtp.expire(),
    // 要给哪个邮箱发邮件(前端请求时请求体中的邮箱)
    email: ctx.request.body.email,
    // 用哪个用户名发送验证码(请求体中的用户名)
    user: ctx.request.body.username
  };
  // 邮件中显示哪些内容
  let mailOptions = {
    // 发送方
    from: `"认证邮件"<${Email.smtp.user}>`,
    // 接收方
    to: ko.email,
    // 主题
    subject: `注册码`,
    html: `您的验证码时${ko.code}`
  };

  await transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return console.log("error");
    } else {
      // 设置新的缓存
      Store.hmset(
        `nodemail:${ko.user}`,
        "code",
        ko.code,
        "expire",
        ko.expire,
        "email",
        ko.email
      );
    }
  });
  // 设置返回的内容
  ctx.body = {
    code: 0,
    msg: "验证码已发送"
  };
});
export default router
