import type { DtoBlogHomepageData } from '~/src/services/-blog-homepage-get.schemas';

interface WeblogDomainProps {
  data: DtoBlogHomepageData;
}
export function WeblogHomeDomain({ data }: WeblogDomainProps) {
  return (
    <div>
      <h1>Weblog</h1>
      <p>{data.featured?.title}</p>
      <p>{data.featured?.excerpt}</p>
      <p>{data.featured?.hero_image_url}</p>
      <p>{data.featured?.hero_image_alt}</p>
      <p>{data.featured?.hero_image_url}</p>
    </div>
  );
}
