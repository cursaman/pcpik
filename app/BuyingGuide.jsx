'use client';

import { useState } from 'react';
import { catalog, priceText, productUrl } from './catalog';

const gameTypes = {
  competitive: {
    label: '경쟁 게임 · 롤, 발로란트, 오버워치',
    advice: 'CPU와 그래픽카드를 함께 보세요. 한타처럼 부하가 몰리는 장면까지 보려면 평균 FPS와 하위 1% FPS를 확인하세요.',
  },
  graphics: {
    label: '고사양 게임 · 오픈월드, 그래픽 중심',
    advice: '그래픽카드와 그래픽 메모리를 먼저 보세요. 같은 해상도와 그래픽 옵션의 벤치마크에서 업스케일링, 레이 트레이싱, 프레임 생성 적용 여부를 확인하세요.',
  },
};

const checklist = [
  ['그래픽카드·파워', '제조사와 정확한 모델명, 파워 정격 출력과 그래픽카드 권장 사양을 확인했습니다.'],
  ['메모리', '총 용량과 장착 구성을 확인했습니다. 게임과 방송을 함께 한다면 32GB 구성을 검토했습니다.'],
  ['SSD·확장', '설치할 게임에 필요한 저장 공간과 추가 M.2 슬롯을 확인했습니다.'],
  ['냉각·크기', '케이스 통풍, 쿨러 구성과 그래픽카드 장착 공간을 확인했습니다.'],
  ['최종 금액·A/S', '윈도우, 조립비, 배송비, 모니터 포함 여부와 고장 시 접수 방식을 확인했습니다.'],
];

export default function BuyingGuide({ onShowCandidate }) {
  const [game, setGame] = useState('competitive');
  const [resolution, setResolution] = useState('FHD');
  const [refreshRate, setRefreshRate] = useState('144');
  const [budget, setBudget] = useState('');
  const [checked, setChecked] = useState([]);

  const candidate = catalog.find((build) => build.tier === resolution);
  const cap = budget ? Number(budget) * 10000 : null;
  const overBudget = cap !== null && candidate.price > cap;
  const alternatives = overBudget
    ? catalog.filter((build) => build.price <= cap).sort((a, b) => a.price - b.price)
    : [];

  return (
    <>
      <section id="guide" className="guide" aria-labelledby="guide-title">
        <h2 id="guide-title">내 게임에 맞는 PC 찾기</h2>
        <div className="guide-inputs">
          <label>주로 하는 게임<select value={game} onChange={(event) => setGame(event.target.value)}>
            {Object.entries(gameTypes).map(([id, type]) => <option key={id} value={id}>{type.label}</option>)}
          </select></label>
          <label>모니터 해상도<select value={resolution} onChange={(event) => setResolution(event.target.value)}>
            {catalog.map((build) => <option key={build.id}>{build.tier}</option>)}
          </select></label>
          <label>모니터 주사율<select value={refreshRate} onChange={(event) => setRefreshRate(event.target.value)}>
            {['60', '75', '120', '144', '165', '180', '240', '360'].map((hz) => <option key={hz} value={hz}>{hz}Hz</option>)}
          </select></label>
          <label>본체 예산 (만원)<input type="number" min="1" step="1" placeholder="예: 200" value={budget}
            onChange={(event) => {
              const amount = event.target.value;
              if (amount === '' || (Number.isSafeInteger(Number(amount)) && Number(amount) > 0)) setBudget(amount);
            }} /></label>
        </div>
        <div className="guide-result" aria-live="polite">
          <h3>{resolution} 사양 후보 · {candidate.gpu}</h3>
          <p>{candidate.cpu} · 메모리 {candidate.ram} · SSD {candidate.storage} · 참고가 {priceText(candidate.price)}</p>
          {overBudget && <p className="budget-note">참고가가 예산을 {priceText(candidate.price - cap)} 초과합니다.
            {alternatives.length ? ' 등록 목록에서 예산 내에 들어오는 구성은 ' + alternatives.map((build) => build.title).join(', ') + '입니다. 해상도를 조정할 때 비교해 보세요.' : ' 등록 목록에 예산 이내인 구성이 없습니다.'}
          </p>}
          <p>{gameTypes[game].advice}</p>
          <p>{game === 'competitive'
            ? resolution + '에서 ' + refreshRate + 'Hz 모니터를 활용하려면 ' + refreshRate + 'FPS를 목표로 벤치마크를 비교해 보세요.'
            : refreshRate + 'Hz 모니터에서도 화질을 우선한다면 60FPS부터 목표로 잡고, 더 부드러운 화면을 원하면 목표 FPS를 높여보세요.'} 실제 FPS는 게임과 설정에 따라 달라집니다.</p>
          <div className="guide-links">
            <a href="#builds" onClick={() => onShowCandidate(resolution)}>구성 목록에서 보기 ↓</a>
            <a href={productUrl(candidate.code)} target="_blank" rel="noopener noreferrer">현재 판매가 확인 ↗</a>
          </div>
        </div>
      </section>
      <section id="checklist" className="guide" aria-labelledby="checklist-title">
        <div className="section-head"><h2 id="checklist-title">구매 전 체크리스트</h2><p role="status">{checked.length} / {checklist.length} 확인</p></div>
        <div className="purchase-checks">
          {checklist.map(([title, description]) => <label key={title}>
            <input type="checkbox" checked={checked.includes(title)} onChange={(event) => {
              const isChecked = event.target.checked;
              setChecked((items) => isChecked ? [...items, title] : items.filter((item) => item !== title));
            }} />
            <span><strong>{title}</strong><span>{description}</span></span>
          </label>)}
        </div>
      </section>
    </>
  );
}
