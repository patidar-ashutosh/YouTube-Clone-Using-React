import React, { useEffect, useState } from 'react'
import './PlayVideo.css';
import like from '../../assets/like.png';
import dislike from '../../assets/dislike.png';
import share from '../../assets/share.png';
import save from '../../assets/save.png';
import { API_KEY, value_converter } from '../../data';
import moment from 'moment';
import { useParams } from 'react-router-dom';
import Spinner from '../Spinner/Spinner';

const PlayVideo = () => {

    const {videoId} = useParams();

    const [apiData, setApiData] = useState(null);
    const [channelData, setChannelData] = useState(null);
    const [commentData, setCommentData] = useState([]);
    const [readMore, setReadMore] = useState(false);
    const [commentCount, setCommentCount] = useState(20);
    const [loading, setLoading] = useState(false);
    
    const fetchVideoData = async () => {
        // Fetching Videos Data
        const videoDetails_url = `https://youtube.googleapis.com/youtube/v3/videos?part=
        snippet%2CcontentDetails%2Cstatistics&id=${videoId}&key=${API_KEY}`;
        const response = await fetch(videoDetails_url);
        const data = await response.json();
        setApiData(data.items[0]);
    }

    const fetchOtherData = async () => {
        // Fetching Channel Data
        const channelData_url = `https://youtube.googleapis.com/youtube/v3/channels?part=
        snippet%2CcontentDetails%2Cstatistics&id=${apiData.snippet.channelId}&key=${API_KEY}`;
        const response = await fetch(channelData_url);
        const data = await response.json();
        setChannelData(data.items[0]);

        setLoading(true);
        // Fetching Comment Data
        const comment_url = `https://youtube.googleapis.com/youtube/v3/commentThreads?part=
        snippet%2Creplies&maxResults=${commentCount}&videoId=${videoId}&key=${API_KEY}`;
        const res = await fetch(comment_url);
        const output = await res.json();
        setCommentData(output.items);
        setLoading(false);
    }

    useEffect(()=>{
        window.scrollTo(0, 0);
        setReadMore(false);
        fetchVideoData();
    }, [videoId])

    useEffect(()=>{
        fetchOtherData();
    },[apiData, commentCount])

    window.addEventListener("scroll", () => {
        let {scrollTop, clientHeight, scrollHeight} = document.documentElement;

        if(commentCount < 50){
            if((scrollTop + clientHeight + 1) >= scrollHeight){
                setCommentCount(commentCount+20);
            }
        }
    })

    return (
    <div className='play-video'>
        <iframe src={`https://www.youtube.com/embed/${videoId}?autoplay=1`} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        <h3>{apiData ? apiData.snippet.title : "Title Here"}</h3> 
        <div className='play-video-info'>
            <p>{apiData ? value_converter(apiData.statistics.viewCount) : "16K"} Views 
            &bull; {apiData ? moment(apiData.snippet.publishedAt).fromNow() : ""} </p>
            <div>
                <span>
                    <img src={like} alt='' />
                    {apiData ? value_converter(apiData.statistics.likeCount) : 155}
                </span>
                <span>
                    <img src={dislike} alt='' />
                </span>
                <span>
                    <img src={share} alt='' />
                    Share
                </span>
                <span>
                    <img src={save} alt='' />
                    Save
                </span>
            </div>
        </div>
        <hr />
        <div className='publisher'>
            <img src={channelData ? channelData.snippet.thumbnails.default.url : ""} alt='' />
            <div>
                <p>{apiData ? apiData.snippet.channelTitle : ""}</p>
                <span>{channelData ? value_converter(channelData.statistics.subscriberCount) : "1M"} Subscribers</span>
            </div>
            <button>Subscribe</button>
        </div>
        <div className='vid-description'>
            <p>
                {
                    (apiData ? apiData.snippet.description.length > 1 : "") ?
                        readMore ? (
                            <div>
                                {apiData ? apiData.snippet.description : "Description Here"}
                                <p className='description-details' onClick={() => setReadMore(false)}>Show Less</p>
                            </div>
                        ) :
                        (
                            <div>
                                {apiData ? apiData.snippet.description.slice(0,250) : "Description Here"}
                                {
                                    apiData.snippet.description.length > 250 ?
                                    (
                                        <p className='description-details' onClick={() => setReadMore(true)}>Read More</p>
                                    ) : ("")
                                }
                            </div>
                        )
                    : ""
                }
            </p>
            <hr />
            <h4>{apiData ? value_converter(apiData.statistics.commentCount) : 102} Comments</h4>
            {
                commentData.map((item, index) => {
                    return (
                        <div key={index} className='comment'>
                            <img src={item.snippet.topLevelComment.snippet.authorProfileImageUrl} alt='' />
                            <div>
                                <h3>{item.snippet.topLevelComment.snippet.authorDisplayName} <span>1 day ago</span></h3>
                                <p>{item.snippet.topLevelComment.snippet.textDisplay}</p>
                                <div className='comment-action'>
                                    <img src={like} alt='' />
                                    <span>{value_converter(item.snippet.topLevelComment.snippet.likeCount)}</span>
                                    <img src={dislike} alt='' />
                                </div>
                            </div>
                        </div>
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
    </div>
    )
}

export default PlayVideo