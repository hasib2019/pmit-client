let banglaDay = {
  Saturday: 'শনিবার',
  Sunday: 'রবিবার',
  Monday: 'সোমবার',
  Tuesday: 'মঙ্গোলবার',
  Wednesday: 'বুধবার',
  Thursday: 'বৃহস্পতিবার',
  Friday: 'শুক্রবার',
};
const engToBangladay = (str) => {
  'str', str;
  for (let day in banglaDay) {
    if (str === day) {
      return banglaDay.day;
    }
  }
};
export default engToBangladay;
