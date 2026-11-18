export const catalog = [
  {
    id: 'fhd', tier: 'FHD', title: 'FHD 게이밍', detail: '마이피씨샵 DIY 게이밍 마스터',
    cpu: 'Ryzen 5 7500F', gpu: 'RTX 5060', vram: '8GB', ram: '16GB', storage: '1TB',
    board: 'A620', power: '600W', price: 1751360, freshness: '최근 1주 내 웹 자료',
    code: '66138815',
  },
  {
    id: 'qhd', tier: 'QHD', title: 'QHD 게이밍', detail: '포유컴퓨터 5016',
    cpu: 'Ryzen 7 9700X', gpu: 'RTX 5070', vram: '12GB', ram: '32GB', storage: '1TB',
    board: 'B650', power: '850W', price: 3099000, freshness: '최근 1일 내 웹 자료',
    code: '77706329',
  },
  {
    id: '4k', tier: '4K', title: '4K 게이밍', detail: '리메이드컴퓨터 B988',
    cpu: 'Ryzen 7 9800X3D', gpu: 'RTX 5080', vram: '16GB', ram: '32GB', storage: '1TB',
    board: 'B850', power: '900W', price: 4417370, freshness: '약 2개월 전 웹 자료',
    code: '77086034',
  },
];

export const priceText = (amount) => new Intl.NumberFormat('ko-KR').format(amount) + '원';
export const productUrl = (code) => 'https://prod.danawa.com/info/?pcode=' + code;
