import type { Metadata } from 'next'
import { ActivityContent } from './ActivityContent'

export const metadata: Metadata = {
  title: 'Activity Log',
  description: 'Audit log of all system activities and events',
}

export default function ActivityPage() {
  return <ActivityContent />
}
