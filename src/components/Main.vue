<template>
  <div class="root">
    <div class="left">
      <img :src="logo" class="logo" />
      <div class="menu">
        <div
          @click="onMenuClick(item)"
          v-for="item in menuItems"
          :class="item.class"
          :key="item.perms"
        >
          <img :src="item.icon" class="icon" />
          <span class="title">{{ item.menuName }}</span>
        </div>
      </div>
      <div class="setting">
        <div class="item">
          <span class="label">推送:</span>
          <span :class="iotClass">正常</span>
        </div>
        <div class="item">
          <span class="label">同步:</span>
          <span :class="iotClass">正常</span>
        </div>
        <el-button @click="refreshMemoryCache" type="info" size="mini"
          >刷新</el-button
        >
        <div class="item">
          <span class="label">V1.1323</span>
        </div>
      </div>
    </div>
    <div class="right">
      <router-view ref="main_router_view"></router-view>
    </div>
  </div>
</template>

<script>
"use strict";
import { mapState } from "vuex";
export default {
  created() {
    this.$eventBus.on("RefreshComplete", () => {
      //UseRoutersFillMenu
      if (this.menuItems.length > 0) {
        let firstMenu = this.menuItems[0];
        this.onMenuClick(firstMenu);
      }
    });
  },
  mounted() {
    this.fillMenu();
    this.$router.replace({
      name: "refreshPage",
      params: { t: new Date().getTime() }
    });
  },
  data() {
    return {
      logo: require("./../assets/Images/cl.png"),
      menuItems: [],
      iotClass: "iotClass",
      requestRefresh: false
    };
  },
  computed: {
    ...mapState({
      routers: state => state.memoryCache.Routers,
      hasNewVersion: state => state.memoryCache.HasNewVersion
    })
  },
  methods: {
    //刷新缓存
    refreshMemoryCache() {
      if ("refreshPage" == this.$route.name) {
        this.$eventBus.emit("RequestGlobalRefresh");
      } else {
        this.$router.replace({
          name: "refreshPage",
          params: { t: new Date().getTime() }
        });
      }
    },
    onMenuClick(item) {
      this.selectMenu(item);
      this.$router.replace({
        name: item.routeName,
        params: { t: new Date().getTime() }
      });
    },
    selectMenu(item) {
      this.menuItems.forEach(element => {
        element.isSelected = element.perms === item.perms;
        element.class = element.isSelected
          ? "menuItems menuItemsActive"
          : "menuItems";
      });
    },
    fillMenu() {
      let routers = this.routers;
      var cs_meal = routers.find(m => m.perms === "cs_meal");
      if (cs_meal) {
        this.menuItems.push({
          routeName: "orderIndex",
          isSelected: true,
          class: "menuItems menuItemsActive",
          perms: cs_meal.perms,
          menuName: cs_meal.menuName,
          icon: require("./../assets/Images/MenuIcon/order.png")
        });
      }

      var cs_wine_cooler = routers.find(m => m.perms === "cs_wine_cooler");
      if (cs_wine_cooler) {
        this.menuItems.push({
          isSelected: false,
          class: "menuItems",
          perms: cs_wine_cooler.perms,
          menuName: cs_wine_cooler.menuName,
          icon: require("./../assets/Images/MenuIcon/wine.png")
        });
      }

      var cs_member = routers.find(m => m.perms === "cs_member");
      if (cs_member) {
        this.menuItems.push({
          isSelected: false,
          class: "menuItems",
          perms: cs_member.perms,
          menuName: cs_member.menuName,
          icon: require("./../assets/Images/MenuIcon/member.png")
        });
      }

      var cs_order_line = routers.find(m => m.perms === "cs_order_line");
      if (cs_order_line) {
        this.menuItems.push({
          isSelected: false,
          class: "menuItems",
          perms: cs_order_line.perms,
          menuName: cs_order_line.menuName,
          icon: require("./../assets/Images/MenuIcon/queue.png")
        });
      }

      var cs_preordain = routers.find(m => m.perms === "cs_preordain");
      if (cs_preordain) {
        this.menuItems.push({
          isSelected: false,
          class: "menuItems",
          perms: cs_preordain.perms,
          menuName: cs_preordain.menuName,
          icon: require("./../assets/Images/MenuIcon/reserve.png")
        });
      }

      var cs_commodity = routers.find(m => m.perms === "cs_commodity");
      if (cs_commodity) {
        this.menuItems.push({
          isSelected: false,
          class: "menuItems",
          perms: cs_commodity.perms,
          menuName: cs_commodity.menuName,
          icon: require("./../assets/Images/MenuIcon/goods.png")
        });
      }

      var cs_bill = routers.find(m => m.perms === "cs_bill");
      if (cs_bill) {
        this.menuItems.push({
          routeName: "billIndex",
          isSelected: false,
          class: "menuItems",
          perms: cs_bill.perms,
          menuName: cs_bill.menuName,
          icon: require("./../assets/Images/MenuIcon/bill.png")
        });
      }

      var cs_tp = routers.find(m => m.perms === "cs_tp");
      if (cs_tp) {
        this.menuItems.push({
          isSelected: false,
          class: "menuItems",
          perms: cs_tp.perms,
          menuName: cs_tp.menuName,
          icon: require("./../assets/Images/MenuIcon/shift.png")
        });
      }

      var cs_print = routers.find(m => m.perms === "cs_print");
      if (cs_print) {
        this.menuItems.push({
          isSelected: false,
          class: "menuItems",
          perms: cs_print.perms,
          menuName: cs_print.menuName,
          icon: require("./../assets/Images/MenuIcon/print.png")
        });
      }
    }
  }
};
</script>
<style scoped>
.root {
  display: flex;
  width: 100%;
  height: 100%;
  position: fixed;
}

.root .left {
  flex: 0 0 62px;
  background: #24272e;
  display: flex;
  flex-direction: column;
}

.root .left .logo {
  width: 40px;
  height: 40px;
  margin: 15px;
}

.root .left .menu {
  flex: 1 1 0;
  display: flex;
  flex-flow: column;
  align-items: center;
}

.root .left .menu .menuItems {
  height: 62px;
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #828282;
  cursor: pointer;
}

.root .left .menu .menuItemsActive {
  background-color: #1e2127;
  color: #ffeab0;
}

.root .left .menuItems .icon {
  width: 24px;
  height: 23px;
  align-self: center;
}

.root .left .menuItems .title {
  font-size: 12px;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  text-align: left;
  line-height: 17px;
  align-self: center;
}

.root .left .setting {
  flex: 0 0 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.root .left .setting .item {
  display: flex;
  justify-content: center;
  margin: 5px auto 5px auto;
}

.root .left .setting .item .label {
  font-size: 14px;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  text-align: left;
  color: #828282;
  line-height: 20px;
}

.root .left .setting .el-button--info {
  background: #3a3d43;
  border-radius: 14px;
  border: transparent;
  font-size: 12px;
  font-family: PingFangSC, PingFangSC-Regular;
  color: #a9a9a9;
}

.root .right {
  flex: 1 1 0;
  background-color: #2a2e37;
}

.iotClass {
  color: #40b88f;
}
</style>
