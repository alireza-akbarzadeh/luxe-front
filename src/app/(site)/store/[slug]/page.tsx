import { StoreDomain } from '~/src/domains/store/containers/store.domain';

interface StorePageProps {
  params: Promise<{ slug: string }>;
}

export default async function StorePage(props: StorePageProps) {
  const { params } = props;
  const { slug } = await params;

  return <StoreDomain slug={slug} />;
}
