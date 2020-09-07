const IS_PROD = ['production', 'test', 'beta'].includes(process.env.NODE_ENV)
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true
  },
  extends: [
    'plugin:vue/essential', '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'array-bracket-spacing': [2, 'never'], // 强制数组方括号中使用一致的空格
    'arrow-parens': 0, // 箭头函数用小括号括起来
    'arrow-spacing': 0, //= >的前/后括号
    'accessor-pairs': 0, // 在对象中使用getter/setter
    'brace-style': [1, '1tbs'], // 大括号风格
    'comma-dangle': [2, 'never'], // 对象字面量项尾不能有逗号
    'consistent-this': [2, 'self'], // this别名
    eqeqeq: 2, // 必须使用全等
    // indent: ['error', 0],
    'no-console': IS_PROD ? 'warn' : 'off',
    'no-debugger': IS_PROD ? 'warn' : 'off',
    'no-const-assign': 2, // 禁止修改const声明的变量
    'no-eq-null': 2, // 禁止对null使用==或!=运算符
    'no-multi-str': 2, // 字符串不能用\换行
    'no-multi-spaces': 1, // 不能用多余的空格
    'no-mixed-spaces-and-tabs': [0], // 禁止混用tab和空格
    'no-multiple-empty-lines': [1, {
      max: 2
    }], // 空行最多不能超过2行
    'no-new-func': 1, // 禁止使用new Function
    'no-new-object': 2, // 禁止使用new Object()
    'no-new-require': 2, // 禁止使用new require
    'no-unused-vars': 0,
    'one-var': ['error', 'never'],
    'operator-assignment': [0, 'always'], // 赋值运算符 += -=什么的
    quotes: ['error', 'single'], // 强制使用单引号
    semi: ['error', 'never'], // 强制不使用分号结尾
    'space-before-function-paren': 0 // function前没有空格0 （加空格[0]）
  }
}
