// // ********************************************** Developed by Md. Hasibuzzaman **********************************
// import React,{useState} from 'react'
// import { Radio, RadioGroup, Grid, TextField,FormControlLabel, FormControl } from "@mui/material";

// const SamityMemberOtherReg = () => {
//     const [samityInfo, setSamityInfo] = useState({});
//     ("samity Info", samityInfo);
//     const handleChange = (e) =>{
//         setSamityInfo({...samityInfo,
//             [e.target.name]: e.target.value,
//         })
//     }
//     return (
//         <>
//         <Grid container spacing={2.5}>
//             <Grid item md={4} xs={12}>
//                 <TextField
//                 fullWidth
//                 name="district"
//                 required
//                 select
//                 SelectProps={{ native: true }}
//                 value={samityInfo.district}
//                 onChange={handleChange}
//                 variant="outlined"
//                 size="small"
//                 sx={{ bgcolor: "#F1F1F1" }}
//                 >
//                 <option>- বিভাগ নির্বাচন করুন -</option>
//                 <option value={1}>- নির্বাচন করুন -</option>
//                 </TextField>
//             </Grid>
//             <Grid item md={4} xs={12}>
//                 <TextField
//                 fullWidth
//                 name="upazila"
//                 required
//                 select
//                 SelectProps={{ native: true }}
//                 value={samityInfo.upazila}
//                 onChange={handleChange}
//                 variant="outlined"
//                 size="small"
//                 sx={{ bgcolor: "#F1F1F1" }}
//                 >
//                 <option>- জেলা নির্বাচন করুন -</option>
//                 <option value={1}>- নির্বাচন করুন -</option>
//                 </TextField>
//             </Grid>
//             <Grid item md={4} xs={12}>
//                 <TextField
//                 fullWidth
//                 name="union"
//                 required
//                 select
//                 SelectProps={{ native: true }}
//                 value={samityInfo.union}
//                 onChange={handleChange}
//                 variant="outlined"
//                 size="small"
//                 sx={{ bgcolor: "#F1F1F1" }}
//                 >
//                 <option>- উপজেলা নির্বাচন করুন -</option>
//                 <option value={1}>- নির্বাচন করুন -</option>
//                 </TextField>
//             </Grid>
//             <Grid item md={4} xs={12}>
//                 <TextField
//                 fullWidth
//                 label="গ্রাম"
//                 name="village"
//                 onChange={handleChange}
//                 number
//                   value={samityInfo.village}
//                 variant="outlined"
//                 size="small"
//                 sx={{ backgroundColor: "#FFF" }}
//                 ></TextField>
//             </Grid>
//             <Grid item md={4} xs={12}>
//                 <TextField
//                 fullWidth
//                 label="ঠিকানা"
//                 name="address"
//                 onChange={handleChange}
//                 number
//                   value={samityInfo.address}
//                 variant="outlined"
//                 size="small"
//                 sx={{ backgroundColor: "#FFF" }}
//                 ></TextField>
//             </Grid>
//             <Grid item md={4} xs={12}>
//                 <TextField
//                 fullWidth
//                 label="প্রকল্পের নাম"
//                 name="projectname"
//                 onChange={handleChange}
//                 number
//                   value={samityInfo.projectname}
//                 variant="outlined"
//                 size="small"
//                 sx={{ backgroundColor: "#FFF" }}
//                 ></TextField>
//             </Grid>
//             <Grid item md={4} xs={12}>
//                 <TextField
//                 fullWidth
//                 label="সমিতির নাম"
//                 name="samityName"
//                 onChange={handleChange}
//                 number
//                 value={samityInfo.samityName}
//                 variant="outlined"
//                 size="small"
//                 sx={{ backgroundColor: "#FFF" }}
//                 ></TextField>
//             </Grid>
//             <Grid item md={4} xs={12}>
//                 <TextField
//                 fullWidth
//                 label="মিটিং এর দিন"
//                 name="meetingDate"
//                 onChange={handleChange}
//                 number
//                   value={samityInfo.meetingDate}
//                 variant="outlined"
//                 size="small"
//                 sx={{ backgroundColor: "#FFF" }}
//                 ></TextField>
//             </Grid>
//             <Grid item md={4} xs={12}>
//                 <TextField
//                 fullWidth
//                 label="মাঠ কর্মী*"
//                 name="fieldWorkers"
//                 onChange={handleChange}
//                 number
//                   value={samityInfo.fieldWorkers}
//                 variant="outlined"
//                 size="small"
//                 sx={{ backgroundColor: "#FFF" }}
//                 ></TextField>
//             </Grid>
//             <Grid item md={4} xs={12}>
//                 <TextField
//                 fullWidth
//                 label="সদস্যের সর্বনিম্ন বয়স*"
//                 name="memberAge"
//                 onChange={handleChange}
//                 number
//                   value={samityInfo.memberAge}
//                 variant="outlined"
//                 size="small"
//                 sx={{ backgroundColor: "#FFF" }}
//                 ></TextField>
//             </Grid>
//             <Grid item md={4} xs={12}>
//                 <TextField
//                 fullWidth
//                 label="সদস্যের সর্বোচ্চ বয়স*"
//                 name="memberMaxAge"
//                 onChange={handleChange}
//                 number
//                   value={samityInfo.memberMaxAge}
//                 variant="outlined"
//                 size="small"
//                 sx={{ backgroundColor: "#FFF" }}
//                 ></TextField>
//             </Grid>
//             <Grid item md={4} xs={12}>
//               <FormControl component="fieldset">
//                 <RadioGroup
//                   row
//                   aria-label="gender"
//                   name="radioValue"
//                   required
//                   value={samityInfo.age}
//                   onChange={handleChange}
//                 >
//                   <FormControlLabel
//                     value="m"
//                     control={<Radio style={{ backgroundColor: "#FFF" }} />}
//                     label="পুরুষ"
//                   />
//                   <FormControlLabel
//                     value="f"
//                     control={<Radio style={{ backgroundColor: "#FFF" }} />}
//                     label="মহিলা"
//                   />
//                   <FormControlLabel
//                     value="o"
//                     control={<Radio style={{ backgroundColor: "#FFF" }} />}
//                     label="অন্যান্য"
//                   />
//                 </RadioGroup>
//               </FormControl>
//             </Grid>
//             <Grid item md={4} xs={12}>
//                 <TextField
//                 fullWidth
//                 label="সবনিম্ন সদস্য*"
//                 name="memberMinAge"
//                 onChange={handleChange}
//                 number
//                   value={samityInfo.memberMinAge}
//                 variant="outlined"
//                 size="small"
//                 sx={{ backgroundColor: "#FFF" }}
//                 ></TextField>
//             </Grid>
//             <Grid item md={4} xs={12}>
//                 <TextField
//                 fullWidth
//                 label="সর্বোচ্চ সদস্য*"
//                 name="maxMember"
//                 onChange={handleChange}
//                 number
//                   value={samityInfo.maxMember}
//                 variant="outlined"
//                 size="small"
//                 sx={{ backgroundColor: "#FFF" }}
//                 ></TextField>
//             </Grid>
//             <Grid item md={4} xs={12}>
//                 <TextField
//                 fullWidth
//                 label="সদস্য ভর্তির ফি*"
//                 name="memberFee"
//                 onChange={handleChange}
//                 number
//                   value={samityInfo.memberFee}
//                 variant="outlined"
//                 size="small"
//                 sx={{ backgroundColor: "#FFF" }}
//                 ></TextField>
//             </Grid>
//             <Grid item md={4} xs={12}>
//                 <TextField
//                 fullWidth
//                 label="দলের সর্বনিম্ন সদস্য*"
//                 name="minMember"
//                 onChange={handleChange}
//                 number
//                   value={samityInfo.minMember}
//                 variant="outlined"
//                 size="small"
//                 sx={{ backgroundColor: "#FFF" }}
//                 ></TextField>
//             </Grid>
//             <Grid item md={4} xs={12}>
//                 <TextField
//                 fullWidth
//                 label="দলের সর্বোচ্চ সদস্য*"
//                 name="maxMeber"
//                 onChange={handleChange}
//                 number
//                   value={samityInfo.maxMeber}
//                 variant="outlined"
//                 size="small"
//                 sx={{ backgroundColor: "#FFF" }}
//                 ></TextField>
//             </Grid>

//             <Grid container item md={12} xs={12}>
//                 <Grid item md={4} xs={12}>
//                     <TextField
//                     fullWidth
//                     label="গুগল ম্যাপে সমিতির অবস্থান নির্বাচন করুনঃ *"
//                     name="location"
//                     onChange={handleChange}
//                     file
//                     value={samityInfo.location}
//                     variant="outlined"
//                     size="small"
//                     sx={{ backgroundColor: "#FFF" }}
//                     ></TextField>
//                 </Grid>

//             </Grid>
//         </Grid>
//         </>
//     )
// }

// export default SamityMemberOtherReg
