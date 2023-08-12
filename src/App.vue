<script setup>
import { ref } from 'vue';
const showModal = ref(false);
const newNote = ref('');
const notes = ref([]);

function getRandomColor(){
  return "hsl(" + Math.random() * 360 + ", 100%, 75%)";
}

const addNote = () => {
  notes.value.push({
    id: Math.floor(Math.random()*1000000),
    text: newNote.value,
    date: new Date(),
    backgroundColor: getRandomColor()
  });
  showModal.value = false;
  newNote.value = '';
}
</script>

<template>
  <main>
    <div v-if="showModal" class="overlay">
      <div class="modal">
        <textarea name="note" id="note" cols="30" rows="10" v-model="newNote"></textarea>
        <button @click="addNote">Add note</button>
        <button @click="showModal=false" class="close">close</button>
      </div>
    </div>
    <div class="container">
      <header>
        <h1>Notes</h1>
        <button @click="showModal=true">+</button>
      </header>
      <div class="cards-container" v-for="note in notes">
        <div class="card" :style="{backgroundColor: note.backgroundColor}">
          <p class="main-text"> {{ note.text }} </p>
          <p class="date"> {{ note.date }} </p>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
  main{
    height: 100vh;
    width: 100vw;
  }

  .container {
    max-width: 800px;
    padding: 10px;
    margin: 0 auto;
  }

  header{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  h1{
    font-weight: bold;
    margin-bottom: 25px;
    font-size: 75px;
  }

  header
  button{
    border: none;
    padding: 10px;
    width: 50px;
    height: 50px;
    cursor: pointer;
    background-color: steelblue;
    border-radius: 100%;
    color: white;
    font-size: 20px;
  }

  .card{
    width: 225px;
    height: 225px;
    background-color: rgb(237, 182, 44);
    padding: 10px;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-right: 20px;
    margin-bottom: 20px;
    color: black;
  }

  .date{
    font-size: 12.5px;
    font-weight: bold;
  }

  .cards-container{
    display: flex;
    flex-wrap: wrap;
  }

  .overlay{
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    align-items: center;
    justify-content: center;
    display: flex;
    z-index: 10;
  }

  .modal
  button{
    padding: 10px 20px;
    font-size: 20px;
    width: 100%;
    background-color: blueviolet;
    border: none;
    color: white;
    margin-top: 15px;
    cursor: pointer;
  }

  .modal{
    width: 700px;
    background-color: white;
    border-radius: 10px;
    padding: 30px;
    position: relative;
    display: flex;
    flex-direction: column;
    margin: 0 auto;
  }

  .modal .close{
    background-color: rgb(146, 9, 9);
    margin-top: 7px;
  }
</style>