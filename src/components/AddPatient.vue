<template>
  <v-dialog
      v-model="dialog"
      max-width="600px"
      hide-overlay
      no-click-animation
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
          class="add-patient"
          color="secondary"
          v-bind="attrs"
          v-on="on"
      >
        Add patient
      </v-btn>
    </template>
    <v-card color="background">
      <v-card-title>
        <span class="text-h5">Add Patient</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form
              ref="form"
              v-model="valid"
              lazy-validation
          >
            <v-col>
              <v-row>
                <v-text-field
                    v-model="surname"
                    :rules="rules"
                    label="Surname"
                    required
                ></v-text-field>
              </v-row>
              <v-row>
                <v-text-field
                    v-model="name"
                    :rules="rules"
                    label="Name"
                    required
                ></v-text-field>
              </v-row>
            </v-col>
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            color="white"
            text
            @click="dialog = false"
        >
          Close
        </v-btn>
        <v-btn
            color="white"
            text
            @click="addPatient()"
        >
          Add
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "AddPatient",
  props: ['fetchPatients'],
  data () {
    return {
      dialog: false,
      valid: true,
      name: '',
      surname: '',
      rules: [
        v => !!v || 'This field is required',
      ],
    }
  },
  methods: {
    addPatient () {
      if (this.$refs.form.validate()){
        this.loader = true;
        this.$http.post(`${this.$hostname}/patients/create`, {
          surname: this.surname,
          name: this.name,
        }).then((response) => {
          console.log(response)
          this.loader = false;
          this.dialog = false;
          this.fetchPatients();
        })
      }
    }
  }
}
</script>

<style scoped>

</style>