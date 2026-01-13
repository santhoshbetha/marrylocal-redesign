import supabase from '../lib/supabase';

//https://stackoverflow.com/questions/77724555/supabase-trigger-on-email-verification

export const checkIfUserExists = async (userdata, signal) => {
  try {
    const { data, error } = await supabase.rpc('check_if_user_exists', {
      email: userdata.email,
      phonenumber: userdata.phonenumber,
      aadharnumber: userdata.aadharnumber,
    }, { signal });

    if (error) {
      return {
        success: false,
        msg: error?.message,
      };
    } else {
      return {
        success: true,
        userExists: data, //data?.rows[0].exists
      };
    }
  } catch (error) {
    return {
      success: false,
      msg: error.message,
    };
  }
};

export const getPasswordRetryCount = async (email, signal) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('password_retry_count')
      .eq('email', email)
      .single(signal ? { signal } : {});

    if (error) {
      return {
        success: false,
        msg: error?.message,
      };
    }
    return {
      success: true,
      passwordretrycount: data.password_retry_count,
    };
  } catch (error) {
    return {
      success: false,
      msg: error.message,
    };
  }
};

export const updatePasswordRetryCount = async dataIn => {
  try {
    const { error } = await supabase
      .from('users')
      .update({ password_retry_count: dataIn.count })
      .eq('email', dataIn.email);

    if (error) {
      return {
        success: false,
        msg: error?.message,
      };
    }
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      msg: error.message,
    };
  }
};

export const getCityUsercount = async (dataIn, signal) => {
  try {
    const { data, error } = await supabase.rpc('get_city_usercount', {
      city: dataIn.city,
      gender: dataIn.gender,
    }, { signal });

    if (error) {
      return {
        success: false,
        msg: error?.message,
      };
    }
    return {
      success: true,
      userCount: data,
    };
  } catch (error) {
    return {
      success: false,
      msg: error.message,
    };
  }
};

export const getUsercountToday = async () => {
  const datetoday = new Date().toISOString().substring(0, 10).toString();
  try {
    const { data, error } = await supabase.rpc('get_usercount_today', {
      datetoday: datetoday,
    });

    if (error) {
      return {
        success: false,
        msg: error?.message,
      };
    }
    return {
      success: true,
      count: data,
    };
  } catch (error) {
    return {
      success: false,
      msg: error.message,
    };
  }
};

export const appendToRefereeEmails = async (dataIn, signal) => {
  try {
    const { data, error } = await supabase.rpc('append_to_referee_emails', {
      emailtoadd: dataIn.emailtoadd,
      referrer: dataIn.referrer_code,
    }, { signal });

    if (error) {
      return {
        success: false,
        msg: error?.message,
      };
    }
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      msg: error.message,
    };
  }
};

export const deleteUserAccount = async userid => {
  try {
    const { error } = await supabase
      .from('users')
      .update({ userstate: 'delete' })
      .eq('userid', userid);

    if (error) {
      return {
        success: false,
        msg: error?.message,
      };
    }
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      msg: error.message,
    };
  }
};
