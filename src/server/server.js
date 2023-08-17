import {
    getFirestore,
    onSnapshot,
    deleteDoc,
    collection,
    addDoc,
    doc,
} from "firebase/firestore";
import config from "../config";
import { initializeApp } from "firebase/app";
import { ref } from "vue";

const app = initializeApp(config);
const db = getFirestore(app);
const dbRef = collection(db, "notes");
const notes = ref([]);
const newNote = ref("");

function getRandomColor() {
    return "hsl(" + Math.random() * 360 + ", 100%, 75%)";
}

const fDate = (date) => {
    const dateInput = new Date(date);
    return dateInput.toLocaleDateString("en-UK");
};

const dbNotes = onSnapshot(dbRef, (docsSnap) => {
    docsSnap.docChanges().forEach((n) => {
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

const addNote = async (noteId) => {
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
    await deleteDoc(doc(db, "notes", noteId.id));
};


export { dbNotes, deleteNote, addNote, notes, newNote }