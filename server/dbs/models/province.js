import mongoose from "mongoose";
const Province = new mongoose.Schema({
  id: {
    type: String,
    require: true
  },
  value: {
    type: String,
    require: true
  }
});
export default mongoose.model("Province", Province);
