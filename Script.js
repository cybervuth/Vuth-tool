// Animated starfield
const starsEl = document.getElementById('stars');
const STAR_COUNT = 90;
for (let i = 0; i < STAR_COUNT; i++) {
  const s = document.createElement('span');
  const size = (Math.random() * 2 + 0.6).toFixed(1);
  s.style.width = size + 'px';
  s.style.height = size + 'px';
  s.style.left = Math.random() * 100 + 'vw';
  s.style.top = Math.random() * 100 + 'vh';
  s.style.animationDuration = (2 + Math.random() * 4).toFixed(2) + 's';
  s.style.animationDelay = (Math.random() * 4).toFixed(2) + 's';
  starsEl.appendChild(s);
}

// IP lookup
document.getElementById('ipBtn').addEventListener('click', async () => {
  const out = document.getElementById('ipResult');
  out.textContent = 'កំពុងស្វែងរក…';
  out.classList.remove('filled');
  try {
    const res = await fetch('https://ipapi.co/json/');
    if (!res.ok) throw new Error('lookup failed');
    const d = await res.json();
    out.innerHTML = `<div class="kv">
      <div>IP</div><div>${d.ip ?? '—'}</div>
      <div>City</div><div>${d.city ?? '—'}</div>
      <div>Region</div><div>${d.region ?? '—'}</div>
      <div>Country</div><div>${d.country_name ?? '—'}</div>
      <div>ISP</div><div>${d.org ?? '—'}</div>
      <div>Timezone</div><div>${d.timezone ?? '—'}</div>
    </div>`;
    out.classList.add('filled');
  } catch (e) {
    out.textContent = 'មិនអាចភ្ជាប់ទៅសេវាកម្មបានទេពេលនេះ ឧបករណ៍នេះត្រូវការការភ្ជាប់អ៊ីនធឺណិតនៅក្នុង browser ធម្មតា';
  }
});

// Phone number info (format check only — no ownership/reverse lookup)
const PHONE_COUNTRIES = [
  { code: '855', name: 'Cambodia (កម្ពុជា)', minLen: 8, maxLen: 9 },
  { code: '66', name: 'Thailand', minLen: 9, maxLen: 9 },
  { code: '84', name: 'Vietnam', minLen: 9, maxLen: 10 },
  { code: '856', name: 'Laos', minLen: 8, maxLen: 10 },
  { code: '95', name: 'Myanmar', minLen: 8, maxLen: 10 },
  { code: '60', name: 'Malaysia', minLen: 9, maxLen: 10 },
  { code: '62', name: 'Indonesia', minLen: 9, maxLen: 12 },
  { code: '63', name: 'Philippines', minLen: 10, maxLen: 10 },
  { code: '65', name: 'Singapore', minLen: 8, maxLen: 8 },
  { code: '86', name: 'China', minLen: 11, maxLen: 11 },
  { code: '82', name: 'South Korea', minLen: 9, maxLen: 10 },
  { code: '81', name: 'Japan', minLen: 9, maxLen: 10 },
  { code: '91', name: 'India', minLen: 10, maxLen: 10 },
  { code: '1', name: 'US / Canada', minLen: 10, maxLen: 10 },
  { code: '44', name: 'United Kingdom', minLen: 10, maxLen: 10 },
  { code: '33', name: 'France', minLen: 9, maxLen: 9 },
  { code: '49', name: 'Germany', minLen: 10, maxLen: 11 },
  { code: '61', name: 'Australia', minLen: 9, maxLen: 9 },
];

document.getElementById('phoneBtn').addEventListener('click', () => {
  const raw = document.getElementById('phoneInput').value.trim();
  const out = document.getElementById('phoneResult');
  if (!raw) { out.textContent = 'លេខខ្លីពេកសូមពិនិត្យម្តងទៀត'; out.classList.remove('filled'); return; }
  const digits = raw.replace(/[^\d+]/g, '');
  const plainDigits = digits.replace(/\D/g, '');
  if (plainDigits.length < 6) {
    out.textContent = 'លេខខ្លីពេសូមពិនិត្យម្តងទៀត';
    out.classList.remove('filled');
    return;
  }
  let match = null;
  let nationalNumber = plainDigits;
  if (digits.startsWith('+')) {
    match = PHONE_COUNTRIES
      .filter(c => plainDigits.startsWith(c.code))
      .sort((a, b) => b.code.length - a.code.length)[0];
    if (match) nationalNumber = plainDigits.slice(match.code.length);
  } else {
    // No country code given — assume Cambodia, strip a leading 0 if present
    match = PHONE_COUNTRIES.find(c => c.code === '855');
    nationalNumber = plainDigits.startsWith('0') ? plainDigits.slice(1) : plainDigits;
  }
  let report = '';
  if (match) {
    const validLength = nationalNumber.length >= match.minLen && nationalNumber.length <= match.maxLen;
    report = `ប្រទេស: ${match.name}\nលេខកូដប្រទេស: +${match.code}\nលេខជាតិ: ${nationalNumber}\nចំនួនខ្ទង់: ${nationalNumber.length}\nទ្រង់ទ្រាយ: ${validLength ? 'ត្រឹមត្រូវ' : 'ប្រហែលមិនត្រឹមត្រូវ (ចំនួនខ្ទង់មិនប្រក្រតី)'}`;
  } else {
    report = `មិនអាចកំណត់ប្រទេសបានទេ\nចំនួនខ្ទង់សរុប: ${plainDigits.length}`;
  }
  out.textContent = report;
  out.classList.add('filled');
});

// Translate
document.getElementById('translateBtn').addEventListener('click', async () => {
  const text = document.getElementById('translateInput').value.trim();
  const from = document.getElementById('fromLang').value;
  const to = document.getElementById('toLang').value;
  const out = document.getElementById('translateResult');
  if (!text) { out.textContent = 'សូមវាយអត្ថបទសិន'; return; }
  out.textContent = 'កំពុងបកប្រែ…';
  out.classList.remove('filled');
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;
    const res = await fetch(url);
    const data = await res.json();
    const translated = data?.responseData?.translatedText;
    out.textContent = translated || 'គ្មានលទ្ធផលបកប្រែត្រឡប់មកវិញ។';
    out.classList.add('filled');
  } catch (e) {
    out.textContent = 'មិនអាចភ្ជាប់ទៅសេវាបកប្រែបានទេពេលនេះ ត្រូវការភ្ជាប់អ៊ីនធឺណិត។';
  }
});

// Base64
let lastB64Result = '';
function setB64Result(text) {
  lastB64Result = text;
  const out = document.getElementById('b64Result');
  out.textContent = text;
  out.classList.add('filled');
}
document.getElementById('toBase64Btn').addEventListener('click', () => {
  const text = document.getElementById('b64Input').value;
  try { setB64Result(btoa(unescape(encodeURIComponent(text)))); }
  catch (e) { setB64Result('មិនអាចបំលែងអត្ថបទនេះបានទេ។'); }
});
document.getElementById('fromBase64Btn').addEventListener('click', () => {
  const text = document.getElementById('b64Input').value.trim();
  try { setB64Result(decodeURIComponent(escape(atob(text)))); }
  catch (e) { setB64Result('នេះមិនមែនជា Base64 ត្រឹមត្រូវទេ។'); }
});
document.getElementById('b64CopyBtn').addEventListener('click', async () => {
  if (!lastB64Result) { alert('សូមបង្កើតលទ្ធផលសិន។'); return; }
  try { await navigator.clipboard.writeText(lastB64Result); alert('ចម្លងទៅ clipboard រួចរាល់។'); }
  catch (e) { alert('ចម្លងមិនបានទេ browser របស់អ្នកអាចនឹងទប់ស្កាត់។'); }
});

// Binary
let lastBinResult = '';
function setBinResult(text) {
  lastBinResult = text;
  const out = document.getElementById('binResult');
  out.textContent = text;
  out.classList.add('filled');
}
document.getElementById('toBinaryBtn').addEventListener('click', () => {
  const text = document.getElementById('binInput').value;
  const bytes = new TextEncoder().encode(text);
  const bin = Array.from(bytes).map(b => b.toString(2).padStart(8, '0')).join(' ');
  setBinResult(bin);
});
document.getElementById('fromBinaryBtn').addEventListener('click', () => {
  const text = document.getElementById('binInput').value.trim();
  try {
    const bytes = text.split(/\s+/).map(b => parseInt(b, 2));
    if (bytes.some(isNaN)) throw new Error();
    setBinResult(new TextDecoder().decode(new Uint8Array(bytes)));
  } catch (e) { setBinResult('នេះមិនមែនជា Binary ត្រឹមត្រូវទេ (ត្រូវការក្រុមលេខ 8 khonat ដកឃ្លាគ្នា)។'); }
});
document.getElementById('binCopyBtn').addEventListener('click', async () => {
  if (!lastBinResult) { alert('សូមបង្កើតលទ្ធផលសិន។'); return; }
  try { await navigator.clipboard.writeText(lastBinResult); alert('ចម្លងទៅ clipboard រួចរាល់។'); }
  catch (e) { alert('ចម្លងមិនបានទេ browser របស់អ្នកអាចនឹងទប់ស្កាត់។'); }
});

// Word repeater
let lastRepeatResult = '';
document.getElementById('repeatBtn').addEventListener('click', () => {
  const word = document.getElementById('repeatWord').value.trim();
  const out = document.getElementById('repeatResult');
  let count = parseInt(document.getElementById('repeatCount').value, 10);
  const numbered = document.getElementById('repeatNumbered').checked;
  if (!word) {
    out.textContent = 'សូមវាយពាក្យ ឬឃ្លាសិន។';
    out.classList.remove('filled');
    return;
  }
  if (isNaN(count) || count < 1) count = 1;
  if (count > 5000) count = 5000;
  const lines = [];
  for (let i = 1; i <= count; i++) {
    lines.push(numbered ? `${i}. ${word}` : word);
  }
  const result = lines.join('\n');
  lastRepeatResult = result;
  out.textContent = result;
  out.classList.add('filled');
});
document.getElementById('repeatCopyBtn').addEventListener('click', async () => {
  if (!lastRepeatResult) { alert('សូមបង្កើតបញ្ជីសិន។'); return; }
  try { await navigator.clipboard.writeText(lastRepeatResult); alert('ចម្លងទៅ clipboard រួចរាល់។'); }
  catch (e) { alert('ចម្លងមិនបានទេ browser របស់អ្នកអាចនឹងទប់ស្កាត់។'); }
});
document.getElementById('repeatDownloadBtn').addEventListener('click', () => {
  if (!lastRepeatResult) { alert('សូមបង្កើតបញ្ជីសិន។'); return; }
  const blob = new Blob([lastRepeatResult], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'word-list.txt';
  a.click();
  URL.revokeObjectURL(url);
});

// Photo metadata checker (for checking your own photos before sharing)
function dmsToDecimal(dms, ref) {
  const [d, m, s] = dms;
  let dec = d + m / 60 + s / 3600;
  if (ref === 'S' || ref === 'W') dec = -dec;
  return dec;
}
document.getElementById('metaBtn').addEventListener('click', () => {
  const input = document.getElementById('metaInput');
  const out = document.getElementById('metaResult');
  if (!input.files.length) {
    out.textContent = 'សូមជ្រើសរើសរូបភាពសិន។';
    out.classList.remove('filled');
    return;
  }
  const file = input.files[0];
  if (typeof EXIF === 'undefined') {
    out.textContent = 'មិនអាចផ្ទុកម៉ូឌុលអានទិន្នន័យបានទេ សូមប្រាកដថាអ្នកកំពុងបើកទំព័រនេះជាមួយការភ្ជាប់អ៊ីនធឺណិត។';
    return;
  }
  out.textContent = 'កំពុងវិភាគ…';
  out.classList.remove('filled');
  EXIF.getData(file, function () {
    const lat = EXIF.getTag(this, 'GPSLatitude');
    const latRef = EXIF.getTag(this, 'GPSLatitudeRef');
    const lon = EXIF.getTag(this, 'GPSLongitude');
    const lonRef = EXIF.getTag(this, 'GPSLongitudeRef');
    const dateTaken = EXIF.getTag(this, 'DateTimeOriginal') || EXIF.getTag(this, 'DateTime');
    const make = EXIF.getTag(this, 'Make');
    const model = EXIF.getTag(this, 'Model');

    let lines = [];
    lines.push(`ឈ្មោះឯកសារ: ${file.name}`);
    lines.push(`ទំហំឯកសារ: ${(file.size / 1024).toFixed(1)} KB`);
    if (dateTaken) lines.push(`ថ្ងៃថតរូប: ${dateTaken}`);
    if (make || model) lines.push(`ឧបករណ៍ថត: ${[make, model].filter(Boolean).join(' ')}`);

    if (lat && lon && latRef && lonRef) {
      const latDec = dmsToDecimal([lat[0].valueOf(), lat[1].valueOf(), lat[2].valueOf()], latRef);
      const lonDec = dmsToDecimal([lon[0].valueOf(), lon[1].valueOf(), lon[2].valueOf()], lonRef);
      lines.push('');
      lines.push('⚠ រូបនេះមានទីតាំង GPS បង្កប់នៅក្នុងរូបភាព:');
      lines.push(`  Latitude:  ${latDec.toFixed(6)}`);
      lines.push(`  Longitude: ${lonDec.toFixed(6)}`);
      lines.push(`  Google Maps: https://www.google.com/maps?q=${latDec.toFixed(6)},${lonDec.toFixed(6)}`);
      lines.push('');
      lines.push('គិតមុនចែករំលែករូបនេះ អ្នកអាចលុបទីតាំងចេញដោយប្រើកម្មវិធីកែរូបភាព ឬកម្មវិធីលុប metadata មុនពេលបញ្ចូន។');
    } else {
      lines.push('');
      lines.push('✓ រូបនេះមិនមានទីតាំង GPS បង្កប់ទេ។');
    }
    out.textContent = lines.join('\n');
    out.classList.add('filled');
  });
});