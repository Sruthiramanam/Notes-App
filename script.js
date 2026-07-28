const addBtn = document.getElementById("addBtn");
const notesContainer = document.getElementById("notesContainer");

let notes = JSON.parse(localStorage.getItem("notes")) || [];

function saveNotes() {
    localStorage.setItem("notes", JSON.stringify(notes));
}

function displayNotes() {

    notesContainer.innerHTML = "";

    notes.forEach((note, index) => {

        const noteDiv = document.createElement("div");
        noteDiv.className = "note";

        const textarea = document.createElement("textarea");
        textarea.value = note;

        textarea.addEventListener("input", () => {
            notes[index] = textarea.value;
            saveNotes();
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.innerText = "Delete";
        deleteBtn.className = "delete";

        deleteBtn.addEventListener("click", () => {
            notes.splice(index,1);
            saveNotes();
            displayNotes();
        });

        noteDiv.appendChild(textarea);
        noteDiv.appendChild(deleteBtn);

        notesContainer.appendChild(noteDiv);

    });

}

addBtn.addEventListener("click", () => {

    notes.push("");

    saveNotes();

    displayNotes();

});

displayNotes();