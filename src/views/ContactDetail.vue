<template>
  <div
    class="contactDetail h-full flex flex-col"
    v-if="Object.keys(this.employeeDetail).length > 0"
  >
    <main class="flex flex-col justify-center flex-1 p-16">
      <h1 class="w-fit text-5xl">Detalesnė kontakto informacija:</h1>
      <div class="p-32 px-60 flex-1 flex flex-col justify-start gap-5">
        <div class="profile flex gap-5 items-center w-fit text-center">
          <md-avatar class="avatar" v-if="employeeDetail.photo.length > 0">
            <img
              :src="`${$CURRENT_URL}/api/files/employees/${employeeDetail.id}/${employeeDetail.photo}`"
              alt="Avatar"
            />
          </md-avatar>
          <img v-else :src="anonymous" alt="grey silhouette" class="w-16" />
          <div class="deets w-fit flex items-center flex-col">
            <h1 class="name text-4xl">
              {{ employeeDetail.name + " " + employeeDetail.surname }}
            </h1>
            <div class="position">Pozicija: {{ employeeDetail.position }}</div>
          </div>
        </div>
        <md-card class="flex justify-start items-start h-fit">
          <div class="flex-1">
            <md-card-header>
              <div class="md-title">Kontaktinės detalės:</div>
            </md-card-header>
            <md-card-content>
              Elektroninis paštas:
              <a :href="`mailto:${employeeDetail.email}`">{{
                employeeDetail.email
              }}</a>
            </md-card-content>
            <md-card-content>
              Telefono numeris:
              <a href="#">{{ employeeDetail.phone_number }}</a>
            </md-card-content>
          </div>
          <div class="flex-1">
            <md-card-header>
              <div class="md-title">Kompanijos detalės:</div>
            </md-card-header>
            <md-card-content>
              Kompanija:
              {{
                employeeDetail.expand.company_id
                  ? employeeDetail.expand.company_id.name
                  : "Nėra"
              }}
            </md-card-content>
            <md-card-content>
              Būstinė:
              {{
                employeeDetail.expand.office_id
                  ? employeeDetail.expand.office_id.name
                  : "Nėra"
              }}
            </md-card-content>
            <md-card-content>
              Padalinys:
              {{
                employeeDetail.expand.division_id
                  ? employeeDetail.expand.division_id.name
                  : "Nėra"
              }}
            </md-card-content>
            <md-card-content>
              Skyrius:
              {{
                employeeDetail.expand.department_id
                  ? employeeDetail.expand.department_id.name
                  : "Nėra"
              }}
            </md-card-content>
            <md-card-content>
              Grupė:
              {{
                employeeDetail.expand.group_id
                  ? employeeDetail.expand.group_id.name
                  : "Nėra"
              }}
            </md-card-content>
          </div>
        </md-card>
      </div>
    </main>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import HeaderVue from "../components/components/Header.vue";
import anonymous from "../assets/avatar.png";

export default {
  beforeRouteLeave(to, from, next) {
    this.SET_EMPLOYEE_DETAIL({}), next();
  },
  data() {
    return {
      anonymous,
    };
  },
  components: {
    HeaderVue,
  },
  methods: {
    ...mapActions(["getSingleEmployee"]),
    ...mapMutations(["SET_EMPLOYEE_DETAIL"]),
  },
  async created() {
    await this.getSingleEmployee(this.$route.params.id);
  },
  computed: {
    ...mapGetters(["employeeDetail"]),
  },
};
</script>

<style scoped>
.avatar {
  width: 4rem !important;
  height: 4rem !important;
}
.name {
  width: fit-content !important;
}
</style>
