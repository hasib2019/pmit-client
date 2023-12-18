/* eslint-disable @next/next/no-img-element */
import { Typography } from '@mui/material';
import styles from 'styles/Home.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className={styles.footerLogo}>
          {/* <img src="/bd.png" alt="Logo" width={'25px'} height={'24px'} /> */}
          <span>Developed By Hasibuzzaman</span>
        </div>
        {/* <div style={{xs: "none"}}> */}
        <Typography sx={{ fontSize: '12px', color: '#7a7a7a', display: { xs: 'none', md: 'unset' } }}>
          {'কপিরাইট © ২০২২ সর্বস্বত্ব সংরক্ষিত গণপ্রজাতন্ত্রী বাংলাদেশ সরকার'}
        </Typography>
        {/* </div> */}
        <div style={{ height: '100%' }}>
          <Typography sx={{ marginRight: '1rem', maxWidth: { xs: '300px', sm: '300px' } }}>
            {/* <img src="/orangeEra.png" alt="Logo" width={'100%'} /> */}
            <span>কারিগরি সহযোগিতায় : আইআইটি জাহাঙ্গীরনগর বিশ্ববিদ্যালয়</span>
          </Typography>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
