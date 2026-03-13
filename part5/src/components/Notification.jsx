import { useNotificationValue } from '../contexts/NotificationContext'

const Notification = () => {
  const notification = useNotificationValue()
  if (!notification) return null

  return (
    <div className="error">
      {notification}
    </div>
  )
}

export default Notification