import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAuthUser } from '../lib/api.js'

function useAuthUser() {
  const authUser= useQuery({
     queryKey:["authUser"],
 
     queryFn:getAuthUser    
   })

    return {isLoading:authUser.isLoading,
    authUser:authUser.data?.user}
};

export default useAuthUser