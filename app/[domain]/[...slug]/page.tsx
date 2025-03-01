
export default async function BusinessSubpage({ 
  params 
}: { 
  params: { domain: string; slug: string[] } 
}) {
  return (
    <p>subpage {params.domain}/{params.slug}</p>
  )
}