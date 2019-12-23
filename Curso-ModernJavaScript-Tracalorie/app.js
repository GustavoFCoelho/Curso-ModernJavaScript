const StorageCtrl = (function () {  
    return{
        storeItem: function (item) {  
            let items = [];
            if(localStorage.getItem('items') !== null){
                items = JSON.parse(localStorage.getItem("items"));   
            }
            items.push(item);
            localStorage.setItem("items", JSON.stringify(items));
        },
        getItensFromStorage: function () {  
            let items = [];
            if(localStorage.getItem("items") !== null){
                items = JSON.parse(localStorage.getItem("items"));
            } 
            return items;
        },
        updateItemStorage: function (updatedItem) {  
            let items  = StorageCtrl.getItensFromStorage();
            items.forEach(function(item, index){
                if(updatedItem.id === item.id){
                    items.splice(index, 1, updatedItem);
                }
            })
            localStorage.setItem("items", JSON.stringify(items));
        },
        deleteItemStorage: function (id) {  
            items.forEach(function(item, index){
                if(id === item.id){
                    items.splice(index, 1);
                }
            })
            localStorage.setItem("items", JSON.stringify(items));
        },
        clearAllItemsFromStorage: function () {  
            localStorage.removeItem("items")
        }
    }
})()

const ItemCtrl = (function(){
    const Item =function (id, name, calories) {  
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    const data = {
        items: StorageCtrl.getItensFromStorage(),
        currentItem: null,
    }

    return {
        getItem: function () {  
            return data.items
        },
        addItem: function(name, calories){
            if(data.items.length > 0){
                ID = data.items[data.items.length-1].id + 1;
            } else {
                ID = 0;
            }

            const calorie = parseInt(calories);

            newItem = new Item(ID, name, calorie);

            data.items.push(newItem);

            return newItem;
        },
        logData: function(){
            return data;
        },
        getTotalCalories: function () {  
            let total = 0;
            data.items.forEach(item=>{
                total += item.calories 
            })
            return total;
        },
        getItemById: function (id) {  
            let found = null;

            data.items.forEach((item)=>{
                if(item.id === id){
                    found = item;
                }
            })

            return found;
        },
        setCurrentItem: function (item) {  
            data.currentItem = item;
        },
        getCurrentItem: function () {  
            return data.currentItem;
        },
        updateItem: function (name, calories) {  
            calories = parseInt(calories);
            let found = null;

            data.items.forEach((item)=>{
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            })

            return found;
        },
        deleteItem: function (id) {  
            ids = data.items.map(function (item) {  
                return item.id
            })

            const index = ids.indexOf(id);

            data.items.splice(index, 1)
        },
        clearAllItens: function () {  
            data.items = [];
        }
    }
})();
const UiCtrl = (function(){
    const UiSelector = {
        itemList: "#item-list",
        addBtn: ".add-btn",
        listItens: "#item-list li",
        updateBtn: ".update-btn",
        deleteBtn: ".delete-btn",
        backBtn: ".back-btn",
        itemNameInput: "#item-name",
        itemCaloriesInput:"#item-calories",
        totalCalorie:".total-calories",
        clearBtn: ".clear-btn"
    }

    return {
        populateItemList: function (items) {  
            let html = "";
            items.forEach(element => {
                html += `<li id="item-${element.id}" class="collection-item">
                <strong>${element.name}: </strong>
                <em>${element.calories} Calories</em>
                <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i></a>
                </li>`
            });
            document.querySelector(UiSelector.itemList).innerHTML = html;
        },
        getSelector: ()=>{
            return UiSelector;
        },
        getItemInput: ()=>{
            return {
                name: document.querySelector(UiSelector.itemNameInput).value,
                calories: document.querySelector(UiSelector.itemCaloriesInput).value
            }
        },
        addListItem: function (item) {  
            document.querySelector(UiSelector.itemList).style.display = "block";
            const li = document.createElement("li");
            li.className = "collection-item";
            li.id = `item-${item.id}`;
            li.innerHTML = `<strong>${item.name}: </strong><em>${item.calories} Calories</em><a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`

            document.querySelector(UiSelector.itemList).insertAdjacentElement('beforeend', li);
        },
        clearField: function () {  
            document.querySelector(UiSelector.itemNameInput).value = ""
            document.querySelector(UiSelector.itemCaloriesInput).value = ""
        },
        hideList: function () {  
            document.querySelector(UiSelector.itemList).style.display = "none";
        },
        showTotalCalories: function (totalCalories) {  
            document.querySelector(UiSelector.totalCalorie).textContent = totalCalories;
        },
        clearEditState: function(){
            UiCtrl.clearField();
            document.querySelector(UiSelector.backBtn).style.display = "none";
            document.querySelector(UiSelector.deleteBtn).style.display = "none";
            document.querySelector(UiSelector.updateBtn).style.display = "none";
            document.querySelector(UiSelector.addBtn).style.display = "inline";

        },
        addItemToForm: function () {  
            document.querySelector(UiSelector.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UiSelector.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UiCtrl.showEditState();
        },
        showEditState: function(){
            document.querySelector(UiSelector.backBtn).style.display = "inline";
            document.querySelector(UiSelector.deleteBtn).style.display = "inline";
            document.querySelector(UiSelector.updateBtn).style.display = "inline";
            document.querySelector(UiSelector.addBtn).style.display = "none";

        },
        updatelistItem: function (item) {  
            let listItens = document.querySelectorAll(UiSelector.listItens);
            listItens = Array.from(listItens)

            listItens.forEach(element=>{
                const itemId = element.getAttribute("id");
                if(itemId === `item-${item.id}`){
                    document.querySelector(`#${itemId}`).innerHTML = `<strong>${item.name}: </strong><em>${item.calories} Calories</em><a href="#" class="secondary-content"><i class="edit-item fa fa-pencil"></i></a>`
                }
            })
        },
        deleteListItem: function (id) {  
            const itemId = `#item-${id}`

            document.querySelector(itemId).remove();

            UiCtrl.clearEditState();
        },
        clearListItem: function () {  
            let listItens = document.querySelectorAll(UiSelector.listItens);
            Array.from(listItens).forEach((item)=>{
                item.remove()
            })
            UiCtrl.hideList();
        }
    }
})();

const App = (function(ItemCtrl, UiCtrl, StorageCtrl){
    
    const loadEventListener = function () {  
        const uiselect = UiCtrl.getSelector();

        document.querySelector(uiselect.addBtn).addEventListener("click", itemAddSubmit);
        document.addEventListener("keypress", function (e) {  
            if(e.keyCode === 13 || e.which === 13){
                e.preventDefault();
                return false;
            }
        })
        document.querySelector(uiselect.itemList).addEventListener("click", itemEditClick);
        document.querySelector(uiselect.updateBtn).addEventListener("click", itemUpdateSubmit);
        document.querySelector(uiselect.backBtn).addEventListener("click", UiCtrl.clearEditState);
        document.querySelector(uiselect.deleteBtn).addEventListener("click", itemDeleteSubmit);
        document.querySelector(uiselect.clearBtn).addEventListener("click", clearAllItensClick);
    }
    
    const itemAddSubmit = function (e) {  
        e.preventDefault();
           
        const input = UiCtrl.getItemInput();
        
        if(input.name !== '' && input.calories !== ''){
            const newItem = ItemCtrl.addItem(input.name, input.calories)
        
            UiCtrl.addListItem(newItem);

            const totalCaloreis = ItemCtrl.getTotalCalories();
            UiCtrl.showTotalCalories(totalCaloreis);
            StorageCtrl.storeItem(newItem);

            UiCtrl.clearField();
        }
    }

    const itemEditClick = function (e) {  
        if(e.target.classList.contains("edit-item")){
            const listId = e.target.parentNode.parentNode.id;
            const listIdArr = listId.split("-")
            const id = parseInt(listIdArr[1]);
            const itemToEdit = ItemCtrl.getItemById(id);
            ItemCtrl.setCurrentItem(itemToEdit);
            UiCtrl.addItemToForm();
        }
        
        e.preventDefault();
    }

    const itemUpdateSubmit = function (e) {  
        e.preventDefault();

        const input = UiCtrl.getItemInput();
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories)
        
        UiCtrl.updatelistItem(updatedItem);

        const totalCaloreis = ItemCtrl.getTotalCalories();
        UiCtrl.showTotalCalories(totalCaloreis);

        StorageCtrl.updateItemStorage(updatedItem);

        UiCtrl.clearEditState();
    }

    const itemDeleteSubmit = function (e) {  
        const currentItem = ItemCtrl.getCurrentItem();

        ItemCtrl.deleteItem(currentItem.id);

        UiCtrl.deleteListItem(currentItem.id);
        const totalCaloreis = ItemCtrl.getTotalCalories();

        StorageCtrl.deleteItemStorage(currentItem.id);

        UiCtrl.showTotalCalories(totalCaloreis);
        e.preventDefault();
    }

    const clearAllItensClick = function (e) {  
        ItemCtrl.clearAllItens();
        UiCtrl.clearListItem();
        const totalCaloreis = ItemCtrl.getTotalCalories();
        UiCtrl.showTotalCalories(totalCaloreis);
        StorageCtrl.clearAllItemsFromStorage();
        e.preventDefault();
    }
    return{
        init: function () { 
            UiCtrl.clearEditState();
            const items = ItemCtrl.getItem();

            if(items.length === 0){
                UiCtrl.hideList();
            } else {
                UiCtrl.populateItemList(items)
            }
            loadEventListener();
        }
    }
})(ItemCtrl, UiCtrl, StorageCtrl);

App.init();