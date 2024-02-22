import React from 'react'
import { APlayer } from 'aplayer-react'
import 'aplayer-react/dist/index.css'
import { DataList } from '@/views/Main/All'
interface PreviewMusicProps {
  musicUrl: string
  fileInfo: DataList
}
const PreviewMusic: React.FC<PreviewMusicProps> = (props) => {
  const { musicUrl, fileInfo } = props
  return (
    <div className="flex items-center justify-center w-full">
      <div className="w-4/5 text-center">
        <div className="m-[0_auto] w-[200px] text-center">
          <img
            src={require('@/assets/icon-image/music_cover-6176aee0.png')}
            alt=""
            className="w-full"
          />
        </div>
        <div className="mt-5" id="aplayer">
          <APlayer
            autoPlay={false}
            audio={{
              lrc: '.lrc.lrc',
              name: fileInfo.fileName,
              artist: 'Audio artist',
              url: `${musicUrl}`,
              cover:
                'data:image/png;base64,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',
            }}
          ></APlayer>
        </div>
      </div>
    </div>
  )
}
export default PreviewMusic
