<template>
  <v-dialog
      v-model="dialog"
      max-width="400"
      hide-overlay
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
          color="#faa"
          v-bind="attrs"
          v-on="on"
          icon
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        Вы действительно хотите удалить?
      </v-card-title>
      <v-card-text>Это действие необратимо.</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            color="white"
            text
            @click="dialog = false"
        >
          No
        </v-btn>
        <v-btn
            color="white"
            text
            @click="deletePatient"
        >
          Yes
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ['patientId', 'fetchPatients'],
  data () {
    return {
      dialog: false,
    }
  },
  methods: {
    deletePatient () {
      console.log(this.patientId)
      this.$http.delete(`${this.$hostname}/patients/delete?id=${this.patientId}`)
        .then((response) => {
          this.fetchPatients()
          console.log(response)
          this.dialog = false
        })
    }
  }
}
</script>