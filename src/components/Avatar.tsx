const Avatar: React.FC<{
  userId: string
  avatar: string
  timeStamp: number
  width: number
}> = (props) => {
  const { userId, avatar, timeStamp, width } = props
  return (
    <div>
      <span
        className="flex w-[40px] h-[40px] rounded-[50%] overflow-hidden"
        style={{ width: width, height: width }}
      >
        {userId ? (
          <img
            className="w-full object-cover"
            src={
              avatar && avatar !== ''
                ? avatar
                : `/api/getAvatar/${userId}?${timeStamp}`
            }
            alt=""
          />
        ) : null}
      </span>
    </div>
  )
}
export default Avatar
