/**
/geo/getPosition       在接口发出请求到服务端，服务端根据当前的ip来查库，给出你当前城市的名称
/geo/province          获取省份的接口
/geo/province/:id      给出你指定的id的省份，每一个省份都有一个对应的id，根据id可以查询到这个省份下面所有管辖的城市
/geo/city              获取所有城市（不是按省份分类的城市）
/geo/hotCity           获取热门城市
/geo/menu              获取全部分类下的菜单数据
接口测试工具：postman
 */

import Router from "koa-router";
import axios from "./utils/axios";
// import Province from '../dbs/models/province'
// import City from '../dbs/models/city'
// import Menu from '../dbs/models/menu'

let router = new Router({
  // 定义一个前缀
  prefix: "/geo"
});
const sign = "c0159e56b92b0f7e191b2228d917afc9";
/**
 * 获取当前城市名称接口，服务端根据当前的ip来获取当前城市名称
 */
router.get("/getPosition", async ctx => {
  let {
    status,
    data: { province, city }
  } = await axios.get(`http://cp-tools.cn/geo/getPosition?sign=${sign}`);
  if (status === 200) {
    ctx.body = {
      province,
      city
    };
  } else {
    ctx.body = {
      province: "",
      city: ""
    };
  }
});

/**
 * 获取全部分类下的菜单数据
 * 每个接口提供两种方案，一种是操作本地数据库的方式，一种是通过线上服务的方式
 */
router.get("/menu", async ctx => {
  // const result = await Menu.findOne()
  // ctx.body = {
  //   menu: result.menu
  // }
  let {
    status,
    data: { menu }
  } = await axios.get(`http://cp-tools.cn/geo/menu?sign=${sign}`);
  if (status === 200) {
    ctx.body = {
      menu
    };
  } else {
    ctx.body = {
      menu: []
    };
  }
});

/**
 * 获取省份的接口
 */
router.get("/province", async ctx => {
  // let province = await Province.find()
  // ctx.body = {
  //     province: province.map(item =>{
  //         return {
  //             id: item.id,
  //             name: item.value[0]
  //         }
  //     })
  // }
  let {
    status,
    data: { province }
  } = await axios.get(`http://cp-tools.cn/geo/province?sign=${sign}`);
  ctx.body = {
    province: status === 200 ? province : []
  };
});
/**
 * 根据指定的id，每一个省份都有一个对应的id，根据id可以查询到这个省份下面所有管辖的城市
 */
router.get("/province/:id", async ctx => {
  // let city = await City.findOne({id: ctx.params.id})

  // ctx.body = {
  //   code: 0,
  //   city: city.value.map(item => {
  //     return {province: item.province, id: item.id, name: item.name}
  //   })
  // }
  let {
    status,
    data: { city }
  } = await axios.get(
    `http://cp-tools.cn/geo/province/${ctx.params.id}?sign=${sign}`
  );
  if (status === 200) {
    ctx.body = {
      city
    };
  } else {
    ctx.body = {
      city: []
    };
  }
});

/**
 * 获取所有城市，不按省份分类
 */
router.get("/city", async ctx => {
  // let city = []
  // let result = await City.find()
  // result.forEach(item => {
  //   city = city.concat(item.value)
  // })
  // ctx.body = {
  //   code: 0,
  //   city: city.map(item => {
  //     return {
  //       province: item.province,
  //       id: item.id,
  //       name: item.name === '市辖区' || item.name === '省直辖县级行政区划'
  //         ? item.province
  //         : item.name
  //     }
  //   })
  // }
  let {
    status,
    data: { city }
  } = await axios.get(`http://cp-tools.cn/geo/city?sign=${sign}`);
  if (status === 200) {
    ctx.body = {
      city
    };
  } else {
    ctx.body = {
      city: []
    };
  }
});

/**
 * 获取热门城市
 */
router.get("/hotCity", async ctx => {
  // let list = [
  //   '北京市',
  //   '上海市',
  //   '广州市',
  //   '深圳市',
  //   '天津市',
  //   '西安市',
  //   '杭州市',
  //   '南京市',
  //   '武汉市',
  //   '成都市'
  // ]
  // let result = await City.find()
  // let nList = []
  // result.forEach(item => {
  //   nList = nList.concat(item.value.filter(k => list.includes(k.name) || list.includes(k.province)))
  // })
  // ctx.body = {
  //   hots: nList
  // }
  let {
    status,
    data: { hots }
  } = await axios.get(`http://cp-tools.cn/geo/hotCity?sign=${sign}`);
  if (status === 200) {
    ctx.body = {
      hots
    };
  } else {
    ctx.body = {
      hots: []
    };
  }
});
export default router;
