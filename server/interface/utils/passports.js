// passport是所有的node程序都可以应用的，koa-passport是对它进行了一个封装，适配koa的
import passport from 'koa-passport'
// passport-local是passport本地的一个策略
import LocalStrategy from 'passport-local'
import UserModel from '../../dbs/models/users'

// 设置本地策略
// 第一个参数是一个函数，函数又有三个参数username, password，和回调函数done
// function参数中的username,password是用户传入的
passport.use(new LocalStrategy(async function(username,password,done){
  // console.log(username, password);// 这个username和password就是注册后进行登录操作，传给signin的参数，也就是注册的帐户名和密码
  // 设置查找条件是用户名
  let where = {
    username
  }
  // 根据查找条件，在User表中查找
  let result = await UserModel.findOne(where)
  if(result!==null){
    if(result.password===password){
      // 如果查找到的password===用户传入的password，验证成功
      /*done的第一个参数为错误信息，没有就返回null，第二个参数为用户信息（验证失败则为false），第三个为错误信息(自定义)*/
      return done(null,result)
    }else{
      done(null,false,'密码错误')
    }
  }else{
    return done(null,false,'用户不存在')
  }
}))


// 如果每次用户进来的时候，都自动通过session去验证
// passport提供的这两个api是固定用法，是库里封装好的api

// 序列化:序列化指的是把用户对象存到session里

/*序列化在ctx.login()函数调用时触发,会自动在ctx.state.user中添加done中的第二个参数，并在session中添加用户登录状态*/
passport.serializeUser(function(user,done){
  // 查到用户登录验证成功之后，会把用户的数据存储到session中
  done(null,user)
})

// 反序列化：从session里取用户数据成对象，session 可能是存数据库的或者写文件里的
/*反序列化，会在用户请求到来的时候从session中解析用户信息，如果在登录状态，则在ctx.state.user中添加ctx.login()函数执行时添加进去的参数*/
passport.deserializeUser(function(user,done){
  // 在每次请求的时候，会从session中读取用户对象
  return done(null,user)
})

// 登录验证成功了，我把数据打到cookies中，因为http通信是没有状态的，session是存储在cookies中，存在浏览器端，下次再进来的时候，我会从cookies中把你的session的信息提出来，和服务端的session做验证对比，如果能找到的话，就说明这个人是登录状态，从而达到一个无状态到有状态的转变

export default passport