import { useEffect, useRef, useState } from "react";

const TOKEN = import.meta.env.VITE_AIRTABLE_TOKEN;
const BASE = import.meta.env.VITE_AIRTABLE_BASE;

const CAT_IMG: Record<string, string> = {
  글로벌트렌드: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=70",
  국내뉴스: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=70",
  소재원단: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=70",
  SNS바이럴: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=70",
  데님트렌드: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=70",
  default: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=70",
};

const CATEGORIES = ["전체", "글로벌트렌드", "국내뉴스", "소재원단", "SNS바이럴", "데님트렌드"];

interface AirtableRecord {
  id: string;
  fields: {
    Title?: string;
    URL?: string;
    Source?: string;
    Category?: string;
    Summary?: string;
    "Published Date"?: string;
  };
}

function useReveal(ref: React.RefObject<Element | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.06 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
}

function Nav() {
  return (
    <nav>
      <a href="#" className="nav-logo">Fashion Signal</a>
      <div className="nav-links">
        <a href="#briefing">브리핑</a>
        <a href="#subscribe" className="nav-sub">구독</a>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="hero-img" />
      <div className="hero-body">
        <div className="hero-eyebrow">AI 패션 트렌드 브리핑 · 2026 S/S</div>
        <h1 className="hero-title">
          패션의<br /><em>신호</em>를<br />먼저 읽는다
        </h1>
        <p className="hero-desc">
          글로벌 런웨이·국내 패션 미디어·소재 트렌드를 AI가 매주 자동 수집·분석해
          바이어와 팀에게 핵심만 전달합니다.
        </p>
        <a href="#briefing" className="hero-cta">이번 주 브리핑 보기</a>
      </div>
      <div className="scroll-cue">
        <div className="scroll-line" />
        scroll
      </div>
    </section>
  );
}

function Ticker() {
  const text =
    "2026 S/S \u2003·\u2003 컬러 해방 \u2003·\u2003 볼륨 실루엣 \u2003·\u2003 저지 소재 \u2003·\u2003 디자이너 빅뱅 \u2003·\u2003 Transformative Teal \u2003·\u2003 화이트 진 \u2003·\u2003 프린지 스커트 \u2003·\u2003 Loewe \u2003·\u2003 Chanel \u2003·\u2003 Dior \u2003·\u2003 Balenciaga \u2003·\u2003 Première Vision \u2003·\u2003 데님 트렌드 \u2003·\u2003\u2003";
  return (
    <div className="ticker">
      <div className="ticker-inner">{text}{text}</div>
    </div>
  );
}

function Editorial() {
  const ref = useRef<HTMLDivElement>(null);
  useReveal(ref);
  return (
    <div className="editorial reveal" ref={ref}>
      <div className="ed-panel">
        <img
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&q=80"
          alt="글로벌 트렌드"
          loading="lazy"
        />
        <div className="ed-overlay">
          <div className="ed-label">글로벌 트렌드</div>
          <h2 className="ed-title">2026 S/S<br /><em>런웨이 분석</em></h2>
          <a href="#briefing" className="ed-link">브리핑 보기 →</a>
        </div>
      </div>
      <div className="ed-panel">
        <img
          src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=80"
          alt="소재 트렌드"
          loading="lazy"
        />
        <div className="ed-overlay">
          <div className="ed-label">소재 · 원단</div>
          <h2 className="ed-title">시즌<br /><em>원단 트렌드</em></h2>
          <a href="#briefing" className="ed-link">브리핑 보기 →</a>
        </div>
      </div>
    </div>
  );
}

function NewsCard({ record }: { record: AirtableRecord }) {
  const f = record.fields;
  const cat = f.Category || "default";
  const img = CAT_IMG[cat] || CAT_IMG.default;
  const dateStr = f["Published Date"]
    ? new Date(f["Published Date"]).toLocaleDateString("ko-KR", { month: "short", day: "numeric" })
    : "";
  const raw = f.Summary || "";
  const body =
    raw
      .replace(/^요약[：:]?\s*/, "")
      .replace(/카테고리[：:]?.*/s, "")
      .trim()
      .substring(0, 120) + (raw.length > 120 ? "…" : "");

  return (
    <div className="card">
      <div className="card-img-wrap">
        <img className="card-img" src={img} alt={cat} loading="lazy" />
      </div>
      <div className="card-body">
        <div className="card-cat">{cat}</div>
        <div className="card-title">{f.Title || "제목 없음"}</div>
        <p className="card-summary">{body || "요약 준비 중"}</p>
        <div className="card-foot">
          <span className="card-src">
            {f.Source || ""}
            {f.Source && dateStr ? " · " : ""}
            {dateStr}
          </span>
          {f.URL && (
            <a href={f.URL} target="_blank" rel="noopener noreferrer" className="card-link">
              원문 →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function Briefing() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);

  const [all, setAll] = useState<AirtableRecord[]>([]);
  const [filtered, setFiltered] = useState<AirtableRecord[]>([]);
  const [activeFilter, setActiveFilter] = useState("전체");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const now = new Date();
  const dateLabel = `${now.getFullYear()}. ${String(now.getMonth() + 1).padStart(2, "0")}`;

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          `https://api.airtable.com/v0/${BASE}/Table%201?maxRecords=30&sort[0][field]=Published%20Date&sort[0][direction]=desc`,
          { headers: { Authorization: `Bearer ${TOKEN}` } }
        );
        const data = await res.json();
        if (data.error) throw new Error(data.error.message);
        const records: AirtableRecord[] = data.records || [];
        setAll(records);
        setFiltered(records);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "알 수 없는 오류");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function doFilter(cat: string) {
    setActiveFilter(cat);
    if (cat === "전체") {
      setFiltered(all);
    } else {
      setFiltered(all.filter((r) => r.fields.Category === cat));
    }
  }

  return (
    <section className="briefing reveal" id="briefing" ref={ref as React.RefObject<HTMLElement>}>
      <div className="section-head">
        <div>
          <div className="section-eyebrow">최신 브리핑</div>
          <h2 className="section-title">이번 주<br />트렌드 신호</h2>
        </div>
        <div className="section-meta">
          <div className="section-date">{dateLabel}</div>
          <div className="section-sub">매주 자동 업데이트</div>
        </div>
      </div>

      <div className="filters">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`fpill${activeFilter === cat ? " on" : ""}`}
            onClick={() => doFilter(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid">
        {loading ? (
          <div className="loading-wrap">
            <div className="dots" style={{ marginBottom: 14 }}>
              <span /><span /><span />
            </div>
            <p style={{ fontSize: 12, letterSpacing: "0.06em" }}>최신 트렌드를 불러오는 중입니다</p>
          </div>
        ) : error ? (
          <div className="loading-wrap" style={{ color: "var(--gold)" }}>
            데이터를 불러올 수 없습니다.<br />
            <small style={{ color: "var(--dust)", fontSize: 11, marginTop: 8, display: "block" }}>{error}</small>
          </div>
        ) : filtered.length === 0 ? (
          <div className="loading-wrap">수집된 기사가 없습니다.</div>
        ) : (
          filtered.map((rec) => <NewsCard key={rec.id} record={rec} />)
        )}
      </div>

      {!loading && !error && all.length > 0 && (
        <div className="stats">
          <div className="stat">
            <div className="stat-n">{all.length}</div>
            <div className="stat-l">수집 기사</div>
          </div>
          <div className="stat">
            <div className="stat-n">5</div>
            <div className="stat-l">수집 소스</div>
          </div>
          <div className="stat">
            <div className="stat-n">5</div>
            <div className="stat-l">카테고리</div>
          </div>
          <div className="stat">
            <div className="stat-n">0분</div>
            <div className="stat-l">수동 작업</div>
          </div>
        </div>
      )}

      <div className="src-bar">
        <span>Vogue Korea · W Korea · Harper's Bazaar · 패션비즈 · 어패럴뉴스</span>
        <span className="src-badge">AI 자동 생성</span>
      </div>
    </section>
  );
}

function Subscribe() {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function sub(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) {
      setDone(true);
    }
  }

  return (
    <section className="cta reveal" id="subscribe" ref={ref as React.RefObject<HTMLElement>}>
      <div className="cta-bg" />
      <div className="cta-body">
        <h2 className="cta-title">
          매주 월요일,<br /><em>트렌드를 먼저</em><br />받아보세요
        </h2>
        <p className="cta-sub">팀·바이어 대상 전용 브리핑 구독 신청</p>
        {done ? (
          <p style={{ color: "var(--gold-lt)", fontSize: 14, letterSpacing: "0.06em", marginBottom: 16 }}>
            구독 신청이 완료됐습니다!<br />
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginTop: 8 }}>
              매주 월요일 브리핑을 보내드릴게요.
            </span>
          </p>
        ) : (
          <form className="cta-form" onSubmit={sub}>
            <input
              className="cta-input"
              type="email"
              placeholder="이메일 주소"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button className="cta-btn" type="submit">구독</button>
          </form>
        )}
        <p className="cta-note">스팸 없음 &nbsp;·&nbsp; 언제든 해지 가능 &nbsp;·&nbsp; 매주 월요일</p>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <div className="footer-logo">Fashion Signal</div>
      <p>© 2026 · AI 자동 패션 트렌드 브리핑</p>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <Nav />
      <Hero />
      <Ticker />
      <Editorial />
      <Briefing />
      <Subscribe />
      <Footer />
    </>
  );
}
