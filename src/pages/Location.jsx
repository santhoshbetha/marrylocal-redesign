import { useState, useRef, useEffect } from 'react';
import { X, MapPin, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { coords } from '../lib/defaultcoords';
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import { useAuth } from '../context/AuthContext';
import { updateUserInfo } from '../services/userService';
import dayjs from 'dayjs';
import 'leaflet/dist/leaflet.css';

function isObjEmpty(val) {
  return val == null ||
    val.length <= 0 ||
    (Object.keys(val).length === 0 && val.constructor === Object)
    ? true
    : false;
}

const getcoords = city => {
  for (var i = 0; i < coords.length; i++) {
    if (coords[i].city == city) {
      return coords[i].coords;
    }
  }
};

const delay = ms => new Promise(res => setTimeout(res, ms));

var deg2rad = function (value) {
  return value * 0.017453292519943295;
};

function haversine(latIn1, lonIn1, latIn2, lonIn2) {
  // Retuns the great circle distance between two coordinate points in miles
  var dLat = deg2rad(latIn2 - latIn1);
  var dLon = deg2rad(lonIn2 - lonIn1);
  var lat1 = deg2rad(latIn1);
  var lat2 = deg2rad(latIn2);

  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return 3960 * c;
}

var toKilometers = function (miles) {
  return Math.round(miles * 1.609344);
};

// https://medium.com/@timndichu/getting-started-with-leaflet-js-and-react-rendering-a-simple-map-ef9ee0498202
export function Location() {
  const { user, profiledata, setProfiledata } = useAuth();
  const mapRef = useRef(null);
  const latitude = profiledata?.latitude;
  const longitude = profiledata?.longitude;
  const center = {
    lat: profiledata?.latitude,
    lng: profiledata?.longitude,
  };
  const [coordinates, setCoordinates] = useState(center);
  const [markerPosition, setMarkerPosition] = useState(center);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [confirmClick, setConfirmClick] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allowCoordsChange, setAllowCoordsChange] = useState(false);
  const [showGeoConfirmDialog, setShowGeoConfirmDialog] = useState(false);
  const [resetCoordsConfirmClick, setResetCoordsConfirmClick] = useState(false);
  const [showResetConfirmDialog, setShowResetConfirmDialog] = useState(false);

  useEffect(() => {
    //setLatlng(getcoords(profiledata?.city))
    setCoordinates(getcoords(profiledata?.city));
    //setLatlngdefault(getcoords(profiledata?.city))
    const datenow = new Date(Date.now());
    let dif = Math.abs(datenow - new Date(profiledata?.dateofcoordinates));
    let dayssincecoordschange = Math.floor(dif / (1000 * 3600 * 24));
    if (dayssincecoordschange > 30) {
      //1 month
      setAllowCoordsChange(true);
    } else {
      setAllowCoordsChange(false);
    }
  }, [profiledata]);

  useEffect(() => {
    if (resetCoordsConfirmClick == true) {
      if (!isObjEmpty(profiledata?.dateofcoordinates)) {
        const datenow = new Date(Date.now());
        let dif = Math.abs(datenow - new Date(profiledata?.dateofcoordinates));
        let dayssincecoordschange = Math.floor(dif / (1000 * 3600 * 24));
        setLoading(true);
        if (dayssincecoordschange > 30) {
          //1 month
          delay(2000).then(async () => {
            await resetCoords([getcoords(profiledata?.city).lat, getcoords(profiledata?.city).lng]);
            setShowResetConfirmDialog(false);
            setResetCoordsConfirmClick(false);
            setLoading(false);
          });
        } else {
          alert('Error! Only one reset per month is allowed!!');
          setLoading(false);
          setShowResetConfirmDialog(false);
          setResetCoordsConfirmClick(false);
        }
      } else {
        console.log('profiledata location empty');
      }
    }
  }, [resetCoordsConfirmClick]);

  const saveGeoCodes = async coords => {
    let dateofcoordinates = new Date().toISOString().substring(0, 10).toString();
    let geodata = {
      latitude: coords[0],
      longitude: coords[1],
      defaultcoordsset: false,
      usercoordsset: true,
      dateofcoordinates: dateofcoordinates,
    };
    const res = await updateUserInfo(user?.id, geodata);
    if (res.success) {
      setProfiledata({ ...profiledata, ...geodata });
      alert('Coordinates Set Successful');
    } else {
      alert('Location Set Error, try again or contact us.');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (confirmClick == true) {
      setConfirmClick(false);
      setLoading(true);
      delay(2000).then(async () => {
        setShowGeoConfirmDialog(false);
        await saveGeoCodes([coordinates?.lat, coordinates?.lng]);
        //set location button
        //setLocationclass("btn btn-secondary disabled col-sm-11")
        //  setOvalclass("")
        setLoading(false);
      });
    }
  }, [confirmClick]);

  const resetCoords = async coords => {
    let geodata = {
      latitude: coords.lat,
      longitude: coords.lng,
      defaultcoordsset: true,
      usercoordsset: false,
    };
    const res = await updateUserInfo(user?.id, geodata);
    if (res.success) {
      setProfiledata({ ...profiledata, ...geodata });
      alert('Reset Coords Successful');
    } else {
      alert('Reset Coords Error, try again or contact us.');
    }
    setLoading(false);
  };

  function verifygeo(coordsIn) {
    for (var i = 0; i < coords.length; i++) {
      if (coords[i].city == profiledata?.city) {
        const distance = haversine(
          coordsIn.latitude,
          coordsIn.longitude,
          coords[i].coords.lat,
          coords[i].coords.lng,
        );
        if (toKilometers(distance) < 250) {
          return true;
        }
      }
    }
    return false;
  }

  function successCallback(pos) {
    var coords = pos.coords;
    if (!verifygeo(coords)) {
      const newCoords = {
        lat: coords?.latitude,
        lng: coords?.longitude,
      };
      setMarkerPosition(newCoords);
      setCoordinates(newCoords);
      setIsGettingLocation(false);
      setShowGeoConfirmDialog(true);
    } else {
      alert('GEO ERROR, CO-ORDINATES ARE FAR FROM YOUR CITY. TRY AGAIN');
    }
  }

  function errorsCallback(error) {
    console.warn(`ERROR(${error.code}): ${error.message}`);
  }

  var options = {
    enableHighAccuracy: true,
    timeout: 27000,
    maximumAge: 0,
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.permissions.query({ name: 'geolocation' }).then(function (result) {
        if (result.state === 'granted') {
          //If granted then you can directly call your function here
          navigator.geolocation.getCurrentPosition(successCallback);
        } else if (result.state === 'prompt') {
          navigator.geolocation.getCurrentPosition(successCallback, errorsCallback, options);
        } else if (result.state === 'denied') {
          //If denied then you have to show instructions to enable location
        }
        result.onchange = function () {
          //console.log(result.state);
        };
      });
    } else {
      alert('Location not available!');
    }
  };

  const handleSetCoordinates = () => {
    setCoordinates(markerPosition);
    alert(
      `Coordinates set to: ${markerPosition?.lat?.toFixed(4)}, ${markerPosition?.lng?.toFixed(4)}`,
    );
  };

  function LocationMarker({ pos, onMove }) {
    return (
      <Marker
        position={pos}
        draggable
        autoPan
        eventHandlers={{
          moveend: event => {
            onMove([event.target.getLatLng().lat, event.target.getLatLng().lng]);
            setMarkerPosition({
              lat: event.target.getLatLng().lat,
              lng: event.target.getLatLng().lng,
            });
          },
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Card className="rounded-none">
        {loading && (
          <Spinner className="absolute top-[50%] left-[50%] z-50 cursor-pointer size-10" />
        )}
        <div className="sticky top-0 bg-card border-b border-border/50 px-6 py-1 flex items-center justify-between z-10">
          <div className="">
            {profiledata?.defaultcoordsset == false ? (
              <h2 className="text-2xl font-bold text-foreground">Change GPS Co-ordinates</h2>
            ) : (
              <h2 className="text-2xl font-bold text-foreground">Set GPS Co-ordinates</h2>
            )}
            <div className="text-sm text-muted-foreground mt-1">
              Use this on computer or large screen for accuracy
            </div>
          </div>
        </div>

        <Separator />

        <div className="px-6 space-y-2">
          {!isObjEmpty(profiledata?.usercoordsset) && profiledata?.usercoordsset == true && (
            <>
              <div className="" role="">
                Your co-ordinates is set to
                <span className="text-orange-600 mx-2">
                  ({profiledata?.latitude}, {profiledata?.longitude})
                </span>
                .
                <div>
                  You may reset using button below or email us the co-ordinates.
                  <Button
                    className="mt-0 opacity-75"
                    data-toggle="tooltip"
                    title="Reset coordinates"
                    onClick={e => {
                      setShowResetConfirmDialog(true);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="white"
                      viewBox="0 0 512 512"
                    >
                      <path d="M105.1 202.6c7.7-21.8 20.2-42.3 37.8-59.8c62.5-62.5 163.8-62.5 226.3 0L386.3 160H336c-17.7 0-32 14.3-32 32s14.3 32 32 32H463.5c0 0 0 0 0 0h.4c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32s-32 14.3-32 32v51.2L414.4 97.6c-87.5-87.5-229.3-87.5-316.8 0C73.2 122 55.6 150.7 44.8 181.4c-5.9 16.7 2.9 34.9 19.5 40.8s34.9-2.9 40.8-19.5zM39 289.3c-5 1.5-9.8 4.2-13.7 8.2c-4 4-6.7 8.8-8.1 14c-.3 1.2-.6 2.5-.8 3.8c-.3 1.7-.4 3.4-.4 5.1V448c0 17.7 14.3 32 32 32s32-14.3 32-32V396.9l17.6 17.5 0 0c87.5 87.4 229.3 87.4 316.7 0c24.4-24.4 42.1-53.1 52.9-83.7c5.9-16.7-2.9-34.9-19.5-40.8s-34.9 2.9-40.8 19.5c-7.7 21.8-20.2 42.3-37.8 59.8c-62.5 62.5-163.8 62.5-226.3 0l-.1-.1L125.6 352H176c17.7 0 32-14.3 32-32s-14.3-32-32-32H48.4c-1.6 0-3.2 .1-4.8 .3s-3.1 .5-4.6 1z" />
                    </svg>
                    <span className="text-white ms-1 d-none d-sm-block">Reset</span>
                  </Button>
                </div>
              </div>
              <Separator className="my-4" />
            </>
          )}

          {!isObjEmpty(profiledata?.defaultcoordsset) && profiledata?.defaultcoordsset == true && (
            <div className="text-sm text-blue-900 dark:text-blue-100">
              Default co-ordinates are set. Change it through map below or email us the
              co-ordinates.
            </div>
          )}

          {!isObjEmpty(profiledata?.usercoordsset) && profiledata?.usercoordsset == false && (
            <Button
              onClick={getCurrentLocation}
              disabled={isGettingLocation}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-4 shadow-md hover:shadow-lg transition-all"
            >
              <Navigation className="w-4 h-4 mr-2" />
              {isGettingLocation ? 'Getting Location...' : 'GET MY COORDINATES AND SET'}
            </Button>
          )}

          {!isObjEmpty(profiledata?.usercoordsset) && profiledata?.usercoordsset == false && (
            <>
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-border"></div>
                  <span className="text-sm text-muted-foreground font-medium">OR</span>
                  <div className="flex-1 h-px bg-border"></div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <div className="text-sm font-medium text-foreground">
                    Mark your exact location on below map and then click below "Save Coordinates"
                    button
                  </div>
                  <Button
                    hidden
                    onClick={handleSetCoordinates}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 shadow-md hover:shadow-lg transition-all"
                  >
                    CLICK TO SET
                  </Button>
                </div>

                <div className="flex items-center gap-2 justify-center py-2">
                  <MapPin className="w-5 h-5 text-destructive" />
                  <span className="text-sm font-medium text-muted-foreground">Co-ordinates:</span>
                  <span className="text-base font-bold text-destructive">
                    ({markerPosition?.lat?.toFixed(4)}, {markerPosition?.lng?.toFixed(4)})
                  </span>
                </div>
              </div>

              <div className="relative rounded-xl overflow-hidden border border-border shadow-lg z-10">
                <div id="coordinates-map1" className="w-[450px] h-[530px] bg-muted">
                  <MapContainer
                    center={[coordinates?.lat, coordinates?.lng]}
                    zoom={14}
                    ref={mapRef}
                    style={{ height: '100vh', width: '100vw' }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker onMove={setCoordinates} pos={coordinates} />
                  </MapContainer>
                </div>

                <button
                  onClick={() => {
                    const mapElement = document.getElementById('coordinates-map1');
                    if (mapElement) {
                      if (document.fullscreenElement) {
                        document.exitFullscreen();
                      } else {
                        mapElement.requestFullscreen();
                      }
                    }
                  }}
                  className="absolute top-4 right-4 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md hover:shadow-lg transition-all z-[1000]"
                  aria-label="Toggle fullscreen"
                >
                  <svg
                    className="w-5 h-5 text-gray-700 dark:text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button
                  // onClick={() => {
                  //     handleSetCoordinates()
                  // }}
                  onClick={() => setShowGeoConfirmDialog(true)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 font-semibold shadow-md hover:shadow-lg transition-all"
                >
                  Save Coordinates
                </Button>
              </div>
            </>
          )}
        </div>
        <Dialog open={showResetConfirmDialog} onOpenChange={setShowResetConfirmDialog}>
          <DialogContent className="">
            {loading && (
              <Spinner className="absolute top-[40%] left-[50%] z-50 cursor-pointer size-10" />
            )}
            <DialogHeader>
              {allowCoordsChange ? (
                <DialogTitle>Press confirm to reset co-ordinates.</DialogTitle>
              ) : (
                <DialogTitle></DialogTitle>
              )}
              <DialogDescription>
                <span className="text-lg font-semibold mb-3">
                  Only one reset per month is allowed.
                </span>
                {allowCoordsChange ? (
                  <></>
                ) : (
                  <>
                    Your last change was on
                    <span className="ms-1 text-red-600">
                      {dayjs(profiledata?.dateofcoordinates).format('MMM D, YYYY')}
                    </span>
                    .
                  </>
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              {allowCoordsChange ? (
                <>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button
                    onClick={() => {
                      setResetCoordsConfirmClick(true);
                    }}
                    //type="submit"
                  >
                    Confirm
                  </Button>
                </>
              ) : (
                <></>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={showGeoConfirmDialog} onOpenChange={setShowGeoConfirmDialog}>
          <DialogContent className="">
            {loading && (
              <Spinner className="absolute top-[40%] left-[50%] z-50 cursor-pointer size-10" />
            )}
            {allowCoordsChange ? (
              <>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    Your location co-ordinates will be set to
                    <span className="ms-1 text-green-700">
                      ({markerPosition?.lat?.toFixed(4)}, {markerPosition?.lng?.toFixed(4)})
                    </span>
                    . Press to confirm.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button
                    onClick={() => setConfirmClick(true)}
                    //type="submit"
                  >
                    Confirm
                  </Button>
                </DialogFooter>
              </>
            ) : (
              <>
                <DialogHeader>
                  <DialogTitle className="text-red-700">
                    Only one co-ordinates change is allowed per month.
                  </DialogTitle>
                  <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="text-md">
                  Your last change date: &nbsp;
                  <span className="text-green-700 font-bold">
                    {dayjs(profiledata?.dateofcoordinates).format('MMM D, YYYY')}
                  </span>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </Card>
    </div>
  );
}

/*
sm:w-[95%] md:w-4/5 max-w-7xlx shadow-2xl border-border/50 animate-in zoom-in-95 duration-200 me-4 rounded-none
style={{height: "100vh", width: "100vw"}}
*/
