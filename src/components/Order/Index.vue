<template>
  <div class="pageRoot">
    <div class="left">
      <div class="tableCard">
        <div class="r1">
          <span class="tabNum">包厢A3</span>
          <el-button type="text" class="configDiscountBtn">折扣配置</el-button>
          <el-button class="updateTableInfo" type="text"
            >编辑桌台信息<i class="el-icon-arrow-right"></i
          ></el-button>
        </div>
      </div>
      <div class="goodsCard"></div>
      <div class="moneyCard"></div>
    </div>
    <div class="right" ref="right">
      <div class="status">
        <div class="r1">
          <el-button
            @click="selectTableState(item)"
            :key="item.title"
            v-for="item in tableStates"
            :class="item.class"
            size="mini"
            >{{ item.title }}</el-button
          >
        </div>
        <div class="r2">
          <el-button
            @click="selectTableZone(item)"
            :key="item.title"
            v-for="item in tableZoneModels"
            :class="item.class"
            size="mini"
            >{{ item.title }}</el-button
          >
        </div>
      </div>

      <div class="tables">
        <div class="table" v-for="item in tableModels" :key="item.id">
          table
        </div>
      </div>
    </div>
  </div>
</template>

<script>
"use strict";
import { queryBookTable } from "../../utils/http";
import { mapState } from "vuex";
export default {
  created() {
    /**填充桌台状态 */
    this.tableStates.push({
      title: "全部",
      class: "stateButton stateButtonActive"
    });
    this.tableStates.push({
      title: "空闲",
      class: "stateButton"
    });
    this.tableStates.push({
      title: "占用",
      class: "stateButton"
    });
    this.tableState = this.tableStates[0];

    /**填充桌台分区 */
    if (this.tableZones && this.tableZones.length > 0) {
      this.tableZones.forEach((element, index) => {
        this.tableZoneModels.push({
          id: element.id,
          title: element.tableZone,
          class:
            index == 0
              ? "tableZoneButton tableZoneButtonActive"
              : "tableZoneButton"
        });
      });
      this.selectedTableZoneModel = this.tableZoneModels[0];
    }
    /**填充桌台分区 */
    this.queryBookTable().then(tables => {
      console.log(tables);
      if (tables && tables.length > 0) {
        tables.forEach(element => {
          this.tableModels.push(element);
        });
      }
    });
  },
  data() {
    return {
      tableState: {},
      tableStates: [],
      tableZoneModels: [],
      selectedTableZoneModel: {},
      tableModels: []
    };
  },
  methods: {
    queryBookTable() {
      return new Promise(resolve => {
        let params = {};
        queryBookTable(params, true).then(res => {
          let data = res.data;
          resolve(data);
        });
      });
    },
    selectTableState(item) {
      this.tableStates.forEach(element => {
        if (element.title == item.title) {
          this.tableState = element;
          element.class = "stateButton stateButtonActive";
        } else {
          element.class = "stateButton";
        }
      });
    },
    selectTableZone(item) {
      this.tableZoneModels.forEach(element => {
        if (element.id == item.id) {
          this.selectedTableZoneModel = element;
          element.class = "tableZoneButton tableZoneButtonActive";
        } else {
          element.class = "tableZoneButton";
        }
      });
    }
  },
  watch: {
    tableState(newValue) {
      console.log(newValue);
    }
  },
  computed: {
    ...mapState({
      tableZones: state => state.memoryCache.TableZones
    })
  }
};
</script>

<style scoped>
.pageRoot {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  padding: 5px;
  align-items: stretch;
}

.pageRoot .left {
  width: 320px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.pageRoot .left .tableCard {
  box-sizing: border-box;
  height: 143px;
  background: #30343d;
  border-radius: 6px;
  box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.09);
  display: flex;
  flex-direction: column;
  padding: 10px;
}

.pageRoot .left .tableCard .r1 {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.pageRoot .left .tableCard .r1 .tabNum {
  font-size: 24px;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  color: #ffeab0;
  line-height: 33px;
  flex: 1;
}

.pageRoot .left .tableCard .r1 .configDiscountBtn {
  font-size: 14px;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  color: #ffffff;
  line-height: 20px;
  margin: 0px;
  flex: 1;
}

.pageRoot .left .tableCard .r1 .updateTableInfo {
  font-size: 14px;
  font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  color: #ffffff;
  line-height: 20px;
  margin: 0px;
  flex: 1;
  text-align: right;
}

.pageRoot .left .goodsCard {
  flex: 1;
  margin-top: 10px;
  background: #30343d;
  border-radius: 6px;
  box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.09);
  display: flex;
  flex-direction: column;
  padding: 10px;
}

.pageRoot .left .moneyCard {
  margin-top: 10px;
  height: 150px;
  background: #30343d;
  border-radius: 6px;
  box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.09);
  display: flex;
  flex-direction: column;
  padding: 10px;
}

.pageRoot .right {
  flex: 1;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.pageRoot .right .status {
  margin-left: 10px;
  min-height: 143px;
  background: #30343d;
  border-radius: 6px;
  box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.09);
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  padding: 10px;
  justify-content: space-between;
}

.pageRoot .right .status .r1 {
  display: flex;
}

.pageRoot .right .status .r1 .stateButton {
  min-width: 99px;
  height: 27px;
  background: #454850;
  border-radius: 14px;
  border: transparent;
  font-size: 12px;
  font-family: Helvetica;
  text-align: center;
  color: white;
  line-height: 14px;
}

.pageRoot .right .status .r1 .stateButtonActive {
  background: linear-gradient(90deg, #ffd594 2%, #fbe9c2);
  color: #3d170e;
}

.pageRoot .right .status .r2 {
  display: flex;
  flex-wrap: wrap;
}

.pageRoot .right .status .r2 .tableZoneButton {
  min-width: 99px;
  height: 27px;
  background: #454850;
  border-radius: 14px;
  border: transparent;
  font-size: 12px;
  font-family: Helvetica;
  text-align: center;
  color: white;
  line-height: 14px;
  margin-bottom: 10px;
}

.pageRoot .right .status .r2 .tableZoneButtonActive {
  background: linear-gradient(90deg, #ffd594 2%, #fbe9c2);
  color: #3d170e;
}

.pageRoot .right .tables {
  display: grid;
  flex-wrap: wrap;
  overflow-y: scroll;
  overflow-x: hidden;
  justify-content: space-between;
  padding: 10px;
  grid-template-columns: repeat(auto-fill, 115px);
  grid-row-gap: 10px;
}

.pageRoot .right .table {
  height: 115px;
  background: #fd7c72;
  border-radius: 4px;
}
</style>
