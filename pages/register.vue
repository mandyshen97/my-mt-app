<template>
  <div class="page-register">
    <article class="header">
      <header>
        <a href="/" class="site-logo"></a>
        <span class="login">
          <em class="bold">已有美团帐号？</em>
          <a href="/login">
            <el-button type="primary" size="small">登录</el-button>
          </a>
        </span>
      </header>
    </article>
    <section>
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        class="demo-reluForm"
      >
        <el-form-item label="昵称" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email" />
          <el-button size="mini" round @click="sendMsg">发送验证码</el-button>
          <span class="status">{{ statusMsg }}</span>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input v-model="ruleForm.code" maxLength="4"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pwd">
          <el-input v-model="ruleForm.pwd" type="password" />
        </el-form-item>
        <el-form-item label="确认密码" prop="cpwd">
          <el-input v-model="ruleForm.cpwd" type="password" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="register"
            >同意以下协议并注册</el-button
          >
          <div class="error">{{ error }}</div>
        </el-form-item>
        <el-form-item>
          <a
            class="f1"
            href="http://www.meituan.com/about/terms"
            target="_blank"
            >《美团网用户协议》</a
          >
        </el-form-item>
      </el-form>
    </section>
  </div>
</template>

<script>
import CryptoJS from "crypto-js";
export default {
  data() {
    return {
      statusMsg: "",
      error: "",
      ruleForm: {
        name: "",
        code: "",
        pwd: "",
        cpwd: "",
        email: ""
      },
      rules: {
        name: [
          {
            required: true,
            type: "string",
            message: "请输入昵称",
            trigger: "blur"
          }
        ],
        email: [
          {
            required: true,
            type: "email",
            message: "请输入邮箱",
            trigger: "blur"
          }
        ],
        pwd: [
          {
            required: true,
            message: "创建密码",
            trigger: "blur"
          }
        ],
        cpwd: [
          { required: true, message: "确认密码", trigger: "blur" },
          // 二次验证，对比两次密码的内容，需要内置一个函数，支持验证函数的自定义
          // validator是一个函数，函数的第一个是rule规则，第二个是value值，第三个是回调
          {
            validator: (rule, value, callback) => {
              if (value === "") {
                callback(new Error("请再次输入密码"));
              } else if (value !== this.ruleForm.pwd) {
                callback(new Error("两次输入的密码不一致"));
              } else {
                callback();
              }
            },
            trigger: "blur"
          }
        ]
      }
    };
  },
  // 创建模板原因：
  //     因为这个注册组件样式上并不需要header和footer，所以不能使用我们配置好的默认模板:default.vue,要新建一个blank.vue的空模板
  layout: "blank",
  methods: {
    sendMsg: function() {
      const self = this;
      let namePass;
      let emailPass;
      // 如果定时器还在，不会重新发送
      if (self.timerid) {
        return false;
      }
      // 验证昵称,errorMsg为空时验证成功
      this.$refs["ruleForm"].validateField("name", errorMsg => {
        namePass = errorMsg;
      });
      self.statusMsg = "";
      // errorMsg不为空，验证失败
      if (namePass) {
        return false;
      }
      // 验证邮箱，errorMsg为空时验证成功
      this.$refs["ruleForm"].validateField("email", errorMsg => {
        emailPass = errorMsg;
      });
      // 昵称和邮箱都验证成功(errorMsg都为空)，发送验证码请求
      if (!namePass && !emailPass) {
        self.$axios
          .post("/users/verify", {
            // encodeURIComponent把字符串作为URI组件进行编码
            username: encodeURIComponent(self.ruleForm.name),
            email: self.ruleForm.email
          })
          .then(({ status, data }) => {
            if (status === 200 && data && data.code === 0) {
              let count = 60;
              self.statusMsg = `验证码已发送，剩余${count--}秒`;
              self.timerid = setInterval(function() {
                self.statusMsg = `验证码已发送，剩余${count--}秒`;
                if (count === 0) {
                  clearInterval(self.timerid);
                }
              }, 1000);
            } else {
              self.statusMsg = data.msg;
            }
          });
      }
    },
    register: function() {
      let self = this;
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          self.$axios
            .post("/users/signup", {
              username: window.encodeURIComponent(self.ruleForm.name),
              password: CryptoJS.MD5(self.ruleForm.pwd).toString(),
              email: self.ruleForm.email,
              code: self.ruleForm.code
            })
            .then(({ status, data }) => {
              if (status === 200) {
                // 注册成功，跳转到登陆页面
                if (data && data.code === 0) {
                  location.href = "/login";
                } else {
                  self.error = data.msg;
                }
              } else {
                self.error = `服务器出错，错误码:${status}`;
              }
              setTimeout(function() {
                self.error = "";
              }, 1500);
            });
        }
      });
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/css/register/index.scss";
</style>
