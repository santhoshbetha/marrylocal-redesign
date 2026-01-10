import { useRef, useState, useEffect, useContext } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  getImagesList,
  uploadImage,
  getImage,
  deleteImage,
  uploadFaceImage,
  getSupabaseFileUrl,
} from '../services/imageService';
import { useAuth } from '../context/AuthContext';
import { SearchDataAndRecoveryContext } from '../context/SearchDataAndRecoveryContext';
import { updateUserInfo } from '../services/userService';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { ImageUploader } from '@/components/ImageUploader';
import { ImageLoader } from '@/components/ImageLoader';

const ID = 'e9657b2174cfd94d867005431c056ae9';
const SECRET = 'fb0d1c76b8cab0a6e196554419a72cd23b5129718d865213cc5a56bb9b30256d';
const BUCKET_NAME = 'localm';

const CDNURL = 'https://gweikvxgqoptvyqiljhp.supabase.co/storage/v1/object/public/localm/images';

//https://www.sammeechward.com/uploading-images-express-and-react
//https://stackoverflow.com/questions/4109276/how-to-detect-input-type-file-change-for-the-same-file
//https://jsitor.com/XdnH239VS

function timeout(delay) {
  return new Promise(res => setTimeout(res, delay));
}

function isObjEmpty(val) {
  return val == null ||
    val.length <= 0 ||
    (Object.keys(val).length === 0 && val.constructor === Object)
    ? true
    : false;
}

export function Photos() {
  const { user, profiledata, setProfiledata } = useAuth();
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const isOnline = useOnlineStatus();
  const { imagesList, setImagesList } = useContext(SearchDataAndRecoveryContext);
  let [loadingImages, setLoadingImages] = useState(false);
  const [reload, setReload] = useState(false);

  const shortid = profiledata?.shortid;

  useEffect(() => {
    const loadImages = async () => {
      if (!isObjEmpty(profiledata?.images)) {
        if (!isObjEmpty(profiledata?.images[0])) {
          setImage1({ uri: `${CDNURL}/${shortid}/${profiledata?.images[0]}` });
        } else {
          setImage1(null);
        }
        if (!isObjEmpty(profiledata?.images[1])) {
          setImage2({ uri: `${CDNURL}/${shortid}/${profiledata?.images[1]}` });
        } else {
          setImage2(null);
        }
        if (!isObjEmpty(profiledata?.images[2])) {
          setImage3({ uri: `${CDNURL}/${shortid}/${profiledata?.images[2]}` });
        } else {
          setImage3(null);
        }
        setReload(false);

        timeout(1000).then(() => {
          setLoadingImages(false);
        });
      }
    };

    setLoadingImages(true);
    loadImages();
  }, [isOnline, user, reload]);

  const handleImageCropped1 = async blob => {
    const timestamp = Date.now();

    console.log('uploadImage timestamp::', timestamp);
    // Create a file from the blob
    const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });

    // Upload to server
    //const formData = new FormData();
    //formData.append("image", file);

    //san add start
    let imageid;
    imageid = 1;
    const res = await uploadImage(shortid, file, imageid, timestamp);

    console.log('uploadImage res::', res);

    //res.data.path
    //images/R2cZLfoAV/first

    //https://gweikvxgqoptvyqiljhp.supabase.co/storage/v1/object/public/localm/images/RxAvAip2b/first

    //res.data.fullPath
    //localm/images/R2cZLfoAV/first

    //${CDNURL}/${shortid}/

    let imagesObj;
    imagesObj = profiledata?.images;

    if (!isObjEmpty(imagesObj)) {
      let updated = false;
      imagesObj.forEach(function (element, index) {
        if (element.slice(0, 5) == 'first') {
          imagesObj[index] = `first?t=${timestamp}`;
          updated = true;
        }
      });
      if (!updated) {
        if (imagesObj[0] == '') {
          imagesObj[0] = `first?t=${timestamp}`;
        } else {
          imagesObj.push(`first?t=${timestamp}`);
        }
      }
    }

    const res2 = await updateUserInfo(user?.id, {
      images: isObjEmpty(imagesObj) ? [`first?t=${timestamp}`] : imagesObj,
    });

    if (res2.success) {
      setProfiledata({
        ...profiledata,
        images: isObjEmpty(imagesObj) ? [`first?t=${timestamp}`] : imagesObj,
      });
    } else {
      alert('Upload Image Error.. try again later');
    }
    //setReload(true)

    //san add end

    /*fetch("/api/upload", {
            method: "POST",
            body: formData,
        })
        .then((response) => response.json())
        .then((data) => console.log("Upload success:", data))
        .catch((error) => console.error("Upload error:", error));*/
  };

  const handleImageCropped2 = async blob => {
    const timestamp = Date.now();

    // Create a file from the blob
    const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });

    let imageid;
    imageid = 2;
    const res = await uploadImage(shortid, file, imageid, timestamp);

    let imagesObj;
    imagesObj = profiledata?.images;

    if (!isObjEmpty(imagesObj)) {
      let updated = false;
      imagesObj.forEach(function (element, index) {
        if (element.slice(0, 6) == 'second') {
          imagesObj[index] = `second?t=${timestamp}`;
          updated = true;
        }
      });
      if (!updated) {
        if (imagesObj[1] == '') {
          imagesObj[1] = `second?t=${timestamp}`;
        } else {
          imagesObj.push(`second?t=${timestamp}`);
        }
      }
    }

    const res2 = await updateUserInfo(user?.id, {
      images: isObjEmpty(imagesObj) ? [`second?t=${timestamp}`] : imagesObj,
    });

    if (res2.success) {
      setProfiledata({
        ...profiledata,
        images: isObjEmpty(imagesObj) ? [`second?t=${timestamp}`] : imagesObj,
      });
    } else {
      alert('Upload Image Error.. try again later');
    }
    setReload(true);
  };

  const handleImageCropped3 = async blob => {
    const timestamp = Date.now();

    // Create a file from the blob
    const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });

    let imageid;
    imageid = 3;
    const res = await uploadImage(shortid, file, imageid, timestamp);

    let imagesObj;
    imagesObj = profiledata?.images;

    if (!isObjEmpty(imagesObj)) {
      let updated = false;
      imagesObj.forEach(function (element, index) {
        if (element.slice(0, 5) == 'third') {
          imagesObj[index] = `third?t=${timestamp}`;
          updated = true;
        }
      });
      if (!updated) {
        if (imagesObj[2] == '') {
          imagesObj[2] = `third?t=${timestamp}`;
        } else {
          imagesObj.push(`third?t=${timestamp}`);
        }
      }
    }

    const res2 = await updateUserInfo(user?.id, {
      images: isObjEmpty(imagesObj) ? [`third?t=${timestamp}`] : imagesObj,
    });

    if (res2.success) {
      setProfiledata({
        ...profiledata,
        images: isObjEmpty(imagesObj) ? [`third?t=${timestamp}`] : imagesObj,
      });
    } else {
      alert('Upload Image Error.. try again later');
    }
    // setReload(true)
  };

  const handleImageRemove1 = async () => {
    const res = await deleteImage(shortid, 1);
    console.log('handleImageRemove1 res::', res);

    let imagesObj;
    let deleteset = false;
    imagesObj = profiledata?.images;

    if (!isObjEmpty(imagesObj)) {
      imagesObj.forEach(function (element, index) {
        if (element.slice(0, 5) == 'first') {
          imagesObj[index] = '';
          deleteset = true;
        }
      });
      if (deleteset) {
        const res = await updateUserInfo(user?.id, { images: imagesObj });
        if (res.success) {
          setProfiledata({ ...profiledata, images: imagesObj });
        }
      }
    }
    setImage1(null);
  };

  const handleImageRemove2 = async () => {
    const res = await deleteImage(shortid, 2);
    let imagesObj;
    let deleteset = false;
    imagesObj = profiledata?.images;

    if (!isObjEmpty(imagesObj)) {
      imagesObj.forEach(function (element, index) {
        if (element.slice(0, 6) == 'second') {
          imagesObj[index] = '';
          deleteset = true;
        }
      });
      if (deleteset) {
        const res = await updateUserInfo(user?.id, { images: imagesObj });
        if (res.success) {
          setProfiledata({ ...profiledata, images: imagesObj });
        }
      }
    }
    console.log('handleImageRemove2 res::', res);
    setImage2(null);
  };

  const handleImageRemove3 = async () => {
    const res = await deleteImage(shortid, 3);
    let imagesObj;
    imagesObj = profiledata?.images;
    let deleteset = false;

    if (!isObjEmpty(imagesObj)) {
      imagesObj.forEach(function (element, index) {
        if (element.slice(0, 5) == 'third') {
          imagesObj[index] = '';
          deleteset = true;
        }
      });
      if (deleteset) {
        const res = await updateUserInfo(user?.id, { images: imagesObj });
        if (res.success) {
          setProfiledata({ ...profiledata, images: imagesObj });
        }
      }
    }
    console.log('handleImageRemove3 res::', res);
    setImage3(null);
  };

  return (
    <div>
      <Card className="w-full shadow-md border-border/50 rounded-none">
        <CardHeader className="flex flex-row items-center justify-between md:mx-2 lg:mx-10">
          <CardTitle className="text-2xl">Photos</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center w-[100%]">
          <div className="">
            <form>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div>
                  {!isObjEmpty(image1) && (
                    <ImageLoader imgSrc={image1} onImageRemove={handleImageRemove1} />
                  )}
                  {isObjEmpty(image1) && (
                    <ImageUploader
                      onImageCropped={handleImageCropped1}
                      onImageRemove={handleImageRemove1}
                      setReload={setReload}
                    />
                  )}
                </div>
                <div>
                  {!isObjEmpty(image2) && (
                    <ImageLoader imgSrc={image2} onImageRemove={handleImageRemove2} />
                  )}
                  {isObjEmpty(image2) && (
                    <ImageUploader onImageCropped={handleImageCropped2} setReload={setReload} />
                  )}
                </div>
                <div>
                  {!isObjEmpty(image3) && (
                    <ImageLoader imgSrc={image3} onImageRemove={handleImageRemove3} />
                  )}
                  {isObjEmpty(image3) && (
                    <ImageUploader onImageCropped={handleImageCropped3} setReload={setReload} />
                  )}
                </div>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
