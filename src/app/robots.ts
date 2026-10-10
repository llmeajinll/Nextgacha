import { MetadataRoute } from 'next';
import { baseUrl } from '@/shared/api/baseUrl';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/mypage/', '/manager/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
