import {
    getFirestore,
    onSnapshot,
    deleteDoc,
    collection,
    addDoc,
    doc,
    updateDoc,
} from "firebase/firestore";
import config from "../config";
import { initializeApp } from "firebase/app";
import { ref } from "vue";

const app = initializeApp(config);
const db = getFirestore(app);
const dbRef = collection(db, "notes");
const notes = ref([]);
const newNote = ref("");
const showModal = ref(false);
const errorMessage = ref("");
const selectedNote = ref({});


const getRandomColor = () => {
    return "hsl(" + Math.random() * 360 + ", 100%, 75%)";
};

const fDate = (date) => {
    const dateInput = new Date(date);
    return dateInput.toLocaleDateString("en-UK");
};

const dbNotes = onSnapshot(dbRef, (docsSnap) => {
    docsSnap.docChanges().forEach((n) => {
        if (n.type === "added") {
            if (!notes.value.find(note => note.id == n.doc.id)) {
                notes.value.push({
                    id: n.doc.id,
                    text: n.doc.data().text,
                    date: fDate(n.doc.data().date.toDate()),
                    bgColor: n.doc.data().bgColor,
                });
            }
        }
        if (n.type === "modified") {
            const noteIndex = notes.value.findIndex(note => note.id == n.doc.id);
            notes.value[noteIndex].text = n.doc.data().text;
        }
        if (n.type === "removed") {
            const noteIndex = notes.value.findIndex((note) => note.id == n.doc.id);
            if (noteIndex !== -1) {
                notes.value.splice(noteIndex, 1);
            }
        }
    });
});

const addNote = async () => {
    const newText = newNote.value
    const id = selectedNote.value.id
    if (newNote.value.length < 9) {
        return (errorMessage.value = "Note needs 10 characters or more");
    }

    // CHECKS IF NOTE EXISTS AND UPDATES
    if (id) {
        const docRef = doc(db, "notes", id)
        updateDoc(docRef, {
            text: newText
        })
        showModal.value = false;
        newNote.value = "";
        selectedNote.value = "";
    }

    if (!id) {
        addDoc(collection(db, "notes"), {
            text: newNote.value,
            date: new Date(),
            bgColor: getRandomColor(),
        });
        showModal.value = false;
        newNote.value = "";
    }

    await Promise.all([addNote, updateDoc, addDoc]);
    errorMessage.value = "";
};

const deleteNote = async (noteId) => {
    await deleteDoc(doc(db, "notes", noteId.id));
};


export {
    dbNotes, deleteNote, addNote,
    notes, newNote, showModal, errorMessage, selectedNote
}