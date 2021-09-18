<template>
  <div class="root">
    <el-progress type="circle" :percentage="percentage"></el-progress>
    <span class="msgLabel">{{ loadingText }}</span>
  </div>
</template>

<script>
import { findMealConfig, routers, findUnComplete } from "../utils/http";
import { mapState } from "vuex";
const totalPercentage = 9;
export default {
  data() {
    return {
      loadingText: "",
      percentage: 0
    };
  },
  created() {
    this.$eventBus.on("requestRefresh", () => {
      this.beginRefresh();
    });
    this.beginRefresh();
  },
  computed: {
    ...mapState({
      storeId: state => state.memoryCache.StoreId,
      routers: state => state.memoryCache.Routers
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
        });
    },
    findMealConfig() {
      this.loadingText = "正在更新数据隐私控制项";
      return new Promise(resolve => {
        let params = { storeid: this.storeId };
        findMealConfig(params, true).then(res => {
          this.$store.commit("memoryCache/setMealConfig", res.data);
          this.percentage = parseInt((1 / totalPercentage) * 100);
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
          this.percentage = parseInt((2 / totalPercentage) * 100);
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
            this.$store.commit("memoryCache/setUnitFindUnCompleteResDto", data);
            this.percentage = parseInt((3 / totalPercentage) * 100);
            resolve();
          });
        } else {
          this.percentage = parseInt((3 / totalPercentage) * 100);
          resolve();
        }
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
