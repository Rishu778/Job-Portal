import React, { useEffect } from 'react'
import axios from 'axios'
import { APPLICATION_API_END_POINT } from '../utils/constant.js'
import { useDispatch } from 'react-redux'
import { setAllAppliedJobs } from '../redux/jobSlice.js'

const useGetAppliedJob = () => {
    const dispatch = useDispatch();
   useEffect(()=>{
    const fetchAppliedJobs = async () => {
        try {
            const res = await axios.get(`${APPLICATION_API_END_POINT}/get`,{withCredentials: true});
            if(res.data.success){
                // console.log(res.data)
                dispatch(setAllAppliedJobs(res.data.application));
            }
        } catch (error) {
            console.log(error)
        }
    }
    fetchAppliedJobs();
   },[])
}

export default useGetAppliedJob;