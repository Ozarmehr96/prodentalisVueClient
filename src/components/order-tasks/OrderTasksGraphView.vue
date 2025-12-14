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
                :y1="topMargin + index * nodeSpacing"
                :x2="lineX + 30"
                :y2="topMargin + index * nodeSpacing"
                stroke="#cbd5e1"
                stroke-width="2"
              />

              <!-- Точка на линии -->
              <circle
                :cx="lineX"
                :cy="topMargin + index * nodeSpacing"
                r="10"
                :fill="getStatusClass(task.status.code, true)"
                stroke="white"
                stroke-width="3"
              />

              <!-- Карточка задачи -->
              <foreignObject
                :x="lineX + 40"
                :y="topMargin + index * nodeSpacing - 25"
                :width="svgWidth - lineX - 50"
                :height="maxCardHeight(task)"
              >
                <div class="card task-card shadow-sm mb-2">
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

                      <div class="task-line" v-if="executor.status.code != 'Finished'">
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
    };
  },

  computed: {
    tasks() {
      return this.order.tasks;
    },

    svgHeight() {
      return this.topMargin * 2 + this.tasks.length * this.nodeSpacing;
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
  overflow-x: auto;
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
