import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Parse request body
    const {
      gender,
      state,
      jobstatus,
      agefrom,
      ageto,
      lat,
      lng,
      searchdistance,
      religion,
      language,
      educationlevel,
      economicstatus,
      community,
      sortOrder = 'login_time_desc',
      page = 1,
      limit = 20
    } = await req.json()

    // Calculate offset for pagination
    const offset = (page - 1) * limit

    // Use the same RPC function as the fallback for distance filtering
    const rpcParams = {
      gender: gender === 'Male' ? 'Female' : 'Male',
      state,
      jobstatus,
      agefrom,
      ageto,
      lat,
      long: lng,
      searchdistance,
    };

    const { data: rpcData, error: rpcError } = await supabaseClient.rpc('search_by_distance', rpcParams);

    if (rpcError) {
      throw rpcError;
    }

    // Apply additional filters that weren't handled by the RPC
    let filteredData = rpcData || [];

    if (religion && religion !== 'All') {
      filteredData = filteredData.filter(user => user.religion === religion);
    }
    if (language && language !== 'All') {
      filteredData = filteredData.filter(user => user.language === language);
    }
    if (educationlevel && educationlevel !== 'All') {
      filteredData = filteredData.filter(user => user.educationlevel === educationlevel);
    }
    if (economicstatus && economicstatus !== 'All') {
      filteredData = filteredData.filter(user => user.economicstatus === economicstatus);
    }
    if (community && community !== 'All') {
      filteredData = filteredData.filter(user => user.community === community);
    }

    // Apply sorting
    if (sortOrder === 'login_time_desc') {
      filteredData.sort((a, b) => new Date(b.last_login || 0) - new Date(a.last_login || 0));
    } else if (sortOrder === 'age_asc') {
      filteredData.sort((a, b) => (a.age || 0) - (b.age || 0));
    } else if (sortOrder === 'age_desc') {
      filteredData.sort((a, b) => (b.age || 0) - (a.age || 0));
    }

    // Apply pagination
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    return new Response(
      JSON.stringify({
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
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        msg: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})