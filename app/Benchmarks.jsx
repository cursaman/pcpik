'use client';

import { useState } from 'react';
import { catalog } from './catalog';

const games = ['Cyberpunk 2077', 'Valorant', 'Overwatch 2', 'Forza Horizon 6'];
const resolutions = { FHD: '1080p', QHD: '1440p', '4K': '2160p' };

// Tweakers, Cyberpunk 2077 Ultra without the separate DXR Ultra preset.
// Values are average and minimum FPS as labeled in the source.
const results = {
  FHD: { 'RTX 5060': [110.8, 84.7], 'RTX 5070': [166.3, 107.0], 'RTX 5080': [216.5, 139.5] },
  QHD: { 'RTX 5060': [68.5, 55.1], 'RTX 5070': [106.2, 77.6], 'RTX 5080': [149.7, 97.9] },
  '4K': { 'RTX 5070': [48.2, 37.7], 'RTX 5080': [72.3, 53.6] },
};

const videos = [
  {
    title: 'RTX 5060 vs RTX 5070 · QHD, DLSS 4.5 Quality',
    detail: '벤치마크 채널 BENCHMARKS FOR GAMERS · Ryzen 7 9800X3D · Cyberpunk 2077 레이 트레이싱 구간 07:21',
    url: 'https://www.youtube.com/watch?v=q8GWimhc5RU&t=441s',
  },
  {
    title: 'RTX 5070 vs RTX 5080 · QHD·4K 비교',
    detail: 'Core i7-14700F · 게임별 DLAA, DLSS 및 레이 트레이싱 조건은 영상에서 확인',
    url: 'https://www.youtube.com/watch?v=z7XRBTyNGco',
  },
];

export default function Benchmarks() {
  const [game, setGame] = useState(games[0]);
  const [resolution, setResolution] = useState('QHD');
  const scores = game === games[0] ? results[resolution] : null;
  const format = (value) => value.toFixed(1);

  return (
    <section id="benchmarks" className="guide" aria-labelledby="benchmark-title">
      <div className="section-head"><div><h2 id="benchmark-title">게임 성능 비교</h2>
        <p>같은 해상도와 그래픽 옵션으로 측정한 GPU 결과를 비교하세요.</p></div></div>
      <div className="guide-inputs">
        <label>게임<select value={game} onChange={(event) => setGame(event.target.value)}>
          {games.map((name) => <option key={name}>{name}</option>)}
        </select></label>
        <label>해상도<select value={resolution} onChange={(event) => setResolution(event.target.value)}>
          {Object.keys(resolutions).map((name) => <option key={name}>{name}</option>)}
        </select></label>
      </div>
      {scores ? <>
        <div className="table-scroll benchmark-table">
          <table>
            <caption>{game} · {resolution} ({resolutions[resolution]}) · Ultra · 레이 트레이싱 제외</caption>
            <thead><tr><th scope="col">그래픽카드</th><th scope="col">평균 FPS</th><th scope="col">최소 FPS</th></tr></thead>
            <tbody>{catalog.map(({ gpu }) => {
              const score = scores[gpu];
              return <tr key={gpu}><th scope="row">{gpu}</th>
                {score ? <><td>{format(score[0])}</td><td>{format(score[1])}</td></> : <td colSpan={2}>공개 수치 없음</td>}
              </tr>;
            })}</tbody>
          </table>
        </div>
        <p className="benchmark-note">Tweakers의 GPU 벤치마크입니다. 최소 FPS와 하위 1% FPS는 서로 다른 지표입니다. 완제품의 실제 FPS는 CPU, 메모리, 게임 버전과 설정에 따라 달라집니다.</p>
        <a className="benchmark-link" href="https://tweakers.net/best-buy-guide/videokaarten/benchmarks/all/" target="_blank" rel="noopener noreferrer">Tweakers 원본 결과 ↗</a>
      </> : <p className="benchmark-note" role="status">이 게임은 동일 조건에서 확인한 FPS 자료가 아직 없습니다. 아래 영상 검색을 이용하세요.</p>}
      <h3>유튜브 벤치마크 찾기</h3>
      <div className="guide-links">{catalog.map(({ id, cpu, gpu }) => {
        const query = [game, cpu, gpu, resolutions[resolution], 'benchmark FPS'].join(' ');
        return <a key={id} href={'https://www.youtube.com/results?search_query=' + encodeURIComponent(query)} target="_blank" rel="noopener noreferrer">{gpu} 영상 검색 ↗</a>;
      })}</div>
      {game === games[0] && resolution !== 'FHD' && <ul className="benchmark-videos">
        {videos.filter((video) => resolution !== '4K' || video.title.includes('4K')).map((video) => <li key={video.url}>
          <a className="benchmark-link" href={video.url} target="_blank" rel="noopener noreferrer">{video.title} ↗</a>
          <p>{video.detail}</p>
        </li>)}
      </ul>}
    </section>
  );
}
