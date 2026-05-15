const cableData = [
  { size: 2.5, ampacity: 21, note: "ค่ามาตรฐานอ้างอิง" },
  { size: 4, ampacity: 28, note: "ค่ามาตรฐานอ้างอิง" },
  { size: 6, ampacity: 36, note: "ค่ามาตรฐานอ้างอิง" },
  { size: 10, ampacity: 50, note: "ค่ามาตรฐานอ้างอิง" },
  { size: 16, ampacity: 66, note: "ค่ามาตรฐานอ้างอิง" },
  { size: 25, ampacity: 88, note: "ค่ามาตรฐานอ้างอิง" },
  { size: 35, ampacity: 109, note: "ค่ามาตรฐานอ้างอิง" },
  { size: 50, ampacity: 131, note: "ค่ามาตรฐานอ้างอิง" },
  { size: 70, ampacity: 167, note: "ค่ามาตรฐานอ้างอิง" },
  { size: 95, ampacity: 202, note: "ค่ามาตรฐานอ้างอิง" },
  { size: 120, ampacity: 234, note: "ค่ามาตรฐานอ้างอิง" },
  { size: 150, ampacity: 261, note: "ค่ามาตรฐานอ้างอิง" },
  { size: 175, ampacity: 287, note: "ค่าประมาณระหว่าง 150 และ 185 sq.mm." },
];

const currentInput = document.querySelector("#current-input");
const sizeSelect = document.querySelector("#size-select");
const referenceBody = document.querySelector("#reference-body");
const selectedAmpacity = document.querySelector("#selected-ampacity");
const selectedNote = document.querySelector("#selected-note");
const recommendedSize = document.querySelector("#recommended-size");
const recommendedCopy = document.querySelector("#recommended-copy");
const statusTitle = document.querySelector("#status-title");
const statusCopy = document.querySelector("#status-copy");
const marginValue = document.querySelector("#margin-value");
const statusCard = document.querySelector(".status-card");

function formatSize(size) {
  return `${size} sq.mm.`;
}

function populateSizeOptions() {
  sizeSelect.innerHTML = cableData
    .map((item) => {
      const extra = item.size === 175 ? " (ประมาณค่า)" : "";
      return `<option value="${item.size}">${formatSize(item.size)}${extra}</option>`;
    })
    .join("");
}

function populateReferenceTable() {
  referenceBody.innerHTML = cableData
    .map(
      (item) => `
        <tr>
          <td>${formatSize(item.size)}</td>
          <td>${item.ampacity} A</td>
          <td>${item.note}</td>
        </tr>
      `,
    )
    .join("");
}

function getRecommendation(current) {
  return cableData.find((item) => current <= item.ampacity) ?? null;
}

function getStatusVariant(current, ampacity) {
  const ratio = ampacity === 0 ? Infinity : current / ampacity;

  if (ratio <= 0.8) {
    return {
      className: "is-good",
      title: "ผ่านสบาย",
      copy: "สายที่เลือกยังมีพิกัดกระแสเหลือใช้งาน เหมาะกับโหลดที่ป้อนภายใต้ข้อสมมติของแอปนี้",
    };
  }

  if (ratio <= 1) {
    return {
      className: "is-warn",
      title: "ผ่านแบบเฉียด",
      copy: "สายที่เลือกยังรับกระแสได้ แต่เหลือเผื่อไม่มาก ควรตรวจแรงดันตกและเงื่อนไขติดตั้งจริงเพิ่ม",
    };
  }

  return {
    className: "is-bad",
    title: "ไม่ผ่าน",
    copy: "กระแสโหลดมากกว่าพิกัดกระแสของสายที่เลือก ควรขยับขนาดสายให้ใหญ่ขึ้น",
  };
}

function render() {
  const current = Number.parseFloat(currentInput.value) || 0;
  const selected = cableData.find((item) => item.size === Number.parseFloat(sizeSelect.value)) ?? cableData[0];
  const recommendation = getRecommendation(current);
  const margin = selected.ampacity - current;
  const status = getStatusVariant(current, selected.ampacity);

  selectedAmpacity.textContent = `${selected.ampacity} A`;
  selectedNote.textContent = `${formatSize(selected.size)} • ${selected.note}`;

  if (recommendation) {
    recommendedSize.textContent = formatSize(recommendation.size);
    recommendedCopy.textContent = `รองรับได้ ${recommendation.ampacity} A สำหรับโหลด ${current.toFixed(1)} A`;
  } else {
    recommendedSize.textContent = "เกินช่วงข้อมูล";
    recommendedCopy.textContent = "กระแสที่ป้อนสูงกว่าช่วงข้อมูลในแอปนี้ ควรตรวจสอบตารางเพิ่มเติม";
  }

  marginValue.textContent = `${margin >= 0 ? "+" : ""}${margin.toFixed(1)} A`;

  statusTitle.textContent = status.title;
  statusCopy.textContent = status.copy;
  statusCard.classList.remove("is-good", "is-warn", "is-bad");
  statusCard.classList.add(status.className);
}

populateSizeOptions();
populateReferenceTable();
sizeSelect.value = "2.5";
render();

currentInput.addEventListener("input", render);
sizeSelect.addEventListener("change", render);
