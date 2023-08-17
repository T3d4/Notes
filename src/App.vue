<script async setup>
import { ref, onUnmounted } from "vue";
import config from "./config";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  onSnapshot,
  deleteDoc,
  collection,
  addDoc,
  doc,
  query,
} from "firebase/firestore";

const app = initializeApp(config);
const db = getFirestore(app);
const showModal = ref(false);
const newNote = ref("");
const notes = ref([]);
const errorMessage = ref("");

function getRandomColor() {
  return "hsl(" + Math.random() * 360 + ", 100%, 75%)";
}

const fDate = (date) => {
  const dateInput = new Date(date);
  return dateInput.toLocaleDateString("en-UK");
};

const dbRef = collection(db, "notes");

const dbNotes = onSnapshot(dbRef, (docsSnap) => {
  docsSnap.docChanges().forEach((n) => {
    const existingNote = notes.value.find((note) => note.id === n.doc.id);
    console.log("data-Updated", n.doc.data());
    if (n.type === "added") {
      notes.value.push({
        id: n.doc.id,
        text: n.doc.data().text,
        date: fDate(n.doc.data().date.toDate()),
        bgColor: n.doc.data().bgColor,
      });
    }
    if (n.type === "modified") {
    }
    if (n.type === "removed") {
      const noteIndex = notes.value.findIndex((note) => note.id == n.doc.id);
      console.log(noteIndex, "Index");
      if (noteIndex !== -1) {
        notes.value.splice(noteIndex, 1);
      }
    }
  });
});

const addNote = async () => {
  if (newNote.value.length < 9) {
    return (errorMessage.value = "Note needs 10 characters or more");
  }
  addDoc(collection(db, "notes"), {
    text: newNote.value,
    date: new Date(),
    bgColor: getRandomColor(),
  });

  showModal.value = false;
  newNote.value = "";
  await Promise.all([addNote()]);
  errorMessage.value = "";
};

const deleteNote = async (noteId) => {
  await deleteDoc(doc(db, "notes", noteId));
};

onUnmounted(() => dbNotes());
</script>

<template>
  <main>
    <div v-if="showModal" class="overlay">
      <div class="modal">
        <textarea
          name="note"
          id="note"
          cols="30"
          rows="10"
          v-model.trim="newNote"
        ></textarea>
        <p v-if="errorMessage">{{ errorMessage }}</p>
        <button @click="addNote">Add note</button>
        <button @click="showModal = false" class="close">close</button>
      </div>
    </div>
    <div class="container">
      <header>
        <h1>Notes</h1>
        <button @click="showModal = true">+</button>
      </header>
      <div class="cards-container">
        <div
          class="card"
          v-for="note in notes"
          :key="note.id"
          :style="{ backgroundColor: note.bgColor }"
        >
          <div class="delete-btn">
            <button @click="deleteNote(note.id)" type="button">
              <font-awesome-icon icon="fa-solid fa-xmark" size="lg" />
            </button>
          </div>
          <p class="main-text">{{ note.text }}</p>
          <p class="date">{{ note.date }}</p>
        </div>
      </div>
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
  margin-bottom: 25px;
  font-size: 75px;
}

header button {
  border: none;
  padding: 10px;
  width: 70px;
  height: 70px;
  cursor: pointer;
  background-color: steelblue;
  border-radius: 100%;
  color: white;
  font-size: 40px;
  margin-right: 30%;
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
