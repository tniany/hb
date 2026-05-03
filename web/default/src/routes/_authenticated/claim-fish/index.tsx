import { createFileRoute } from '@tanstack/react-router'
import { ClaimFishTutorial } from '@/features/claim-fish'

export const Route = createFileRoute('/_authenticated/claim-fish/')({
  component: ClaimFishTutorialPage,
})

function ClaimFishTutorialPage() {
  return <ClaimFishTutorial />
}
