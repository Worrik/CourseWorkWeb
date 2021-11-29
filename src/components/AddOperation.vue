<template>
  <v-dialog
      v-model="dialog"
      max-width="600px"
      hide-overlay
      no-click-animation
  >
    <template v-slot:activator="{ on }">
      <v-btn
          v-on="on"
          icon
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">Add Operation</span>
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
                <v-select
                    :items="operationTypes"
                    v-model="operationType"
                    color="secondary"
                    label="Type"
                    :rules="rules"
                    dense
                    solo
                    required
                ></v-select>
              </v-row>
              <v-row>
                <v-text-field
                    v-model="operationPrice"
                    :rules="rules"
                    type="number"
                    label="Price"
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
            @click="closeDialog()"
        >
          Close
        </v-btn>
        <v-btn
            color="white"
            text
            @click="addOperation()"
        >
          Add
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "AddOperation",
  props: ['activePatient', 'activePatientId', 'onSelect', 'fetchPatients'],
  data () {
    return {
      dialog: false,
      valid: true,
      operationType: '',
      operationPrice: '',
      operationTypes: ['Удаление зуба', 'Протезирование', 'Пломбирование', 'Имплантация', 'Еще что-то'],
      rules: [
        v => !!v || 'This field is required',
      ],
    }
  },
  methods: {
    addOperation () {
      if (this.$refs.form.validate()){
        this.loader = true;
        this.$http.post(`${this.$hostname}/operations/create`, {
          patient_id: this.activePatientId,
          type: this.operationType,
          price: this.operationPrice
        }).then(() => {
          this.loader = false;
          this.dialog = false;
          this.onSelect(this.activePatientId, this.activePatient);
          this.fetchPatients();
        })
      }
    },
    closeDialog () {
      this.dialog = false;
    }
  }
}
</script>

<style scoped>

</style>
