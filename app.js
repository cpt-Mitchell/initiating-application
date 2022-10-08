const ssd = require('simple-sftp-deploy')
const path = require('path')
// ssd.start({
//   is_bak: false,
//   remote_path: '/data/webapps/hwagain-web/vue3-x',
//   assets_path: path.resolve(__dirname, './dist'),
//   host: '192.168.68.207',
//   port: '22',
//   user: 'portal',
//   password: 'portal'
// })

ssd.deploy({
  is_bak: false,
  remote_path: '/hwagain/frontweb/hwagain-dingtalk-oa-test/initiating-application',
  assets_path: path.resolve(__dirname, './dist'),
  host: '172.16.1.39',
  port: '22',
  user: 'hwtest',
  password: 'hwtest2019'
})
