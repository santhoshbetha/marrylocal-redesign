# Search Users Edge Function

This Supabase Edge Function provides server-side pagination for user search functionality.

## Features

- **Server-side pagination**: Only fetches the requested page of results
- **Distance-based search**: Uses the existing `search_by_distance` RPC function
- **Filtering**: Supports all existing filters (religion, language, education, etc.)
- **Performance**: Much more efficient for large datasets

## Deployment

1. **Deploy the Edge Function:**
   ```bash
   supabase functions deploy search-users
   ```

2. **Test the function:**
   ```bash
   supabase functions invoke search-users --data '{
     "gender": "Male",
     "state": "Maharashtra",
     "lat": 19.0760,
     "lng": 72.8777,
     "searchdistance": 50000,
     "page": 1,
     "limit": 20
   }'
   ```

## API

### Request Body
```json
{
  "gender": "Male|Female",
  "state": "string",
  "jobstatus": true|false,
  "agefrom": number,
  "ageto": number,
  "lat": number,
  "lng": number,
  "searchdistance": number,
  "religion": "string" | null,
  "language": "string" | null,
  "educationlevel": "string" | null,
  "economicstatus": "string" | null,
  "community": "string" | null,
  "page": number (default: 1),
  "limit": number (default: 20)
}
```

### Response
```json
{
  "success": true,
  "data": [...], // Array of user objects
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalItems": 150,
    "totalPages": 8,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

## Fallback Behavior

The client-side code includes automatic fallback to the original client-side pagination if the Edge Function fails, ensuring backward compatibility.

## Performance Benefits

- **Reduced bandwidth**: Only transfers 20 users per request instead of potentially thousands
- **Faster response times**: Server-side filtering and pagination
- **Better scalability**: Handles large user databases efficiently
- **Reduced memory usage**: Client doesn't need to load all users at once