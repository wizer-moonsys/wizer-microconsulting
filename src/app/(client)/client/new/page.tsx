import { redirect } from 'next/navigation'

// Study creation has moved to the Org Admin panel.
// Clients access a read-only status dashboard only.
export default function ClientNewStudyRedirect() {
  redirect('/client')
}
