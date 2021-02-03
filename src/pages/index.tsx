import styles from './index.less';
import { request } from 'umi';
import React, { useState } from 'react';

interface IndexPageProps {}
const IndexPage: React.FC<IndexPageProps> = () => {
  const [list, setList] = useState<any[]>([]);

  const fetchData = async () => {
    // 向后端发起请求的接口地址
    const { results } = await request(`/api/proxy/https://api.seniverse.com/`);
    setList(results);
  };

  return (
    <div>
      <h1 className={styles.title}>Page index</h1>
      <h2 style={{ cursor: 'pointer' }} onClick={fetchData}>
        天气
      </h2>
      <>
        {list.map((item) => {
          return (
            <div key={item.last_update}>
              <li>地区：{item.location.name}</li>
              <li>温度：{item.now.temperature}</li>
              <li>状态：{item.now.text}</li>
            </div>
          );
        })}
      </>
    </div>
  );
};

export default IndexPage;
