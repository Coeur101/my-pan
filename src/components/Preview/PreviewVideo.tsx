import DPlayer from 'dplayer'
import React, { useEffect } from 'react'
import Hls from 'hls.js'
interface PreviewPropType {
  videoUrl: string
}
const PreviewVideo: React.FC<PreviewPropType> = (props) => {
  const { videoUrl } = props
  useEffect(() => {
    initPlayer()
    console.log(videoUrl)
  }, [])
  const initPlayer = () => {
    const dp = new DPlayer({
      container: document.querySelector('#player'),
      theme: '#b7daff',
      hotkey: true,
      screenshot: true,
      video: {
        url: `/api/${videoUrl}`,
        type: 'customHls',
        customType: {
          customHls: function (video: any, player: any) {
            const hls = new Hls()
            hls.loadSource(video.src)
            hls.attachMedia(video)
          },
        },
      },
    })
  }
  return <div id="player" className="w-full h-[calc(100vh-41px)]"></div>
}
export default PreviewVideo
