import { supabase2 } from '../lib/supabase';

// https://www.youtube.com/watch?app=desktop&v=7JEzp21Zi-8

export const idVerify = async formData => {
  //TODO //NOT USED NOW
  try {
    const { data, error } = await supabase2.functions.invoke('ocr-id-verify', {
      //body: formData
      body: JSON.stringify({
        file: formData,
      }),
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
      msg: error.message,
    };
  }
};
