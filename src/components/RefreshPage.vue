<template>
  <div class="root">
    <el-progress type="circle" :percentage="percentage"></el-progress>
    <span class="msgLabel">{{ loadingText }}</span>
  </div>
</template>

<script>
"use strict";
import {
  findMealConfig,
  routers,
  findUnComplete,
  queryUserRoles,
  findOverTablePrinterConfig,
  getTableZone,
  getAllCommodityType,
  queryWaitTableCall
} from "../utils/http";
import { mapState } from "vuex";
var pinyin = require("pinyin");
const totalPercentage = 9;
export default {
  data() {
    return {
      loadingText: "",
      percentage: 0
    };
  },
  created() {
    this.$eventBus.on("RequestGlobalRefresh", () => {
      this.beginRefresh();
    });
    this.beginRefresh();
  },
  computed: {
    ...mapState({
      storeId: state => state.memoryCache.StoreId,
      deviceId: state => state.memoryCache.DeviceId,
      routers: state => state.memoryCache.Routers,
      pinyinItemCaches: state => state.memoryCache.PinyinItemCaches
    })
  },
  methods: {
    beginRefresh() {
      this.findMealConfig()
        .then(() => {
          return this.getRouters();
        })
        .then(() => {
          return this.findUnComplete();
        })
        .then(() => {
          return this.queryUserRoles();
        })
        .then(() => {
          return this.findOverTablePrinterConfig();
        })
        .then(() => {
          return this.getTableZone();
        })
        .then(() => {
          return this.getAllCommodityType();
        })
        .then(() => {
          return this.queryWaitTableCall();
        })
        .then(() => {
          this.$eventBus.emit("RefreshComplete");
        });
    },
    findMealConfig() {
      this.loadingText = "正在更新数据隐私控制项";
      return new Promise(resolve => {
        let params = { storeid: this.storeId };
        findMealConfig(params, true).then(res => {
          this.$store.commit("memoryCache/setMealConfig", res.data);
          this.percentage = parseInt((2 / totalPercentage) * 100);
          resolve();
        });
      });
    },
    getRouters() {
      this.loadingText = "正在更新权限数据";
      return new Promise(resolve => {
        let params = {};
        routers(params, true).then(res => {
          let data = res.data;
          this.$store.commit("memoryCache/setRouters", data);
          this.percentage = parseInt((3 / totalPercentage) * 100);
          resolve();
        });
      });
    },
    findUnComplete() {
      this.loadingText = "正在更新存取酒单位配置";
      return new Promise(resolve => {
        let cs_wine_cooler = this.routers.find(
          m => m.perms == "cs_wine_cooler"
        );
        if (cs_wine_cooler) {
          let params = {};
          findUnComplete(params, true).then(res => {
            let data = res.data;
            if (data && data.length > 0) {
              this.$store.commit(
                "memoryCache/setUnitFindUnCompleteResDto",
                data[0]
              );
            }
            this.percentage = parseInt((4 / totalPercentage) * 100);
            resolve();
          });
        } else {
          this.percentage = parseInt((4 / totalPercentage) * 100);
          resolve();
        }
      });
    },
    queryUserRoles() {
      this.loadingText = "正在查询客户经理";
      return new Promise(resolve => {
        let params = {};
        queryUserRoles(params, true).then(res => {
          let data = res.data;
          if (data && data.length > 0) {
            data.forEach(element => {
              let sureName = element.sureName;
              if (sureName) {
                if (this.pinyinItemCaches) {
                  var existPinYin = this.pinyinItemCaches[sureName];
                  if (existPinYin) {
                    element.pinYin = existPinYin;
                    return;
                  }
                }
                var sureNamePinYin = pinyin(sureName, {
                  style: pinyin.STYLE_FIRST_LETTER
                })
                  .toString()
                  .replace(new RegExp(",", "g"), "");
                element.pinYin = sureNamePinYin;
                this.$store.commit("memoryCache/setPinYinItem", {
                  key: sureName,
                  value: sureNamePinYin
                });
              }
            });
          }
          this.$store.commit("memoryCache/setAccountManagers", data);
          this.percentage = parseInt((5 / totalPercentage) * 100);
          resolve();
        });
      });
    },
    findOverTablePrinterConfig() {
      this.loadingText = "正在处理翻台自动打印";
      return new Promise(resolve => {
        let cs_meal = this.routers.find(m => m.perms == "cs_meal");
        if (cs_meal) {
          let params = {
            storeId: this.storeId,
            storeid: this.storeId,
            deviceId: this.deviceId
          };
          findOverTablePrinterConfig(params, true).then(res => {
            let data = res.data;
            let overTablePrintPre = data.TAG_OVERTABLEPRE === "OVERTABLEPRE";
            let overTablePrintDetail =
              data.TAG_OVERTABLEDETAIL === "OVERTABLEDETAIL";
            this.$store.commit(
              "memoryCache/setOverTablePrintPre",
              overTablePrintPre
            );
            this.$store.commit(
              "memoryCache/setOverTablePrintDetail",
              overTablePrintDetail
            );
            this.percentage = parseInt((6 / totalPercentage) * 100);
            resolve();
          });
        } else {
          this.percentage = parseInt((6 / totalPercentage) * 100);
          resolve();
        }
      });
    },
    getTableZone() {
      this.loadingText = "正在获取桌台分区数据";
      return new Promise(resolve => {
        let cs_meal = this.routers.find(m => m.perms == "cs_meal");
        if (cs_meal) {
          let params = {
            storeId: this.storeId,
            storeid: this.storeId
          };
          getTableZone(params, true).then(res => {
            let data = res.data;
            this.$store.commit("memoryCache/setTableZones", data);
            this.percentage = parseInt((7 / totalPercentage) * 100);
            resolve();
          });
        } else {
          this.percentage = parseInt((7 / totalPercentage) * 100);
          resolve();
        }
      });
    },
    getAllCommodityType() {
      this.loadingText = "正在缓存商品分类数据";
      return new Promise(resolve => {
        let params = {};
        getAllCommodityType(params, true).then(res => {
          let data = res.data;
          if (data) {
            data.forEach(element => {
              switch (element.isSetMealType) {
                case 1:
                  element.commodityType = "SetMeal";
                  element.uiShowSetMealBlock = true;
                  break;
                case 0:
                  element.commodityType = "Single";
                  break;
              }
            });
          }
          this.$store.commit("memoryCache/setCommodityTypes", data);
          this.percentage = parseInt((8 / totalPercentage) * 100);
          resolve();
        });
      });
    },
    queryWaitTableCall() {
      this.loadingText = "更新排队叫号语音模板";
      return new Promise(resolve => {
        let params = {
          storeId: this.storeId
        };
        queryWaitTableCall(params, true).then(res => {
          let data = res.data;
          if (data && data.length > 0) {
            let firstData = data[0];
            let template = firstData.content;
            if (template) {
              console.log(data);
            }
          }
          this.percentage = parseInt((9 / totalPercentage) * 100);
          resolve();
        });
      });
    }
  }
};
</script>

<style scoped>
.root {
  height: 100%;
  width: 100%;
  position: fixed;
  flex-direction: column;
  display: flex;
  justify-content: center;
  align-items: center;
}

.root .msgLabel {
  color: #828282;
  font-size: 16px;
  margin-top: 6px;
}
</style>
