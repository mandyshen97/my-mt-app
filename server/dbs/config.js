export default {
  // mongodb连接方式
  dbs: "mongodb://127.0.0.1:27017/student",
  // redis连接方式
  redis: {
    get host() {
      return "127.0.0.1";
    },
    get port() {
      return 6379;
    }
  },
  // smtp服务
  smtp: {
    get host() {
      // 这里是固定的，因为smtp服务不是自己提供的，是使用腾讯的QQ邮箱
      return "smtp.qq.com";
    },
    get user() {
      // 发送方的QQ邮箱账号
      return "1099232082@qq.com";
    },
    get pass() {
      // 配置授权码，这个授权码是QQ邮箱中开启SMTP服务的那里得到的，每个人的都不一样
      return "ogxkskuckfpubacc";
    },
    get code() {
      // 配置验证码，每次验证码都是随机的四位数
      return () => {
        return Math.random()
          .toString(16)
          .slice(2, 6)
          .toLowerCase();
      };
    },
    get expire() {
      // 配置验证码的过期时间，这里设置1分钟
      return () => {
        return new Date().getTime() + 60 * 1000;
      };
    }
  }
};
