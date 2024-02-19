import { useEffect } from 'react'

const PreviewMusic = () => {
  useEffect(() => {})
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
        <div className="mt-5 aplayer"></div>
      </div>
    </div>
  )
}
export default PreviewMusic
