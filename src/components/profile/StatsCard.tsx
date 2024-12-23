import { IconType } from 'react-icons'

interface StatsCardProps {
  icon: IconType
  title: string
  value: string | number
  subtitle: string
  className?: string
}

export function StatsCard({ icon: Icon, title, value, subtitle, className = '' }: StatsCardProps) {
  return (
    <div className={`p-4 rounded-xl ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-5 h-5" />
        <span className="text-sm font-medium">{title}</span>
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-sm text-gray-600">{subtitle}</div>
    </div>
  )
}
