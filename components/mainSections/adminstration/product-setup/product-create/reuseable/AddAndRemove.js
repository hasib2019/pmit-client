import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import { Button, Grid } from '@mui/material';
import React from 'react';
import ProductChargeReuseable from './ProductChargeReuseable';
import PscReuseable from './PscReuseable';

const AddAndRemove = ({ val }) => {
  //("The Props Value", val)
  // const [compIndex, setCompIndex] = useState(0);
  const [tempComponent, setTempComponent] = React.useState([
    [<PscReuseable key={0} />],
    [<ProductChargeReuseable key={0} />, 'two'],
  ]);

  const onAddData = () => {
    'The Props Value', val;
    let temp = [...tempComponent];
    let Comp = temp[val][0];
    temp[val].push(<Comp key={val + 1} />);
    // temp[val].forEach((el, ind)=>{
    //     temp[val].push(<Comp key={ind + 1}/>);
    // })

    //(temp[val][0].key)
    // temp[val].forEach((el,i)=>{
    //     temp[val][i].key = el.key + Math.ceil(Math.random() * 100)
    // })
    temp[val];
    // ("Temp", temp[val])
    // let findInd = temp.findIndex((element, index)=> val === index)
    // let filterComp = temp.filter((e,i)=> i === findInd)
    //filterComp.push("5")
    // temp[findInd].push(filterComp[0])
    // temp[val][0].key === val + 1
    // ("Hello",temp[val][0].key)
    //(temp[val][0].key =)

    // let sample = [{key:0},{key:1}]
    // sample.forEach((s,i)=>{
    //     sample[i].key = s.key + Math.ceil(Math.random() * 100);
    // })
    // (sample)
  };

  const onDeleteData = () => {
    let temp = [...tempComponent];
    temp.pop();
    setTempComponent(temp);
  };

  const returnJsx = (ui, ind) => {
    //("val and index", ind + 2, val)

    if (ind === val) {
      return <div>{ui}</div>;
    }
  };

  return (
    <>
      <Grid container>
        <Grid
          item
          xs={5}
          sm={5}
          md={6}
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            '& .MuiButton-root': {
              color: '#f4f4f4',
              backgroundColor: '#086e7d',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px',

              '&:hover': {
                backgroundColor: '#F14A16',
                color: '#F14A16',
                boxShadow: 'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px',
              },
            },
          }}
        >
          <Button onClick={onDeleteData} sx={{ marginBottom: '20px' }} size="large" className="btn btn-warning">
            <ClearIcon />
            মুছে ফেলুন
          </Button>
        </Grid>

        <Grid
          item
          xs={5}
          sm={5}
          md={6}
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            '& .MuiButton-root': {
              color: '#f4f4f4',
              backgroundColor: '#557c55',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              boxShadow: 'rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px',

              '&:hover': {
                backgroundColor: '#95CD41',
                color: '#95CD41',
                boxShadow: 'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px',
              },
            },
          }}
        >
          <Button
            sx={{ marginBottom: '20px' }}
            onClick={() => onAddData()}
            size="large"
            className="hvr-bounce-to-right"
          >
            <AddIcon />
            যোগ করুন
          </Button>
        </Grid>

        {tempComponent.map((v, i) => (
          <>{returnJsx(v, i)}</>
        ))}
      </Grid>
    </>
  );
};

export default AddAndRemove;
