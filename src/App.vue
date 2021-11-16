<template>
  <v-app :style="{background: $vuetify.theme.themes[theme].background}">
    <router-view />
  </v-app>
</template>

<script>
export default {
  name: 'App',
  computed:{
    theme(){
      return (this.$vuetify.theme.dark) ? 'dark' : 'light'
    }
  },
}
</script>

<style lang="scss">
@import './styles/toggle.scss';
@import url('https://fonts.googleapis.com/css2?family=Comfortaa');

#app > div > main > div > div > div > div {
}
* {
  font-family: 'Comfortaa', sans-serif;
}
html {
  overflow-y: auto;
}
.search {
  margin: 0 10px 10px 10px !important;
}
.operation-list {
  border-radius: 10px;
  padding: 10px;
  background-color: #857d6d;
}
.operation:first-child {
  border-radius: 10px 10px 0 0;
}
.operation:last-child {
  border-radius: 0 0 10px 10px;
}
.operation {
  transition: background-color .5s ease;
  padding-right: 0 !important;
}
.operation + .operation {
  border-bottom: aqua 1px solid !important;
}
.toggle {
  transform: scale(0.5);
}
.add-patient {
  margin-right: 10px;
  margin-left: 10px;
  margin-bottom: 10px !important;
  width: calc(100% - 20px);
}
*:before {
  background-color: inherit !important;
}
.theme--dark.v-card {
  background-color: #4a453c !important;
}
#list-128, .v-select-list.theme--dark,
#app > div.v-dialog__content.v-dialog__content--active > div > div > div.v-card__text > div > form > div > div:nth-child(1) > div > div > div,
#app > div.v-dialog__content.v-dialog__content--active > div > div{
  background-color: #59483c !important;
}
</style>
