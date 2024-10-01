import { TEN_SECONDS } from '../../constants/dates';
import ordersStatusToExpired from './ordersStatusToExpired';

const checkExpiredTime = () => {
  setInterval(() => {
    ordersStatusToExpired();
  }, TEN_SECONDS);
};

export default checkExpiredTime;
