//переключение темы
document.getElementById('nightbtn').addEventListener('click', function () {
    const themeIcon = document.getElementById('theme-icon');
    const currentTheme = document.body.className;

    if (currentTheme === 'light-theme') {
        document.body.className = 'dark-theme';
        themeIcon.src = "photos/Vector (2).svg";
        emptyStateImg.src = emptyStateImg.getAttribute('data-dark');
    } else {
        document.body.className = 'light-theme';
        themeIcon.src = "photos/Vector (1).svg";
        emptyStateImg.src = emptyStateImg.getAttribute('data-light');
    }
});

let TrueDo = null;

//Открытие редактора
document.addEventListener("click", function (e) {
    if (e.target.classList.contains("editor")) {
        const DoElem = e.target.closest(".trashies");
        const TxtElem = DoElem.querySelector(".note");

        TrueDo = TxtElem;
        document.querySelector("#inptRedactor").value = TxtElem.textContent;
        document.querySelector("#backgroundRedactor").style.display = "flex";
        document.querySelector("#inptRedactor").focus();
    }
});

//Закрытие редатокра и сохранение
document.querySelector("#cancelEditor").addEventListener("click", function () {
    const background = document.querySelector("#backgroundRedactor");
    document.querySelector("#backgroundRedactor").style.display = "none";
    TrueDo = null;

})

background = document.querySelector("#backgroundRedactor");
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && background.style.display === 'flex') {
        background.style.display = "none";
        TrueDo = null;
    }
});

document.querySelector("#inptRedactor").addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        document.querySelector("#applyEditor").click();
    }
});



document.querySelector("#applyEditor").addEventListener("click", function () {
    if (TrueDo) {
        const newText = document.querySelector("#inptRedactor").value.trim();
        if (newText !== "") {
            TrueDo.textContent = newText;
        }
        document.querySelector("#backgroundRedactor").style.display = "none";
        TrueDo = null;
    }
});


//поиск
document.getElementById('poisk').addEventListener('input', searchNotes);

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

    const emptyState = document.getElementById('emptyState');
    if (!foundAny && search !== '') {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
    }
}



//открытие попупа
function openPopup() {
    let popup = document.querySelector('.popup');
    let overflow = document.querySelector('.overflow');
    popup.style.display = 'block';
    document.getElementById("inpt").focus();
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
            <div Id="btns">
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

    // Проверяем, есть ли видимые задачи (не скрытые)
    const visibleTasks = Array.from(allTasks).filter(task =>
        task.style.display !== 'none'
    );

    if (visibleTasks.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
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
        const trashies = this.closest('.trashies');
        const nextHr = trashies.nextElementSibling;
        timerUndo(trashies, nextHr);
    });
}

// Для кнопок удаления (существующих задач при загрузке)
document.querySelectorAll('.Trash').forEach(trashBtn => {
    trashBtn.addEventListener('click', function () {
        const trashies = this.closest('.trashies');
        const nextHr = trashies.nextElementSibling;
        timerUndo(trashies, nextHr);
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

// выпадающий список
const filterBtn = document.getElementById('filterBtn');
const dropdown = document.getElementById('filterDropdown');
const menu = dropdown.querySelector(".menu");
const items = menu.querySelectorAll("li");

filterBtn.onclick = function () {
    dropdown.classList.toggle("open");
};

document.addEventListener('click', function (event) {
    if (!dropdown.contains(event.target)) {
        dropdown.classList.remove("open");
    }
});

items.forEach(item => {
    item.addEventListener('click', function () {
        dropdown.classList.remove("open");
    });
});

const changeValueBtn = document.getElementById("filterBtn");
const all = document.querySelectorAll('.menu>li');
const checkbox = document.querySelectorAll('.checknote');

all.forEach(li => {
    li.addEventListener("click", () => {
        changeValueBtn.innerHTML = li.innerHTML;
        filter()
    });
});

function filter() {
    let note = document.querySelectorAll(".trashies");
    note.forEach(elem => {
        elem.style.display = "none"
        let hr = elem.nextElementSibling;
        hr.style.display = "none";
        if (elem.querySelector(".checknote").checked && changeValueBtn.innerText == "Complete") {
            elem.style.display = "flex";
            hr.style.display = "flex";
        }
        if (!elem.querySelector(".checknote").checked && changeValueBtn.innerText == "Incomplete") {
            elem.style.display = "flex";
            hr.style.display = "flex";
        }
        if (changeValueBtn.innerText == "All") {
            elem.style.display = "flex";
            hr.style.display = "flex";
        }
    })
}

// Функция для плашки undo
function timerUndo(taskElement, hrElement) {
    // Сохраняем задачу и hr для возможного восстановления
    const taskClone = taskElement.cloneNode(true);
    const hrClone = hrElement ? hrElement.cloneNode(true) : null;

    // Скрываем оригинальные элементы
    taskElement.style.display = 'none';
    if (hrElement) hrElement.style.display = 'none';

    // Создаем плашку undo и размещаем ее ПЕРЕД скрытой задачей
    const undoBar = document.createElement('div');
    undoBar.className = 'div-undo';
    undoBar.innerHTML = `
        <div class="loader-div">
            <div class="loader"></div>
            <p class="timer">2</p>
        </div>
        <div>
            <p>UNDO <img src="photos/Vector (3).svg"></p>
        </div>
    `;

    // Вставляем плашку перед скрытой задачей
    taskElement.parentNode.insertBefore(undoBar, taskElement);

    let i = 2;
    const timerElement = undoBar.querySelector('.timer');

    // Запускаем анимацию
    undoBar.querySelector('.loader').style.animation = 'l1 2s infinite linear';

    const undoTimeout = setInterval(() => {
        i--;
        timerElement.textContent = i;

        if (i <= -1) {

            clearInterval(undoTimeout);
            if (taskElement.parentNode) {
                taskElement.remove();
                if (hrElement && hrElement.parentNode) {
                    hrElement.remove();
                }
            }
            undoBar.remove();
            EmptyState();
        }
    }, 650);

    // Добавляем обработчик для восстановления
    undoBar.addEventListener('click', function () {
        clearInterval(undoTimeout);

        taskElement.style.display = 'flex';
        if (hrElement) hrElement.style.display = 'block';

        undoBar.remove();
        EmptyState();
    });
}

document.addEventListener('DOMContentLoaded', function () {
    EmptyState();
});

