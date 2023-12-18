import axios from '../../service/AxiosInstance';
import {
  pendingTransactionApplicationRoute,
  rejectPendingApplicationRoute,
  vocuherPostingRoute,
} from '../../url/AccountsApiLIst';

export const getPendingApplications = async () => {
  'url', pendingTransactionApplicationRoute;
  try {
    const pApplications = await axios.get(pendingTransactionApplicationRoute);
    return pApplications.data;
  } catch (error) {
    'approvalError', error;
  }
};

export const approveVoucherPosting = async (data) => {
  const response = await axios.post(vocuherPostingRoute, { data });
  return response.data;
};
export const rejectPendingApplication = async (id) => {
  const response = await axios.put(rejectPendingApplicationRoute + id);
  return response.data;
};
