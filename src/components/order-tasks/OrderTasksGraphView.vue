<template>
  <div>
    <div class="card mb-3">
      <div class="card-content">
        <div class="graph-container" ref="graphContainer">
          <svg :width="svgWidth" :height="svgHeight" class="graph-svg">
            <!-- Главная вертикальная линия -->
            <line
              :x1="lineX"
              :y1="topMargin"
              :x2="lineX"
              :y2="svgHeight - topMargin"
              stroke="#cbd5e1"
              stroke-width="4"
            />

            <!-- Задачи -->
            <g v-for="(task, index) in tasks" :key="task.id">
              <!-- Соединительная линия к карточке -->
              <line
                :x1="lineX"
                :y1="getTaskY(index)"
                :x2="lineX + 30"
                :y2="getTaskY(index)"
                stroke="#cbd5e1"
                stroke-width="2"
              />

              <!-- Точка на линии -->
              <circle
                :cx="lineX"
                :cy="getTaskY(index)"
                r="10"
                :fill="getNodeColor(task)"
                stroke="white"
                stroke-width="3"
              />

              <!-- Карточка задачи -->
              <foreignObject
                :x="lineX + 40"
                :y="getTaskY(index) - 25"
                :width="svgWidth - lineX - 50"
                :height="maxCardHeight(task)"
              >
                <div
                  class="card task-card shadow-sm mb-2"
                  :ref="(el) => setTaskRef(el, index)"
                >
                  <div class="card-body p-1">
                    <!-- Заголовок -->
                    <div class="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <div class="fw-semibold">
                          {{ task.work_step?.name }}
                        </div>
                        <small class="text-muted">
                          {{ task.work_type?.name }}
                        </small>
                      </div>

                      <span class="badge" :class="getStatusClass(task.status.code)">
                        {{ task.status.name }}
                      </span>
                    </div>

                    <template v-for="executor in task.executors">
                      <div class="task-line">
                        <span class="text-muted">Исполнитель:</span>
                        <span class="task-value">
                          {{ executor.executor?.name || "—" }}
                        </span>
                      </div>

                      <!-- Ключ — значение (одна строка = одна пара) -->
                      <div class="task-line">
                        <span class="text-muted">Начат:</span>
                        <span>
                          {{ $toDateTimeFormat(executor.started_at) }}
                        </span>
                      </div>

                      <div class="task-line" v-if="executor.status.code == 'Finished'">
                        <span class="text-muted">Завершен:</span>
                        <span>
                          {{ $toDateTimeFormat(executor.started_at) }}
                        </span>
                      </div>

                      <div class="task-line">
                        <span class="text-muted">Затраченное время:</span>
                        <span>{{ millisecondsToTime(executor.elapsedTime) }}</span>
                      </div>
                    </template>
                  </div>
                </div>
              </foreignObject>
            </g>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getTaskStatusClass, msToTime } from "../../helpers/order-helpers";

export default {
  name: "TaskGraph",
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      nodeSpacing: 200,
      topMargin: 40,
      svgWidth: 250,
      taskHeights: [], // 👈 реальные высоты карточек
    };
  },

  computed: {
    tasks() {
      return this.order.tasks.sort((a, b) => {
        // 1️⃣ по типу работы
        if (a.work_type.id !== b.work_type.id) {
          return a.work_type.id - b.work_type.id;
        }

        // 2️⃣ внутри типа — по приоритету этапа
        return a.priority - b.priority;
      });
    },

    svgHeight() {
      let height = this.topMargin;

      for (let i = 0; i < this.tasks.length; i++) {
        height += (this.taskHeights[i] || 200) + 20; // 20 — тот же отступ
      }

      return height + this.topMargin;
    },

    lineX() {
      return 10; // линия строго слева
    },
  },

  mounted() {
    this.updateSvgWidth();
    window.addEventListener("resize", this.updateSvgWidth);
  },

  beforeUnmount() {
    window.removeEventListener("resize", this.updateSvgWidth);
  },

  methods: {
    updateSvgWidth() {
      if (this.$refs.graphContainer) {
        this.svgWidth = this.$refs.graphContainer.clientWidth;
      }
    },

    getNodeColor(task) {
      return task.status.code === "Finished" ? "#198754" : "#6c757d";
    },

    getStatusClass(status, returnHex = false) {
      return getTaskStatusClass(status, returnHex);
    },

    millisecondsToTime(ms) {
      return msToTime(ms);
    },

    maxCardHeight(task) {
      // высота карточки зависит от количества исполнителей
      const baseHeight = 200;
      const extra = task.executors.length > 1 ? (task.executors.length - 1) * 20 : 0;
      return baseHeight + extra;
    },

    setTaskRef(el, index) {
      if (!el) return;

      this.$nextTick(() => {
        this.taskHeights[index] = el.offsetHeight;
      });
    },

    getTaskY(index) {
      console.log("Вычисление Y для задачи", index);
      console.log("Вычисление this.topMargin для задачи", this.topMargin);
      let y = this.topMargin;

      for (let i = 0; i < index; i++) {
        y += (this.taskHeights[i] || 200) + 20; // 20 — минимальный отступ
      }

      return y;
    },
  },
};
</script>

<style scoped>
.card {
  border-radius: 8px;
  background: white;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}
.card-content {
  padding: 1rem;
}
.graph-container {
  width: 100%;
}
.graph-svg {
  min-width: 100%;
}
.task-card {
  background: white;
  border-radius: 8px;
  padding: 6px 10px;
  border: 1px solid #e5e7eb;
  font-family: sans-serif;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  max-width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.task-name {
  font-weight: 600;
  margin-bottom: 4px;
}
.task-info {
  font-size: 12px;
  color: #6b7280;
}
.task-footer {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 4px;
}
.executor-name {
  font-size: 13px;
  background: #dcfce7;
  color: #16a34a;
  padding: 2px 6px;
  border-radius: 6px;
  white-space: nowrap;
}
</style>
