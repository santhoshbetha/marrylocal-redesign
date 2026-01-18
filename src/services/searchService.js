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

export const searchUsers = async (searchinput, signal, page = 1, limit = 20, profiledata = null) => {
  try {
    const gender = searchinput.gender;
    let state = searchinput.state;
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

    // Check if we should use Edge Function or RPC based on arounduserscount
    const useEdgeFunction = profiledata && profiledata.arounduserscount > 100;

    if (useEdgeFunction) {
      // Use Supabase Edge Function for server-side pagination when user count is high
      // Fetch 100 items at a time for better performance, but paginate client-side
      const serverLimit = 100;
      const serverPage = Math.ceil((page * limit) / serverLimit);

      const { data, error } = await supabase.functions.invoke('search-users', {
        body: {
          gender: searchinput.gender,
          state,
          jobstatus: searchinput?.jobstatus,
          agefrom: searchinput?.agefrom,
          ageto: searchinput?.ageto,
          lat,
          lng,
          searchdistance: searchinput?.searchdistance,
          religion: searchinput?.religion,
          language: searchinput?.language,
          educationlevel: searchinput?.educationlevel,
          economicstatus: searchinput?.economicstatus,
          community: community !== 'All' ? searchinput?.community : null,
          sortOrder: searchinput?.sortOrder,
          page: serverPage,
          limit: serverLimit,
        },
        signal,
      });

      if (error) {
        // Fallback to client-side pagination if Edge Function fails
        console.warn('Edge Function failed, falling back to client-side pagination:', error);
        return await searchUsersFallback(searchinput, signal, page, limit);
      }

      // Apply sorting to the full dataset before pagination
      let sortedData = [...data];
      if (searchinput?.sortOrder === 'login_time_desc') {
        sortedData.sort((a, b) => new Date(b.last_login || 0) - new Date(a.last_login || 0));
      } else if (searchinput?.sortOrder === 'age_asc') {
        sortedData.sort((a, b) => (a.age || 0) - (b.age || 0));
      } else if (searchinput?.sortOrder === 'age_desc') {
        sortedData.sort((a, b) => (b.age || 0) - (a.age || 0));
      }

      // Calculate pagination indices for client-side pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      // Extract the current page's data from the sorted dataset
      const paginatedData = sortedData.slice(startIndex, endIndex);

      // Adjust pagination metadata for client-side pagination
      const totalItems = data?.pagination?.totalItems || 0;
      const totalPages = Math.ceil(totalItems / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      return {
        success: true,
        data: paginatedData,
        pagination: {
          page,
          limit,
          totalItems,
          totalPages,
          hasNextPage,
          hasPrevPage,
        },
      };
    } else {
      // Use RPC call directly for smaller datasets
      return await searchUsersFallback(searchinput, signal, page, limit);
    }
  } catch (error) {
    // Fallback to client-side pagination on any error
    console.warn('Search error, falling back to client-side pagination:', error);
    return await searchUsersFallback(searchinput, signal, page, limit);
  }
};

const searchUsersFallback = async (searchinput, signal, page = 1, limit = 20) => {
  try {
    const gender = searchinput.gender;
    let state = searchinput.state;
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
    };

    const { data, error } = await supabase.rpc('search_by_distance', cols, { signal });

    if (error) {
      return {
        success: false,
        msg: error?.message,
      };
    }

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

    // Apply sorting
    if (searchinput?.sortOrder === 'login_time_desc') {
      filtereddata.sort((a, b) => new Date(b.last_login || 0) - new Date(a.last_login || 0));
    } else if (searchinput?.sortOrder === 'age_asc') {
      filtereddata.sort((a, b) => (a.age || 0) - (b.age || 0));
    } else if (searchinput?.sortOrder === 'age_desc') {
      filtereddata.sort((a, b) => (b.age || 0) - (a.age || 0));
    }

    const totalItems = filtereddata.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = filtereddata.slice(startIndex, endIndex);

    return {
      success: true,
      data: paginatedData,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
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
          .select('userid, shortid, firstname, gender, age, images, userstate')
          .textSearch('phonenumber', Number(searchtext))
          .single();
      } else {
        dataout = await supabase
          .from('users')
          .select('userid, shortid, firstname, gender, age, images, userstate')
          .textSearch('userid', searchtext)
          .single();
      }
    } else {
      console.log("search user by email", searchtext);
      dataout = await supabase
        .from('users')
        .select('userid, shortid, firstname, gender, age, images, userstate')
        .textSearch('email', searchtext.toLowerCase())
        .single();
      console.log("search user by email result", dataout);
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

