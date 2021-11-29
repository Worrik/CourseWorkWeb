<template>
  <div>
    <v-app-bar app flat color="appbar">
      <v-app-bar-nav-icon @click="drawer = !drawer" v-if="!drawer"></v-app-bar-nav-icon>
      <v-app-bar-title v-text="activePatient || 'History'" />

      <v-spacer></v-spacer>

      <AddOperation
          :active-patient-id="activePatientId"
          :active-patient="activePatient"
          :onSelect="onSelect"
          :fetchPatients="fetchPatients"
          v-if="activePatient"
      >
      </AddOperation>
    </v-app-bar>

    <v-progress-linear
        :indeterminate="loader"
        color="red darken-2"
        :style="loader ? 'z-index: 100' : ''"
    ></v-progress-linear>
    <v-navigation-drawer app v-model="drawer" color="navbar">
      <v-list>
        <v-text-field
            class="search"
            v-model="search"
            label="Search"
            append-icon="mdi-magnify"
            hide-details
            outlined
        ></v-text-field>
        <SpeechControl
            :onSelect="onSelect"
            :fetchPatients="fetchPatients"
            :fetchHistory="fetchHistory"
        />
        <AddPatient :fetch-patients="fetchPatients"></AddPatient>
        <v-list-item-group
        >
          <v-list-item
              v-for="patient in filteredPatients"
              :key="patient.id"
          >
            <v-list-item-content
                @click="onSelect(patient.id, `${patient.surname} ${patient.name}`)"
            >
              <v-list-item-title v-text="`${patient.surname} ${patient.name}`"/>
              <v-list-item-subtitle v-text="`${patient.debt || 0} $`" />
            </v-list-item-content>
            <DeletePatient :patient-id="patient.id" :fetch-patients="fetchPatients"></DeletePatient>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid>
        <div class="operation-list" v-if="historyChanges.length && showHistory">
          <v-list-item
              v-for="h in historyChanges"
              :key="h.id"
              :class="h.type"
              class="operation"
          >
            <v-list-item-content>
              <v-list-item-title v-text="h.type" />
              <v-list-item-subtitle v-text="h.description" />
            </v-list-item-content>
          </v-list-item>
        </div>
        <div class="operation-list" v-if="operations.length && !showHistory">
          <v-list-item
              v-for="operation in operations"
              :key="operation.id"
              :class=" (operation.paid !== false) ? 'create' : 'delete' "
              class="operation"
          >
            <v-list-item-content>
              <v-list-item-title
                  v-text="`${operation.type}`"
              />
              <v-list-item-subtitle v-text="`${operation.price} $`" />
            </v-list-item-content>
            <div class="toggle checkcross">
              <input :ref="`operation-toggle-${operation.id}`"
                     :id="`operation-toggle-${operation.id}`"
                     type="checkbox"
                     @change="payForOperation(operation.id)"
                     :checked="!operation.paid"
                     class="checkcross">
              <label class="toggle-item" :for="`operation-toggle-${operation.id}`">
                <div class="check"></div>
              </label>
            </div>
          </v-list-item>
        </div>
      </v-container>
    </v-main>
  </div>
</template>

<script>
import AddPatient from "@/components/AddPatient";
import AddOperation from "@/components/AddOperation";
import DeletePatient from "@/components/DeletePatient";
import SpeechControl from "@/components/SpeechControl";

export default {
  name: "Dashboard",

  components: {
    SpeechControl,
    DeletePatient,
    AddOperation,
    AddPatient
  },

  computed:{
    theme(){
      return (this.$vuetify.theme.dark) ? 'dark' : 'light'
    },
    filteredPatients() {
      if (this.patients !== []) {
        return this.patients.filter(patient => {
          let name = `${patient.surname} ${patient.name}`
          return name.toLowerCase().includes(this.search.toLowerCase())
        })
      }
      return []
    }
  },

  data () {
    return {
      drawer: null,
      loader: true,
      search: '',
      patients: [],
      operations: [],
      activePatient: "",
      activePatientId: -1,
      historyChanges: [],
      showHistory: true,
      model: 1,
    }
  },
  created () {
    this.fetchPatients()
    this.fetchHistory(true)
  },
  methods: {
    fetchPatients () {
      this.$http.get(`${this.$hostname}/patients/`)
          .then((response) => {
            this.patients = response.data
            this.loader = false
            console.log(response.data)
          })
          .catch((error) => {
            console.log(error)
            localStorage.removeItem('token')
			this.router.push('login')
          });
    },
    onSelect(id, name) {
      this.showHistory = false
      this.loader = true
      this.$http.get(`${this.$hostname}/operations?user=${id}`)
          .then((response) => {
            this.operations = response.data
            this.loader = false
          });
      this.activePatient = name
      this.activePatientId = id
    },
    payForOperation(id) {
      for (let i = this.operations.length - 1; i >= 0; i--) {
        if (this.operations[i].id === id) {
          this.$http.put(`${this.$hostname}/operations/${id}/pay?value=${!this.operations[i].paid}`)
              .then(() => this.fetchPatients())
          this.operations[i].paid = !this.operations[i].paid;
          break;
        }
      }
    },
    fetchHistory(update=false) {
      this.showHistory = true

      if (update)
        this.$http.get(`${this.$hostname}/history`)
            .then((response) => {
              this.historyChanges = response.data
            })
    }
  }
};
</script>

<style scoped>

</style>
