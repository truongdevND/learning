import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { message } from 'antd';
import AppRouter from './routers';

import './index.css';
import 'antd/dist/reset.css';
import useNotificationStore from './stores/useNotificationStore';

const Root = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const { setMessageApi } = useNotificationStore();

  useEffect(() => {
    setMessageApi(messageApi);
  }, [messageApi, setMessageApi]);

  return (
    <>
      {contextHolder}
      <AppRouter />
    </>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <Root />
  </StrictMode>
);