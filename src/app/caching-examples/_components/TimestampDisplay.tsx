import styles from './TimestampDisplay.module.scss'

type TimestampData = {
  timestamp: string
  randomValue: number
  note: string
}

export default function TimestampDisplay({
  data,
  label,
  fetchTime,
}: {
  data: TimestampData
  label: string
  fetchTime?: number
}) {
  // Format the timestamp for display
  const formattedTime = new Date(data.timestamp).toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  return (
    <div className={styles.container}>
      <h3>{label}</h3>
      <div className={styles.dataCard}>
        <div className={styles.row}>
          <span className={styles.label}>タイムスタンプ:</span>
          <span className={styles.value}>{formattedTime}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>ランダム値:</span>
          <span className={styles.value}>{data.randomValue}</span>
        </div>
        {fetchTime && (
          <div className={styles.row}>
            <span className={styles.label}>取得時間:</span>
            <span className={styles.value}>{fetchTime}ms</span>
          </div>
        )}
        <div className={styles.note}>{data.note}</div>
      </div>
    </div>
  )
}
