import axios from 'axios';
import React from 'react'

const API_KEY = "AIzaSyBqtmhD0OD9rvs3hksMJIWV7Hqj9p4Aob0";


const parseData = async(items) => {

    try {
        const videoIds = [];
        const channelIds = [];

        items.forEach((item) => {
            channelIds.push(item.snippet.channelId)
            videoIds.push(item.id.videoIds)
        });

        const{
            data: {item:channelsData},
        } = await axios.get(`https://www.googleapis.com/youtube/v3/channels?part=snippet.contentDetails&id=${channelIds}.join(",")}&key=${API_KEY}`
        );

        const parsedChannelsData = [];
        channelsData.forEach((channel) => parsedChannelsData.push({
            id: channel.id,
            image: channel.snippet.thumbnails.default.url,
        }));

        const {
            data: {items:videosData},
        } = await axios.get(
            `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id=${videoIds.join(",")}&key=${API_KEY}`
        )

        const parseData = [];
        items.forEach((item,index) => {
            const {image:channelImage} = parsedChannelsData.find((data) => data.id === item.snippet.channelId);
            if(channelImage){
                parseData.push({
                    videoId : item.id.videoData,
                    videoTitle : item.snippet.title,
                    videoDescription : item.snippet.description,
                    videoThumbnail : item.snippet.thumbnails.medium.url,
                    videoLink : `https://www.youtube.com/watch?v=${item.id.videoId}`,
                    videoDuration : parseVideoDuration (
                        videosData[index].contentDetails.duration
                    ),
                    videoViews: convertRawtoString(
                        videosData[index].statistics.viewCount
                    ),
                    videoAge: timeSince(new Date(item.snippet.publishedAt)),
                    channelInfo : {
                        id: item.snippet.channelId,
                        image: channelImage,
                        name: item.snippet.channelTitle
                    },
                });
            }
        });

        return parseData;
    }

    catch (err){
        console.log(err);

    }
}

export default parseData

