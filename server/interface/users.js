import Router from "koa-router";
// 借助 Redis，实现当用户a和用户b同时发送验证码的时候，能够将用户名与验证码对应上
import Redis from "koa-redis";
// Redis 的作用：
// 在邮箱验证的时候，除了在邮箱部分开启smpt（注册的smpt服务），还需要在node上安装一个对应的应用程序nodemailer
import nodeMailer from "nodemailer";
import User from "../dbs/models/users.js";
// 引入SMTP
import Email from "../dbs/config";
import axios from "./utils/axios";
import Passport from "./utils/passport";
let router = new Router({
  // 定义一个前缀，所有这个文件中的接口都是有/users前缀的
  prefix: "/users"
});
// 声明变量获取redis客户端
let Store = new Redis().client;

/**
 * 定义注册接口，用post方式更安全
 */
router.post("/signup", async ctx => {
  // 获取用户在注册接口上传的信息
  // 注意: post方式如何去获取post方式上传的数据，是要用ctx.request.body这个方法
  const { username, password, email, code } = ctx.request.body;
  console.log(code,'code')
  // 拿到数据验证
  // 在nodemail发验证码的时候会在redis上去存了一下，然后在这里要把存的东西拿出来，做对比，对比一下用户传入的验证码是不是redis上存的验证码，用户填入了验证码==>验证码正确==>验证码过期==>不再执行此函数中的其他内容
  if (code) {
    // 获取redis中缓存的验证码code
    const saveCode = await Store.hget(`nodemail:${username}`, "code");
    console.log(saveCode,'saveCode')
    // 获取redis中缓存的验证码过期时间
    const saveExpire = await Store.hget(`nodemail:${username}`, "expire");
    if (code === saveCode) {
      if (new Date().getTime() - saveExpire > 0) {
        ctx.body = {
          code: -1,
          msg: "验证码已过期，请重新尝试"
        };
        return false; // 验证码已过期，不再执行其他内容
      }
    } else {
      ctx.body = {
        code: -1,
        msg: "请填写正确的验证码"
      };
    }
  } else {
    ctx.body = {
      code: -1,
      msg: "请填写验证码"
    };
  }

  // 判断用户名是否已经被注册。根据用户传进来的用户名(username)，在用户表中查找
  let user = await User.find({ username });
  if (user.length) {
    ctx.body = {
      code: -1,
      msg: "已被注册"
    };
    return;
  }

  // 将用户名和密码和邮箱进行写库操作
  // nuser->newUser
  let nuser = await User.create({
    username,
    password,
    email
  });
  // 判断是否写库成功
  if (nuser) {
    console.log(nuser,'写库成功！')
    // 如果写库成功，进行自动登录操作（调用登录接口）
    let res = await axios.post("/users/signin", {
      username,
      password
    });
    // 如果登录成功
    if (res.data && res.data.code === 0) {
      console.log('登录成功')
      ctx.body = {
        code: 0,
        msg: "注册成功",
        user: res.data.user
      };
    }
    //如果没有登录成功
    else {
      ctx.body = {
        code: -1,
        msg: "error"
      };
    }
  }
  // 如果写库失败
  else {
    ctx.body = {
      code: -1,
      msg: "注册失败"
    };
  }
});
/**
 * 定义登录接口
 */
router.post("/signin", async (ctx, next) => {
  // 写passport时候用的是local策略，这里调用local策略，这个策略会给你返回一个信息
  return Passport.authenticate("local", function(err, user, info, status) {
    // 如果出错了
    if (err) {
      ctx.body = {
        code: -1,
        msg: err
      };
    } else {
      if (user) {
        ctx.body = {
          code: 0,
          msg: "登录成功",
          user
        };
        //做登录操作
        return ctx.login(user);
      } else {
        ctx.body = {
          code: 1,
          // 如果发现异常，把具体信息返回去
          msg: info
        };
      }
    }
  })(ctx, next); // 把当前的上下文对象传进这个api进去，这是固定用法
});
/**
 * 定义给客户发送验证码的接口
 */
router.post("/verify", async ctx => {
  let username = ctx.request.body.username;
  // 验证请求是否过于频繁
  // 获取redis缓存的中的过期时间，如果过期时间存在，且此时的时间小于过期时间(也就是还没过期)，就返回“请求过于频繁”，否则开启SMTP连接池发送新的邮件
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
  let transporter = nodeMailer.createTransport({
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
/**
 * 定义退出接口
 */
router.get("/exit", async (ctx, next) => {
  await ctx.logout();
  // 二次验证，检查现在是不是注销了状态
  if (!ctx.isAuthenticated()) {
    ctx.body = {
      code: 0
    };
  } else {
    ctx.body = {
      code: -1
    };
  }
});
/**
 * 定义获取用户名接口
 */
router.get("/getUser", async ctx => {
  //isAuthenticated()， 是passport内部固定的的api，
  // 判断用户是否登录
  if (ctx.isAuthenticated()) {
    // 我们的passport会把我们的用户信息的session放到session对象里面去，ctx这个上下文对象中session就有passport相关信息，所以我们的passport是存储在这个session中的
    // 如果它是登录状态的话，session中一定有passport，passport中一定有user
    const { username, email } = ctx.session.passport.user;
    ctx.body = {
      user: username,
      email
    };
  } else {
    // 如果用户没有登录
    ctx.body = {
      user: "",
      email: ""
    };
  }
});
export default router;