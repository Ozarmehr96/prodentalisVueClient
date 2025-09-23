<template>
  <div class="teeth-arc-container data-in-center">
    <svg
      ref="svgRoot"
      viewBox="0 -55 1140 1800"
      preserveAspectRatio="xMidYMin meet"
      xmlns="http://www.w3.org/2000/svg"
      style="width: auto; height: 100%; max-width: 100%"
      @mousedown="startDrag"
      @mousemove="moveDrag"
      @mouseup="endDrag"
    >
      <g id="teeth-layer" @click="handleToothClick">
        <!-- Верхняя дуга -->
        <g class="tooth" id="tooth-18" transform="translate(205, 698)">
          <ellipse
            cx="0"
            cy="0"
            rx="51"
            ry="50"
            fill="#efe6d0"
            stroke="#bfae92"
            stroke-width="2"
          />
          <text x="0" y="20" font-size="42" fill="#111111" text-anchor="middle">
            18
          </text>
        </g>
        <g class="tooth" id="tooth-17" transform="translate(182, 568)">
          <ellipse
            cx="0"
            cy="0"
            rx="51"
            ry="50"
            fill="#efe6d0"
            stroke="#bfae92"
            stroke-width="2"
          />
          <text x="0" y="20" font-size="42" fill="#111111" text-anchor="middle">
            17
          </text>
        </g>
        <g class="tooth" id="tooth-16" transform="translate(186, 436)">
          <ellipse
            cx="0"
            cy="0"
            rx="51"
            ry="50"
            fill="#efe6d0"
            stroke="#bfae92"
            stroke-width="2"
          />
          <text x="0" y="20" font-size="42" fill="#111111" text-anchor="middle">
            16
          </text>
        </g>
        <g class="tooth" id="tooth-15" transform="translate(216, 308)">
          <ellipse
            cx="0"
            cy="0"
            rx="51"
            ry="50"
            fill="#efe6d0"
            stroke="#bfae92"
            stroke-width="2"
          />
          <text x="0" y="20" font-size="42" fill="#111111" text-anchor="middle">
            15
          </text>
        </g>
        <g class="tooth" id="tooth-14" transform="translate(272, 195)">
          <ellipse
            cx="0"
            cy="0"
            rx="51"
            ry="50"
            fill="#efe6d0"
            stroke="#bfae92"
            stroke-width="2"
          />
          <text x="0" y="20" font-size="42" fill="#111111" text-anchor="middle">
            14
          </text>
        </g>
        <g class="tooth" id="tooth-13" transform="translate(349, 103)">
          <ellipse
            cx="0"
            cy="0"
            rx="51"
            ry="50"
            fill="#efe6d0"
            stroke="#bfae92"
            stroke-width="2"
          />
          <text x="0" y="20" font-size="42" fill="#111111" text-anchor="middle">
            13
          </text>
        </g>
        <g
          class="tooth"
          id="tooth-12"
          transform="translate(443, 38) rotate(-3)"
        >
          <ellipse
            cx="0"
            cy="0"
            rx="51"
            ry="50"
            fill="#efe6d0"
            stroke="#bfae92"
            stroke-width="2"
          />
          <text x="0" y="20" font-size="42" fill="#111111" text-anchor="middle">
            12
          </text>
        </g>
        <g class="tooth" id="tooth-11" transform="translate(546, 4) rotate(-6)">
          <ellipse
            cx="0"
            cy="0"
            rx="51"
            ry="50"
            fill="#efe6d0"
            stroke="#bfae92"
            stroke-width="2"
          />
          <text x="0" y="20" font-size="42" fill="#111111" text-anchor="middle">
            11
          </text>
        </g>
        <g class="tooth" id="tooth-21" transform="translate(654, 4) rotate(-9)">
          <ellipse
            cx="0"
            cy="0"
            rx="51"
            ry="50"
            fill="#efe6d0"
            stroke="#bfae92"
            stroke-width="2"
          />
          <text x="0" y="20" font-size="42" fill="#111111" text-anchor="middle">
            21
          </text>
        </g>
        <g
          class="tooth"
          id="tooth-22"
          transform="translate(757, 38) rotate(-12)"
        >
          <ellipse
            cx="0"
            cy="0"
            rx="51"
            ry="50"
            fill="#efe6d0"
            stroke="#bfae92"
            stroke-width="2"
          />
          <text x="0" y="20" font-size="42" fill="#111111" text-anchor="middle">
            22
          </text>
        </g>
        <g
          class="tooth"
          id="tooth-23"
          transform="translate(851, 103) rotate(-15)"
        >
          <ellipse
            cx="0"
            cy="0"
            rx="51"
            ry="50"
            fill="#efe6d0"
            stroke="#bfae92"
            stroke-width="2"
          />
          <text x="0" y="20" font-size="42" fill="#111111" text-anchor="middle">
            23
          </text>
        </g>
        <g
          class="tooth"
          id="tooth-24"
          transform="translate(928, 195) rotate(-18)"
        >
          <ellipse
            cx="0"
            cy="0"
            rx="51"
            ry="50"
            fill="#efe6d0"
            stroke="#bfae92"
            stroke-width="2"
          />
          <text x="0" y="20" font-size="42" fill="#111111" text-anchor="middle">
            24
          </text>
        </g>
        <g
          class="tooth"
          id="tooth-25"
          transform="translate(984, 308) rotate(-18)"
        >
          <ellipse
            cx="0"
            cy="0"
            rx="51"
            ry="50"
            fill="#efe6d0"
            stroke="#bfae92"
            stroke-width="2"
          />
          <text x="0" y="20" font-size="42" fill="#111111" text-anchor="middle">
            25
          </text>
        </g>
        <g
          class="tooth"
          id="tooth-26"
          transform="translate(1014, 436) rotate(-18)"
        >
          <ellipse
            cx="0"
            cy="0"
            rx="51"
            ry="50"
            fill="#efe6d0"
            stroke="#bfae92"
            stroke-width="2"
          />
          <text x="0" y="20" font-size="42" fill="#111111" text-anchor="middle">
            26
          </text>
        </g>
        <g
          class="tooth"
          id="tooth-27"
          transform="translate(1018, 568) rotate(-18)"
        >
          <ellipse
            cx="0"
            cy="0"
            rx="51"
            ry="50"
            fill="#efe6d0"
            stroke="#bfae92"
            stroke-width="2"
          />
          <text x="0" y="20" font-size="42" fill="#111111" text-anchor="middle">
            27
          </text>
        </g>
        <g
          class="tooth"
          id="tooth-28"
          transform="translate(995, 698) rotate(-18)"
        >
          <ellipse
            cx="0"
            cy="0"
            rx="51"
            ry="50"
            fill="#efe6d0"
            stroke="#bfae92"
            stroke-width="2"
          />
          <text x="0" y="20" font-size="42" fill="#111111" text-anchor="middle">
            28
          </text>
        </g>

        <!-- Нижняя дуга -->
        <g class="tooth" id="tooth-48" transform="translate(205, 982)">
          <ellipse
            cx="0"
            cy="0"
            rx="51"
            ry="50"
            fill="#efe6d0"
            stroke="#bfae92"
            stroke-width="2"
          />
          <text x="0" y="20" font-size="42" fill="#111111" text-anchor="middle">
            48
          </text>
        </g>
        <g class="tooth" id="tooth-47" transform="translate(182, 1112)">
          <ellipse
            cx="0"
            cy="0"
            rx="51"
            ry="50"
            fill="#efe6d0"
            stroke="#bfae92"
            stroke-width="2"
          />
          <text x="0" y="20" font-size="42" fill="#111111" text-anchor="middle">
            47
          </text>
        </g>
        <g class="tooth" id="tooth-46" transform="translate(186, 1244)">
          <ellipse
            cx="0"
            cy="0"
            rx="51"
            ry="50"
            fill="#efe6d0"
            stroke="#bfae92"
            stroke-width="2"
          />
          <text x="0" y="20" font-size="42" fill="#111111" text-anchor="middle">
            46
          </text>
        </g>
        <g class="tooth" id="tooth-45" transform="translate(216, 1372)">
          <ellipse
            cx="0"
            cy="0"
            rx="51"
            ry="50"
            fill="#efe6d0"
            stroke="#bfae92"
            stroke-width="2"
          />
          <text x="0" y="20" font-size="42" fill="#111111" text-anchor="middle">
            45
          </text>
        </g>
        <g class="tooth" id="tooth-44" transform="translate(272, 1485)">
          <ellipse
            cx="0"
            cy="0"
            rx="51"
            ry="50"
            fill="#efe6d0"
            stroke="#bfae92"
            stroke-width="2"
          />
          <text x="0" y="20" font-size="42" fill="#111111" text-anchor="middle">
            44
          </text>
        </g>
        <g class="tooth" id="tooth-43" transform="translate(349, 1577)">
          <ellipse
            cx="0"
            cy="0"
            rx="51"
            ry="50"
            fill="#efe6d0"
            stroke="#bfae92"
            stroke-width="2"
          />
          <text x="0" y="20" font-size="42" fill="#111111" text-anchor="middle">
            43
          </text>
        </g>
        <g
          class="tooth"
          id="tooth-42"
          transform="translate(443, 1642) rotate(3)"
        >
          <ellipse
            cx="0"
            cy="0"
            rx="51"
            ry="50"
            fill="#efe6d0"
            stroke="#bfae92"
            stroke-width="2"
          />
          <text x="0" y="20" font-size="42" fill="#111111" text-anchor="middle">
            42
          </text>
        </g>
        <g
          class="tooth"
          id="tooth-41"
          transform="translate(546, 1676) rotate(6)"
        >
          <ellipse
            cx="0"
            cy="0"
            rx="51"
            ry="50"
            fill="#efe6d0"
            stroke="#bfae92"
            stroke-width="2"
          />
          <text x="0" y="20" font-size="42" fill="#111111" text-anchor="middle">
            41
          </text>
        </g>
        <g
          class="tooth"
          id="tooth-31"
          transform="translate(654, 1676) rotate(9)"
        >
          <ellipse
            cx="0"
            cy="0"
            rx="51"
            ry="50"
            fill="#efe6d0"
            stroke="#bfae92"
            stroke-width="2"
          />
          <text x="0" y="20" font-size="42" fill="#111111" text-anchor="middle">
            31
          </text>
        </g>
        <g
          class="tooth"
          id="tooth-32"
          transform="translate(757, 1642) rotate(12)"
        >
          <ellipse
            cx="0"
            cy="0"
            rx="51"
            ry="50"
            fill="#efe6d0"
            stroke="#bfae92"
            stroke-width="2"
          />
          <text x="0" y="20" font-size="42" fill="#111111" text-anchor="middle">
            32
          </text>
        </g>
        <g
          class="tooth"
          id="tooth-33"
          transform="translate(851, 1577) rotate(15)"
        >
          <ellipse
            cx="0"
            cy="0"
            rx="51"
            ry="50"
            fill="#efe6d0"
            stroke="#bfae92"
            stroke-width="2"
          />
          <text x="0" y="20" font-size="42" fill="#111111" text-anchor="middle">
            33
          </text>
        </g>
        <g
          class="tooth"
          id="tooth-34"
          transform="translate(928, 1485) rotate(18)"
        >
          <ellipse
            cx="0"
            cy="0"
            rx="51"
            ry="50"
            fill="#efe6d0"
            stroke="#bfae92"
            stroke-width="2"
          />
          <text x="0" y="20" font-size="42" fill="#111111" text-anchor="middle">
            34
          </text>
        </g>
        <g
          class="tooth"
          id="tooth-35"
          transform="translate(984, 1372) rotate(18)"
        >
          <ellipse
            cx="0"
            cy="0"
            rx="51"
            ry="50"
            fill="#efe6d0"
            stroke="#bfae92"
            stroke-width="2"
          />
          <text x="0" y="20" font-size="42" fill="#111111" text-anchor="middle">
            35
          </text>
        </g>
        <g
          class="tooth"
          id="tooth-36"
          transform="translate(1014, 1244) rotate(18)"
        >
          <ellipse
            cx="0"
            cy="0"
            rx="51"
            ry="50"
            fill="#efe6d0"
            stroke="#bfae92"
            stroke-width="2"
          />
          <text x="0" y="20" font-size="42" fill="#111111" text-anchor="middle">
            36
          </text>
        </g>
        <g
          class="tooth"
          id="tooth-37"
          transform="translate(1018, 1112) rotate(18)"
        >
          <ellipse
            cx="0"
            cy="0"
            rx="51"
            ry="50"
            fill="#efe6d0"
            stroke="#bfae92"
            stroke-width="2"
          />
          <text x="0" y="20" font-size="42" fill="#111111" text-anchor="middle">
            37
          </text>
        </g>
        <g
          class="tooth"
          id="tooth-38"
          transform="translate(995, 982) rotate(18)"
        >
          <ellipse
            cx="0"
            cy="0"
            rx="51"
            ry="50"
            fill="#efe6d0"
            stroke="#bfae92"
            stroke-width="2"
          />
          <text x="0" y="20" font-size="42" fill="#111111" text-anchor="middle">
            38
          </text>
        </g>
      </g>
    </svg>
    <div
      style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 16px;
        color: #333;
      "
    >
      <!--Привет<br /> -->
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { ORDER_SELECTED_TEETH, SELECTED_TOOTH, SET_SELECTED_TOOTH } from "../store/types";

export default {
  name: "ToothSelection",
  data() {
    return {
      draggedToothId: null,
      draggedCopy: null,
      offsetX: 0,
      offsetY: 0,
    };
  },
  props: {
  },
  computed: {
    ...mapGetters({
      selectedTooth: SELECTED_TOOTH
    }),
  },
  methods: {
    ...mapActions({
      setSelectedTooth: SET_SELECTED_TOOTH,
    }),
    defineExpose() {},
    // Единый метод подсветки зубов
    applySelection() {
      console.log("applySelection", "this.selectedTooth", this.selectedTooth);
      console.log("Применение подсветки для зуба", this.selectedTooth);
      const allTeeth = document.querySelectorAll(".tooth");

      allTeeth.forEach((toothG) => {
        const toothId = parseInt(toothG.id.replace("tooth-", ""));
        const ellipse = toothG.querySelector("ellipse");
        const text = toothG.querySelector("text");

        if (this.selectedTooth.id === toothId) {
          if (this.selectedTooth.isSelected) {
            // Зуб выбран
            toothG.classList.add("selected");
            if (ellipse) ellipse.setAttribute("fill", "red"); // фон
            if (text) text.setAttribute("stroke", "#ffff"); // текст
          } else this.removeSelected(toothG, ellipse, text);

          if (this.selectedTooth.background_color) {
            toothG.classList.add("colored");
            if (ellipse)
              ellipse.setAttribute("fill", this.selectedTooth.background_color); // фон
            if (text) text.setAttribute("stroke", "#ffff"); // текст
            if (text) text.setAttribute("fill", "#ffff"); // текст
          } else {
            // если передан признак удаление выбранного цвета когда нет типов работ, то установим стили по умолчанию
            if (this.selectedTooth.hasOwnProperty("removeColored")) {
              toothG.classList.remove("colored");
              this.setTextDefaultStyle(text);
            }
          }
        } else {
          // Зуб не выбран
          this.removeSelected(toothG, ellipse, text);
        }
      });
    },
    setTextDefaultStyle(text) {
      if (text) text.setAttribute("stroke", "#111111"); // текст
      if (text) text.setAttribute("fill", "#111111"); // текст
    },
    removeSelected(toothG, ellipse, text) {
      toothG.classList.remove("selected");
      // если зуб "закрашенный", не трогаем
      if (toothG.classList.contains("colored")) {
        return;
      }

      if (ellipse) ellipse.setAttribute("fill", "#efe6d0"); // фон
      if (text) text.setAttribute("stroke", "#111111"); // текст
    },

    // Обработка клика по зубу
    async handleToothClick(event) {
      const toothG = event.target.closest(".tooth");
      if (!toothG) return;

      const toothId = parseInt(toothG.id.replace("tooth-", ""));
      await this.setSelectedTooth({
        id: toothId,
        isSelected: true,
      });
      this.applySelection(); // применяем подсветку
      // Отправляем обновлённый массив выбранных зубов наружу
      this.$emit("onToothSelectedChanged", this.selectedTooth.id);
    },

    // Пример метода для кнопки "+"
    onPlusClick() {
      console.log("Стрелка нажата");
      // Здесь позже можно открывать модалку
    },

    /**
     * Перетаскивание зуба и копирование стилей.
     */
    getMouseSVGPoint(event) {
      const svg = this.$refs.svgRoot;
      const pt = svg.createSVGPoint();
      pt.x = event.clientX;
      pt.y = event.clientY;
      return pt.matrixTransform(svg.getScreenCTM().inverse());
    },
    /**
     * Подготовка объекта для перетаскивания
     */
    startDrag(event) {
      const tooth = event.target.closest(".tooth");
      if (!tooth) return;

      this.draggedTooth = tooth;
      this.draggedCopy = tooth.cloneNode(true);
      this.draggedCopy.setAttribute("opacity", "0.8");
      this.draggedCopy.setAttribute("pointer-events", "none");
      this.$refs.svgRoot.appendChild(this.draggedCopy);

      const mousePos = this.getMouseSVGPoint(event);
      this.offsetX = mousePos.x;
      this.offsetY = mousePos.y;

      // Начальная позиция копии
      const transform = tooth
        .getAttribute("transform")
        .match(/translate\((.+),\s*(.+)\)/);
      this.startX = parseFloat(transform[1]);
      this.startY = parseFloat(transform[2]);

      this.draggedCopy.setAttribute(
        "transform",
        `translate(${this.startX}, ${this.startY})`
      );
    },

    /**
     * Перемещение объекта
     */
    moveDrag(event) {
      if (!this.draggedCopy) return;

      const mousePos = this.getMouseSVGPoint(event);
      const x = mousePos.x - (this.offsetX - this.startX);
      const y = mousePos.y - (this.offsetY - this.startY);
      this.draggedCopy.setAttribute("transform", `translate(${x}, ${y})`);
    },
    /**
     * Получение зуба в указанной позиции
     */
    getToothAtPosition(mousePos) {
      const allTeeth = document.querySelectorAll(".tooth");
      for (const tooth of allTeeth) {
        const ellipse = tooth.querySelector("ellipse");
        if (!ellipse) continue;

        const transformMatch = tooth
          .getAttribute("transform")
          ?.match(/translate\((.+),\s*(.+)\)/);
        if (!transformMatch) continue;

        const x = parseFloat(transformMatch[1]);
        const y = parseFloat(transformMatch[2]);
        const bbox = ellipse.getBBox();

        if (
          mousePos.x >= x - bbox.width / 2 &&
          mousePos.x <= x + bbox.width / 2 &&
          mousePos.y >= y - bbox.height / 2 &&
          mousePos.y <= y + bbox.height / 2
        ) {
          return tooth; // возвращаем сам объект зуба
        }
      }
      return null; // если не попали ни на один зуб
    },
    /**
     * Вставка объекта. Копирование стилей.
     */
    endDrag(event) {
      if (!this.draggedCopy) return;

      const mousePos = this.getMouseSVGPoint(event);
      const targetTooth = this.getToothAtPosition(mousePos);

      let fromToothId = null;
      let toToothId = null;

      if (targetTooth) {
        // копируем стили
        const fromEllipse = this.draggedTooth.querySelector("ellipse");
        const fromText = this.draggedTooth.querySelector("text");
        const toEllipse = targetTooth.querySelector("ellipse");
        const toText = targetTooth.querySelector("text");

        toEllipse.setAttribute("fill", fromEllipse.getAttribute("fill"));
        toEllipse.setAttribute("stroke", fromEllipse.getAttribute("stroke"));

        toText.setAttribute("fill", fromText.getAttribute("fill"));
        toText.setAttribute("stroke", fromText.getAttribute("stroke"));
        
        this.draggedTooth.classList.forEach(c => {
          if (!targetTooth.classList.contains(c)) {
            targetTooth.classList.add(c);
          }
        });

        fromToothId = parseInt(this.draggedTooth.id.replace("tooth-", ""));
        toToothId = parseInt(targetTooth.id.replace("tooth-", ""));
        console.log("copy from ", fromToothId);
        console.log("copy to ", toToothId);
      }

      // удаляем копию
      this.draggedCopy.remove();
      this.draggedCopy = null;
      this.draggedTooth = null;

      if (targetTooth && fromToothId && toToothId) {
        this.$emit("onCopyToothData", fromToothId, toToothId);
      }
    },
  },
};
</script>

<style scoped>
.data-in-center {
  position: relative;
  display: inline-block;
}

body {
  overflow: hidden !important;
}
.cross-container {
  position: relative;
  width: 200px;
  height: 200px;
}

/* горизонтальная линия */
.cross-container::before {
  content: "";
  position: absolute;
  top: 50%;
  /* left: 0; */
  margin-top: -35px;
  width: 80%;
  height: 2px;
  background: #c4c4c4;
  transform: translateY(-50%);
}

/* вертикальная линия */
.cross-container::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 60px;
  width: 2px;
  height: 70%;
  background: #c4c4c4;
  transform: translateX(-50%);
}

.teeth-arc-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start; /* привязываем к верху */
  overflow: hidden;
}
svg {
  width: 100%;
}
.tooth {
  cursor: pointer;
  transition: transform 0.12s ease, filter 0.12s ease;
}
.tooth:hover {
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.45));
}
.selected {
  stroke: #333;
  stroke-width: 3px;
  filter: drop-shadow(0 6px 10px rgba(0, 0, 0, 0.6));
}
svg,
text {
  user-select: none; /* запрещаем выделение текста */
  -webkit-user-select: none; /* для Safari/Chrome */
  -moz-user-select: none; /* для Firefox */
  -ms-user-select: none; /* для IE/Edge */
}
</style>
