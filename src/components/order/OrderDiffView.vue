<template>
  <div :id="`order-${order.id}-body`">
    <div class="me-3" style="flex: 1 1 auto">

      <!-- Заказчик -->
      <div class="d-flex mb-2">
        <span class="text-muted orderKey">Заказчик:</span>
        <span class="fw-semibold">
          <template v-if="showDiffs && isChanged('customer_name')">
            <span class="text-secondary text-decoration-line-through">{{ oldOrder.customer_name }}</span>
            <transition name="fade-slide">
              <span class="text-secondary mx-1 arrow">→</span>
            </transition>
          </template>
          {{ order.customer_name }}
        </span>
      </div>

      <!-- Пациент -->
      <div class="d-flex mb-2">
        <span class="text-muted orderKey">Пациент:</span>
        <span class="fw-semibold">
          <template v-if="showDiffs && isChanged('patient_name')">
            <span class="text-secondary text-decoration-line-through">{{ oldOrder.patient_name }}</span>
            <transition name="fade-slide">
              <span class="text-secondary mx-1 arrow">→</span>
            </transition>
          </template>
          {{ order.patient_name }}
        </span>
      </div>

      <!-- Срок исполнения -->
      <div class="d-flex mb-2">
        <span class="text-danger fw-bold orderKey">Срок:</span>
        <span class="fw-semibold text-danger fw-bold">
          <template v-if="showDiffs && isChanged('expired_at')">
            <span class="text-secondary text-decoration-line-through fw-normal">{{ $toDateFormat(oldOrder.expired_at) }}</span>
            <transition name="fade-slide">
              <span class="text-secondary mx-1 arrow">→</span>
            </transition>
          </template>
          {{ $toDateFormat(order.expired_at) }}
        </span>
      </div>

      <!-- Цена -->
      <div class="d-flex mb-2">
        <span class="text-muted orderKey">Цена:</span>
        <span class="fw-semibold">
          <template v-if="showDiffs && isChanged('price')">
            <span class="text-secondary text-decoration-line-through">{{ oldOrder.price }} TJS</span>
            <transition name="fade-slide">
              <span class="text-secondary mx-1 arrow">→</span>
            </transition>
          </template>
          {{ order.price }} TJS
        </span>
      </div>

      <!-- Комментарий -->
      <div class="d-flex mb-2">
        <span class="text-muted orderKey">Комментарии:</span>
        <span class="fw-semibold">
          <template v-if="showDiffs && isChanged('description')">
            <span class="text-secondary text-decoration-line-through">{{ oldOrder.description }}</span>
            <transition name="fade-slide">
              <span class="text-secondary mx-1 arrow">→</span>
            </transition>
          </template>
          {{ order.description }}
        </span>
      </div>

      <!-- Типы работ -->
      <div>
        <strong>Типы работ:</strong>
        <ul class="list-unstyled ms-2">
          <li v-for="wt in diffWorkTypes" :key="wt.id" class="mb-1 d-flex align-items-center">
            <div class="workTypeBlock me-2" :style="`background-color:${wt.background_color};`"></div>
            <span class="me-2">
              <template v-if="showDiffs && wt.oldName">
                <span class="text-secondary text-decoration-line-through">{{ wt.oldName }}</span>
                <transition name="fade-slide">
                  <span v-if="wt.name" class="text-secondary mx-1 arrow">→</span>
                </transition>
              </template>
              {{ wt.name }}:
            </span>
            <span class="text-muted">
              <div class="teeth d-inline-flex">
                <template v-if="showDiffs && wt.changed && wt.oldTeeth.length">
                  <span class="text-secondary text-decoration-line-through ms-1 tooth">{{ wt.oldTeeth.join(', ') }}</span>
                  <transition name="fade-slide">
                    <span v-if="!wt.oldName" class="text-secondary mx-1 arrow">→</span>
                  </transition>
                </template>
                <template v-if="!wt.oldName || !showDiffs">
                  <span v-for="tooth in wt.teeth" :key="tooth" class="tooth">{{ tooth }}</span>
                </template>
              </div>
            </span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { convertOrderTeethToWorkTypes } from '../../helpers/order-helpers';

export default {
  name: "DiffOrder",
  props: {
    order: { type: Object, required: true },
    oldOrder: { type: Object, required: true },
    showDiffs: { type: Boolean, default: true } // новый проп для включения/отключения сравнения
  },
  computed: {
    workTypes() {
      return convertOrderTeethToWorkTypes(this.order.teeth.slice());
    },
    oldWorkTypes() {
      return convertOrderTeethToWorkTypes(this.oldOrder.teeth.slice());
    },
    diffWorkTypes() {
      const diffs = [];

      this.workTypes.forEach(newWt => {
        const oldWt = this.oldWorkTypes.find(o => o.id === newWt.id);
        let changed = false;
        let oldName = '';
        let oldTeeth = [];

        if (!oldWt) {
          changed = true;
        } else {
          if (oldWt.name !== newWt.name) {
            changed = true;
            oldName = oldWt.name;
          }
          const oldTeethSorted = [...oldWt.teeth].sort();
          const newTeethSorted = [...newWt.teeth].sort();
          if (JSON.stringify(oldTeethSorted) !== JSON.stringify(newTeethSorted)) {
            changed = true;
            oldTeeth = oldTeethSorted;
          }
        }

        diffs.push({ ...newWt, changed, oldName, oldTeeth });
      });

      this.oldWorkTypes.forEach(oldWt => {
        const existsInNew = this.workTypes.find(n => n.id === oldWt.id);
        if (!existsInNew) {
          diffs.push({ ...oldWt, changed: true, oldName: oldWt.name, oldTeeth: oldWt.teeth, name: '' });
        }
      });

      return diffs;
    }
  },
  methods: {
    isChanged(key) {
      return this.showDiffs && this.oldOrder?.[key] !== this.order?.[key];
    }
  }
};
</script>

<style scoped>
.orderKey { width: 120px; display: inline-block; }
.text-secondary { font-size: 0.9em; }
.teeth { display: flex; flex-wrap: wrap; gap: 4px; }
.tooth { font-size: 14px; background: #f0f0f0; padding: 2px 6px; border-radius: 4px; }
.arrow { font-size: 1.2em; font-weight: bold; line-height: 1; }
.workTypeBlock { width: 20px; height: 20px; display: inline-flex; }

.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-6px);
}
</style>
