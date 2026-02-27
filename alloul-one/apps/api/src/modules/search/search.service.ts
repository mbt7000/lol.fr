import { Injectable } from '@nestjs/common';

@Injectable()
export class SearchService {
  private baseUrl = process.env.MEILI_URL || 'http://localhost:7700';

  async indexDocument(doc: { id: string; orgId: string; title: string; body: string }) {
    const index = `org_${doc.orgId}_documents`;
    const url = `${this.baseUrl}/indexes/${index}/documents`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify([doc]),
    });
    return { ok: res.ok, index };
  }

  async query(orgId: string, q: string) {
    const index = `org_${orgId}_documents`;
    const url = `${this.baseUrl}/indexes/${index}/search`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ q, limit: 20 }),
    });
    if (!res.ok) return { hits: [], index, warning: 'search_backend_unavailable_or_index_missing' };
    return res.json();
  }
}
