interface PageProps {
  params: Promise<{
    domain: string;
    slug: string[];
  }>;
}

export default async function BusinessSubpage({ params }:  PageProps ) {

  const {domain, slug} = await params;

  return (
    <p>subpage {domain}/{slug}</p>
  )
}