<template>
  <v-dialog
      v-model="dialog"
      max-width="400"
      hide-overlay
      no-click-animation
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
          v-bind="attrs"
          v-on="on"
          @click="prepare()"
          v-if="isSupport"
          color="secondary"
          class="add-patient"
      >
        Speech Control
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        Speech Control
      </v-card-title>

      <v-card-text>
        <p>- {{ queryToDialogflow }}</p>
        <p>- {{ dialogflowAnswer }}</p>
        <v-btn
            @click="start()"
            :color="buttonColor"
            class="button"
            icon
        >
          <v-icon size="40">mdi-microphone</v-icon>
        </v-btn>
      </v-card-text>

      {{ speechText }}
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            color="white"
            text
            @click="closeDialog()"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "SpeechControl",
  props: ['fetchPatients', 'fetchHistory'],
  data () {
    return {
      isSupport: window.SpeechRecognition || window.webkitSpeechRecognition,
      dialog: false,
      speechText: '',
      buttonColor: 'white',
      recognition: window.SpeechRecognition || window.webkitSpeechRecognition,
      recognitionStart: false,
      queryToDialogflow: 'Query',
      dialogflowAnswer: 'Answer',
      speech: SpeechSynthesisUtterance,
    }
  },
  created () {
  },
  methods: {
    closeDialog () {
      this.onSpeechEnd();
      this.dialog = false;
    },
    prepare () {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

      this.recognition = new SpeechRecognition();
      // this.recognition.continuous = true;
      // this.recognition.interimResults = true;
      this.recognition.lang = 'ru-RU';

      this.recognition.onaudiostart = this.onAudioStart;
      this.recognition.onresult = this.onResult;
      this.recognition.onspeechend = this.onSpeechEnd;
      this.recognition.onerror = function(event) {
        alert('Speech recognition error detected: ' + event.error);
        alert('Additional information: ' + event.message);
      }

      this.speech = new SpeechSynthesisUtterance();
      this.speech.lang = "ru-RU";
    },
    start () {
      if (!this.recognitionStart) {
        this.recognition.start();
        console.log('Ready to receive command.');
        this.buttonColor = 'red';
      }
      else {
        this.buttonColor = 'white';
        this.onSpeechEnd();
      }
      this.recognitionStart = !this.recognitionStart;
    },
    onAudioStart () {
      console.log('start');
    },
    onResult (event) {
      const last = event.results.length - 1;
      console.log(`${event.results[last][0].transcript}, ${event}`);
      console.log('Confidence: ' + event.results[0][0].confidence);
      this.queryToDialogflow = event.results[last][0].transcript;
      this.recognitionStart = false;

      this.$http.post(`${this.$hostname}/speechcontrol/1/`, {"text": event.results[last][0].transcript})
        .then((response) => {
          this.dialogflowAnswer = response.data["answer"];
          this.speech.text = response.data["answer"];
          window.speechSynthesis.speak(this.speech);
          if (response.data.need_update) {
            this.fetchHistory();
            this.fetchPatients();
          }
        })
    },
    onSpeechEnd () {
      this.recognition.stop();
      window.speechSynthesis.cancel();
      this.buttonColor = 'white';
      this.recognitionStart = false;
    }
  }
}
</script>

<style scoped>
.button {
  display: table;
  margin: 0 auto !important;
}
</style>