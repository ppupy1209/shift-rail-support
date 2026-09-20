(function () {
  "use strict";

  const samples = {
    morning: [
      { minuteOfDay: 420, weekdays: [0], isEnabled: true },
      { minuteOfDay: 440, weekdays: [0], isEnabled: true },
      { minuteOfDay: 460, weekdays: [0], isEnabled: true }
    ],
    midnight: [
      { minuteOfDay: 1420, weekdays: [6], isEnabled: true },
      { minuteOfDay: 1435, weekdays: [6], isEnabled: true },
      { minuteOfDay: 15, weekdays: [0], isEnabled: true }
    ],
    early: [
      { minuteOfDay: 10, weekdays: [0], isEnabled: true },
      { minuteOfDay: 30, weekdays: [0], isEnabled: true },
      { minuteOfDay: 50, weekdays: [0], isEnabled: true }
    ]
  };

  // Match AlarmEntry.shifted(by:), including negative offsets at midnight.
  function shiftAlarm(alarm, offset) {
    const total = alarm.minuteOfDay + offset;
    const dayDelta = Math.floor(total / 1440);
    return {
      ...alarm,
      minuteOfDay: total - dayDelta * 1440,
      weekdays: alarm.weekdays.map(day => ((day + dayDelta) % 7 + 7) % 7).sort((a, b) => a - b)
    };
  }

  function formatTime(minuteOfDay) {
    return [Math.floor(minuteOfDay / 60), minuteOfDay % 60]
      .map(value => String(value).padStart(2, "0")).join(":");
  }

  const copy = {
    en: {
      days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      offset: value => value === 0 ? "No shift" : `${Math.abs(value)} min ${value > 0 ? "later" : "earlier"}`,
      dayChange: value => value > 0 ? "Next day" : "Previous day",
      summary: (offset, times) => `${offset}. Preview: ${times.join("; ")}. No alarms are scheduled.`
    },
    ko: {
      days: ["월", "화", "수", "목", "금", "토", "일"],
      offset: value => value === 0 ? "이동 없음" : `${Math.abs(value)}분 ${value > 0 ? "늦게" : "일찍"}`,
      dayChange: value => value > 0 ? "다음 날" : "이전 날",
      summary: (offset, times) => `${offset}. 미리보기: ${times.join(", ")}. 실제 알람은 예약되지 않습니다.`
    }
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = { shiftAlarm, formatTime, samples };
  }
  if (typeof document === "undefined") return;

  document.querySelectorAll("[data-shift-demo]").forEach(panel => {
    const language = copy[panel.dataset.language];
    const scenario = panel.querySelector("[data-scenario]");
    const slider = panel.querySelector("[data-offset]");
    const output = panel.querySelector("[data-offset-label]");
    const status = panel.querySelector("[data-summary]");
    const rows = panel.querySelectorAll("[data-alarm-row]");
    const presets = panel.querySelectorAll("[data-preset]");

    function render(announce) {
      const offset = Number(slider.value);
      const originals = samples[scenario.value];
      const times = [];
      output.textContent = language.offset(offset);
      slider.setAttribute("aria-valuetext", language.offset(offset));
      presets.forEach(button => button.setAttribute("aria-pressed", String(Number(button.dataset.preset) === offset)));

      originals.forEach((original, index) => {
        const shifted = shiftAlarm(original, offset);
        const row = rows[index];
        const beforeDay = language.days[original.weekdays[0]];
        const afterDay = language.days[shifted.weekdays[0]];
        const beforeTime = formatTime(original.minuteOfDay);
        const afterTime = formatTime(shifted.minuteOfDay);
        row.querySelector("[data-before-day]").textContent = beforeDay;
        row.querySelector("[data-after-day]").textContent = afterDay;
        [["[data-before-time]", beforeTime], ["[data-after-time]", afterTime]].forEach(([selector, value]) => {
          const time = row.querySelector(selector);
          time.textContent = value;
          time.setAttribute("datetime", value);
        });
        const dayDelta = Math.floor((original.minuteOfDay + offset) / 1440);
        const badge = row.querySelector("[data-day-change]");
        badge.hidden = dayDelta === 0;
        badge.textContent = dayDelta === 0 ? "" : language.dayChange(dayDelta);
        times.push(`${afterDay} ${afterTime}`);
      });
      if (announce) status.textContent = language.summary(language.offset(offset), times);
    }

    scenario.addEventListener("change", () => render(true));
    slider.addEventListener("input", () => render(false));
    slider.addEventListener("change", () => render(true));
    presets.forEach(button => button.addEventListener("click", () => {
      slider.value = button.dataset.preset;
      render(true);
    }));
    render(false);
    panel.querySelector("fieldset").disabled = false;
    panel.querySelector("[data-load-note]").hidden = true;
  });
})();
