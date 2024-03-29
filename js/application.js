const Application = {
    storageKey: 'todo',

    // Сохраняем текущее состояние в локальное хранилище.
    save() {
        const object = {
            columns: {
                idCounter: Column.idCounter,
                items: []
            },
            notes: {
                idCounter: Note.idCounter,
                items: []
            }
        }

        document
            .querySelectorAll('.column')
            .forEach(columnElement => {
                const column = {
                    id: parseInt(columnElement.getAttribute('data-column-id')),
                    header: columnElement.querySelector('.column-header').textContent,
                    noteIds: []
                }

                columnElement
                    .querySelectorAll('.note')
                    .forEach(noteElement => {
                        column.noteIds.push(parseInt(noteElement.getAttribute('data-note-id')))
                    })

                object.columns.items.push(column)
            })

        document
            .querySelectorAll('.note')
            .forEach(noteElement => {
                const note = {
                    id: parseInt(noteElement.getAttribute('data-note-id')),
                    content: noteElement.textContent
                }

                object.notes.items.push(note)
            })

        const json = JSON.stringify(object)
        localStorage.setItem(Application.storageKey, json)
    },

    // Восстанавливаем текущее состояние из локального хранилища.
    load() {
        if (!localStorage.getItem(Application.storageKey)) {
            return
        }

        const object = JSON.parse(localStorage.getItem(Application.storageKey))
        const getNoteById = id => object.notes.items.find(note => note.id === id)

        const columnsElement = document.querySelector('.columns')
        columnsElement.innerHTML = ''

        for (const {id, header, noteIds} of object.columns.items) {
            const column = new Column(id)
            column.element.querySelector('.column-header').textContent = header

            columnsElement.append(column.element)

            for (const noteId of noteIds) {
                const {id, content} = getNoteById(noteId)
                const note = new Note(id, content)
                column.add(note)
            }
        }
    }
}
