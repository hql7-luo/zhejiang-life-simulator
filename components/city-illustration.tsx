export function CityIllustration() {
  return (
    <svg
      aria-label="由浙中山川、东海、水乡石桥与杭州天际线组成的抽象浙江地图"
      className="h-auto w-full"
      role="img"
      viewBox="0 0 720 330"
    >
      <defs>
        <pattern id="zj-windows" width="20" height="24" patternUnits="userSpaceOnUse">
          <rect width="6" height="8" x="4" y="5" fill="#f3efe5" opacity=".72" />
        </pattern>
      </defs>
      {/* 远山：浙西浙南山地 */}
      <path d="m18 252 70-84 58 84Zm32 0 78-118 92 118Z" fill="#50657b" opacity=".16" stroke="#50657b" strokeWidth="2" />
      {/* 丘陵茶山 */}
      <path d="M150 256c30-26 62-26 92 0" fill="none" stroke="#2d7a67" strokeWidth="3" />
      <path d="M165 244c22-18 45-18 62 0" fill="none" stroke="#2d7a67" strokeWidth="2" opacity=".55" />
      {/* 杭州现代天际线 */}
      <path d="M268 258V138h62v120m12 0V84h84v174m12 0V116h56v142m12 0V52h80v206" fill="#1b2a35" />
      <path d="M268 258V138h62v120m12 0V84h84v174m12 0V116h56v142m12 0V52h80v206" fill="url(#zj-windows)" />
      <path d="M342 84 364 52l21 32M506 52l22-22 21 22" fill="none" stroke="#c53d32" strokeWidth="4" />
      {/* 水乡石拱桥 */}
      <path d="M600 258c0-40 24-64 52-64s52 24 52 64" fill="none" stroke="#1b2a35" strokeWidth="3" />
      <path d="M626 258c0-24 12-38 26-38s26 14 26 38" fill="none" stroke="#1b2a35" strokeWidth="2" opacity=".5" />
      {/* 河流与东海波浪 */}
      <path d="M0 292c80-31 118-22 184-1s117 10 178-15 122-23 184-3 106 30 174 5v52H0Z" fill="#2d7a67" opacity=".14" />
      <path d="M560 300c22-8 44-8 66 0m-52 12c18-6 36-6 54 0m-40 12c14-4 28-4 42 0" fill="none" stroke="#2d7a67" strokeWidth="2" opacity=".6" />
      {/* 人生迁移路线：山城 → 杭州 → 上海/海外 */}
      <path d="M94 268c80-40 164-38 250-10 90 29 178 20 268-18" fill="none" stroke="#c53d32" strokeDasharray="8 10" strokeWidth="3" />
      <circle cx="94" cy="268" r="7" fill="#f3efe5" stroke="#c53d32" strokeWidth="3" />
      <circle cx="344" cy="258" r="7" fill="#f3efe5" stroke="#c53d32" strokeWidth="3" />
      <circle cx="612" cy="240" r="7" fill="#c53d32" />
      {/* 货轮：宁波舟山港 */}
      <g transform="translate(430 268)">
        <path d="M0 12h74l14 12H10Z" fill="#f3efe5" stroke="#1b2a35" strokeWidth="2" />
        <path d="M16 12 26 2h38l10 10" fill="#f3efe5" stroke="#1b2a35" strokeWidth="2" />
        <path d="M30 2v-8h18v8" fill="none" stroke="#1b2a35" strokeWidth="2" />
      </g>
      {/* 太阳 */}
      <circle cx="656" cy="56" r="32" fill="#d3a64a" opacity=".85" />
    </svg>
  );
}
