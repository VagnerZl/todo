class Note {
    constructor(id = null, content = '') {
        const instance = this

        const element = this.element = document.createElement('div')

        element.classList.add('note')
        element.setAttribute('draggable', 'true')
        element.setAttribute('data-note-id', id ? id : Note.idCounter++)
        element.textContent = content

        element.addEventListener('dblclick', function (event) {
            element.removeAttribute('draggable')
            instance.column.removeAttribute('draggable')
            element.setAttribute('contenteditable', 'true')
            element.focus()
        })

        element.addEventListener('blur', function (event) {
            element.removeAttribute('contenteditable')
            element.setAttribute('draggable', 'true')
            instance.column.setAttribute('draggable', 'true')

            if (!element.textContent.trim().length) {
                element.remove()
            }

            Application.save()
        })

        element.addEventListener('dragstart', this.dragstart.bind(this))
        element.addEventListener('dragend', this.dragend.bind(this))
        element.addEventListener('dragenter', this.dragenter.bind(this))
        element.addEventListener('dragover', this.dragover.bind(this))
        element.addEventListener('dragleave', this.dragleave.bind(this))
        element.addEventListener('drop', this.drop.bind(this))
    }

    get column() {
        return this.element.closest('.column')
    }

    dragstart(event) {
        event.stopPropagation()

        Note.dragged = this.element
        this.element.classList.add('dragged')
    }

    dragend(event) {
        event.stopPropagation()

        Note.dragged = null
        this.element.classList.remove('dragged')

        document
            .querySelectorAll('.note')
            .forEach(x => x.classList.remove('under'))

        Application.save()
    }

    dragenter(event) {
        event.stopPropagation()

        if (!Note.dragged || this.element === Note.dragged) {
            return
        }

        this.element.classList.add('under')
    }

    dragover(event) {
        event.preventDefault()

        if (!Note.dragged || this.element === Note.dragged) {
            return
        }
    }

    dragleave(event) {
        event.stopPropagation()

        if (!Note.dragged || this.element === Note.dragged) {
            return
        }

        this.element.classList.remove('under')
    }

    drop(event) {
        if (!Note.dragged || this.element === Note.dragged) {
            return
        }

        if (this.element.parentElement === Note.dragged.parentElement) {
            const notes = Array.from(this.element.parentElement.querySelectorAll('.note'))
            const indexA = notes.indexOf(this.element)
            const indexB = notes.indexOf(Note.dragged)

            if (indexA < indexB) {
                this.element.parentElement.insertBefore(Note.dragged, this.element)
            } else {
                this.element.parentElement.insertBefore(Note.dragged, this.element.nextElementSibling)
            }
        } else {
            this.element.parentElement.insertBefore(Note.dragged, this.element)
        }
    }
}

Note.idCounter = 1
Note.dragged = null
