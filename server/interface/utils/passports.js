import passport from 'koa-passport'
import LocalStrategy from 'passport-local'
import UserModel from '../../dbs/models/users'

// 设置本地策略
// function参数中的username,password是用户传入的
passport.use(new LocalStrategy(async function(username,password,done){
  // 查找条件是用户名
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

// 序列化
/*序列化在ctx.login()函数调用时触发,会自动在ctx.state.user中添加done中的第二个参数，并在session中添加用户登录状态*/
passport.serializeUser(function(user,done){
  done(null,user)
})

// 反序列化
/*反序列化，会在用户请求到来的时候从session中解析用户信息，如果在登录状态，则在ctx.state.user中添加ctx.login()函数执行时添加进去的参数*/
passport.deserializeUser(function(user,done){
  return done(null,user)
})

export default passport