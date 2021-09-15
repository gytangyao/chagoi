String.prototype.handlePointAfterNum = function () {
  let len = this.length;
  let pointNum = 0;
  let num = 0;
  let afterPointNUm = 0;
  for (let i = 0; i < len; i++) {
    if (this.charCodeAt(i) === 46) {
      pointNum++;
    } else if (this.charCodeAt(i) >= 48 && this.charCodeAt(i) <= 57) {
      num++;
      if (pointNum === 1) {
        afterPointNUm++;
      }
    }
  }
  console.log(this)
  if (
    pointNum + num === len &&
    ((afterPointNUm <= 2 && pointNum === 1) || pointNum === 0) &&
    len
  ) {
    if (afterPointNUm === 0 && pointNum) {
      return this + '00'
    } else if (afterPointNUm === 0 && !pointNum) {
      return this + '.00'
    } else if (afterPointNUm === 1) {
      return this + '0'
    } else {
      return this
    }
  }
};

/**
 * Created by PanJiaChen on 16/11/18.
 */


export function timeFormat1(time) {
  time = new Date(time)
  if (time == 'Invalid Date') {
    return 'Time is wrong'
  }
  const year = time.getYear() + (time.getYear() < 1900 ? 1900 : '') + ''
  const month = (time.getMonth() < 9 ? '0' : '') + (time.getMonth() + 1)
  const date = (time.getDate() < 10 ? '0' : '') + time.getDate()
  const hour = (time.getHours() < 10 ? '0' : '') + time.getHours()
  const minute = (time.getMinutes() < 10 ? '0' : '') + time.getMinutes()
  const second = (time.getSeconds() < 10 ? '0' : '') + time.getSeconds()
  time = `${year}-${month}-${date} ${hour}:${minute}:${second}`
  return time
}


/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 * @param {string} input value
 * @returns {number} output value
 */
export function byteLength(str) {
  // returns the byte length of an utf8 string
  let s = str.length
  for (var i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i)
    if (code > 0x7f && code <= 0x7ff) s++
    else if (code > 0x7ff && code <= 0xffff) s += 2
    if (code >= 0xDC00 && code <= 0xDFFF) i--
  }
  return s
}

/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

/**
 * @param {Object} json
 * @returns {Array}
 */
export function param(json) {
  if (!json) return ''
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) return ''
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
    })
  ).join('&')
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
    decodeURIComponent(search)
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/=/g, '":"')
      .replace(/\+/g, ' ') +
    '"}'
  )
}

/**
 * @param {string} val
 * @returns {string}
 */
export function html2Text(val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

/**
 * Merges two objects, giving the last one precedence
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export function objectMerge(target, source) {
  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  Object.keys(source).forEach(property => {
    const sourceProperty = source[property]
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty)
    } else {
      target[property] = sourceProperty
    }
  })
  return target
}

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

/**
 * @param {string} type
 * @returns {Date}
 */
export function getTime(type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function (...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

/**
 * @param {Array} arr
 * @returns {Array}
 */
export function uniqueArr(arr) {
  return Array.from(new Set(arr))
}

/**
 * @returns {string}
 */
export function createUniqueString() {
  const timestamp = +new Date() + ''
  const randomNum = parseInt((1 + Math.random()) * 65536) + ''
  return (+(randomNum + timestamp)).toString(32)
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}

const CryptoJS = require('crypto-js');
//秘钥
const key = "BF8DB286"; //十六位十六进制数作为密钥
// 加密
export function Encrypt(message, inputKey = key) {
  var keyHex = CryptoJS.enc.Utf8.parse(inputKey);
  var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
    iv: keyHex,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.ciphertext.toString().toUpperCase();
}
//解密
export function Decrypt(ciphertext, inputKey = key) {
  var keyHex = CryptoJS.enc.Utf8.parse(inputKey);
  var decrypted = CryptoJS.DES.decrypt({
    ciphertext: CryptoJS.enc.Hex.parse(ciphertext.toLowerCase())
  }, keyHex, {
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
    iv: keyHex
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}




/**
 * 金额补足两位小数
 */
export function addAfterPointNum(val) {
  val = typeof val === 'string' ? val : val.toString();
  let num = val.handlePointAfterNum()
  return num;
}

/**
 * 小于十补零
 * 
 */

export function addZero(val) {
  val = typeof val === 'string' ? val : val.toString();
  return val.length < 2 ? '0' + val : val
}

export function elParseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || 'yyyy-MM-dd HH:mm:ss'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        time = parseInt(time)
      } else {
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    M: date.getMonth() + 1,
    d: date.getDate(),
    H: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds()
  }
  const time_str = format.replace(/([yMdHms]+)/g, (result, key) => {
    const value = formatObj[key[0]];
    return value.toString().padStart(2, '0')
  })
  return time_str
}


export async function asyncAll(...jobs) {
  try {
    let results = jobs.map(async job => await job)
    let res = []
    for (const result of results) {
      res.push(await result)
    }
    return res
  } catch (error) {
    throw new Error(error)
  }
}
/*
*金额验证正则
*判断输入为小数点点后两位的数字
*/
export const MONEYREG = /^[0-9]+([.]{1}[0-9]{0,2}){0,1}$/;

export const reg = {
  zero: /^(([0])|([0][.][0]*))$/,   //是否为0
  integer: /^[1-9]\d*$/, // 正整数
  double: /^(([1-9]\d*)|(\d+[.]\d{1,2}))$/, // 最多两位小数(包含整数)
  // double: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, // 最多两位小数
  _double: /^-?(([1-9]\d*)|(\d+[.]\d{1,2}))$/, // 最多两位小数(包含整数 包含负数)
  // _double: /^-?(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, // 最多两位小数(包含整数 包含负数)
  phone: /^[1]([3-9])[0-9]{9}$/, // 电话号码验证
  landline: /^[0-9]{3,4}[-][0-9]{7,8}$/, //座机验证
};
const ONEYEARTIME = 366 * 24 * 60 * 60 * 1000;
export function checkTime(arr) {
  let bd = arr[0] + '-01 00:00:00';
  let ed = arr[1];
  let m = new Date(ed).getMonth() + 1;
  let year = new Date(ed).getYear();
  let arr1 = [1, 3, 5, 7, 8, 10, 12];
  let arr2 = [4, 6, 9, 11];
  if (arr1.includes(m)) ed += '-31 23:59:59';
  if (arr2.includes(m)) ed += '-30 23:59:59';
  if (m === 2) {
    if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) {
      ed += '-29 23:59:59';
    } else {
      ed += '-28 23:59:59';
    }
  }
  let time = new Date(ed) - new Date(bd)
  return time > ONEYEARTIME
}


export function trim(str) {
  return (str || '').toString().trim()
}