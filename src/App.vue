<script async setup>
import { ref, onUnmounted } from "vue";
import {
  addNote,
  deleteNote,
  notes,
  newNote,
  showModal,
  errorMessage,
  dbNotes,
  selectedNote,
} from "./server/server";

const openModal = (note) => {
  newNote.value = note.text;
  showModal.value = true;
  selectedNote.value = note;
};

const closeModal = () => {
  showModal.value = false;
  newNote.value = "";
};
onUnmounted(() => dbNotes());
</script>

<template>
  <main>
    <div v-if="showModal" class="overlay">
      <div class="modal">
        <textarea
          ref="inputArea"
          name="note"
          id="note"
          cols="30"
          rows="10"
          v-model.trim="newNote"
        ></textarea>
        <p v-if="errorMessage">{{ errorMessage }}</p>
        <button @click="addNote">Add note</button>
        <button @click="closeModal" class="close">close</button>
      </div>
    </div>
    <div class="container">
      <header>
        <h1>Notes</h1>
      </header>
      <div class="cards-container">
        <!-- CARD HOLDING THE DATA -->
        <div
          class="card"
          v-for="note in notes"
          :key="note.id"
          :style="{ backgroundColor: note.bgColor }"
          @click.stop="openModal(note)"
        >
          <div class="delete-btn">
            <button @click.stop="deleteNote(note)" type="button">
              <font-awesome-icon icon="fa-solid fa-xmark" size="lg" />
            </button>
          </div>

          <p class="main-text">{{ note.text }}</p>
          <p class="date">{{ note.date }}</p>
        </div>
      </div>
      <!-- BUTTON FOR ADDING NOTE -->
      <button class="add-note" @click="showModal = true">+</button>
    </div>
  </main>
</template>

<style scoped>
main {
  height: 100vh;
  width: 100vw;
}

.container {
  max-width: 80%;
  padding: 10px;
  margin: 0 auto;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h1 {
  font-weight: bold;
  margin-bottom: 10px;
  font-size: 75px;
}

.add-note {
  border: none;
  padding: 10px;
  width: 60px;
  height: fit-content;
  cursor: pointer;
  background-color: steelblue;
  border-radius: 100%;
  color: white;
  font-size: 40px;
  display: flex;
  margin-left: auto;
  margin-right: 2%;
  margin-bottom: 3%;
  justify-content: center;
  float: right;
}

.card {
  background-color: rgb(237, 182, 44);
  height: 230px;
  padding: 10px;
  border-radius: 15px;
  margin: 10px;
  display: flex;
  flex-direction: column;
  color: black;
  word-wrap: break-word;
  box-sizing: border-box;
  overflow: hidden;
  flex-wrap: nowrap;
  flex: 225px;
  transition: transform 0.6s;
}

.card:hover {
  transform: scale(1.05);
}

.date {
  font-size: 14.5px;
  font-weight: bold;
  position: absolute;
  align-items: flex-start;
}

.cards-container {
  display: flex;
  flex-wrap: wrap;
}

.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  align-items: center;
  justify-content: center;
  display: flex;
  z-index: 10;
}

.modal button {
  padding: 10px 20px;
  font-size: 20px;
  width: 100%;
  background-color: blueviolet;
  border: none;
  color: white;
  margin-top: 15px;
  cursor: pointer;
}

.modal {
  width: 700px;
  background-color: white;
  border-radius: 10px;
  padding: 30px;
  position: relative;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
}

.modal .close {
  background-color: rgb(146, 9, 9);
  margin-top: 7px;
}

.modal p {
  color: rgb(170, 9, 9);
}

.delete-btn button {
  background-color: transparent;
  border: none;
  cursor: pointer;
  float: right;
  transition: transform 0.2ms;
}

.delete-btn button:hover {
  transform: scale(1.6);
}
</style>
