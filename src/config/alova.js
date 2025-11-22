import { createAlova } from 'alova';
import fetchAdapter from 'alova/fetch';
import ReactHook from 'alova/react';

const alovaInstance = createAlova({
  baseURL: 'http://localhost:3001',
  statesHook: ReactHook,
  requestAdapter: fetchAdapter(),
  responded: response => response.json()
});

export default alovaInstance;
