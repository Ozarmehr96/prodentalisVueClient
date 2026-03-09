<template>
  <div>
    <div class="mb-3 w-100">
      <div class="btn-group w-100" role="group">
        <button
          type="button"
          class="btn btn-sm"
          :class="displayMode === 'grouped' ? 'brand-style' : 'btn-outline-secondary'"
          @click="displayMode = 'grouped'"
        >
          Сгруппированный
        </button>
        <button
          type="button"
          class="btn btn-sm"
          :class="displayMode === 'normal' ? 'brand-style' : 'btn-outline-secondary'"
          @click="displayMode = 'normal'"
        >
          Обычный
        </button>
      </div>
    </div>
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
              :stroke="lineColor"
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
                  :style="`border-color: ${getWorkTypeColor(task?.work_type?.id)}`"
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
                          {{ task.displayWorkTypeName }}
                        </small>
                      </div>

                      <span class="badge" :class="getStatusClass(task.status.code)">
                        {{ task.status.name }}
                      </span>
                    </div>

                    <div
                      class="task-line"
                      title="Стоимость за работу, то есть за все зубы"
                      v-if="!isCustomer"
                    >
                      <span class="text-muted">Стоимость:</span>
                      <span class="fw-bold">
                        {{ task.total_price }} TJS / {{ task.teeth_count }} ед.</span
                      >
                    </div>

                    <!-- Информация о задаче -->
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
                          {{ $toDateTimeFormat(executor?.finishedAt) }}
                        </span>
                      </div>

                      <div class="task-line">
                        <span class="text-muted">Затраченное время:</span>
                        <Timer
                          :elapsedTime="executor ? executor.elapsedTime : 0"
                          :running="
                            task.status.code === 'Started' && executor ? true : false
                          "
                        />
                      </div>
                    </template>

                    <OrderTaskWizard
                      @refreshTasks="() => $emit('reloadOrder')"
                      class="mt-3"
                      :orderTask="task"
                      :showButtonsOnly="true"
                      v-if="
                        task.status.code != 'Finished' &&
                        task.status.code != 'Pending' &&
                        task.status.code != 'Canceled'
                      "
                    />
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
import { mapActions, mapGetters } from "vuex";
import { getTaskStatusClass, msToTime } from "../../helpers/order-helpers";
import OrderTaskWizard from "./OrderTaskWizard.vue";
import { IS_CUSTOMER, LOAD_WORK_TYPES, WORK_TYPES } from "../../store/types";
import Timer from "../order/Timer.vue";

export default {
  name: "TaskGraph",
  components: {
    OrderTaskWizard,
    Timer,
  },
  props: {
    order: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      lineColor: "#cbd5e1",
      nodeSpacing: 210,
      topMargin: 40,
      svgWidth: 250,
      displayMode: "grouped", // 'normal' или 'grouped'
      taskHeights: [], // 👈 реальные высоты карточек
    };
  },

  computed: {
    ...mapGetters({
      workTypes: WORK_TYPES,
      isCustomer: IS_CUSTOMER,
    }),
    tasks() {
      if (this.displayMode === "grouped") {
        return this.tasksGrouped;
      }

      return this.sortTasks(this.order.tasks, true);
    },

    tasksGrouped() {
      // Исходные задачи
      const tasks = this.order.tasks;

      // Словарь для быстрого поиска по id
      const taskMap = {};
      tasks.forEach((t) => (taskMap[t.id] = t));

      // Новый список задач для отображения
      const displayTasks = [];

      // Чтобы не добавлять дубликаты
      const addedTaskIds = new Set();

      tasks.forEach((task) => {
        // Если это авто-запущенная задача, её не добавляем отдельно
        if (task.started_task_id) {
          return;
        }

        // Ищем все задачи, которые были запущены этой задачей
        const relatedTasks = tasks.filter((t) => t.started_task_id === task.id);

        // Формируем объединённое название work_type
        const allWorkTypes = [
          task.work_type?.name,
          ...relatedTasks.map((t) => t.work_type?.name),
        ].filter(Boolean); // убираем null/undefined

        const displayTask = {
          ...task,
          displayWorkTypeName: allWorkTypes.join(" + "), // Имплант + Промежуток МК
          relatedTasks: relatedTasks, // можно сохранить для других целей
        };

        displayTask.total_price =
          task.total_price + relatedTasks.reduce((sum, t) => sum + t.total_price, 0);

        displayTask.teeth_count =
          task.teeth_count + relatedTasks.reduce((sum, t) => sum + t.teeth_count, 0);

        displayTasks.push(displayTask);
        addedTaskIds.add(task.id);
      });

      return this.sortTasks(displayTasks);
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

  async beforeMount() {
    if (this.workTypes.length == 0) {
      await this.loadWorkTypes();
    }
  },
  mounted() {
    this.updateSvgWidth();
    window.addEventListener("resize", this.updateSvgWidth);
  },

  beforeUnmount() {
    window.removeEventListener("resize", this.updateSvgWidth);
  },

  methods: {
    ...mapActions({
      loadWorkTypes: LOAD_WORK_TYPES,
    }),

    getWorkTypeColor(workTypeId) {
      let color = this.workTypes.find((t) => t.id == workTypeId)?.background_color;
      if (color) {
        return color;
      }

      return null;
    },
    updateSvgWidth() {
      if (this.$refs.graphContainer) {
        this.svgWidth = this.$refs.graphContainer.clientWidth;
      }
    },

    getNodeColor(task) {
      return task.status.code === "Finished" ? "#0d6efd" : "#6c757d";
    },

    getStatusClass(status, returnHex = false) {
      return getTaskStatusClass(status, returnHex);
    },

    millisecondsToTime(ms) {
      return msToTime(ms);
    },

    maxCardHeight(task) {
      // высота карточки зависит от количества исполнителей
      const baseHeight = 400;
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
      let y = this.topMargin;

      for (let i = 0; i < index; i++) {
        y += (this.taskHeights[i] || 200) + 20; // 20 — минимальный отступ
      }

      return y;
    },

    sortTasks(tasks, canMapByWorkType = false) {
      let sortedTasks = tasks.sort((a, b) => {
        // 1️⃣ по типу работы
        if (a.work_type.id !== b.work_type.id) {
          return a.work_type.id - b.work_type.id;
        }
        // 2️⃣ внутри типа — по приоритету этапа
        return a.priority - b.priority;
      });

      if (canMapByWorkType) {
        sortedTasks = sortedTasks.map((task) => ({
          ...task,
          displayWorkTypeName: task.work_type?.name, // добавляем свойство для обычного отображения
        }));
      }

      return sortedTasks;
    },
  },
};
</script>

<style scoped>
.text-muted {
  padding-right: 3px;
}
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
