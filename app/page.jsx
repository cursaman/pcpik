'use client';

import { useEffect, useRef, useState } from 'react';
import Benchmarks from './Benchmarks';
import BuyingGuide from './BuyingGuide';
import { catalog, priceText, productUrl } from './catalog';

const specs = [
  ['프로세서', 'cpu'], ['그래픽카드', 'gpu'], ['그래픽 메모리', 'vram'],
  ['메모리 (DDR5)', 'ram'], ['SSD (M.2)', 'storage'], ['메인보드', 'board'], ['파워', 'power'],
];

export default function Home() {
  const [tier, setTier] = useState('전체');
  const [budget, setBudget] = useState('');
  const [sort, setSort] = useState('asc');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState([]);
  const [showCompare, setShowCompare] = useState(false);

  const compareHeading = useRef(null);

  useEffect(() => {
    if (showCompare) compareHeading.current?.focus();
  }, [showCompare]);

  const builds = catalog.filter((build) =>
    (tier === '전체' || build.tier === tier) &&
    (!budget || build.price <= Number(budget)) &&
    [build.detail, build.cpu, build.gpu, build.title].join(' ').toLowerCase().includes(query.trim().toLowerCase())
  ).sort((a, b) => sort === 'asc' ? a.price - b.price : b.price - a.price);
  const compared = catalog.filter((build) => selected.includes(build.id));

  function toggle(id) {
    setSelected((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
  }

  return (
    <>
      <header className="top"><div className="wrap header-inner">
        <a className="logo" href="#"><span className="logo-mark" aria-hidden="true">▣</span> PC<span>픽</span></a>
        <nav aria-label="주 메뉴"><a href="#guide">PC 선택</a><a href="#builds">사양 비교</a><a href="#benchmarks">게임 성능</a></nav>
      </div></header>
      <main className="wrap">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow"><i /> 게이밍 PC 구매 가이드</p>
            <h1>게임용 PC,<br /><em>사양부터 가격까지.</em></h1>
            <p className="intro">FHD부터 4K까지. 원하는 해상도와 예산으로<br className="desktop-br" /> 완제품 조립 PC를 골라 비교하세요.</p>
            <a className="primary" href="#guide">내 게임에 맞는 PC 찾기 <span aria-hidden="true">↓</span></a>
          </div>
          <div className="hero-art" aria-hidden="true" />
        </section>

        <BuyingGuide onShowCandidate={(resolution) => { setTier(resolution); setBudget(''); setQuery(''); }} />

        <section id="builds" className="builds">
          <div className="section-head"><div><h2>해상도별 게이밍 PC</h2><p>본체 기준 · 운영체제 미포함</p></div>
            <button className="compare-button" disabled={selected.length < 2} onClick={() => setShowCompare(true)}>사양 비교 ({selected.length})</button>
          </div>

          <div className="filters">
            <div className="tabs" aria-label="해상도 필터">
              {['전체', 'FHD', 'QHD', '4K'].map((name) => <button key={name} aria-pressed={tier === name} onClick={() => setTier(name)}>{name}</button>)}
            </div>
            <div className="fields">
              <input aria-label="상품·부품 검색" placeholder="CPU, GPU, 상품 검색" value={query} onChange={(event) => setQuery(event.target.value)} />
              <select aria-label="최대 예산" value={budget} onChange={(event) => setBudget(event.target.value)}>
                <option value="">전체 예산</option><option value="2000000">200만원 이하</option><option value="3500000">350만원 이하</option><option value="5000000">500만원 이하</option>
              </select>
              <select aria-label="가격 정렬" value={sort} onChange={(event) => setSort(event.target.value)}>
                <option value="asc">낮은 가격순</option><option value="desc">높은 가격순</option>
              </select>
            </div>
          </div>

          <div className="grid">
            {builds.map((build) => <article id={'build-' + build.id} key={build.id} className={'card build-' + build.id}>
              <div className="card-top"><span className="tier">{build.tier}</span><label className="check"><input type="checkbox" checked={selected.includes(build.id)} onChange={() => toggle(build.id)} aria-label={build.title + ' 비교 선택'} /> 비교</label></div>
              <h3>{build.title}</h3><p className="product">{build.detail}</p>
              <dl>{specs.slice(0, 5).map(([label, key]) => <div key={key}><dt>{label}</dt><dd>{build[key]}</dd></div>)}</dl>
              <div className="price"><small>다나와 참고가 · {build.freshness}</small><strong>{priceText(build.price)}</strong></div>
              <a className="market" href={productUrl(build.code)} target="_blank" rel="noopener noreferrer">현재 판매가 확인 <span aria-hidden="true">↗</span></a>
            </article>)}
          </div>
          {!builds.length && <p className="empty" role="status">조건에 맞는 PC가 없습니다. 해상도, 예산 또는 검색어를 바꿔보세요.</p>}
        </section>

        {showCompare && <section className="comparison" aria-labelledby="comparison-title">
          <div className="section-head"><h2 id="comparison-title" ref={compareHeading} tabIndex={-1}>선택한 PC 사양 비교</h2><button onClick={() => setShowCompare(false)}>비교표 닫기</button></div>
          {compared.length < 2 ? <p>비교할 PC를 두 대 이상 선택하세요.</p> : <div className="table-scroll"><table>
            <thead><tr><th scope="col">항목</th>{compared.map((build) => <th key={build.id} scope="col">{build.title}</th>)}</tr></thead>
            <tbody>
              {specs.map(([label, key]) => <tr key={key}><th scope="row">{label}</th>{compared.map((build) => <td key={build.id}>{build[key]}</td>)}</tr>)}
              <tr><th scope="row">참고가</th>{compared.map((build) => <td key={build.id}>{priceText(build.price)}</td>)}</tr>
              <tr><th scope="row">판매가</th>{compared.map((build) => <td key={build.id}><a href={productUrl(build.code)} target="_blank" rel="noopener noreferrer">다나와 ↗</a></td>)}</tr>
            </tbody>
          </table></div>}
        </section>}

        <Benchmarks />

        <section className="pricing" id="pricing"><h2>가격 기준</h2>
          <p>2026년 11월 18일 조사한 다나와 웹 자료를 참고가로 표시합니다. 수집 시점은 상품마다 다릅니다. 현재 결제 금액, 배송비 및 재고는 상품 링크에서 확인하세요.</p>
          <p>해상도는 구성 선택을 돕는 분류입니다. 실제 성능은 게임, 그래픽 설정, 업스케일링에 따라 달라집니다.</p>
        </section>
      </main>
      <footer className="wrap footer">PC픽 · 게이밍 PC 구매 가이드</footer>
    </>
  );
}
