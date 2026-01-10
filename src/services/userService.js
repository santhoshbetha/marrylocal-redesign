import supabase from '../lib/supabase.js';

export const getProfileData = async userid => {
  try {
    const { data, error } = await supabase.from('users').select().eq('userid', userid).single();
    if (error) {
      return {
        success: false,
        msg: error?.message,
      };
    }
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      msg: error.message,
    };
  }
};

export const updateUserInfo = async (userid, data) => {
  //console.log("updateUserInfo data::", data)
  try {
    const { error } = await supabase.from('users').update(data).eq('userid', userid);

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

export const getShortlist = async userid => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('shortlist')
      .eq('userid', userid)
      .single();
    if (error) {
      return {
        success: false,
        msg: error?.message,
      };
    }
    return {
      success: true,
      shortlist: data.shortlist,
    };
  } catch (error) {
    return {
      success: false,
      msg: error.message,
    };
  }
};

export const getShortlistData = async (userid) => {
  try {
    const res = await getShortlist(userid);

    if (!res.success) {
      return {
        success: false,
        msg: res.msg,
      };
    }

    if (res.success && res.shortlist == null) {
      return {
        success: true,
        msg: 'shortlist empty',
      };
    }

    if (res.success) {
      if (res.shortlist.length > 0) {
        const { data, error } = await supabase
          .from('users')
          .select('userid, shortid, firstname, age, images')
          .filter('shortid', 'in', `(${res.shortlist})`); // `(${shortlist})`

        if (error) {
          return {
            success: false,
            msg: error?.message,
          };
        }
        return {
          success: true,
          data: data,
        };
      } else {
        return {
          success: true,
          data: null,
        };
      }
    }
  } catch (error) {
    return {
      success: false,
      msg: error.message,
    };
  }
};

//https://github.com/orgs/supabase/discussions/2771
export const addToShortlist = async (userid, shortidtoadd) => {
  try {
    const { data: data0, error: error0 } = await supabase.rpc('get_shortlist_count', {
      userid: userid,
    });

    if (error0) {
      return {
        success: false,
        msg: error0?.message,
      };
    }

    //data is count
    if (data0 == 0) {
      const { data: data1, error: error1 } = await supabase
        .from('users')
        .update({ shortlist: [`${shortidtoadd}`] })
        .eq('userid', userid);

      if (error1) {
        return {
          success: false,
          msg: error1.message,
        };
      }
      return {
        success: true,
      };
    }
    if (data0 > 0) {
      const { data: data2, error: error2 } = await supabase.rpc('append_to_shortlist', {
        shortidtoadd: shortidtoadd,
        userid: userid,
      });

      if (error2) {
        return {
          success: false,
          msg: error2.message,
        };
      }
      return {
        success: true,
      };
    }
  } catch (error) {
    return {
      success: false,
      msg: error.message,
    };
  }
};

export const removeFromShortlist = async (userid, shortidtoremove) => {
  try {
    const { data, error } = await supabase.rpc('remove_from_shortlist', {
      userid: userid,
      shortidtoremove: shortidtoremove,
    });
    if (error) {
      return {
        success: false,
        msg: error?.message,
      };
    }
    return {
      success: true,
      data: {
        shortid: shortidtoremove,
      },
    };
  } catch (error) {
    return {
      success: false,
      msg: error.message,
    };
  }
};

export const getUserProfile = async shortid => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select(
        'userid, shortid, firstname, age, educationlevel, jobstatus, gender, \
                 city, state, language, religion, community, economicstatus,\
                 phonenumber, email, bio, images,\
                 showphone, showinstagram, showfacebook, showcommunity, \
                 facebook, instagram, \
                 aadharverified,\
                 passportverified, \
                 userstate',
      )
      .eq('shortid', shortid)
      .single();
    if (error) {
      return {
        success: false,
        msg: error?.message,
      };
    }
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      msg: error.message,
    };
  }
};

export const getReferralsData = async userid => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('referee_emails')
      .eq('userid', userid)
      .single();
    if (error) {
      return {
        success: false,
        msg: error?.message,
      };
    }
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      msg: error.message,
    };
  }
};
