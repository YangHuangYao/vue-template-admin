import config from './index'
export const init = () => {
  config.regist('themes', {
    blue: {
      primary: '#f55525',
      highlight: '#eee'
    }
  })
}
