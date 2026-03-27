const TOKEN = 'patPrnrfTgSDs7A1C.43f72cce92199af458c05b188667a7f98c5e98240ef17133c4398b5a4b201235';
const BASE = 'appT6B0N71oCjNVXf';
const TABLE = 'Table 1';

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function getOgImage(url: string): Promise<string | null> {
  try {
    const res = await fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}`);
    const data = await res.json() as { data?: { image?: { url?: string } } };
    return data?.data?.image?.url ?? null;
  } catch {
    return null;
  }
}

async function fetchAllRecords(): Promise<{ id: string; fields: Record<string, string> }[]> {
  const records: { id: string; fields: Record<string, string> }[] = [];
  let offset: string | undefined;

  do {
    const url = `https://api.airtable.com/v0/${BASE}/${encodeURIComponent(TABLE)}?pageSize=100${offset ? `&offset=${offset}` : ''}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
    const data = await res.json() as { records?: { id: string; fields: Record<string, string> }[]; offset?: string };
    records.push(...(data.records ?? []));
    offset = data.offset;
  } while (offset);

  return records;
}

async function updateRecord(id: string, imageUrl: string) {
  await fetch(`https://api.airtable.com/v0/${BASE}/${encodeURIComponent(TABLE)}/${id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ fields: { Image: imageUrl } }),
  });
}

async function main() {
  console.log('📋 Airtable 레코드 불러오는 중...');
  const records = await fetchAllRecords();
  console.log(`✅ 총 ${records.length}개 레코드 발견\n`);

  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (const rec of records) {
    const url = rec.fields['URL'];
    const existing = rec.fields['Image'];

    if (!url) {
      console.log(`⏭  [${rec.id}] URL 없음 — 건너뜀`);
      skipped++;
      continue;
    }

    if (existing) {
      console.log(`⏭  [${rec.id}] 이미지 이미 있음 — 건너뜀`);
      skipped++;
      continue;
    }

    process.stdout.write(`🔍 이미지 추출 중: ${url.substring(0, 60)}... `);
    const imgUrl = await getOgImage(url);

    if (imgUrl) {
      await updateRecord(rec.id, imgUrl);
      console.log(`✅ 저장됨`);
      updated++;
    } else {
      console.log(`❌ 이미지 없음`);
      failed++;
    }

    await sleep(600);
  }

  console.log(`\n🎉 완료! 업데이트: ${updated} | 건너뜀: ${skipped} | 실패: ${failed}`);
}

main().catch(console.error);
