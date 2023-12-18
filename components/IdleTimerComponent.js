/* eslint-disable no-unused-vars */
/**
 * @author Md Hasibuzzaman
 * @email hasib.9437.hu@gmail.com
 * @create date 2023-11-2 12:53:48
 * @modify date 2023-11-2 10:13:48
 * @desc [description]
 */
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useIdleTimer } from 'react-idle-timer';
import { tokenData } from 'service/common';
import { userService } from 'service/userService';
const timeout = 1810_000
const promptBeforeIdle = 60_000

export default function App() {
  const getTokenData = tokenData()
  const [state, setState] = useState('Active')
  const [remaining, setRemaining] = useState(timeout)
  const [open, setOpen] = useState(false)

  const onIdle = () => {
    setState('Idle')
    // setOpen(false)
  }

  const onActive = () => {
    setState('Active')
    setOpen(false)
  }

  const onPrompt = () => {
    setState('Prompted')
    setOpen(true)
  }

  const { getRemainingTime, activate } = useIdleTimer({
    onIdle,
    onActive,
    onPrompt,
    timeout,
    promptBeforeIdle,
    throttle: 500
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(Math.ceil((getRemainingTime()) / 1000))
    }, 500)

    return () => {
      clearInterval(interval)
    }
  })

  // const handleStillHere = () => {
  //   activate()
  // }

  // const handleClose = () => {
  //   setOpen(false);
  // };

  const logOut = () => {
    userService.logout(getTokenData);
  }

  // const timeTillPrompt = Math.max(remaining - promptBeforeIdle / 1000, 0)
  // const seconds = timeTillPrompt > 1 ? 'seconds' : 'second'

  return (
    <>
      {/* <h1>React Idle Timer</h1>
      <h2>Confirm Prompt</h2>
      <br />
      <p>Current State: {state}</p>
      {timeTillPrompt > 0 && (
        <p>
          {timeTillPrompt} {seconds} until prompt
        </p>
      )} */}
      <React.Fragment>
        <Dialog
          open={open}
          // onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"সেশন সময়সীমা সতর্কতা!"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              দয়া করে সক্রিয় থাকুন !  আপনার অনুপ্রয়োগের অবস্থানটি সংরক্ষণ করতে আপনার নির্দিষ্ট সময় রয়েছে। {remaining}{remaining == 0 && logOut()} সেকেন্ডের মধ্যে কোনো কাজ না করলে স্বয়ংক্রিয়ভাবে লগআউট হবে।
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button className='btn btn-delete' onClick={logOut}> লগআউট </Button>
            <Button className='btn btn-apply' onClick={onActive} autoFocus> সক্রিয় থাকুন </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </>
  )
}
