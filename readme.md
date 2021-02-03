# `express` + `umi3.0` 基础项目

项目名称为 `strawberry` ，所有涉及到的 `strawberry` 名称需要替换成新的项目名。

## 运行原理 

开发环境下，接口走 `.umirc` 中的 `proxy` 代理，这里跑的 `webpack` 的 `proxy` ， `webpack` 的服务器将请求转发到了我们的 `express` 服务，我们的 `express` 服务再转发真实的接口请求。

大体的流程类似于：

``` flow
st=>start:  前端 /api/proxy 发起请求
op1=>operation: 被 proxy 转发到了本地 wepback-server 
op2=>operation: 本地 proxy 代理的服务是我们自己的 node express server
op3=>operation: node express server 向真实接口请求
op4=>operation: 拿到返回值之后 返回给前端
e=>end: 结束
st->op1->op2->op3->op4->e
```

先来了解一下 `express` 怎么托管静态资源以及如何访问 `index.html` 。 `express` 的启动文件中配置了模版引擎和托管的静态资源的地址，所以如果我们的静态资源的路径设置的没问题的话，在服务跑起来之后，就是可以访问静态资源的。而且最终我们的入口路由逻辑是处理，当请求落在 `/` 的时候，我们去 `render index` ，而能真正识别并且 `render` 入口 `index.html` 是依赖我们在 `app.js` 中配置的模版引擎。

也就是说，我们在 `express` 的启动文件中正确配置了静态资源的地址和模板引擎的话，在路由里配置当请求打到 `/` 的时候 `res.render('index')` 就会渲染对应的 `index.html` 文件。当然如果有引入外部的样式或者脚本的话，需要确保在前端打包的时候的 `publicPath` 的正确性以及 `express` 静态资源的访问路径的正确性。

现在我们再来看一下 `build` 处理的过程以及之后跑起来的流程：

当我们 `build` 的时候，会先去执行 `build.sh` 的这个脚本，在运行 `yarn build` 之后，按照 `shell` 的命令，会先清除上一次打包的产物，清除掉 `server/views/index.html` 的模版引擎的入口文件，开始执行 `umi` 的打包命令，这里的 `umiBuild` 是在 `package.json` 的 `script` 脚本里重写了，其实就是执行的 `umi build` 。接下来将打包生成的 `index.html` 移动到 `server/views` 中。我们启动 `express` 服务，当我们请求 `http://localhost:3000/` 之后因为路由解析，被分发到了 `routes/index` 中，执行 `res.render('index', { title: '' })` ， `render` 的 `index` 就是 `views` 下我们打包好的 `umi` 的 `index.html` 。所以就能看到了首页，然后在当我们为页面元素增加事件点击发起请求的时候，因为我们服务端接受到 `/api/proxy` 的请求之后，匹配到路由从而执行 `/server/routes/proxy` 文件，内部由 `request` 向 `proxy` 后的接口地址发起请求，拿到返回结果之后再将接回数据返回给前端，从而绕过跨域。在最终的前端资源是跑在一个 `node` 的进程中的，当 `yarn start` 开始运行之后，启动文件是 `server/www.js` ，入口文件就是 `server/app.js` ，所以跑的都是 `express` 的那一套。

## 文件介绍

 `/server`

* `express`搭建的服务端目录。

 `/src`

* `umi`前端源码目录。

 `/build.sh`

* `yarn build`后执行的脚本。

``` shell
rm -rf public
rm server/views/index.html
yarn umiBuild
mv public/strawberry/index.html server/views/index.html
```

 `/server/app.js`

* `express`启动文件。

``` js
// 将静态文件的路径设置为umi打包产物的路径
app.use(express.static(path.join(__dirname, '..', 'public')));
```

## 开发环境运行

* `yarn start` 启动服务端。

* `yarn dev` 启动前端。

`umirc` 中设置了 `publicPath` 为项目的名称，所以最终打包生成静态文件的引用就是
`/strawberry/umi.js` 格式为 `/` 项目名称 `/asset.css|.js` 。

## 生产打包环境运行

访问打包后的文件就是直接启动 `express` 服务端，然后访问 `http://localhost:3000/` ，陆路由命中 `server/routes/index` ， 从而解析 `views/index.html` 的模板显示页面。

## TODO

* [ ] 打包后的产物的复制或者删除可以考虑用`webpack`插件。

* [ ] 可以将项目名称设置为一个变量，在利用脚手架生成项目的时候注入进去，避免全局替换出现的未知的问题。
