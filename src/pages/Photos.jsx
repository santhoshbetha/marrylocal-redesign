import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  uploadImage,
  deleteImage,
} from '../services/imageService';
import { useAuth } from '../context/AuthContext';
import { SearchDataAndRecoveryContext } from '../context/SearchDataAndRecoveryContext';
import { updateUserInfo } from '../services/userService';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { ImageUploader } from '@/components/ImageUploader';
import { ImageLoader } from '@/components/ImageLoader';
import { Camera, ImageIcon, Upload, Plus, Grid3X3, X, Loader2 } from 'lucide-react';

const ID = 'e9657b2174cfd94d867005431c056ae9';
const SECRET = 'fb0d1c76b8cab0a6e196554419a72cd23b5129718d865213cc5a56bb9b30256d';
const BUCKET_NAME = 'localm';

const CDNURL = 'https://gweikvxgqoptvyqiljhp.supabase.co/storage/v1/object/public/localm/images';

const IMAGE_NAMES = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'];

function isObjEmpty(val) {
  return val == null ||
    val.length <= 0 ||
    (Object.keys(val).length === 0 && val.constructor === Object)
    ? true
    : false;
}

function Photos() {
  const { user, profiledata, setProfiledata } = useAuth();
  const [images, setImages] = useState(Array(10).fill(null));
  const [visibleSlots, setVisibleSlots] = useState(() => {
    const stored = localStorage.getItem('visibleSlots');
    return stored ? parseInt(stored, 10) : 3;
  }); // Start with 3 slots or from localStorage
  const [uploadingSlots, setUploadingSlots] = useState(Array(10).fill(false)); // Track uploading state for each slot
  const [removingSlots, setRemovingSlots] = useState(Array(10).fill(false)); // Track removing state for each slot
  const [removingEmptySlots, setRemovingEmptySlots] = useState(Array(10).fill(false)); // Track removing empty slots state
  const isOnline = useOnlineStatus();
  const [reload, setReload] = useState(false);

  const shortid = profiledata?.shortid;

  useEffect(() => {
    const loadImages = async () => {
      if (!isObjEmpty(profiledata?.images)) {
        const newImages = Array(10).fill(null);
        let maxIndexWithImage = -1;

        profiledata.images.forEach((imageName, index) => {
          if (imageName && index < 10) {
            newImages[index] = { uri: `${CDNURL}/${shortid}/${imageName}` };
            maxIndexWithImage = Math.max(maxIndexWithImage, index);
          }
        });

        setImages(newImages);

        // Calculate required slots based on images
        const requiredSlots = Math.max(3, maxIndexWithImage + 1);

        // If visibleSlots is less than required, update it
        if (visibleSlots < requiredSlots) {
          const newVisibleSlots = requiredSlots;
          setVisibleSlots(newVisibleSlots);
          localStorage.setItem('visibleSlots', newVisibleSlots.toString());
        }

        setReload(false);
      } else {
        // No images, ensure minimum 3 slots
        if (visibleSlots < 3) {
          setVisibleSlots(3);
          localStorage.setItem('visibleSlots', '3');
        }
      }
    };

    loadImages();
  }, [isOnline, user, reload, profiledata?.images, shortid]);

  const handleImageCropped = async (blob, imageIndex) => {
    // Set uploading state
    setUploadingSlots(prev => {
      const newState = [...prev];
      newState[imageIndex] = true;
      return newState;
    });

    const timestamp = Date.now();
    const imageName = IMAGE_NAMES[imageIndex];
    const imageId = imageIndex + 1;

    console.log('uploadImage timestamp::', timestamp);

    // Create a file from the blob
    const file = new File([blob], 'cropped-image.jpg', { type: 'image/jpeg' });

    // Upload to server
    const res = await uploadImage(shortid, file, imageId, timestamp);
    console.log('uploadImage res::', res);

    let imagesObj = profiledata?.images ? [...profiledata.images] : [];

    // Ensure array has enough slots
    while (imagesObj.length < imageIndex + 1) {
      imagesObj.push('');
    }

    // Update the specific image slot
    imagesObj[imageIndex] = `${imageName}?t=${timestamp}`;

    // If uploading to a slot beyond current visibleSlots, increase visibleSlots
    let newVisibleSlots = visibleSlots;
    if (imageIndex >= visibleSlots) {
      newVisibleSlots = Math.min(imageIndex + 1, 10);
      setVisibleSlots(newVisibleSlots);
      localStorage.setItem('visibleSlots', newVisibleSlots.toString());
    }

    const updateData = { images: imagesObj };

    const res2 = await updateUserInfo(user?.id, updateData);

    if (res2.success) {
      setProfiledata({
        ...profiledata,
        images: imagesObj,
      });

      // Update local state
      const newImages = [...images];
      newImages[imageIndex] = { uri: `${CDNURL}/${shortid}/${imagesObj[imageIndex]}` };
      setImages(newImages);
      if (newVisibleSlots !== visibleSlots) {
        setVisibleSlots(newVisibleSlots);
      }
    } else {
      alert('Upload Image Error.. try again later');
    }

    // Clear uploading state
    setUploadingSlots(prev => {
      const newState = [...prev];
      newState[imageIndex] = false;
      return newState;
    });
  };

  const handleImageRemove = async (imageIndex) => {
    // Set removing state
    setRemovingSlots(prev => {
      const newState = [...prev];
      newState[imageIndex] = true;
      return newState;
    });

    const imageId = imageIndex + 1;
    const res = await deleteImage(shortid, imageId);
    console.log(`handleImageRemove${imageIndex + 1} res::`, res);

    let imagesObj = profiledata?.images ? [...profiledata.images] : [];

    if (!isObjEmpty(imagesObj) && imagesObj[imageIndex]) {
      imagesObj[imageIndex] = '';
      const res = await updateUserInfo(user?.id, { images: imagesObj });
      if (res.success) {
        setProfiledata({ ...profiledata, images: imagesObj });

        // Update local state
        const newImages = [...images];
        newImages[imageIndex] = null;
        setImages(newImages);
      }
    }

    // Clear removing state
    setRemovingSlots(prev => {
      const newState = [...prev];
      newState[imageIndex] = false;
      return newState;
    });
  };

  const handleAddMoreSlots = async () => {
    // Add 1 more slot, but don't exceed 10 total
    const newVisibleSlots = Math.min(visibleSlots + 1, 10);
    setVisibleSlots(newVisibleSlots);
    localStorage.setItem('visibleSlots', newVisibleSlots.toString());
  };

  const handleRemoveEmptySlot = async (slotIndex) => {
    // Set removing empty slot state
    setRemovingEmptySlots(prev => {
      const newState = [...prev];
      newState[slotIndex] = true;
      return newState;
    });

    // Remove the specific empty slot by shifting subsequent slots left
    let imagesObj = profiledata?.images ? [...profiledata.images] : [];

    // Shift images left from slotIndex onwards
    for (let i = slotIndex; i < 9; i++) {
      imagesObj[i] = imagesObj[i + 1] || '';
    }
    imagesObj[9] = ''; // Ensure the last slot is empty

    // Calculate new visibleSlots - minimum 3, or up to the last non-empty slot + 1
    let newVisibleSlots = 3;
    for (let i = 0; i < 10; i++) {
      if (imagesObj[i]) {
        newVisibleSlots = Math.max(newVisibleSlots, i + 1);
      }
    }
    newVisibleSlots = Math.min(newVisibleSlots, 10);

    const updateData = { images: imagesObj };

    const res = await updateUserInfo(user?.id, updateData);
    if (res.success) {
      setProfiledata({ ...profiledata, images: imagesObj });

      // Update local images state
      const newImages = Array(10).fill(null);
      for (let i = 0; i < 10; i++) {
        if (imagesObj[i]) {
          newImages[i] = { uri: `${CDNURL}/${shortid}/${imagesObj[i]}` };
        }
      }
      setImages(newImages);
      setVisibleSlots(newVisibleSlots);
      localStorage.setItem('visibleSlots', newVisibleSlots.toString());
    } else {
      alert(`Failed to remove empty slot: ${res.msg || 'Unknown error'}. Please try again.`);
    }

    // Clear removing empty slot state
    setRemovingEmptySlots(prev => {
      const newState = [...prev];
      newState[slotIndex] = false;
      return newState;
    });
  };

  const getDisplayedSlots = () => {
    // Always show exactly visibleSlots number of slots
    return visibleSlots;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <Card className="w-full shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center py-4">
            <div className="flex items-center justify-center mb-2">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                <Camera className="h-6 w-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Your Photo Gallery
            </CardTitle>
            <p className="text-gray-600 text-sm mt-1">
              Upload up to 10 photos to showcase your personality and lifestyle
            </p>
          </CardHeader>

          <CardContent className="pt-4">
            {/* Photo Stats */}
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-4 bg-white rounded-lg px-4 py-2 shadow-md border border-gray-100">
                <div className="flex items-center space-x-2">
                  <ImageIcon className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium text-gray-700">
                    {images.filter(img => img !== null).length} of 10 photos uploaded
                  </span>
                </div>
                <div className="w-px h-4 bg-gray-300"></div>
                <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200 text-xs">
                  {visibleSlots} slots shown
                </Badge>
              </div>
            </div>

            {/* Photo Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 mb-6 place-items-center">
              {images.slice(0, getDisplayedSlots()).map((image, index) => (
                <div key={index} className="relative group w-full max-w-64 sm:max-w-48">
                  {/* Photo Number Badge */}
                  <div className="absolute -top-2 -left-2 z-10">
                    <Badge
                      variant={image ? "default" : "secondary"}
                      className={`text-xs font-bold ${
                        image
                          ? 'bg-green-500 hover:bg-green-600 text-white'
                          : 'bg-gray-400 text-white'
                      }`}
                    >
                      {index + 1}
                    </Badge>
                  </div>

                  {/* Image Container */}
                  <div className="aspect-square rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-gray-100 hover:border-blue-300 w-full">
                    {image ? (
                      <div className="w-full h-full relative">
                        <img
                          src={image.uri}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-full object-cover rounded-xl"
                        />
                        <Button
                          onClick={() => handleImageRemove(index)}
                          className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          variant="destructive"
                          size="sm"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        {removingSlots[index] && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl">
                            <Loader2 className="h-8 w-8 animate-spin text-white" />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center group-hover:from-blue-50 group-hover:to-purple-50 transition-all duration-300 rounded-xl overflow-hidden relative">
                        <ImageUploader
                          onImageCropped={(blob) => handleImageCropped(blob, index)}
                          setReload={setReload}
                          minimal={true}
                          className="w-full h-full"
                        />
                        {uploadingSlots[index] && (
                          <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                          </div>
                        )}
                        {removingEmptySlots[index] && (
                          <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl">
                            <Loader2 className="h-8 w-8 animate-spin text-red-500" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Remove Empty Slot Button */}
                  {!image && visibleSlots > 3 && (
                    <div className="absolute -top-2 -right-2 z-20">
                      <Button
                        onClick={() => handleRemoveEmptySlot(index)}
                        variant="destructive"
                        size="sm"
                        className="h-6 w-6 p-0 rounded-full bg-red-500 hover:bg-red-600 border-2 border-white shadow-lg"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add More Photos Button */}
            {visibleSlots < 10 && (
              <div className="flex justify-center mb-8">
                <Button
                  onClick={handleAddMoreSlots}
                  variant="outline"
                  size="lg"
                  className="bg-white hover:bg-blue-50 border-2 border-blue-200 hover:border-blue-300 text-blue-600 hover:text-blue-700 font-medium px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add New Photo Slot
                  <Grid3X3 className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}

            {/* Tips Section */}
            <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Camera className="h-5 w-5 mr-2 text-blue-500" />
                Photo Tips
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Use clear, well-lit photos for the best results</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Show your personality through various activities</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Keep photos appropriate and respectful</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Photos;
