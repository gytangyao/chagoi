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
    <div class="right">
      <div class="status"></div>
    </div>
  </div>
</template>

<script>
"use strict";
export default {};
</script>

<style scoped>
.pageRoot {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  padding: 10px;
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
  height: 143px;
  background: #30343d;
  border-radius: 6px;
  box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.09);
}
</style>
