//переключение темы
document.getElementById('nightbtn').addEventListener('click', function () {
    const themeIcon = document.getElementById('theme-icon');
    const currentTheme = document.body.className;

    
    if (currentTheme === 'light-theme') {
        document.body.className = 'dark-theme';
        themeIcon.src = "Vector (2).svg";
        console.log("Switched to dark theme");
    } else {
        document.body.className = 'light-theme';
        themeIcon.src = "Vector (1).svg";
        console.log("Switched to light theme");
    }
});

//поиск
function searchNotes() {
    const search = document.getElementById('poisk').value.toLowerCase();
    const allTasks = document.querySelectorAll('.trashies');
    let foundAny = false;

    allTasks.forEach(task => {
        const text = task.querySelector('.note').textContent.toLowerCase();
        const isVisible = text.includes(search);


        task.style.display = isVisible ? 'flex' : 'none';


        const nextHr = task.nextElementSibling;
        if (nextHr && nextHr.tagName === 'HR') {
            nextHr.style.display = isVisible ? 'block' : 'none';
        }

        if (isVisible) {
            foundAny = true;
        }
    });

    //показываем или скрываем  "Empty..."
    const emptyState = document.getElementById('emptyState');
    if (!foundAny && search !== '') {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
    }
}

document.getElementById('confirm').addEventListener('click', searchNotes);

//рабочий Enter для поиска
document.getElementById('poisk').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        searchNotes();
    }
});

//открытие попупа
function openPopup() {
    let popup = document.querySelector('.popup');
    let overflow = document.querySelector('.overflow');
    popup.style.display = 'block';
    overflow.style.display = 'block';
}

//отчистка поля ввода и закрытие попупа
function closePopup() {
    let popup = document.querySelector('.popup');
    let overflow = document.querySelector('.overflow');
    popup.style.display = 'none';
    overflow.style.display = 'none';
    document.getElementById('inpt').value = '';
}

//добавление новой задачи
function addNewNote() {
    const input = document.getElementById('inpt');
    const noteText = input.value.trim();

    if (noteText === '') {
        alert('Задача не может быть без задачи лол');
        return;
    }

    //структура html для новой задачи
    const newNoteHTML = `
        <div class="trashies">
            <div class="checkboxes">
                <input type="checkbox" class="checknote"> 
                <label class="note">${noteText}</label>
            </div>
            <div style="display: flex;">
                <div class="editor"></div>
                <div class="Trash"></div>
            </div>
        </div>
        <hr>
    `;

    //добавляем новую задачу в начало списка
    const divNote = document.getElementById('divNote');
    divNote.insertAdjacentHTML('afterbegin', newNoteHTML);

    addEventListenersToNewNote(divNote.firstElementChild);

    // Очищаем поле ввода и закрываем попуп
    input.value = '';
    closePopup();

    //если создается новая задача скрываем "empty..."
    document.getElementById('emptyState').classList.add('hidden');
}

//функия для "empty..."
function EmptyState() {
    const allTasks = document.querySelectorAll('.trashies');
    const emptyState = document.getElementById('emptyState');
    const search = document.getElementById('poisk').value.toLowerCase();

    // Если есть активный поиск, не меняем состояние "empty..."
    if (search !== '') {
        return;
    }

    // Если нет задач, показываем "empty..."
    if (allTasks.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        // Проверяем, есть ли видимые задачи
        const visibleTasks = Array.from(allTasks).filter(task =>
            task.style.display !== 'none'
        );
        if (visibleTasks.length === 0) {
            emptyState.classList.remove('hidden');
        } else {
            emptyState.classList.add('hidden');
        }
    }
}

//обработчик для новой задачи
function addEventListenersToNewNote(noteElement) {
    //для чекбокса
    const checkbox = noteElement.querySelector('.checknote');
    checkbox.addEventListener('change', function () {
        const label = noteElement.querySelector('.note');
        if (this.checked) {
            label.style.textDecoration = 'line-through';
        } else {
            label.style.textDecoration = 'none';
        }
    });

    //для корзины
    const trashBtn = noteElement.querySelector('.Trash');
    trashBtn.addEventListener('click', function () {
        const nextHr = noteElement.nextElementSibling;
        if (nextHr && nextHr.tagName === 'HR') {
            nextHr.remove();
        }
        noteElement.remove();
        EmptyState();
    });

    //для редактирования
    const editorBtn = noteElement.querySelector('.editor');
    editorBtn.addEventListener('click', function () {

        alert('Ну тоже не наглей да');
    });
}


// Для кнопок удаления
document.querySelectorAll('.Trash').forEach(trashBtn => {
    trashBtn.addEventListener('click', function () {
        const trashies = this.closest('.trashies');
        const nextHr = trashies.nextElementSibling;
        if (nextHr && nextHr.tagName === 'HR') {
            nextHr.remove();
        }
        trashies.remove();
        EmptyState();
    });
});


document.querySelector('.Apply').addEventListener('click', addNewNote);

//Рабочий Enter для новых задач
document.getElementById('inpt').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        addNewNote();
    }
});