const MONEY = new Intl.NumberFormat("es-GT", {
  style: "currency",
  currency: "GTQ",
  maximumFractionDigits: 0,
});

const FEES = {
  registration: 150,
  membership: 125,
};

const PLANS = {
  dancer: { name: "Dancer Pass", price: 395 },
  night: { name: "Night Pass", price: 595 },
  weekend: { name: "Weekend Pass", price: 300 },
  teens: { name: "Teens In Motion", price: 495 },
  full: { name: "Full In Motion", price: 750 },
};

const DAYS = [
  { id: "lunes", label: "Lunes", type: "weekday" },
  { id: "martes", label: "Martes", type: "weekday" },
  { id: "miercoles", label: "Miércoles", type: "weekday" },
  { id: "jueves", label: "Jueves", type: "weekday" },
  { id: "sabado", label: "Sábado", type: "weekend" },
  { id: "domingo", label: "Domingo", type: "weekend" },
];

const TIME_SLOTS = [
  { id: "9am", label: "9 a 10am" },
  { id: "10am", label: "10 a 11am" },
  { id: "11am", label: "11am a 12pm" },
  { id: "4pm", label: "4 a 5:30pm" },
  { id: "6pm", label: "6:00 pm" },
  { id: "7pm", label: "7:00 pm" },
  { id: "8pm", label: "8:00 pm" },
];

const TRACKS = {
  latinOpen: "Latin Dance Nivel Abierto",
  level1: "Nivel 1 Salsa y Bachata",
  level2: "Nivel 2 Salsa y Bachata",
  urbano: "Urbano",
  level4: "Nivel 4 Salsa y Bachata",
  level3: "Nivel 3 Salsa y Bachata",
  salsaCubana: "Salsa Cubana",
  salsaOn2: "Salsa On2",
  teens: "Teens",
  kpop: "K-Pop",
};

const COLORS = {
  latinOpen: "#686d72",
  level1: "#e30613",
  level2: "#ffd43b",
  urbano: "#5fd24f",
  level4: "#ff914d",
  level3: "#005bbf",
  teens: "#f653b8",
  salsaCubana: "#4bd8df",
  kpop: "#2e7d32",
  salsaOn2: "#8f56f5",
};

const CLASSES = [
  classItem("latin-mon", "lunes", "6pm", "6:00 pm", "Latin Dance Nivel Abierto", "latinOpen", "weekday"),
  classItem("level1-mon", "lunes", "7pm", "7:00 pm", "Nivel 1 Básico Salsa y Bachata", "level1", "weekday"),
  classItem("level2-mon", "lunes", "8pm", "8:00 pm", "Nivel 2 Principiante Salsa y Bachata", "level2", "weekday"),
  classItem("urbano-tue", "martes", "6pm", "6:00 pm", "Urbano", "urbano", "weekday"),
  classItem("level4-tue", "martes", "7pm", "7:00 pm", "Nivel 4 Intermedio Salsa y Bachata", "level4", "weekday"),
  classItem("level3-tue", "martes", "8pm", "8:00 pm", "Nivel 3 Prin / Inter Salsa y Bachata", "level3", "weekday"),
  classItem("latin-wed", "miercoles", "6pm", "6:00 pm", "Latin Dance Nivel Abierto", "latinOpen", "weekday"),
  classItem("level1-wed", "miercoles", "7pm", "7:00 pm", "Nivel 1 Básico Salsa y Bachata", "level1", "weekday"),
  classItem("level2-wed", "miercoles", "8pm", "8:00 pm", "Nivel 2 Principiante Salsa y Bachata", "level2", "weekday"),
  classItem("urbano-thu", "jueves", "6pm", "6:00 pm", "Urbano", "urbano", "weekday"),
  classItem("level4-thu", "jueves", "7pm", "7:00 pm", "Nivel 4 Intermedio Salsa y Bachata", "level4", "weekday"),
  classItem("level3-thu", "jueves", "8pm", "8:00 pm", "Nivel 3 Prin / Inter Salsa y Bachata", "level3", "weekday"),
  classItem("teens-urbano-sat", "sabado", "9am", "9:00 a 10:00 am", "Urbano Teens", "teens", "teen"),
  classItem("teens-kpop-sat", "sabado", "10am", "10:00 a 11:00 am", "K-Pop Teens", "teens", "teen"),
  classItem("teens-latino-sat", "sabado", "11am", "11:00 am a 12:00 pm", "Latino Teens", "teens", "teen"),
  classItem("cubana-sat", "sabado", "4pm", "4:00 a 5:30 pm", "Salsa Cubana (Rueda de Casino)", "salsaCubana", "weekend"),
  classItem("kpop-sun", "domingo", "10am", "10:00 a 11:00 am", "K-Pop", "kpop", "weekend"),
  classItem("on2-sun", "domingo", "4pm", "4:00 a 5:30 pm", "Salsa On2", "salsaOn2", "weekend"),
];

const selectedIds = new Set();

function classItem(id, day, slot, time, name, track, category) {
  return {
    id,
    day,
    slot,
    time,
    name,
    track,
    category,
    color: COLORS[track],
  };
}

function formatMoney(amount) {
  return MONEY.format(amount).replace("GTQ", "Q").replace(/\s/g, "");
}

function unique(items) {
  return [...new Set(items)];
}

function parkingForSelection(classes) {
  return unique(classes.map((item) => item.day)).reduce((total, day) => {
    const dayInfo = DAYS.find((candidate) => candidate.id === day);
    return total + (dayInfo?.type === "weekend" ? 20 : 15);
  }, 0);
}

function getSelectedClasses(ids = selectedIds) {
  return CLASSES.filter((item) => ids.has(item.id));
}

function summarizePlan(parts) {
  const counts = parts.reduce((summary, part) => {
    summary.set(part, (summary.get(part) || 0) + 1);
    return summary;
  }, new Map());

  return [...counts.entries()]
    .map(([name, count]) => (count > 1 ? `${name} x${count}` : name))
    .join(" + ");
}

function compareRecommendations(a, b) {
  if (a.total !== b.total) return a.total - b.total;
  if (a.monthly !== b.monthly) return a.monthly - b.monthly;
  return a.title.localeCompare(b.title, "es");
}

function buildRecommendations(classes) {
  if (!classes.length) return [];

  const full = {
    id: "full",
    title: PLANS.full.name,
    monthly: PLANS.full.price,
    parking: 0,
    total: PLANS.full.price,
    note: "Incluye parqueo hasta 3 horas por visita.",
  };

  const weekdayClasses = classes.filter((item) => item.category === "weekday");
  const teenClasses = classes.filter((item) => item.category === "teen");
  const weekendClasses = classes.filter((item) => item.category === "weekend");
  const regularParking = parkingForSelection(classes);
  const options = [];

  const weekdayOptions = buildWeekdayOptions(weekdayClasses);
  const weekendOption = buildWeekendOption(weekendClasses);
  const teensOption = buildTeensOption(teenClasses);

  if (weekdayOptions.length || weekendOption || teensOption) {
    const requiredBlocks = [
      weekdayOptions.length ? weekdayOptions : [emptyBlock()],
      weekendOption ? [weekendOption] : [emptyBlock()],
      teensOption ? [teensOption] : [emptyBlock()],
    ];

    for (const weekday of requiredBlocks[0]) {
      for (const weekend of requiredBlocks[1]) {
        for (const teens of requiredBlocks[2]) {
          const parts = [...weekday.parts, ...weekend.parts, ...teens.parts];
          if (!parts.length) continue;

          const monthly = weekday.monthly + weekend.monthly + teens.monthly;
          options.push({
            id: parts.join("-"),
            title: summarizePlan(parts),
            monthly,
            parking: regularParking,
            total: monthly + regularParking,
            note: buildCoverageNote({ weekday, weekend, teens }),
          });
        }
      }
    }
  }

  return dedupeRecommendations([...options, full]).sort(compareRecommendations);
}

function emptyBlock() {
  return { parts: [], monthly: 0, note: "" };
}

function buildWeekdayOptions(weekdayClasses) {
  if (!weekdayClasses.length) return [];

  const tracks = unique(weekdayClasses.map((item) => item.track));
  const dancerOption = {
    parts: tracks.map(() => PLANS.dancer.name),
    monthly: tracks.length * PLANS.dancer.price,
    note:
      tracks.length === 1
        ? `Dancer Pass para ${TRACKS[tracks[0]]}.`
        : `Dancer Pass por cada track weekday seleccionado (${tracks.length}).`,
  };

  return [
    dancerOption,
    {
      parts: [PLANS.night.name],
      monthly: PLANS.night.price,
      note: "Night Pass cubre las clases seleccionadas de lunes a jueves.",
    },
  ];
}

function buildWeekendOption(weekendClasses) {
  if (!weekendClasses.length) return null;

  const weekendDays = unique(weekendClasses.map((item) => item.day));
  return {
    parts: weekendDays.map(() => PLANS.weekend.name),
    monthly: weekendDays.length * PLANS.weekend.price,
    note: `Weekend Pass aplicado a ${weekendDays.length} día${weekendDays.length > 1 ? "s" : ""} de fin de semana.`,
  };
}

function buildTeensOption(teenClasses) {
  if (!teenClasses.length) return null;

  return {
    parts: [PLANS.teens.name],
    monthly: PLANS.teens.price,
    note: "Teens In Motion cubre las clases Teens del sábado.",
  };
}

function buildCoverageNote(blocks) {
  return [blocks.weekday.note, blocks.weekend.note, blocks.teens.note].filter(Boolean).join(" ");
}

function dedupeRecommendations(recommendations) {
  const byKey = new Map();

  for (const recommendation of recommendations) {
    const key = `${recommendation.title}|${recommendation.monthly}|${recommendation.parking}`;
    const current = byKey.get(key);
    if (!current || recommendation.total < current.total) {
      byKey.set(key, recommendation);
    }
  }

  return [...byKey.values()];
}

function renderSchedule() {
  const schedule = document.querySelector("#schedule");
  schedule.innerHTML = "";

  const timeColumn = document.createElement("article");
  timeColumn.className = "poster-column time-column";
  timeColumn.innerHTML = `
    <div class="poster-title">Hora</div>
    <div class="poster-slots">
      ${TIME_SLOTS.map((slot) => `<div class="time-slot">${slot.label}</div>`).join("")}
    </div>
  `;
  schedule.append(timeColumn);

  for (const day of DAYS) {
    const column = document.createElement("article");
    column.className = "poster-column";

    const title = document.createElement("div");
    title.className = "poster-title";
    title.textContent = day.label;
    column.append(title);

    const list = document.createElement("div");
    list.className = "poster-slots";

    for (const slot of TIME_SLOTS) {
      const item = CLASSES.find((classItem) => classItem.day === day.id && classItem.slot === slot.id);
      const cell = document.createElement("div");
      cell.className = item ? "poster-cell has-class" : "poster-cell";
      cell.dataset.slot = slot.id;
      if (item) {
        cell.append(renderClassCard(item));
      }
      list.append(cell);
    }

    column.append(list);
    schedule.append(column);
  }
}

function renderClassCard(item) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "class-card poster-class";
  button.dataset.classId = item.id;
  button.style.setProperty("--class-color", item.color);
  button.setAttribute("aria-pressed", "false");

  button.innerHTML = `
    <span class="dot" aria-hidden="true"></span>
    <span>
      <span class="class-name">${item.name}</span>
    </span>
  `;

  button.addEventListener("click", () => {
    if (selectedIds.has(item.id)) {
      selectedIds.delete(item.id);
    } else {
      selectedIds.add(item.id);
    }
    render();
  });

  return button;
}

function renderSelectionSummary(classes) {
  const summary = document.querySelector("#selection-summary");

  if (!classes.length) {
    summary.innerHTML = `
      <span class="selection-count">0 clases</span>
      <span>Selecciona una o más casillas para comparar planes.</span>
    `;
    return;
  }

  const days = unique(classes.map((item) => DAYS.find((day) => day.id === item.day)?.label || item.day));
  summary.innerHTML = `
    <span class="selection-count">${classes.length} clase${classes.length > 1 ? "s" : ""}</span>
    <span>${days.length} día${days.length > 1 ? "s" : ""} de visita: ${days.join(", ")}.</span>
    <ul class="selected-list">
      ${classes
        .map((item) => `<li>${DAYS.find((day) => day.id === item.day).label} · ${item.time} · ${item.name}</li>`)
        .join("")}
    </ul>
  `;
}

function renderRecommendations(classes) {
  const container = document.querySelector("#recommendations");
  const recommendations = buildRecommendations(classes);

  if (!recommendations.length) {
    container.innerHTML = `<div class="empty-state">Las opciones aparecerán aquí cuando selecciones clases.</div>`;
    return;
  }

  container.innerHTML = recommendations
    .map(
      (recommendation, index) => `
        <article class="recommendation-card ${index === 0 ? "best" : ""}">
          <div class="rec-header">
            <h3 class="rec-title">${recommendation.title}</h3>
            ${index === 0 ? `<span class="badge">Recomendado</span>` : ""}
          </div>
          <div class="price-lines">
            <div class="price-line"><span>Mensualidad</span><strong>${formatMoney(recommendation.monthly)}</strong></div>
            <div class="price-line"><span>Parqueo estimado</span><strong>${formatMoney(recommendation.parking)}</strong></div>
            <div class="price-line total"><span>Total mensual</span><strong>${formatMoney(recommendation.total)}</strong></div>
          </div>
          <p class="note">${recommendation.note}</p>
          <p class="note">Cargos separados: Registration ${formatMoney(FEES.registration)} y Membership anual ${formatMoney(FEES.membership)}.</p>
        </article>
      `
    )
    .join("");
}

function syncSelectedCards() {
  document.querySelectorAll(".class-card").forEach((card) => {
    const selected = selectedIds.has(card.dataset.classId);
    card.classList.toggle("selected", selected);
    card.setAttribute("aria-pressed", String(selected));
  });
}

function render() {
  const classes = getSelectedClasses();
  syncSelectedCards();
  renderSelectionSummary(classes);
  renderRecommendations(classes);
}

function bindActions() {
  document.querySelector("#select-all").addEventListener("click", () => {
    CLASSES.forEach((item) => selectedIds.add(item.id));
    render();
  });

  document.querySelector("#clear-selection").addEventListener("click", () => {
    selectedIds.clear();
    render();
  });
}

renderSchedule();
bindActions();
render();

window.InMotionPlans = {
  CLASSES,
  PLANS,
  FEES,
  buildRecommendations,
  parkingForSelection,
};
