const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const fmt = new Intl.NumberFormat("th-TH", { maximumFractionDigits: 2 });
const fmt0 = new Intl.NumberFormat("th-TH", { maximumFractionDigits: 0 });
const SQRT3 = Math.sqrt(3);

function numberValue(selector, fallback = 0) {
  const value = Number.parseFloat($(selector).value);
  return Number.isFinite(value) ? value : fallback;
}

function setStatusClass(element, status) {
  element.classList.remove("is-good", "is-warn", "is-bad");
  element.classList.add(status);
}

function formatSize(size) {
  return `${size} sq.mm.`;
}

function formatAmp(value) {
  return `${fmt.format(value)} A`;
}

function formatKva(value) {
  return `${fmt.format(value)} kVA`;
}

function formatKw(value) {
  return `${fmt.format(value)} kW`;
}

function buildTable(sizes, columns) {
  return Object.fromEntries(
    Object.entries(columns).map(([key, values]) => [
      key,
      Object.fromEntries(sizes.map((size, index) => [size, values[index]])),
    ]),
  );
}

function interpolateValue(column, size) {
  if (column[size] !== undefined && column[size] !== null) return column[size];

  const points = Object.entries(column)
    .map(([pointSize, value]) => [Number(pointSize), value])
    .filter(([, value]) => value !== null && value !== undefined)
    .sort((a, b) => a[0] - b[0]);

  const lower = [...points].reverse().find(([pointSize]) => pointSize < size);
  const upper = points.find(([pointSize]) => pointSize > size);

  if (!lower || !upper) return null;
  const ratio = (size - lower[0]) / (upper[0] - lower[0]);
  return lower[1] + (upper[1] - lower[1]) * ratio;
}

const cableSizes = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 175, 185, 240, 300, 400];
const standardSizes = [1, 1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300, 400, 500];

const pvcAirTable = buildTable(standardSizes, {
  g1_single_2: [10, 13, 17, 23, 30, 40, 53, 70, 86, 104, 131, 158, 183, 209, 238, 279, 319, null, null],
  g1_multi_2: [10, 12, 16, 22, 28, 37, 50, 65, 80, 96, 121, 145, 167, 191, 216, 253, 291, null, null],
  g1_single_3: [9, 12, 16, 21, 27, 37, 49, 64, 77, 94, 118, 143, 164, 188, 213, 249, 285, null, null],
  g1_multi_3: [9, 11, 15, 20, 25, 34, 45, 59, 72, 86, 109, 131, 150, 171, 194, 227, 259, null, null],
  g2_single_2: [12, 15, 21, 28, 36, 50, 66, 88, 109, 131, 167, 202, 234, 261, 297, 348, 398, 475, 545],
  g2_multi_2: [11, 14, 20, 26, 33, 45, 60, 78, 97, 116, 146, 175, 202, 224, 256, 299, 343, null, null],
  g2_single_3: [10, 13, 18, 24, 31, 44, 59, 77, 96, 117, 149, 180, 208, 228, 258, 301, 343, 406, 464],
  g2_multi_3: [10, 13, 17, 23, 30, 40, 54, 70, 86, 103, 130, 156, 179, 196, 222, 258, 295, null, null],
});

const pvcBuriedTable = buildTable(standardSizes, {
  g5_2: [17, 21, 28, 36, 46, 62, 81, 106, 129, 153, 190, 232, 265, 303, 344, 404, 462, 529, 605],
  g5_3: [15, 19, 25, 33, 41, 55, 72, 94, 114, 136, 168, 204, 234, 266, 303, 361, 404, 462, 527],
  g6_3: [21, 26, 35, 45, 57, 76, 99, 128, 154, 181, 223, 267, 304, 342, 386, 448, 507, 577, 654],
});

const vctTable = buildTable([1, 1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240], {
  flex_2: [13, 16, 25, 30, 39, 51, 73, 97, 140, 175, 216, 258, 302, 347, 394, 471],
  flex_3: [11, 14, 21, 26, 34, 47, 63, 83, 102, null, null, null, null, null, null, null],
});

const xlpeAirTable = buildTable(standardSizes, {
  g1_single_2: [13, 17, 24, 32, 41, 56, 74, 96, 119, 144, 182, 219, 253, 289, 329, 386, 442, null, null],
  g1_multi_2: [13, 17, 23, 30, 38, 52, 69, 90, 110, 132, 167, 200, 230, 264, 299, 351, 402, null, null],
  g1_single_3: [12, 15, 21, 28, 36, 49, 66, 86, 106, 128, 163, 197, 227, 259, 295, 346, 396, null, null],
  g1_multi_3: [12, 15, 20, 27, 35, 46, 62, 81, 99, 118, 149, 179, 207, 236, 268, 315, 360, null, null],
  g2_single_2: [15, 21, 28, 38, 49, 68, 91, 121, 149, 180, 230, 278, 322, 358, 409, 480, 549, 622, 713],
  g2_multi_2: [15, 20, 27, 36, 46, 63, 83, 108, 133, 159, 201, 241, 278, 304, 349, 418, 484, null, null],
  g2_single_3: [14, 18, 25, 34, 44, 60, 80, 106, 131, 159, 202, 245, 284, 311, 349, 410, 468, 531, 606],
  g2_multi_3: [14, 18, 24, 32, 40, 55, 73, 96, 116, 140, 177, 212, 244, 273, 309, 362, 414, null, null],
});

const xlpeBuriedTable = buildTable([1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300, 400, 500], {
  g5_2: [25, 33, 43, 54, 71, 94, 124, 150, 180, 223, 271, 313, 355, 406, 477, 543, 625, 717],
  g5_3: [22, 29, 38, 47, 63, 83, 109, 132, 159, 196, 238, 275, 312, 356, 418, 475, 545, 623],
  g6_3: [33, 43, 55, 70, 92, 119, 152, 184, 217, 266, 318, 362, 406, 459, 533, 601, 684, 777],
});

const tableRegistry = {
  pvcAir: pvcAirTable,
  pvcBuried: pvcBuriedTable,
  vct: vctTable,
  xlpeAir: xlpeAirTable,
  xlpeBuried: xlpeBuriedTable,
};

const cableTypes = [
  {
    id: "iec01",
    name: "60227 IEC 01 / THW",
    insulation: "pvc",
    defaultCore: "single",
    cores: ["single"],
    methods: ["pvc-air-g2", "pvc-air-g1"],
  },
  {
    id: "nyy",
    name: "NYY / NYY-G",
    insulation: "pvc",
    defaultCore: "multi",
    cores: ["single", "multi"],
    methods: ["pvc-air-g2", "pvc-air-g1", "pvc-buried-g5", "pvc-buried-g6"],
  },
  {
    id: "vct",
    name: "VCT / VCT-G",
    insulation: "pvc",
    defaultCore: "multi",
    cores: ["multi"],
    methods: ["vct-air"],
  },
  {
    id: "cv",
    name: "CV / XLPE 0.6/1 kV",
    insulation: "xlpe",
    defaultCore: "multi",
    cores: ["single", "multi"],
    methods: ["xlpe-air-g2", "xlpe-air-g1", "xlpe-buried-g5", "xlpe-buried-g6"],
  },
];

const coreLabels = {
  single: "แกนเดียว",
  multi: "หลายแกน",
};

const installMethods = {
  "pvc-air-g2": {
    label: "PVC ร้อยท่อในอากาศ กลุ่มที่ 2 (ตาราง 5-20)",
    tableId: "pvcAir",
    tableNo: "5-20",
    group: "g2",
    tempMode: "air",
    groupingMode: "raceway",
  },
  "pvc-air-g1": {
    label: "PVC ร้อยท่อในอากาศ กลุ่มที่ 1 (ตาราง 5-20)",
    tableId: "pvcAir",
    tableNo: "5-20",
    group: "g1",
    tempMode: "air",
    groupingMode: "raceway",
  },
  "pvc-buried-g5": {
    label: "PVC ร้อยท่อ/ฝังดิน กลุ่มที่ 5 (ตาราง 5-23)",
    tableId: "pvcBuried",
    tableNo: "5-23",
    group: "g5",
    tempMode: "buried",
    groupingMode: "raceway",
  },
  "pvc-buried-g6": {
    label: "PVC ฝังดินโดยตรง กลุ่มที่ 6 (ตาราง 5-23)",
    tableId: "pvcBuried",
    tableNo: "5-23",
    group: "g6",
    tempMode: "buried",
    groupingMode: "none",
  },
  "vct-air": {
    label: "VCT สายอ่อนเดินในอากาศ (ตาราง 5-26)",
    tableId: "vct",
    tableNo: "5-26",
    group: "flex",
    tempMode: "air",
    groupingMode: "none",
  },
  "xlpe-air-g2": {
    label: "XLPE ร้อยท่อในอากาศ กลุ่มที่ 2 (ตาราง 5-27)",
    tableId: "xlpeAir",
    tableNo: "5-27",
    group: "g2",
    tempMode: "air",
    groupingMode: "raceway",
  },
  "xlpe-air-g1": {
    label: "XLPE ร้อยท่อในอากาศ กลุ่มที่ 1 (ตาราง 5-27)",
    tableId: "xlpeAir",
    tableNo: "5-27",
    group: "g1",
    tempMode: "air",
    groupingMode: "raceway",
  },
  "xlpe-buried-g5": {
    label: "XLPE ร้อยท่อ/ฝังดิน กลุ่มที่ 5 (ตาราง 5-29)",
    tableId: "xlpeBuried",
    tableNo: "5-29",
    group: "g5",
    tempMode: "buried",
    groupingMode: "raceway",
  },
  "xlpe-buried-g6": {
    label: "XLPE ฝังดินโดยตรง กลุ่มที่ 6 (ตาราง 5-29)",
    tableId: "xlpeBuried",
    tableNo: "5-29",
    group: "g6",
    tempMode: "buried",
    groupingMode: "none",
  },
};

const ambientAirFactors = {
  pvc: [
    [15, 1.34], [20, 1.29], [25, 1.22], [30, 1.15], [35, 1.08], [40, 1],
    [45, 0.91], [50, 0.82], [55, 0.7], [60, 0.57],
  ],
  xlpe: [
    [15, 1.23], [20, 1.19], [25, 1.14], [30, 1.1], [35, 1.05], [40, 1],
    [45, 0.96], [50, 0.9], [55, 0.84], [60, 0.78], [65, 0.71], [70, 0.64],
    [75, 0.55], [80, 0.45],
  ],
};

const ambientBuriedFactors = {
  pvc: [[15, 1.18], [20, 1.12], [25, 1.07], [30, 1], [35, 0.94], [40, 0.87], [45, 0.8], [50, 0.71], [55, 0.62], [60, 0.51]],
  xlpe: [[15, 1.12], [20, 1.08], [25, 1.03], [30, 1], [35, 0.96], [40, 0.91], [45, 0.86], [50, 0.82], [55, 0.76], [60, 0.7], [65, 0.65], [70, 0.57], [75, 0.49], [80, 0.41]],
};

const copperResistance = {
  1.5: 12.1, 2.5: 7.41, 4: 4.61, 6: 3.08, 10: 1.83, 16: 1.15, 25: 0.727,
  35: 0.524, 50: 0.387, 70: 0.268, 95: 0.193, 120: 0.153, 150: 0.124,
  175: 0.106, 185: 0.0991, 240: 0.0754, 300: 0.0601, 400: 0.047,
};

function nearestFactor(factors, temp) {
  const sorted = [...factors].sort((a, b) => a[0] - b[0]);
  const found = sorted.find(([limit]) => temp <= limit);
  return found ? found[1] : null;
}

function groupFactor(groups, groupingMode) {
  if (groupingMode === "none" || groups <= 1) return 1;
  if (groups === 2) return 0.8;
  if (groups === 3) return 0.7;
  if (groups === 4) return 0.65;
  if (groups === 5) return 0.6;
  if (groups === 6) return 0.57;
  if (groups === 7) return 0.54;
  if (groups === 8) return 0.52;
  if (groups === 9) return 0.5;
  if (groups <= 12) return 0.45;
  if (groups <= 16) return 0.41;
  return 0.38;
}

function tableKeyFor(method, core, conductorCount) {
  if (method.tableId === "vct") return conductorCount === 2 ? "flex_2" : "flex_3";
  if (method.tempMode === "buried") return method.group === "g6" ? "g6_3" : `${method.group}_${conductorCount}`;
  return `${method.group}_${core}_${conductorCount}`;
}

function baseAmpacity(method, core, conductorCount, size) {
  const table = tableRegistry[method.tableId];
  const key = tableKeyFor(method, core, conductorCount);
  const column = table[key];
  return column ? interpolateValue(column, size) : null;
}

function voltageDropPercent(phase, current, size, length, voltage) {
  const resistancePerKm = copperResistance[size] ?? interpolateValue(copperResistance, size);
  if (!resistancePerKm || !voltage) return 0;
  const resistancePerMeter = resistancePerKm / 1000;
  const multiplier = phase === 3 ? SQRT3 : 2;
  return (multiplier * current * resistancePerMeter * length * 100) / voltage;
}

function initTabs() {
  $$(".tab-button").forEach((button) => {
    button.addEventListener("click", () => {
      $$(".tab-button").forEach((item) => item.classList.remove("is-active"));
      $$(".view").forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      $(`#view-${button.dataset.view}`).classList.add("is-active");
    });
  });
}

function initCableTool() {
  $("#cable-type").innerHTML = cableTypes.map((type) => `<option value="${type.id}">${type.name}</option>`).join("");
  $("#breaker-size").innerHTML = [0, 6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125, 160, 200, 250, 320, 400, 500, 630, 800]
    .map((size) => `<option value="${size}">${size === 0 ? "ไม่ระบุ" : `${size} A`}</option>`)
    .join("");
  $("#breaker-size").value = "32";
  $("#selected-cable-size").innerHTML = cableSizes.map((size) => `<option value="${size}">${formatSize(size)}${size === 175 ? " (ประมาณ)" : ""}</option>`).join("");
  $("#selected-cable-size").value = "10";
  $("#ambient-temp").innerHTML = [15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80]
    .map((temp) => `<option value="${temp}">${temp} °C</option>`)
    .join("");
  $("#ambient-temp").value = "40";
  $("#circuit-groups").innerHTML = Array.from({ length: 20 }, (_, index) => index + 1)
    .map((count) => `<option value="${count}">${count} กลุ่ม</option>`)
    .join("");

  $("#cable-type").addEventListener("change", () => {
    updateCableMethodOptions();
    updateCableCoreOptions();
    renderCable();
  });

  $("#install-method").addEventListener("change", renderCable);
  $("#core-type").addEventListener("change", renderCable);
  $("#cable-form").addEventListener("input", renderCable);
  $("#cable-form").addEventListener("change", renderCable);

  updateCableMethodOptions();
  updateCableCoreOptions();
  renderCable();
}

function selectedCableType() {
  return cableTypes.find((type) => type.id === $("#cable-type").value) ?? cableTypes[0];
}

function updateCableMethodOptions() {
  const type = selectedCableType();
  const current = $("#install-method").value;
  $("#install-method").innerHTML = type.methods.map((methodId) => {
    const method = installMethods[methodId];
    return `<option value="${methodId}">${method.label}</option>`;
  }).join("");
  $("#install-method").value = type.methods.includes(current) ? current : type.methods[0];
}

function updateCableCoreOptions() {
  const type = selectedCableType();
  const current = $("#core-type").value;
  $("#core-type").innerHTML = type.cores
    .map((core) => `<option value="${core}">${coreLabels[core]}</option>`)
    .join("");
  $("#core-type").value = type.cores.includes(current) ? current : type.defaultCore;
}

function renderCable() {
  const type = selectedCableType();
  const method = installMethods[$("#install-method").value];
  const core = $("#core-type").value;
  const conductorCount = Number.parseInt($("#conductor-count").value, 10);
  const loadCurrent = numberValue("#cable-current");
  const breaker = numberValue("#breaker-size");
  const designCurrent = breaker > 0 ? Math.max(loadCurrent, breaker) : loadCurrent;
  const selectedSize = numberValue("#selected-cable-size", 10);
  const ambient = numberValue("#ambient-temp", 40);
  const groups = numberValue("#circuit-groups", 1);
  const phase = Number.parseInt($("#cable-phase").value, 10);
  const voltage = numberValue("#cable-voltage", phase === 3 ? 400 : 230);
  const length = numberValue("#cable-length", 0);
  const vdLimit = numberValue("#vd-limit", 3);

  const tempFactors = method.tempMode === "buried" ? ambientBuriedFactors : ambientAirFactors;
  const ca = nearestFactor(tempFactors[type.insulation], ambient);
  const cg = groupFactor(groups, method.groupingMode);
  const derating = ca && cg ? ca * cg : 0;
  const requiredBaseAmpacity = derating ? designCurrent / derating : Infinity;
  const selectedBaseAmpacity = baseAmpacity(method, core, conductorCount, selectedSize);
  const adjustedAmpacity = selectedBaseAmpacity ? selectedBaseAmpacity * derating : 0;
  const vdPercent = voltageDropPercent(phase, designCurrent, selectedSize, length, voltage);
  const recommendation = cableSizes.find((size) => {
    const base = baseAmpacity(method, core, conductorCount, size);
    if (!base) return false;
    const vd = voltageDropPercent(phase, designCurrent, size, length, voltage);
    return base >= requiredBaseAmpacity && vd <= vdLimit;
  });

  const ampacityPass = adjustedAmpacity >= designCurrent;
  const vdPass = vdPercent <= vdLimit;
  const statusCard = $("#cable-status-card");
  let status = "ไม่ผ่าน";
  let statusClass = "is-bad";
  let statusNote = "พิกัดสายหรือแรงดันตกยังไม่ผ่านเงื่อนไขที่ตั้งไว้";

  if (ampacityPass && vdPass) {
    const reserve = adjustedAmpacity - designCurrent;
    status = reserve / designCurrent > 0.25 ? "ผ่านสบาย" : "ผ่าน";
    statusClass = reserve / designCurrent > 0.25 ? "is-good" : "is-warn";
    statusNote = vdPercent <= vdLimit ? "สายที่เลือกผ่านทั้งพิกัดกระแสหลังปรับค่าและแรงดันตก" : statusNote;
  }

  setStatusClass(statusCard, statusClass);
  $("#cable-status").textContent = status;
  $("#cable-status-note").textContent = statusNote;
  $("#recommended-cable").textContent = recommendation ? formatSize(recommendation) : "เกินช่วงข้อมูล";
  $("#recommended-cable-note").textContent = recommendation
    ? `ต้องการพิกัดตารางอย่างน้อย ${formatAmp(requiredBaseAmpacity)} ก่อนปรับค่า`
    : "ควรตรวจตารางมาตรฐานเพิ่มเติมหรือแบ่งวงจร";
  $("#adjusted-ampacity").textContent = selectedBaseAmpacity ? formatAmp(adjustedAmpacity) : "-";
  $("#derating-note").textContent = `Ca ${ca ?? "-"} x Cg ${cg} = ${derating ? fmt.format(derating) : "-"}`;
  $("#voltage-drop").textContent = `${fmt.format(vdPercent)}%`;
  $("#voltage-drop-note").textContent = `จำกัดไว้ ${fmt.format(vdLimit)}% จากความยาว ${fmt.format(length)} m`;
  $("#design-current").textContent = formatAmp(designCurrent);
  $("#design-current-note").textContent = breaker > 0 ? `ใช้ CB ${formatAmp(breaker)} เป็น In` : "ใช้กระแสโหลดเป็น In";
  $("#cable-breakdown").textContent = `เลือก ${type.name}, ${method.label}, ${coreLabels[core]}, ตัวนำกระแส ${conductorCount} เส้น: It >= ${fmt.format(designCurrent)} / (${ca ?? "-"} x ${cg}) = ${fmt.format(requiredBaseAmpacity)} A`;
  $("#active-table-label").textContent = `${method.label} / ${type.name}`;

  renderCableReference(method, core, conductorCount, derating, recommendation);
}

function renderCableReference(method, core, conductorCount, derating, recommendation) {
  $("#cable-reference-body").innerHTML = cableSizes.map((size) => {
    const base = baseAmpacity(method, core, conductorCount, size);
    if (!base) return "";
    const marker = recommendation === size ? " ✓" : "";
    return `
      <tr>
        <td>${formatSize(size)}${marker}</td>
        <td>${formatAmp(base)}</td>
        <td>${formatAmp(base * derating)}</td>
      </tr>
    `;
  }).join("");
}

const loadRows = Array.from({ length: 42 }, (_, index) => ({
  circuit: index + 1,
  name: "",
  pole: "1P",
  cb: "",
  load: "",
  demand: 100,
  phase: "AUTO",
}));

[
  ["Lighting Zone A", "1P", 16, "", 100, "AUTO"],
  ["Office Outlet", "1P", 20, "", 100, "AUTO"],
  ["Air 48k BTU", "1P", 32, "", 100, "AUTO"],
  ["Pump Motor", "3P", 40, "", 100, "L1-L2-L3"],
  ["Workshop Outlet", "1P", 32, "", 80, "AUTO"],
  ["Spare Machine", "3P", 63, "", 100, "L1-L2-L3"],
].forEach((sample, index) => {
  const [name, pole, cb, load, demand, phase] = sample;
  Object.assign(loadRows[index], { name, pole, cb, load, demand, phase });
});

function initLoadSchedule() {
  $("#slot-count").innerHTML = Array.from({ length: 42 }, (_, index) => index + 1)
    .map((count) => `<option value="${count}">${count} ช่อง</option>`)
    .join("");
  $("#slot-count").value = "42";

  $("#slot-count").addEventListener("change", () => {
    renderLoadRows();
    calculateLoadSchedule();
  });
  $("#panel-system").addEventListener("change", () => {
    renderLoadRows();
    calculateLoadSchedule();
  });
  $("#phase-voltage").addEventListener("input", calculateLoadSchedule);
  $("#line-voltage").addEventListener("input", calculateLoadSchedule);
  $("#panel-pf").addEventListener("input", calculateLoadSchedule);
  $("#auto-balance-button").addEventListener("click", autoBalanceLoads);
  $("#clear-load-button").addEventListener("click", clearLoadSchedule);
  $("#load-table-body").addEventListener("input", updateLoadRow);
  $("#load-table-body").addEventListener("change", updateLoadRow);

  renderLoadRows();
  calculateLoadSchedule();
}

function visibleLoadRows() {
  return loadRows.slice(0, Number.parseInt($("#slot-count").value, 10));
}

function phaseOptions(row, panelSystem) {
  if (panelSystem === "1") return ["L-N"];
  if (row.pole === "3P") return ["L1-L2-L3"];
  if (row.pole === "2P") return ["AUTO", "L1-L2", "L2-L3", "L3-L1"];
  return ["AUTO", "L1", "L2", "L3"];
}

function renderLoadRows() {
  const panelSystem = $("#panel-system").value;
  $("#load-table-body").innerHTML = visibleLoadRows().map((row, index) => {
    const options = phaseOptions(row, panelSystem);
    if (!options.includes(row.phase)) row.phase = options[0];
    return `
      <tr>
        <td>${row.circuit}</td>
        <td><input data-index="${index}" data-field="name" value="${row.name}" placeholder="ชื่อโหลด"></td>
        <td>
          <select data-index="${index}" data-field="pole">
            ${["1P", "2P", "3P"].map((pole) => `<option value="${pole}" ${row.pole === pole ? "selected" : ""}>${pole}</option>`).join("")}
          </select>
        </td>
        <td><input data-index="${index}" data-field="cb" type="number" min="0" step="1" value="${row.cb}" placeholder="A"></td>
        <td><input data-index="${index}" data-field="load" type="number" min="0" step="0.1" value="${row.load}" placeholder="ว่าง=CB"></td>
        <td><input data-index="${index}" data-field="demand" type="number" min="0" max="100" step="1" value="${row.demand}"></td>
        <td>
          <select data-index="${index}" data-field="phase">
            ${options.map((phase) => `<option value="${phase}" ${row.phase === phase ? "selected" : ""}>${phase}</option>`).join("")}
          </select>
        </td>
        <td id="row-kva-${index}">0</td>
      </tr>
    `;
  }).join("");
}

function updateLoadRow(event) {
  const target = event.target;
  const index = Number.parseInt(target.dataset.index, 10);
  const field = target.dataset.field;
  if (!Number.isFinite(index) || !field) return;
  loadRows[index][field] = target.value;
  if (field === "pole") {
    loadRows[index].phase = "AUTO";
    renderLoadRows();
  }
  calculateLoadSchedule();
}

function loadAmps(row) {
  const load = Number.parseFloat(row.load);
  const cb = Number.parseFloat(row.cb);
  const base = Number.isFinite(load) && load > 0 ? load : Number.isFinite(cb) ? cb : 0;
  const demand = Number.parseFloat(row.demand);
  return base * ((Number.isFinite(demand) ? demand : 100) / 100);
}

function rowKva(row, amps) {
  const phaseVoltage = numberValue("#phase-voltage", 230);
  const lineVoltage = numberValue("#line-voltage", 400);
  if (row.pole === "3P") return (SQRT3 * lineVoltage * amps) / 1000;
  if (row.pole === "2P") return (lineVoltage * amps) / 1000;
  return (phaseVoltage * amps) / 1000;
}

function applyPhaseLoad(totals, row, amps) {
  const panelSystem = $("#panel-system").value;
  if (panelSystem === "1") {
    totals.l1 += amps;
    return;
  }
  if (row.pole === "3P") {
    totals.l1 += amps;
    totals.l2 += amps;
    totals.l3 += amps;
    return;
  }
  const phase = row.phase === "AUTO" ? sequencePhase(row.circuit, row.pole) : row.phase;
  if (phase === "L1") totals.l1 += amps;
  if (phase === "L2") totals.l2 += amps;
  if (phase === "L3") totals.l3 += amps;
  if (phase === "L1-L2") {
    totals.l1 += amps;
    totals.l2 += amps;
  }
  if (phase === "L2-L3") {
    totals.l2 += amps;
    totals.l3 += amps;
  }
  if (phase === "L3-L1") {
    totals.l3 += amps;
    totals.l1 += amps;
  }
}

function sequencePhase(circuit, pole) {
  if (pole === "2P") return ["L1-L2", "L2-L3", "L3-L1"][(circuit - 1) % 3];
  return ["L1", "L2", "L3"][(circuit - 1) % 3];
}

function calculateLoadSchedule() {
  const totals = { l1: 0, l2: 0, l3: 0, kva: 0 };
  visibleLoadRows().forEach((row, index) => {
    const amps = loadAmps(row);
    const kva = rowKva(row, amps);
    totals.kva += kva;
    applyPhaseLoad(totals, row, amps);
    const cell = $(`#row-kva-${index}`);
    if (cell) cell.textContent = fmt.format(kva);
  });

  $("#phase-l1").textContent = formatAmp(totals.l1);
  $("#phase-l2").textContent = formatAmp(totals.l2);
  $("#phase-l3").textContent = formatAmp(totals.l3);
  const maxPhase = Math.max(totals.l1, totals.l2, totals.l3, 1);
  $("#bar-l1").style.width = `${Math.min(100, (totals.l1 / maxPhase) * 100)}%`;
  $("#bar-l2").style.width = `${Math.min(100, (totals.l2 / maxPhase) * 100)}%`;
  $("#bar-l3").style.width = `${Math.min(100, (totals.l3 / maxPhase) * 100)}%`;

  const values = [totals.l1, totals.l2, totals.l3];
  const avg = values.reduce((sum, value) => sum + value, 0) / 3;
  const unbalance = avg > 0 ? ((Math.max(...values) - Math.min(...values)) / avg) * 100 : 0;
  const panelPf = numberValue("#panel-pf", 0.85);
  const kw = totals.kva * panelPf;
  let status = "Balance ดี";
  let statusClass = "is-good";
  if (unbalance > 20) {
    status = "ควรปรับ";
    statusClass = "is-bad";
  } else if (unbalance > 10) {
    status = "พอใช้";
    statusClass = "is-warn";
  }
  setStatusClass($("#balance-status-card"), statusClass);
  $("#balance-status").textContent = status;
  $("#balance-note").textContent = `Unbalance ${fmt.format(unbalance)}% / รวม ${formatKva(totals.kva)} / ${formatKw(kw)}`;
}

function autoBalanceLoads() {
  const rows = visibleLoadRows().filter((row) => loadAmps(row) > 0);
  const totals = { L1: 0, L2: 0, L3: 0 };

  rows.filter((row) => row.pole === "3P").forEach((row) => {
    const amps = loadAmps(row);
    row.phase = "L1-L2-L3";
    totals.L1 += amps;
    totals.L2 += amps;
    totals.L3 += amps;
  });

  rows.filter((row) => row.pole !== "3P")
    .sort((a, b) => loadAmps(b) - loadAmps(a))
    .forEach((row) => {
      const amps = loadAmps(row);
      if (row.pole === "2P") {
        const pairs = [
          ["L1-L2", "L1", "L2"],
          ["L2-L3", "L2", "L3"],
          ["L3-L1", "L3", "L1"],
        ];
        const [phase, a, b] = pairs.sort((left, right) => (totals[left[1]] + totals[left[2]]) - (totals[right[1]] + totals[right[2]]))[0];
        row.phase = phase;
        totals[a] += amps;
        totals[b] += amps;
        return;
      }
      const phase = ["L1", "L2", "L3"].sort((a, b) => totals[a] - totals[b])[0];
      row.phase = phase;
      totals[phase] += amps;
    });

  renderLoadRows();
  calculateLoadSchedule();
}

function clearLoadSchedule() {
  loadRows.forEach((row, index) => {
    Object.assign(row, { circuit: index + 1, name: "", pole: "1P", cb: "", load: "", demand: 100, phase: "AUTO" });
  });
  renderLoadRows();
  calculateLoadSchedule();
}

function initPfTool() {
  $("#pf-form").addEventListener("input", renderPf);
  $("#pf-form").addEventListener("change", renderPf);
  ["#nameplate-power", "#nameplate-unit", "#nameplate-system", "#nameplate-voltage", "#nameplate-pf", "#nameplate-eff"].forEach((selector) => {
    $(selector).addEventListener("input", renderNameplate);
    $(selector).addEventListener("change", renderNameplate);
  });
  renderPf();
  renderNameplate();
}

function renderPf() {
  const system = Number.parseInt($("#pf-system").value, 10);
  const voltage = numberValue("#pf-voltage", 400);
  const current = numberValue("#pf-current", 0);
  const pf = Math.min(1, Math.max(0.01, numberValue("#pf-value", 0.82)));
  const efficiency = Math.min(100, Math.max(1, numberValue("#efficiency-value", 88))) / 100;
  const targetPf = Math.min(1, Math.max(pf, numberValue("#target-pf", 0.95)));
  const kva = system === 3 ? (SQRT3 * voltage * current) / 1000 : (voltage * current) / 1000;
  const kwInput = kva * pf;
  const kwOutput = kwInput * efficiency;
  const loss = kwInput - kwOutput;
  const kvar = Math.sqrt(Math.max(0, kva ** 2 - kwInput ** 2));
  const capacitor = kwInput * (Math.tan(Math.acos(pf)) - Math.tan(Math.acos(targetPf)));

  $("#pf-kva").textContent = formatKva(kva);
  $("#pf-kw-input").textContent = formatKw(kwInput);
  $("#pf-kw-output").textContent = formatKw(kwOutput);
  $("#pf-hp-output").textContent = `${fmt.format(kwOutput / 0.746)} HP`;
  $("#pf-loss").textContent = formatKw(loss);
  $("#pf-loss-note").textContent = `สูญเสียจาก efficiency ${fmt.format((1 - efficiency) * 100)}%`;
  $("#pf-kvar").textContent = `${fmt.format(kvar)} kVAR`;
  $("#capacitor-kvar").textContent = `${fmt.format(Math.max(0, capacitor))} kVAR`;
  $("#capacitor-note").textContent = `ปรับ PF ${fmt.format(pf)} ไป ${fmt.format(targetPf)}`;
  setStatusClass($("#pf-status-card"), pf >= 0.9 ? "is-good" : pf >= 0.8 ? "is-warn" : "is-bad");
}

function renderNameplate() {
  const power = numberValue("#nameplate-power", 0);
  const unit = $("#nameplate-unit").value;
  const outputKw = unit === "hp" ? power * 0.746 : power;
  const system = Number.parseInt($("#nameplate-system").value, 10);
  const voltage = numberValue("#nameplate-voltage", 400);
  const pf = Math.min(1, Math.max(0.01, numberValue("#nameplate-pf", 0.85)));
  const efficiency = Math.min(100, Math.max(1, numberValue("#nameplate-eff", 90))) / 100;
  const inputKw = outputKw / efficiency;
  const kva = inputKw / pf;
  const current = system === 3 ? (kva * 1000) / (SQRT3 * voltage) : (kva * 1000) / voltage;
  $("#nameplate-input-kw").textContent = formatKw(inputKw);
  $("#nameplate-kva").textContent = formatKva(kva);
  $("#nameplate-current").textContent = formatAmp(current);
}

const roomTypes = [
  { id: "office", label: "สำนักงานทั่วไป", factor: 800 },
  { id: "residential", label: "บ้านพัก / ห้องทั่วไป", factor: 700 },
  { id: "shop", label: "ร้านค้า / คนเข้าออกมาก", factor: 1000 },
  { id: "server", label: "ห้อง Server / โหลดความร้อนสูง", factor: 1200 },
  { id: "custom", label: "กำหนดเอง", factor: 1000 },
];

const acTypes = [
  { id: "wall", label: "Wall Type", sizes: [9000, 12000, 18000, 24000, 30000] },
  { id: "cassette", label: "Cassette Type", sizes: [18000, 24000, 30000, 36000, 48000, 60000] },
  { id: "ceiling", label: "Ceiling / Floor Type", sizes: [24000, 30000, 36000, 48000, 60000, 80000] },
  { id: "duct", label: "Duct Type", sizes: [36000, 48000, 60000, 80000, 100000, 120000] },
  { id: "vrf", label: "VRV / VRF Indoor", sizes: [24000, 36000, 48000, 60000, 80000, 96000] },
];

function initBtuTool() {
  $("#room-type").innerHTML = roomTypes.map((room) => `<option value="${room.id}">${room.label}</option>`).join("");
  $("#room-type").value = "shop";
  $("#ac-type").innerHTML = acTypes.map((type) => `<option value="${type.id}">${type.label}</option>`).join("");
  $("#ac-type").value = "cassette";
  updateAcBtuOptions();
  $("#ac-btu-size").value = "48000";

  $("#room-type").addEventListener("change", () => {
    const room = roomTypes.find((item) => item.id === $("#room-type").value);
    if (room) $("#cooling-factor").value = room.factor;
    renderBtu();
  });
  $("#ac-type").addEventListener("change", () => {
    updateAcBtuOptions();
    renderBtu();
  });
  $("#btu-form").addEventListener("input", renderBtu);
  $("#btu-form").addEventListener("change", renderBtu);
  renderBtu();
}

function updateAcBtuOptions() {
  const acType = acTypes.find((item) => item.id === $("#ac-type").value) ?? acTypes[0];
  $("#ac-btu-size").innerHTML = acType.sizes.map((size) => `<option value="${size}">${fmt0.format(size)} BTU</option>`).join("");
}

function renderBtu() {
  const area = numberValue("#room-area", 0);
  const factor = numberValue("#cooling-factor", 1000);
  const selectedBtu = numberValue("#ac-btu-size", 48000);
  const customBtu = numberValue("#custom-btu", 0);
  const unitBtu = customBtu > 0 ? customBtu : selectedBtu;
  const requiredBtu = area * factor;
  const exactCount = unitBtu > 0 ? requiredBtu / unitBtu : 0;
  const roundedCount = Math.ceil(exactCount);
  const installedBtu = roundedCount * unitBtu;
  const reserve = installedBtu - requiredBtu;
  const reservePct = requiredBtu > 0 ? (reserve / requiredBtu) * 100 : 0;

  $("#required-btu").textContent = `${fmt0.format(requiredBtu)} BTU`;
  $("#btu-formula").textContent = `${fmt0.format(area)} ตร.ม. x ${fmt0.format(factor)} BTU/ตร.ม.`;
  $("#exact-ac-count").textContent = `${fmt.format(exactCount)} เครื่อง`;
  $("#rounded-ac-count").textContent = `${fmt0.format(roundedCount)} เครื่อง`;
  $("#installed-btu-note").textContent = `ติดตั้งจริง ${fmt0.format(installedBtu)} BTU`;
  $("#reserve-btu").textContent = `${fmt0.format(reserve)} BTU`;
  $("#reserve-percent").textContent = `${fmt.format(reservePct)}% จากโหลดที่ต้องการ`;
  $("#btu-summary").textContent = `พื้นที่ ${fmt0.format(area)} ตร.ม. ต้องการ ${fmt0.format(requiredBtu)} BTU/hr ถ้าใช้แอร์ ${fmt0.format(unitBtu)} BTU/ตัว ต้องติดตั้ง ${fmt0.format(roundedCount)} เครื่อง`;
  setStatusClass($("#btu-status-card"), reservePct <= 20 ? "is-good" : reservePct <= 40 ? "is-warn" : "is-bad");
}

function boot() {
  initTabs();
  initCableTool();
  initLoadSchedule();
  initPfTool();
  initBtuTool();
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

document.addEventListener("DOMContentLoaded", boot);
