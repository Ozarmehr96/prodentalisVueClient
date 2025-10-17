<template>
  <div class="card p-3 mb-3" v-if="isSystemAdmin">
    <form @submit.prevent="handleSubmit">
      <div class="mb-3">
        <label for="labName" class="form-label">Название лаборатории</label>
        <input type="text" id="labName" class="form-control" v-model="lab.name"
          placeholder="Введите название лаборатории" required />
      </div>

      <button type="submit" class="btn btn-primary">
        {{ editMode ? "Сохранить изменения" : "Создать" }}
      </button>
      <button v-if="editMode" type="button" class="btn btn-secondary ms-2" @click="cancelEdit">
        Отмена
      </button>
    </form>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from "vuex";
  import { IS_SYSTEM_ADMIN, SAVE_LAB, UPDATE_LAB } from "../../store/types";

  export default {
    name: "LabForm",
    props: {
      editMode: {
        type: Boolean,
        default: false,
      },
      existingLab: {
        type: Object,
        default: null,
      },
    },
    data() {
      return {
        lab: {
          id: null,
          name: "",
        },
      };
    },
    computed: {
      ...mapGetters({
        isSystemAdmin: IS_SYSTEM_ADMIN
      }),
    },
    watch: {
      existingLab: {
        immediate: true,
        handler(newVal) {
          if (newVal) {
            this.lab = { ...newVal };
          } else {
            this.lab = { id: null, name: "" };
          }
        },
      },
    },
    methods: {
      ...mapActions({
        saveLab: SAVE_LAB,
        updateLab: UPDATE_LAB,
      }),

      async handleSubmit() {
        if (this.editMode) {
          await this.updateLab({
            ...this.lab,
            callback: (l) => {
              this.$toast(
                `Лаборатория изменена.`,
                5000
              );

              this.$router.push('/labs');
              return;
            }
          });
        } else {
          this.saveLab({
            ...this.lab,
            callback: (l) => {
              this.$toast(
                `Лаборатория '${l.name}' добавлена.`,
                5000
              );

              this.$router.push('/labs');
              return;
            }
          });
        }
      },

      cancelEdit() {
        this.lab = { id: null, name: "" };
         this.$router.push('/labs');
      },
    },
  };
</script>

<style scoped>
  .card {
    max-width: 500px;
  }
</style>
