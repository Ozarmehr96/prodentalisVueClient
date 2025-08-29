<template>
  <!-- Main content -->
  <div class="content flex-grow-1 me-3">
    <div class="content-header d-flex align-items-center" style="margin-bottom: 16px;">
      <span class="fs-4">{{ title }}</span>
    </div>
    <slot></slot>
  </div>
</template>
<script >
export default {
  name: 'AppPage',
  props: {
    title: {
      type: String,
      default: null,
    },
  },
};
</script>

