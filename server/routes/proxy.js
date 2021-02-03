const express = require('express');
const router = express.Router();
const request = require('request')

/* GET users listing. */
router.all('/', function (req, res, next) {
  const method = req.method;
  const [, url] = req.baseUrl.split('/api/proxy/')
  // 设置请求参数
  const options = {
    url,
    method,
    headers: {
      "content-type": "application/json",
    },
    json: true,
    body: {}
  }
  // 按照请求方式处理参数
  if (method.toUpperCase() === 'GET') {
    options.qs = req.query;
  } else {
    options.json = true;
    options.body = req.body;
  }
  request(options, function (error, response, body) {
    try {
      if (!error && response.statusCode == 200) {
        res.json(body)
      } else {
        res.json({ header: { code: 1, message: typeof error === 'string' ? error : JSON.stringify(error) }, data: [] });
      }
    } catch (error) {
      res.json({ header: { code: 1, message: '服务器发生错误!', error, }, data: [] });
    }
  });
});

module.exports = router;
