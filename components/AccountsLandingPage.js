/* eslint-disable @next/next/no-img-element */
/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2021/12/08 10:13:48
 * @modify date 2021-12-08 10:13:48
 * @desc [description]
 */
import { Box } from '@mui/material';
import TextField from '@mui/material/TextField';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const AccountsLandingPage = () => {
  const [baseUrl, setBaseUrl] = useState();
  useEffect(() => {
    setBaseUrl(`${window.location.hostname}`);
  }, []);
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100vh',
        background: '#E7F2FA',
      }}
    >
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          padding: '9px 16px',
          height: '60px',
          boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
          background: 'rgba(255,255,255,0.8)',
          alignItems: 'center',
        }}
      >
        <div style={{ height: '100%' }}>
          <img style={{ height: '100%' }} src="/myGov.png" alt="rdcd" />
        </div>
        <Link
          href={
            baseUrl === 'coop.rdcd.gov.bd' ? 'https://dashboard.rdcd.gov.bd/' : 'https://stage-dashboard.rdcd.gov.bd/'
          }
          passHref
        >
          <a
            href={
              baseUrl === 'coop.rdcd.gov.bd' ? 'https://dashboard.rdcd.gov.bd/' : 'https://stage-dashboard.rdcd.gov.bd/'
            }
            rel="noopener noreferrer"
          >
            <button
              style={{
                padding: '.3rem 1.5rem',
                border: '1px solid rgba(66,104,128,0.25 )',
                borderRadius: '.2rem',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '38px',
                background: 'transparent',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              ড্যাশবোর্ড লগইন
            </button>
          </a>
        </Link>
      </div>
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4rem' }}>
        <div
          style={{
            width: '100%',
            maxWidth: '450px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'white',
            borderRadius: '.5rem',
            padding: '50px',
            boxShadow: '4px 4px 30px -15px rgba(0,0,0,0.4)',
          }}
        >
          <div style={{ height: '58px', width: '58px', marginBottom: '24px' }}>
            <img style={{ maxWidth: '200px', width: '100%' }} src="/bd.png" alt="rdcd" />
          </div>
          <h2 style={{ fontSize: '21px', marginBottom: '24px' }}> অ্যাকাউন্ট ম্যানেজমেন্ট সিস্টেম </h2>
          {/* <div style={{ maxWidth: "480px", border: "1px solid gray", borderRadius: "4px", padding: "1rem", textAlign: "center", margin: "2rem 0" }}>
                        <p style={{ textAlign: "center" }}>সম্মানিত সকল ব্যাবহারকারিকে পোর্টালের লগইন বাটনে ক্লিক করে লগইন করার জন্য সবিনয় অনুরোধ করা যাচ্ছে</p>
                        <Link href="https://dashboard.rdcd.gov.bd/" passHref>
                            <a href="https://dashboard.rdcd.gov.bd/" rel="noopener noreferrer">
                                <button style={{ padding: ".3rem 1.5rem", border: "1px solid black", borderRadius: ".2rem", display: "flex", justifyContent: "center", alignItems: "center", margin: "1rem auto 0" }}>লগইন করতে এগিয়ে যান </button>
                            </a>
                        </Link>
                    </div> */}
          <div style={{ width: '100%', marginBottom: '22px' }}>
            <TextField label="ইউজার আইডি" id="outlined-size-small" size="small" fullWidth />
          </div>
          <div style={{ width: '100%', marginBottom: '8px' }}>
            <TextField label="পাসওয়ার্ড" id="outlined-size-small" size="small" fullWidth type="password" />
          </div>
          <div style={{ width: '100%', textAlign: 'right', marginBottom: '14px' }}>
            <a href="#" style={{ fontSize: '12px', cursor: 'pointer', color: '#555555' }}>
              পাসওয়ার্ড ভুলে গেছেন?
            </a>
          </div>
          <div style={{ width: '100%' }}>
            <button
              style={{
                width: '100%',
                cursor: 'pointer',
                padding: '9px',
                color: 'white',
                textAlign: 'center',
                fontSize: '16px',
                background: 'var(--color-primary)',
                borderRadius: '.3rem',
                border: '0',
              }}
            >
              লগইন করুন
            </button>
          </div>
        </div>
        {/* <div style={{maxWidth:"630px", width:"100%",display:"grid",gridTemplateRow:"2fr 2fr",gridTemplateColumns:"2fr 2fr",gridGap:"20px", background:"lightgreen", height:"100%"}}>
                    <div>
                        <img></img>
                    </div>
                    <div style={{width:"100%", background:"red"}}></div>
                    <div style={{width:"100%", background:"red"}}></div>
                    <div style={{width:"100%", background:"red"}}></div>
                </div> */}
        <div style={{ maxWidth: '530px', width: '100%', height: '100%' }}>
          <div>
            <img style={{ width: '100%', height: '100%' }} src="/loanWelcome.png" alt="rdcd" />
          </div>
        </div>
      </div>

      <div style={{ width: '100%' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '.5rem 1rem',
            background: 'var(--color-bg-topbar)',
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <b>কারিগরি সহযোগিতায় : আইআইটি জাহাঙ্গীরনগর বিশ্ববিদ্যালয়</b>
            {/* <img src="/main-logo.png" alt="Logo" width={130} height={25} /> */}
          </span>
        </Box>
      </div>
    </div>
  );
};

export default AccountsLandingPage;
