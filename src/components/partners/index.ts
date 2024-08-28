import { lazy } from 'react';

const Channels = lazy(
  () => import('./partners' /* webpackChunkName: "channels" */)
);

export default Channels;
