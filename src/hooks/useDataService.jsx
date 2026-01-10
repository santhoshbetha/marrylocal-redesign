import { useQuery, useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import {
  getShortlistData,
  removeFromShortlist,
  addToShortlist,
  getUserProfile,
  getProfileData,
} from '../services/userService';

export const shortlistDataQueryKey = () => ['shortlistdata'];

function isObjEmpty(val) {
  return val == null ||
    val.length <= 0 ||
    (Object.keys(val).length === 0 && val.constructor === Object)
    ? true
    : false;
}

export function useGetProfileData(userid) {
  return useQuery({
    queryKey: ['profiledata'],
    queryFn: async () => {
      const response = await getProfileData(userid);
      return response.data || null;
    },
  });
}

export function useGetUserProfile(dataIn) {
  return useQuery({
    queryKey: ['userprofile', dataIn.shortid],
    queryFn: async () => {
      const response = await getUserProfile(dataIn.shortid);
      return response.data || null;
    },
  });
}

export function useShortlistData(dataIn) {
  console.log('useShortlistData...1::');
  return useQuery({
    queryKey: shortlistDataQueryKey(),
    queryFn: async () => {
      console.log('useShortlistData...2');
      if (!isObjEmpty(dataIn.userid)) {
        console.log('useShortlistData...3');
        const response = await getShortlistData(dataIn.userid, dataIn.shortlist);
        return response.data || null;
      } else {
        return null;
      }
    },
  });
}

export const useAddToShortlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async dataIn => {
      return addToShortlist(dataIn.userid, dataIn.shortid);
    },
    onSuccess: data => {
      //old is undefined because different tab (so no use)
      queryClient.setQueryData(['profiledata'], old => {
        return old;
      });
      queryClient.invalidateQueries({
        queryKey: ['profiledata'],
        type: 'inactive',
        refetchType: 'none',
      });
    },
    onError: (err, context) => {
      queryClient.invalidateQueries({ queryKey: ['profiledata'] });
      if (context?.prevData) {
        queryClient.setQueriesData({ queryKey: ['profiledata'], type: 'active' }, context.prevData);
        queryClient.invalidateQueries({
          queryKey: ['profiledata'],
        });
      }
    },
  });
};

export const useRemoveFromShortlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: dataIn => {
      return removeFromShortlist(dataIn.userid, dataIn.shortidtoremove);
    },
    onSuccess: data => {
      queryClient.setQueryData(['shortlistdata'], old => {
        if (old) {
          if (data.success == false) {
            return old;
          }
          if (Object.prototype.toString.call(old) == '[object Array]') {
            const newe = old.filter(eachuser => {
              if (eachuser.shortid == data.data.shortid) {
                return false;
              } else {
                return true;
              }
            });
            return newe;
          }
        }
      });
      queryClient.invalidateQueries({
        queryKey: shortlistDataQueryKey,
        type: 'inactive',
        refetchType: 'none',
      });
    },
    onError: (err, context) => {
      queryClient.invalidateQueries({ queryKey: shortlistDataQueryKey });
      //toast.error("Failed to upvote post");
      if (context?.prevData) {
        queryClient.setQueriesData(
          { queryKey: shortlistDataQueryKey, type: 'active' },
          context.prevData,
        );
        queryClient.invalidateQueries({
          queryKey: shortlistDataQueryKey,
        });
      }
    },
  });
};
