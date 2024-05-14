import React, { useEffect, useState } from 'react'
import './Recommended.css';
import { API_KEY } from '../../data';
import { value_converter } from '../../data';
import { Link } from 'react-router-dom';
import Spinner from '../Spinner/Spinner';

const Recommended = ({categoryId}) => {

    const [apiData, setApiData] = useState([]);
    const [videoCount, setVideoCount] = useState(22);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        const relatedVideo_url = `https://youtube.googleapis.com/youtube/v3/videos?part=
        snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=${videoCount}&
        regionCode=US&videoCategoryId=${categoryId}&key=${API_KEY}`;
        const response = await fetch(relatedVideo_url);
        const data = await response.json();
        setApiData(data.items);
        setLoading(false);
    }

    useEffect(()=>{
        fetchData();
    },[videoCount])

    window.addEventListener("scroll", () => {
        let {scrollTop, clientHeight, scrollHeight} = document.documentElement;

        if(videoCount < 50){
            if((scrollTop + clientHeight + 1) >= scrollHeight){
                setVideoCount(videoCount+20);
            }
        }
    })

    return (
    <div className='recommended'>
        {
            apiData.map((item, index) => {
                return (
                <Link to={`/video/${item.snippet.categoryId}/${item.id}`} key={index} className='side-video-list'>
                    <img src={item.snippet.thumbnails.medium.url} alt='' />
                    <div className='vid-info'>
                        <h4>{item.snippet.title}</h4>
                        <p>{item.snippet.channelTitle}</p>
                        <p>{value_converter(item.statistics.viewCount)} Views</p>
                    </div>
                </Link>
                )
            })
        }

        {
            loading ? (
                <div className='spinner-container'>
                    {<Spinner />}
                </div>
            ) : ("")
        }
    </div>
    )
}

export default Recommended