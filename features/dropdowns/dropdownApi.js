import axios from '../../service/AxiosInstance';
import { loanProject, officeName } from '../../url/ApiList';

export const getOfficeName = async () => {
  let officeNameData = await axios.get(officeName);
  return officeNameData.data.data;
};
export const getProjects = async () => {
  let loanProjects = await axios.get(loanProject);
  return loanProjects.data.data;
};
