
window.addEventListener('DOMContentLoaded', () => {
    const list = document.querySelector('.todo__list');
    const input = document.getElementById('form-input');
    const form = document.getElementById('form');
    const footer = document.querySelector('.todo__footer');
    const footerLeft = document.querySelector('.footer__left');
    const all = document.querySelector('.center__btn--all');
    const active = document.querySelector('.center__btn--active');
    const completed = document.querySelector('.center__btn--completed');

    const themeButton = document.querySelector('.header__theme');

    if (localStorage.getItem("isDark") === "true") {
        document.body.classList.toggle("dark-theme");
    }

    function dragAndDrop() {
        for (let i = 0; i < list.children.length; i++) {
            list.children[i].draggable = true;

            list.children[i].ondragover = allowDrop;
            list.children[i].ondragstart = drag;
            list.ondrop = drop;

            function allowDrop(event) {
                event.preventDefault();
            }

            function drag(event) {
                event.dataTransfer.setData('id', event.target.id);
            }

            function drop(event) {
                const oldId = event.dataTransfer.getData('id');
                const newId = event.target.id;
                const oldTodoIndex = todosArray.findIndex((item) => item.id === +oldId);
                const newTodoIndex = todosArray.findIndex((item) => item.id === +newId);
                const oldTodo = todosArray[oldTodoIndex];
                const newTodo = todosArray[newTodoIndex];
                todosArray[oldTodoIndex] = newTodo;
                todosArray[newTodoIndex] = oldTodo;
                checkEmptyArray(todosArray);
                createLi(todosArray);
            }
        }
    }

    function changeTheme() {
        if (document.body.classList.contains("dark-theme")) {
            localStorage.setItem("isDark", "false");
            document.body.classList.toggle("dark-theme");
        } else {
            localStorage.setItem("isDark", "true");
            document.body.classList.toggle("dark-theme");
        }
    }

    themeButton.addEventListener('click', () => {
        changeTheme();
    })

    let todosArray = [];

    if (localStorage.getItem("array")) {
        todosArray = JSON.parse(localStorage.getItem("array"));
        createLi(todosArray);
    }

    function addArrayToLocalStorage() {
        localStorage.setItem("array", JSON.stringify(todosArray));
    }

    function checkEmptyArray(array) {
        if (array.length !== 0) {
            footer.style.display = "flex";
        } else {
            footer.style.display = "none";
        }

        if (array.length === 1) {
            footerLeft.textContent = `1 item left`;
        } else {
            footerLeft.textContent = `${array.length} items left`;
        }
        addArrayToLocalStorage();
    }
    checkEmptyArray(todosArray);

    function createLi(array) {
        list.innerHTML = "";
        array.forEach((obj, i) => {
            if(array[i].completed) {
                list.innerHTML += `<li id="${obj.id}" class="list__item done">
                        <div class="list__item--icon check__icon newIconBg"></div>
                        <div class="list__item--text">${obj.value}</div>
                        <img class="list__item--remove" src="images/cross.svg">
                    </li>`;
            } else {
                list.innerHTML += `<li id="${obj.id}" class="list__item">
                        <div class="list__item--icon check__icon"></div>
                        <div class="list__item--text">${obj.value}</div>
                        <img class="list__item--remove" src="images/cross.svg">
                    </li>`;
            }
        })
        dragAndDrop();
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (input.value) {
            const id = todosArray.length? (Math.max(...todosArray.map((item) => item.id)) + 1) : 1;
            todosArray.push({value:input.value, completed: false, id});
            createLi(todosArray);
            checkEmptyArray(todosArray);
            form.reset();
            deleteActiveFooter();
            all.classList.add('activeFooter');
            addArrayToLocalStorage();
        }
    });

    list.addEventListener('click', (e) => {
        console.log(e.target);
        if (e.target.classList.contains("list__item--remove")) {
            const todoIndex = todosArray.findIndex((item) => item.id === +e.target.parentNode.getAttribute('id'));
            todosArray.splice(todoIndex, 1);
            createLi(todosArray);
            checkEmptyArray(todosArray);
        }

        if (e.target.classList.contains("list__item--icon")) {
            e.target.parentNode.classList.toggle("done");
            e.target.classList.toggle("newIconBg");
            const todo = todosArray.find((item) => item.id === +e.target.parentNode.getAttribute('id'));

            if (e.target.parentNode.classList.contains("done")) {
                todo.completed = true;
            } else {
                todo.completed = false;
            }

            addArrayToLocalStorage();
        }

        if (active.classList.contains("activeFooter") || completed.classList.contains("activeFooter")) {
            e.target.parentNode.style.display = "none";
        }
    })


    function deleteActiveFooter () {
        for (let i = 0; i < footer.children.length; i++) {
            if (footer.children[1].children[i].classList.contains('activeFooter')) {
                footer.children[1].children[i].classList.remove('activeFooter');
            }
        }
    }

    footer.addEventListener('click', (e) => {
        deleteActiveFooter();
        if (e.target.classList.contains("center__btn--all")) {
            deleteActiveFooter();
            e.target.classList.add("activeFooter");
            todosArray.forEach((el, i) => {
                    list.children[i].style.display = "flex";
            });

        } else if (e.target.classList.contains("center__btn--active")) {
            deleteActiveFooter();
            e.target.classList.add("activeFooter");
            todosArray.forEach((el, i) => {
                if (el.completed) {
                    list.children[i].style.display = "none";
                } else {
                    list.children[i].style.display = "flex";
                }
            });

        } else if (e.target.classList.contains("center__btn--completed")) {
            deleteActiveFooter();
            e.target.classList.add("activeFooter");
            todosArray.forEach((el, i) => {
                if (!el.completed) {
                   list.children[i].style.display = "none";
               } else {
                    list.children[i].style.display = "flex";
                }
            });

        } else if (e.target.classList.contains("footer__right")) {
            deleteActiveFooter();
            all.classList.add('activeFooter');
            todosArray = todosArray.filter(el => !el.completed);
            createLi(todosArray);
            checkEmptyArray(todosArray);
        }
    })
});