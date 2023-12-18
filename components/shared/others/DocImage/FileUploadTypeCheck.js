const fileCheck = (fileType) => {
  const spliting = fileType.split('/');
  let status = {
    type: '',
    showAble: '',
  };

  if (spliting[0] == 'application') {
    const appSplit = fileType.split('/');

    switch (appSplit[1]) {
      case 'x-msdownload':
        status.type = 'not supported';
        status.showAble = false;
        break;
      default:
        status.type = 'not showable';
        status.showAble = false;
    }
  } else {
    switch (spliting[0]) {
      case 'image':
        status.type = 'Supported';
        status.showAble = true;
        break;
      case 'video':
        status.type = 'not supported';
        status.showAble = false;
        break;
      case 'text':
        status.type = 'not supported';
        status.showAble = false;
        break;
      default:
        status.type = 'not showable';
        status.showAble = false;
    }
  }

  return status;
};

export default fileCheck;
