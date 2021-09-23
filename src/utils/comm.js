var moment = require("moment");


/**
 * 重新映射桌台信息
 * @param {table} table 
 * @returns 
 */
export function reReMappingTable(table) {
    table.inReserve = table.reserveStatus;
    if (table.reserveDate) {
        table.reserveDateDisplay = toDateTime(table.reserveDate);
    }

    table.seatCountDisplay = `${table.seatCount}人桌`;
    table.tableNumExtendName = `${table.tableNum}`;
    if (table.extendName) {
        table.tableNumExtendName += table.extendName;
    }

    //支付前后置的显示
    switch (table.snapPrePay) {
        case null:
            break;
        case true:
            table.snapPrePayDisplay = "切换为先享后付";
            break;
        case false:
            table.snapPrePayDisplay = "切换为先付后享";
            break;
    }

    //H5支付支付前置下单
    switch (table.snapCreateOrder) {
        case null:
        case false:
            table.snapCreateOrderDisplay = "启用下单";
            break;
        case true:
            table.snapCreateOrderDisplay = "禁用下单";
            break;
    }

    //低消开关
    switch (table.lowestConsumerState) {
        case false:
            table.lowestConsumerText = "开启低消";
            break;
        case true:
            table.lowestConsumerText = "关闭低消";
            break;
    }

    //显示友好的开台时间
    if (table.fixedTime) {
        var totalSeconds = moment(new Date()).diff(
            moment(table.fixedTime),
            "seconds"
        );
        if (totalSeconds < 60) {
            table.fixedTimeDisplay = `${Math.floor(totalSeconds)}秒`;
        } else if (totalSeconds < 60 * 60) {
            table.fixedTimeDisplay = `${Math.floor(totalSeconds / 60)}分钟`;
        } else if (totalSeconds < 60 * 60 * 60) {
            table.fixedTimeDisplay = `${Math.floor(totalSeconds / 3600)}小时`;
        } else {
            table.fixedTimeDisplay = `${Math.floor(totalSeconds / 86400)}天`;
        }
    } else {
        table.fixedTimeDisplay = "";
    }

    //处理客户经理的显示
    if (table.bookTableState !== "USE" && table.inReserve) {
        table.clientName = table.reserveClientName;
    }

    var lowestConsumerStateDisplay = table.lowestConsumerState ? "[开]" : "[关]";
    var leftBottomDisplay = `${table.lowestConsumer ? 0 : table.lowestConsumer}${lowestConsumerStateDisplay}`;
    if (table.clientName) {
        leftBottomDisplay += `<br/>${table.clientName}`;
    }

    table.leftBottomDisplay = leftBottomDisplay;
    table.lockTableBtnText = table.lockStatus ? "解锁台" : "锁台";

    switch (table.tableStatus) {
        //空闲
        case 0:
            table.background = "#3F434B";
            table.tabNumBackground = "#52565D";
            table.tabNumColor = "#C3C8DB";
            table.showPaid = false;

            table.leftTopDisplayVisible = false;
            table.leftTopDisplayTextColor = "#000000";
            table.leftTopDisplayBackgroundColor = "#000000";

            table.centerLine0Display = `${table.seatCount}人桌`;
            table.centerLine0DisplayTextColor = "#C3C8DB";

            table.centerLine1DisplayTextColor = "#000000";

            table.leftBottomDisplayTextColor = "#FFFFFF";
            break;
        //已预定
        case 1:
            table.background = "#FFE1A4";
            table.tabNumBackground = "#E1C07D";
            table.tabNumColor = "#9C721D";
            table.showPaid = false;
            table.leftTopDisplayVisible = true;
            table.leftTopDisplay = toDateTime(table.reserveDate, "HH:mm");
            table.leftTopDisplayTextColor = "#9C721D";
            table.leftTopDisplayBackgroundColor = "#FFE1A4";

            table.centerLine0Display = `${table.customer}`;
            table.centerLine0DisplayTextColor = "#9C721D";

            table.centerLine1Display = `${table.phone}`;
            table.centerLine1DisplayTextColor = "#9C721D";

            table.leftBottomDisplayTextColor = "#9C721D";
            break;
        //开台未付款
        case 2:
            table.background = "#FD7C72";
            table.tabNumBackground = "#E7685E";
            table.tabNumColor = "#FFFFFF";
            table.showPaid = false;
            table.leftTopDisplayVisible = true;
            if (table.inReserve) {
                table.leftTopDisplay = toDateTime(table.reserveDate, "HH:mm");
                table.leftTopDisplayTextColor = "#9C721D";
                table.leftTopDisplayBackgroundColor = "#FFE1A4";
            } else {
                table.leftTopDisplay = table.fixedTimeDisplay;
                table.leftTopDisplayTextColor = "#FFFFFF";
                table.leftTopDisplayBackgroundColor = "#FD7C72";
            }

            table.centerLine0Display = toNumber(table.payMoney);
            table.centerLine0DisplayTextColor = "#FFFFFF";

            table.centerLine1Display = toNumber(table.waitPayMoney);
            table.centerLine1DisplayTextColor = "#FFEC21";

            table.leftBottomDisplayTextColor = "#FFFFFF";
            break;
        //开台已付款
        case 3:
            table.background = "#FD7C72";
            table.tabNumBackground = "#E7685E";
            table.tabNumColor = "#FFFFFF";
            //针对刚开台还没有点菜的桌台   后台返回3(已付款)  进行二次处理
            if (table.payMoney && table.payMoney > 0) {
                table.showPaid = true;
            } else {
                table.showPaid = false;
            }

            table.leftTopDisplayVisible = true;
            if (table.inReserve) {
                table.leftTopDisplay = toDateTime(table.reserveDate, "HH:mm");
                table.leftTopDisplayTextColor = "#9C721D";
                table.leftTopDisplayBackgroundColor = "#FFE1A4";
            } else {
                table.leftTopDisplay = table.fixedTimeDisplay;
                table.leftTopDisplayTextColor = "#FFFFFF";
                table.leftTopDisplayBackgroundColor = "#FD7C72";
            }

            table.centerLine0Display = toNumber(table.payMoney);
            table.centerLine0DisplayTextColor = "#FFFFFF";

            table.centerLine1Display = toNumber(table.waitPayMoney);
            table.centerLine1DisplayTextColor = "#FFEC21";

            table.leftBottomDisplayTextColor = "#FFFFFF";
            break;
    }

    return table;
}


/**
 * 将时间戳转为时间
 * 如果转换失败,返回 ""
 * @param {*} v 
 * @returns 
 */
export function toDateTime(v, format) {
    if (v) {
        return moment.unix(v / 1000).format(format);
    } else {
        return "";
    }
}

/**
 * 将数字保留两位返回
 * 如果不是数字,返回0.00
 * @param {*} v 
 * @returns 
 */
export function toNumber(v) {
    const defaultValue = 0;
    if (v) {
        let number = parseFloat(v);
        if ("NaN" === number.toString()) {
            return defaultValue.toFixed(2);
        } else {
            return number.toFixed(2);
        }
    } else {
        return defaultValue.toFixed(2);
    }
}