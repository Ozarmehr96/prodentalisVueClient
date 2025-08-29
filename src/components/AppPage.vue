<template>
  <!-- Main content -->
  <div class="content flex-grow-1 me-3">
    <div
      class="content-header d-flex align-items-center"
      style="margin-bottom: 16px"
    >
      <span class="fs-4">{{ title }}</span>
      <add-button v-if="isShowAddButton" @onClickEvent="() => $emit(`onAddButtonClickEvent`)" />
    </div>
    <slot></slot>
  </div>
</template>
<script>
import AddButton from "./AddButton.vue";
export default {
  name: "AppPage",
  components: {
    AddButton,
  },
  props: {
    title: {
      type: String,
      default: null,
    },
    isShowAddButton: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style>
.content-header {
  border-bottom: var(--bs-border-width) solid;
  padding-top: 10px;
  height: 58px;
  max-height: 58px;
  border-bottom-color: rgb(194 196 197);
}
</style>
