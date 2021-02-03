import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [{ path: '/', component: '@/pages/index' }],
  fastRefresh: {},
  publicPath: '/strawberry/',
  outputPath: './public/strawberry',
  proxy: {
    '/api': {
      target: 'http://dev.yidian-inc.com:3000',
      changeOrigin: true,
    },
  },
});
