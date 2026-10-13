const addBtn = document.getElementById("addBtn");
const notesContainer = document.getElementById("notesContainer");

// Create a search input dynamically, so index.html stays unchanged
const searchInput = document.createElement("input");
searchInput.type = "search";
searchInput.placeholder = "Search notes...";
searchInput.setAttribute("aria-label", "Search notes");
searchInput.id = "searchInput";

notesContainer.parentNode.insertBefore(searchInput, notesContainer);

let notes = loadNotes();

function loadNotes() {
    try {
        const savedNotes = JSON.parse(localStorage.getItem("notes"));

        return Array.isArray(savedNotes)
            ? savedNotes.filter(note => typeof note === "string")
            : [];
    } catch (error) {
        console.error("Could not load saved notes:", error);
        return [];
    }
}

function saveNotes() {
    try {
        localStorage.setItem("notes", JSON.stringify(notes));
        return true;
    } catch (error) {
        console.error("Could not save notes:", error);
        alert("Unable to save notes. Browser storage may be full or unavailable.");
        return false;
    }
}

function displayNotes() {
    const searchTerm = searchInput.value.trim().toLowerCase();

    notesContainer.replaceChildren();

    const matchingNotes = notes
        .map((note, index) => ({ note, index }))
        .filter(({ note }) => note.toLowerCase().includes(searchTerm));

    if (matchingNotes.length === 0) {
        const message = document.createElement("p");
        message.className = "empty-message";
        message.textContent = searchTerm
            ? "No matching notes found."
            : "No notes yet. Click + Add Note to get started.";

        notesContainer.appendChild(message);
        return;
    }

    matchingNotes.forEach(({ note, index }) => {
        const noteDiv = document.createElement("div");
        noteDiv.className = "note";

        const textarea = document.createElement("textarea");
        textarea.value = note;
        textarea.placeholder = "Write your note here...";
        textarea.setAttribute("aria-label", `Note ${index + 1}`);
        textarea.rows = 4;

        textarea.addEventListener("input", () => {
            notes[index] = textarea.value;
            saveNotes();
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete";
        deleteBtn.setAttribute("aria-label", `Delete note ${index + 1}`);

        deleteBtn.addEventListener("click", () => {
            const confirmed = confirm("Are you sure you want to delete this note?");

            if (!confirmed) return;

            notes.splice(index, 1);
            saveNotes();
            displayNotes();
        });

        noteDiv.append(textarea, deleteBtn);
        notesContainer.appendChild(noteDiv);
    });
}

addBtn.addEventListener("click", () => {
    notes.push("");
    saveNotes();
    displayNotes();

    // Focus the newly added note when it is visible
    const textareas = notesContainer.querySelectorAll("textarea");
    const lastTextarea = textareas[textareas.length - 1];

    if (lastTextarea && !searchInput.value.trim()) {
        lastTextarea.focus();
    }
});

searchInput.addEventListener("input", displayNotes);

displayNotes();
