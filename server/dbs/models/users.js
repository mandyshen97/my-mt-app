/**
 * 用户信息表
 */
// 1.引入mongoose
import mongoose from "mongoose";
// 2. 引入Schema
const Schema = mongoose.Schema;
// 3. 创建用户表实例
const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    require: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
});
// 4.导出用户表，名字为User
export default mongoose.model('User',UserSchema)
