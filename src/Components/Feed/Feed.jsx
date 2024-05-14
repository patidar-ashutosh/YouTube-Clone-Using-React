import React, { useEffect, useState } from 'react'
import './Feed.css';
import { Link } from 'react-router-dom';
import { API_KEY, value_converter } from '../../data';
import moment from 'moment';
import Spinner from '../Spinner/Spinner';

const Feed = ({category}) => {

    const [data, setData] = useState([]);
    const [videoCount, setVideoCount] = useState(20);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        const videoList_url = `https://youtube.googleapis.com/youtube/v3/videos?part=
        snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=${videoCount}&
        regionCode=US&videoCategoryId=${category}&key=${API_KEY}`;
        const response = await fetch(videoList_url);
        const data = await response.json();
        setData(data.items);
        setLoading(false);
    }

    useEffect(() => {
        fetchData();
    }, [category, videoCount])
    
    useEffect(()=>{
        window.scrollTo(0, 0);
    },[category])

    window.addEventListener("scroll", () => {
        let {scrollTop, clientHeight, scrollHeight} = document.documentElement;

        if(videoCount < 50){
            if((scrollTop + clientHeight + 1) >= scrollHeight){
                setVideoCount(videoCount+20);
            }
        }
    })

    return (
    <div>
        <div className='feed'>
            {
                data.map( (item, index) => {
                    return (
                        <Link key={index} to={`video/${item.snippet.categoryId}/${item.id}`} className='card'>
                            <img src={item.snippet.thumbnails.medium.url} alt='' />
                            <h2>{item.snippet.title}</h2>
                            <h3>{item.snippet.channelTitle}</h3>
                            <p>{value_converter(item.statistics.viewCount)} views &bull; {moment(item.snippet.publishedAt).fromNow()} </p>
                        </Link>
                    )
                })
            }
        </div>
        
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

export default Feed