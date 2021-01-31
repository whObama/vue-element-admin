export function name (rule, value, callback) {
  // 不含 ' / \ : * ?  < > | 这些特殊字符
  let reg = /^[^'\/\\:\*\?"<>\|]*$/g
  if (value === '') {
    callback(new Error('此项为必填项'))
  } else if (!reg.test(value)) {
    callback(new Error('请填写正确格式'))
  } else {
    callback()
  }
}

export function indexCode (rule, value, callback) {
  // 只允许数字和字母
  let reg = /^[\da-zA-Z]*$/g
  if (value === '') {
    callback(new Error('此项为必填项'))
  } else if (!reg.test(value)) {
    callback(new Error('请填写正确格式'))
  } else {
    callback()
  }
}

export function notRequiredCode (rule, value, callback) {
  // 只允许数字和字母
  let reg = /^[\da-zA-Z]*$/g
  if (!reg.test(value)) {
    callback(new Error('请填写正确格式'))
  } else {
    callback()
  }
}

// 必填项
export function valueRequired (rule, value, callback) {
  if (value === '') {
    callback(new Error('此项为必填项'))
  } else {
    callback()
  }
}
// 手机号码 
export function phone (rule, value, callback) {
  let reg = /^\d{0,11}$/g
  if (!reg.test(value)) {
    callback(new Error('请填写正确格式'))
  } else {
    callback()
  }
}

// 正整数 
export function num (rule, value, callback) {
  let reg = /^[1-9]\d*$/g
  if (value === '') {
    callback(new Error('此项为必填项'))
  } else if (!reg.test(value)) {
    callback(new Error('请填写正确格式'))
  } else {
    callback()
  }
}

// 导入文件
export function file (rule, value, callback) {
  if (value === '') {
    callback(new Error('请上传导入文件'))
  } else {
    callback()
  }
}
