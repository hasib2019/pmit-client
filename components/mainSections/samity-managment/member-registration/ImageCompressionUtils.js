import imageCompression from 'browser-image-compression';
import { errorHandler } from 'service/errorHandler';
// import { largeTime } from './notificationTime'

export const ImageCompressor = async (event, threshold = 0.03) => {
  if (event.target.files[0]) {
    const imageFile = event.target.files[0];
    // ("imageFile", imageFile)
    // (`originalFile size ${imageFile.size / 1024 / 1024} MB`);
    const options = {
      maxSizeMB: threshold,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      let compressedFile = await imageCompression(imageFile, options);
      //   ("Result after compressed",compressedFile)
      // (`compressedFile size ${compressedFile.size / 1024} MB`);
      // var file = new File([compressedFile], 'name', {
      //   type: compressedFile.type,
      // });
      // ("File after convert--",file);

      let blobTobase = await imageCompression.getDataUrlFromFile(compressedFile);
      let base64Image = blobTobase.split(',')[1];
      //("Blob to Base", base64Image)
      // this.props.handleState("signature", base64Image);
      // this.props.handleState('signatureType', imageFile.type)
      return base64Image;
    } catch (error) {
      errorHandler(error)
      // NotificationManager.warning('Click to remove the message', 'The file given is not an image', largeTime);
    }
  }
};
