import supabase from '../lib/supabase';
const supabaseUrl = 'https://gweikvxgqoptvyqiljhp.supabase.co';

const CDNURL = 'https://gweikvxgqoptvyqiljhp.supabase.co/storage/v1/object/public/localm/images/';

//https://github.com/supabase/storage/issues/266

export const getImagesList = async shortid => {
  try {
    const { data, error } = await supabase.storage.from('localm').list(`images/${shortid}`, {
      limit: 4,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' },
    });

    if (error) {
      return {
        success: false,
        msg: error?.message,
      };
    } else {
      return {
        success: true,
        data: data, //data?.rows[0].exists
      };
    }
  } catch (error) {
    return {
      success: false,
      msg: error?.message,
    };
  }
};

export const getSupabaseFileUrl = filePath => {
  if (filePath) {
    return {
      uri: `${supabaseUrl}/storage/v1/object/public/localm/images/${filePath}`,
    }; //supabase filePath
  }
  return null;
};

export const getImage = async (shortid, imagename) => {
  try {
    const { data, error } = await supabase.storage
      .from('localm')
      .list(`images/${shortid}/${imagename}`);

    //console.log('getImage imagename::', imagename);
    //console.log('getImage data:', data);
    //console.log('getImage error:', error);

    if (error) {
      return {
        success: false,
        msg: error?.message,
      };
    } else {
      return {
        success: true,
        data: getSupabaseFileUrl(`${shortid}/${imagename}`),
      };
    }
  } catch (error) {
    return {
      success: false,
      msg: error.message,
    };
  }
};

export const uploadImage = async (shortid, file, imageid, timestamp) => {
  let imagename;
  switch (imageid) {
    case 0:
      imagename = 'face.png';
      break;
    case 1:
      imagename = 'first';
      break;
    case 2:
      imagename = 'second';
      break;
    case 3:
      imagename = 'third';
      break;
    case 4:
      imagename = 'fourth';
      break;
    case 5:
      imagename = 'fifth';
      break;
    case 6:
      imagename = 'sixth';
      break;
    case 7:
      imagename = 'seventh';
      break;
    case 8:
      imagename = 'eighth';
      break;
    case 9:
      imagename = 'ninth';
      break;
    case 10:
      imagename = 'tenth';
      break;
    default:
      imagename = 'other';
      break;
  }
  try {
    const { data, error } = await supabase.storage
      .from('localm')
      .upload(`images/${shortid}/${imagename}` + `?t=${timestamp}`, file, {
        cacheControl: '300',
        upsert: true,
      }); //300 = 5 minutes

    if (error) {
      return {
        success: false,
        msg: error?.message,
      };
    } else {
      return {
        success: true,
        data: data,
      };
    }
  } catch (error) {
    return {
      success: false,
      msg: error.message,
    };
  }
};

export const uploadFaceImage = async (shortid, file) => {
  try {
    const { data, error } = await supabase.storage
      .from('localm')
      .upload(`images/${shortid}/face` + '/', file);
    if (error) {
      return {
        success: false,
        msg: error?.message,
      };
    } else {
      return {
        success: true,
        data: data,
      };
    }
  } catch (error) {
    return {
      success: false,
      msg: error.message,
    };
  }
};

export const deleteImage = async (shortid, imageid) => {
  let imagename;
  switch (imageid) {
    case 0:
      imagename = 'face.png';
      break;
    case 1:
      imagename = 'first';
      break;
    case 2:
      imagename = 'second';
      break;
    case 3:
      imagename = 'third';
      break;
    case 4:
      imagename = 'fourth';
      break;
    case 5:
      imagename = 'fifth';
      break;
    case 6:
      imagename = 'sixth';
      break;
    case 7:
      imagename = 'seventh';
      break;
    case 8:
      imagename = 'eighth';
      break;
    case 9:
      imagename = 'ninth';
      break;
    case 10:
      imagename = 'tenth';
      break;
    default:
      imagename = 'other';
      break;
  }

  try {
    const { data, error } = await supabase.storage
      .from('localm')
      .remove([`images/${shortid}/${imagename}`]);

    if (error) {
      return {
        success: false,
        msg: error?.message,
      };
    } else {
      return {
        success: true,
        data: data,
      };
    }
  } catch (error) {
    return {
      success: false,
      msg: error.message,
    };
  }
};
