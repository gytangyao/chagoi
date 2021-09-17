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
      <div class="setting"></div>
    </div>
    <div class="right">right</div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  created() {
    let routers = this.routers;

    var cs_meal = routers.find(m => m.perms === "cs_meal");
    if (cs_meal) {
      this.menuItems.push({
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

    var cs_print = routers.find(m => m.perms === "cs_bill");
    if (cs_print) {
      this.menuItems.push({
        isSelected: false,
        class: "menuItems",
        perms: cs_print.perms,
        menuName: cs_print.menuName,
        icon: require("./../assets/Images/MenuIcon/print.png")
      });
    }
  },
  data() {
    const item = {
      date: "2016-05-02",
      name: "王小虎",
      address: "上海市普陀区金沙江路 1518 弄"
    };
    return {
      logo: require("./../assets/Images/cl.png"),
      tableData: Array(20).fill(item),
      menuItems: []
    };
  },
  computed: {
    ...mapState({
      routers: state => state.memoryCache.Routers
    })
  },
  methods: {
    onMenuClick(item) {
      console.log(item);
      this.menuItems.forEach(element => {
        element.isSelected = element.perms === item.perms;
        element.class = element.isSelected
          ? "menuItems menuItemsActive"
          : "menuItems";
      });
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
  background-color: yellow;
}

.root .right {
  flex: 1 1 0;
  background-color: #2a2e37;
}</style
>>
