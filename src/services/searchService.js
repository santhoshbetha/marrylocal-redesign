import supabase from '../lib/supabase';

function isEmpty(val) {
  return val === undefined || val == null || val.length <= 0 ? true : false;
}

function isNumber(n) {
  return !isNaN(parseFloat(n)) && !isNaN(n - 0);
}

const digits = (num, count = 0) => {
  if (num) {
    return digits(Math.floor(num / 10), ++count);
  }
  return count;
};

export const searchUsers = async (searchinput, signal) => {
  try {
    const gender = searchinput.gender;
    let state = searchinput.state; //search 'state' although 'city' is passed
    let lat = searchinput.lat;
    let lng = searchinput.lng;
    let community = 'All';

    const addons = searchinput.addons;

    if (!isEmpty(addons)) {
      if (searchinput.city != '') {
        if (searchinput.city == addons.location2.city2) {
          state = addons.location2.state2;
          lat = addons.location2.lat;
          lng = addons.location2.lng;
        } else if (searchinput.city == addons.location3.city3) {
          state = addons.location3.state3;
          lat = addons.location3.lat;
          lng = addons.location3.lng;
        }
      }

      if (addons.communitySearch == true) {
        community = searchinput.community;
      } else {
        community = 'All';
      }
    }

    var cols = {
      gender: gender == 'Male' ? 'Female' : 'Male',
      state: state,
      jobstatus: searchinput?.jobstatus,
      agefrom: searchinput?.agefrom,
      ageto: searchinput?.ageto,
      lat: lat,
      long: lng,
      searchdistance: searchinput?.searchdistance,
      //religion: searchinput?.religion,
      //language: searchinput?.language,
      //educationlevel: searchinput?.educationlevel,
      //economicstatus: searchinput?.economicstatus,
      //community: community,
    };

    const { data, error } = await supabase.rpc('search_by_distance', cols, { signal });

    let filtereddata = data
      .filter(eachuser => {
        if (searchinput?.religion == 'All') {
          return true;
        } else {
          return eachuser.religion == searchinput?.religion;
        }
      })
      .filter(eachuser => {
        if (searchinput?.language == 'All') {
          return true;
        } else {
          return eachuser.language == searchinput?.language;
        }
      })
      .filter(eachuser => {
        if (searchinput?.educationlevel == 'All') {
          return true;
        } else {
          return eachuser.educationlevel == searchinput?.educationlevel;
        }
      })
      .filter(eachuser => {
        if (searchinput?.economicstatus == 'All') {
          return true;
        } else {
          return eachuser.economicstatus == searchinput?.economicstatus;
        }
      })
      .filter(eachuser => {
        if (community == 'All') {
          return true;
        } else {
          return eachuser.community == searchinput?.community;
        }
      });

    if (error) {
      return {
        success: false,
        msg: error?.message,
      };
    }
    return {
      success: true,
      data: filtereddata,
    };
  } catch (error) {
    return {
      success: false,
      msg: error.message,
    };
  }
};

export const searchUser = async searchtext => {
  try {
    let dataout = {
      data: null,
      error: null,
    };

    if (isNumber(searchtext)) {
      if (digits(Number(searchtext)) == 10) {
        dataout = await supabase
          .from('users')
          .select('userid, shortid, firstname, gender, age, userstate')
          .textSearch('phonenumber', Number(searchtext))
          .single();
      } else {
        dataout = await supabase
          .from('users')
          .select('userid, shortid, firstname, gender, age, userstate')
          .textSearch('userid', searchtext)
          .single();
      }
    } else {
      dataout = await supabase
        .from('users')
        .select('userid, shortid, firstname, gender, age, userstate')
        .textSearch('email', searchtext.toLowerCase())
        .single();
    }

    if (dataout.error) {
      return {
        success: false,
        msg: dataout.error?.message,
      };
    }
    return {
      success: true,
      data: dataout.data,
    };
  } catch (error) {
    return {
      success: false,
      msg: error.message,
    };
  }
};
