document.querySelector(".btn").addEventListener("click", function() {
    document.querySelector("body").innerHTML=`
    <div>
    <h1> ToDo List ! </h1>
    <input class="inputStyle" type="text" name="todoName" id="todoName" placeholder="New Todo">
    <button class="btn btn-lg btn-dark" id="addToDo">Add todo</button>
    <p class="ml-7"><i>( click on a todo to edit )</i></p>
    <ol id="todos"></ol>
    <div>
`;
    document.querySelector("body").classList.add("appTheme");
    document.querySelector("#addToDo").addEventListener("click",addToDo);
    
    // setTimeout(todoApp , 1 );
});
window.addEventListener("keydown" ,function(key){
    if(key.code=="Enter"){
        addToDo();
    }
} )


function addToDo() {
    const todosList = document.querySelector("#todos");
    const newTodo = document.querySelector("#todoName").value.trim();
    if (newTodo) {
        const li = document.createElement("li");
        li.classList.add("todo-item");

        const todoText = document.createElement("span");
        todoText.setAttribute("id","todoText");
        todoText.textContent = newTodo;
        todoText.classList.add("todo-text");
        todoText.addEventListener("click",function(){
            editTodo(todoText);
        })

        const doneButton = document.createElement("button");
        doneButton.textContent = "Done 🚀";
        doneButton.classList.add("btn", "done-btn", "btn-md", "btn-dark");
        
        const removeButton = document.createElement("button");
        removeButton.textContent = "Delete 🗑️";
        removeButton.classList.add("btn", "delete-btn", "btn-md", "btn-dark");


        li.appendChild(todoText);
        li.appendChild(doneButton);
        li.appendChild(removeButton);

        todosList.appendChild(li);

        doneButton.addEventListener("click" , ()=>{
            doneToDo(li);
        });
        removeButton.addEventListener("click" , ()=>{
            removeToDo(li);
        });
        
        document.querySelector("#todoName").value = "";
    }
}


function doneToDo(li){
    const todoText = li.querySelector("#todoText");
    todoText.classList.toggle("removed");
}

function editTodo(todoText){
    const input = document.createElement("input");
    input.value = todoText.textContent.trim(); 
    input.classList.add("edit-input","inputStyle"); 
    
    todoText.innerHTML = ""; 
    todoText.appendChild(input); 

    input.focus();

    input.addEventListener("keydown",function(evt){
        if(evt.code==="Enter"){
            todoText.innerHTML=input.value;
        }
    });

    input.addEventListener("blur", function() {
        todoText.innerHTML = input.value;
    });

}

function removeToDo(li){
    li.remove();
}


// CODE FOR GENERATING WELCOME PAGE MEMES

const memes = [
    {
      image: './images/daenerys.jpeg',
      heading: 'THAT SPECIAL moment',
      text: 'When you find the perfect avocado 🥑 at the supermarket',
    },
    {
      image: './images/anime.jpg',
      heading: '🚀CHASE YOUR DREAMS LIKE YOUR FAVORITE ANIME HERO 🚀',
      text: 'The journey may be tough, but it\'s your determination that makes the difference ',
    },
    {
        image: './images/nike.jpg',
        heading: 'JUST DO IT 👟',
        text: 'Don\'t wait for the perfect moment take the moment and make it perfect',
      } ,
      {
        image: './images/gintama.jpg',
        heading: 'Life is basically like a soap bubble 🫧 ',
        text: 'It rides on the wind, flying here and there ... And before you realize it, pop! It\'s gone',
      },
      {
        image: './images/banana.jpg',
        heading: 'My mother always used to say ',
        text: 'The older you get, the better you get, unless you\'re a banana',
      },
      {
        image: './images/cat.jpg',
        heading: 'Cats are smarter than dogs ',
        text: 'You can\'t get eight cats to pull a sled through snow',
      }
  ];

  function displayRandomMeme() {
    const memeHeading = document.getElementById('memeHeading');
    const memeText = document.getElementById('memeText');

    const randomIndex = Math.floor(Math.random() * memes.length);
    const randomMeme = memes[randomIndex];


    document.querySelector('.randomMotivation>img').src=`${randomMeme.image}`;
    memeHeading.textContent = randomMeme.heading;
  
    memeText.textContent = randomMeme.text;
  }

  window.addEventListener('load', displayRandomMeme);
  
  