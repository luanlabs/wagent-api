import { ONE_MINUTES } from '../../constants/dates';
import orderStatusToExpired from './ordersStatusToExpired';

const checkExpiredTime = () => {
  setInterval(() => {
    orderStatusToExpired();
  }, ONE_MINUTES);
};

export default checkExpiredTime;
