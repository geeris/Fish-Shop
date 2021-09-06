window.onload = function(){
   
    /*AUTOCOMPLETE*/
    $('input').attr('autocomplete', 'off');

    /* GET PRODUCTS */
    (function () {
        $.ajax({
            url: "assets/data/products.json",
            method: "get",
            dataType: "json",
            success: function (products) {
                showProducts(products);
            },
            error: function (xhr, error, status) {
                alert(status);
            }
        })
    })();

    /*TYPE OF FOOD AND MANUFACTURER*/
    fillTypeOfFood();
    fillManufacturer();
    fillFooterSocials();

    /*HEADER CONTENT */
    headerImages();

    /*EVENTS*/
    document.getElementById("search").addEventListener("keyup", sortAndFilter);
    
    let filters = document.querySelectorAll(".filters");
        for(let f of filters)
            f.addEventListener("click", sortAndFilter);

    document.getElementById("selectPrice").addEventListener("change", sortAndFilter);
    
    /* LOCAL STORAGE */
    $("#search").keyup(function () {
        localStorage.setItem("search", $("#search").val());
    });

    $(".food").click(function () {
        localStorage.setItem("food", $(this).attr("data-food-type"));
    });
    
    $(".brand").click(function () {
        localStorage.setItem("brand", $(this).attr("data-brand"));
    });
    
    $(".reset").click(function(e){
        e.preventDefault();
        localStorage.removeItem("food");
        localStorage.removeItem("brand");
        localStorage.removeItem("search");
        localStorage.removeItem("sort");

        document.getElementsByClassName("search")[0].value='';
       
        $(".food").find("i").addClass("disappear");
        $(".brand").find("i").addClass("disappear");

        $("#selectPrice").val("0");
        //getProductsRequest();
        sortAndFilter();
    });

    onbeforeunload = localStorage.removeItem("food");
                     localStorage.removeItem("brand");
                     localStorage.removeItem("search");
                     localStorage.removeItem("sort");
                     localStorage.removeItem("addedProducts");

    $("#selectPrice").change(function(){
        localStorage.setItem("sort", $(this).val());
    });

    /* FORM CHECK */
    document.getElementById("check").addEventListener("click", checkData);

    $('#author').click(function(e){
        e.preventDefault();
        Swal.fire({
            title: 'Gabrijela Matović 21/18',
            text: 'geeris77@gmail.com',
            imageUrl: 'assets/images/author.jpg',
            imageWidth: 350,
            imageHeight: 470,
            imageAlt: 'Author'
        })
    });

    /* ACTIVE FILTER ICON */
    (function () {
        $(".food").click(function (e) {
            e.preventDefault();
            $(".food").find("i").addClass("disappear");
            $(this).find("i").removeClass("disappear");
        });
        $(".brand").click(function (e) {
            e.preventDefault();
            $(".brand").find("i").addClass("disappear");
            $(this).find("i").removeClass("disappear");
        });
    })();

    /* ADD PRODUCTS FUNCTION */
   
    if (localStorage.getItem("addedProducts") === null)
    {
        document.getElementById("addedProducts").innerHTML = `<p class="notFound"> No added products. </p>`;
    }

    var addedProducts = [];
    $('body').on('click', 'a.add', function (e) {
        let that = this;
        e.preventDefault();
        localStorage.removeItem("addedProducts");
        console.log(localStorage.getItem("addedProducts"));
        let potential = $(this).data("id");
        
        if(addedProducts.includes(potential)){}
        else{
            addedProducts.push(potential);
            $(that).html("Added");
        } 
        //console.log(addedProducts);
        localStorage.setItem("addedProducts", JSON.stringify(addedProducts));
        addProducts(addedProducts);
    });
}







/************************************************* FUNCTIONS ************************************************/
/************************************************************************************************************/
function showProducts(products){
    let productsToPreview = products;
    let content = '';

    for(let p of productsToPreview)
    {
    content += `
        <div class="borderProducts m-3 mb-5">
            <img src="${p.slika.src}" class="text-center mb-3" alt="${p.slika.alt}" />
        
            <h3 class="highlight ml-2 mt-1 mb-2"> ${p.naziv} `;

             if(p.isNew == 1)
                 content += `<span class="badge"> New</span>`;
             
            content +=`
            </h3>
            <p class="mb-1">Code to order item:<span class="code"> ${p.code}</span></p>
            <p class="mb-2">Weight: <span class="code">${p.width}g</span> </p>
            <div class="d-flex justify-content-between align-content-center">
                <span class="p-2 ml-2 cena">`;

            if(p.newPrice == 0)
                content += `${p.price}€`;
            else
                content += `<span class="sale">${p.price}€</span>  <span class="saleRed">${p.newPrice}€</span>`;
                
                content +=`</span>
                <a href="#" data-id="${p.id}" class="add text-center mr-2" > Add item </a>
            </div>
        </div>
    `;
    }
    document.getElementById("products").innerHTML = content;
}

/* TYPE OF FOOD AND MANUFACTURER */
var filterObject = function (id, naziv) {
        this.id = id,
        this.naziv = naziv
}
var typeOfFood = [new filterObject(1, "Flakes"), new filterObject(2, "Frozen food"), new filterObject(3, "Pellets")];      
var brand = [new filterObject(1, "Ocean Nutrition"), new filterObject(2, "Tropical") ];

/*FOOTER*/
var footerSocial = [
    {
        "id" : 1,
        "href": "https://www.facebook.com/",
        "content": `<i class="fab fa-facebook networksI ml-5"></i>`
    }, 
    {
        "id": 2,
        "href": "https://www.instagram.com/",
        "content": `<i class="fab fa-instagram networksI"></i>`
    }, 
    {
        "id": 3,
        "href": "https://twitter.com/",
        "content": `<i class="fab fa-twitter - square networksI mr-5"></i>`
    }
];

function fillTypeOfFood(){
    
    let content = '';

    for(let t of typeOfFood)
    {
        content += `
            <a href="#" class="filters food" data-food-type="${t.naziv}"> ${t.naziv} <i class="fas fa-check-circle disappear"></i></a>
                   `;
    } 
    document.getElementById("typeOfFood").innerHTML += content;      
}
function fillManufacturer(){

    let content = '';

    for (let b of brand) {
        content += `
            <a href="#" class="filters brand" data-brand="${b.naziv}"> ${b.naziv} <i class="fas fa-check-circle disappear"></i></a>
                   `;
    }
    document.getElementById("brand").innerHTML += content;     
}
function fillFooterSocials(){
    let content = '';

    for (let s of footerSocial) {
        content += `
            <li> <a href="${s.href}" target="_blank"> ${s.content}  </a></li>
                   `;
    }
    document.getElementById("socials").innerHTML += content;   
}

/* HEADER CONTENT */
var images = [
    {
        src: "sale1.jpg",
        alt: "Sale",
    },
    {
        src: "sale2.jpg",
        alt: "New collection",
    }
];
document.getElementById("headerImages").innerHTML = `<img src="assets/images/sale1.jpg" class="saleSlika" alt="Sale" />`;
function headerImages() {
            let i = 1;
    setInterval(function () {
            
            document.getElementById("headerImages").innerHTML = `<img src="assets/images/${images[i].src}" class="saleSlika" alt="${images[i].alt}" />`;
            if (i == images.length - 1) {
                i = 0;
            }
            else
                i++;
    }, 3000);
}

/* EVENT'S FUNCTION */
function sortAndFilter(){
    var sortedAndFilteredProducts = [];

    $.ajax({
        url: "assets/data/products.json",
        method: "get",
        dataType: "json",
        success: function (products) {
            sortedAndFilteredProducts = products;
            
            sortedAndFilteredProducts = search(sortedAndFilteredProducts);
            
            sortedAndFilteredProducts = filterProductsFood(sortedAndFilteredProducts);

            sortedAndFilteredProducts = filterProductsBrand(sortedAndFilteredProducts);
            
            sortedAndFilteredProducts = sortProducts(sortedAndFilteredProducts);
            
            if(sortedAndFilteredProducts.length!=0)
                showProducts(sortedAndFilteredProducts);

            else
                document.getElementById("products").innerHTML = `<div class="notFound"> <p> No products were found matching your selection. </p> </div>`;
        },
        error: function (xhr, error, status) {
            alert(status);
        }
    })

}
function search(products){
    
            let productsToSearch = products;
            let searched = products;
            let find = localStorage.getItem("search");

            if (localStorage.getItem("search") === null)
                return searched;
            else
            searched = productsToSearch.filter(x => x.naziv.toLowerCase().includes(find.toLowerCase()));
                return searched;  
}
function sortProducts(products){
    
    let productsToSort = products;
    let checked = document.getElementById("selectPrice").value;

    if(checked == 1)
    {
        productsToSort.sort((a,b) => {
            if ((a.newPrice == 0 ? a.price : a.newPrice) > (b.newPrice == 0 ? b.price : b.newPrice))
            return 1;
            if ((a.newPrice == 0 ? a.price : a.newPrice) < (b.newPrice == 0 ? b.price : b.newPrice))
            return -1;
            return 0;
        });
        return productsToSort;
    }
    if(checked == 2)
    {
        productsToSort.sort((a, b) => {
                if ((a.newPrice == 0 ? a.price : a.newPrice) > (b.newPrice == 0 ? b.price : b.newPrice))
                    return -1;
                if ((a.newPrice == 0 ? a.price : a.newPrice) < (b.newPrice == 0 ? b.price : b.newPrice))
                    return 1;
                return 0;
        });
        return productsToSort;
    }
    if(checked == 0)
    {
        return productsToSort;
    }
}
function filterProductsFood(products){

    let productsToFilter = products;
    let choosenTypeOfFood = localStorage.getItem("food");
    
    let filtered = products;
            
            if (localStorage.getItem("food") === null)
            {
                return filtered;
            }
            else
                filtered = productsToFilter.filter(x => x.type.naziv == choosenTypeOfFood);
                return filtered;
                
}
function filterProductsBrand(products){
    let productsToFilter = products;
    let choosenBrand = localStorage.getItem("brand");

    let filtered = products;

    if (localStorage.getItem("brand") === null) {
        return filtered;
    }
    else
        filtered = productsToFilter.filter(x => x.brand.naziv == choosenBrand);
        return filtered;
}

/* FORM CHECK */
var correct;
function checkData(e){
    e.preventDefault();
    correct = true;

    checkFullName();
    checkPhoneNumber();
    checkStreetName();
    checkHouseNumber();
    checkFlatNumber();
    checkState();
    checkCity();
    checkZipCode();

    console.log(correct);
    if(correct)
    {
        Swal.fire({
            title: 'Are you sure you want to sent this message?',
            text: "You won't be able to revert this!",
            //icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            //cancelButtonColor: '#E8000D',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.value) {
                Swal.fire({
                    title: 'Your message has been sent!',
                    icon: 'success'
                });
            let inputs = document.getElementsByTagName("input");
            for(let i of inputs)
            i.value='';
                document.getElementById("addedProducts").innerHTML = `<p class="notFound"> No added products. </p>`;
            }
        })
    }
}
function checkFullName(){
    let fullName = document.getElementById("fullName").value;
    let id ="fullName";
    let request = /^([A-Z][a-z]{2,}\s)+([A-Z][a-z]{1,})$/;
    //let nextP = fullName.nextElementSibling;
    console.log(correct);
    checkMyTextBox(fullName, request, id);
}
function checkPhoneNumber() {
    let phoneNumber = document.getElementById("phone").value;
    let id ="phone";
    let request = /^\+[1-9][0-9]{10,13}$/;
    checkMyTextBox(phoneNumber, request, id);
}
function checkStreetName() {
    let streetName = document.getElementById("streetName").value;
    let id="streetName";
    let request = /^([1-9]\s)?([A-Z][a-z]{1,}\s)?([A-Z][a-z]{1,})$/;
    checkMyTextBox(streetName, request, id);
}
function checkHouseNumber() {
    let houseNumber = document.getElementById("house").value;
    let id = "house";
    let request = /^([1-9])([0-9])?([0-9])?([0-9])?([0-9])?$/;
    checkMyTextBox(houseNumber, request, id);
}
function checkFlatNumber() {
    let flatNumber = document.getElementById("flat").value;
    let id = "flat";
    let request = /^([1-9])([0-9])?([0-9])?$/;
    checkMyTextBox(flatNumber, request, id);
}
function checkState() {
    let state = document.getElementById("state").value;
    let id = "state";
    let request = /^([A-Z][a-z]{3,}\s)?([A-Z][a-z]{2,})$/;
    checkMyTextBox(state, request, id);
}
function checkCity() {
    let city = document.getElementById("city").value;
    let id = "city";
    let request = /^([A-Z][a-z]{2,}\s)*([A-Z][a-z]{2,})$/;
    checkMyTextBox(city, request, id);
}
function checkZipCode() {
    let zipCode = document.getElementById("zipCode").value;
    let id = "zipCode";
    let request = /^[0-9]{4,5}$/;
    checkMyTextBox(zipCode, request, id);
}
function checkMyTextBox(data, criteria, id)
{   
    if(!criteria.test(data))
        {
        document.getElementById(`${id}`).classList.add("redBorder");
        correct = false;
        }
    else
        document.getElementById(`${id}`).classList.remove("redBorder");
}

/*SIDE BAR FILTERS*/
function openNav() { 
    document.getElementById("mySidenav").style.width = "280px";
    document.getElementById("bodyOverlay").classList.add("sidenav-overlay");
    document.getElementsByTagName("body")[0].classList.add("sidebar");
}
/* Set the width of the side navigation to 0 */
function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("bodyOverlay").classList.remove("sidenav-overlay"); 
    document.getElementsByTagName("body")[0].classList.remove("sidebar");
}
function addProducts(addedProducts){
    $.ajax({
        url: "assets/data/products.json",
        method: "get",
        dataType: "json",
        success: function (products) {
            let productsForCode = [];
            let takeCodeFromAddedProducts = addedProducts;
            for (let one of products) {
                let  j=0;
                while(j<takeCodeFromAddedProducts.length)
                {
                    if(one.id == takeCodeFromAddedProducts[j])
                        productsForCode.push(one);
                    j++;
                }
            }
            console.log(productsForCode);

            let content = '';
            for(let one of productsForCode)
            {
                content += `
                    <div class="shop">
                        <h3 class="highlight p-2 mb-0"> ${one.naziv} </h3>
                            <div class="row d-flex justify-content-around align-items-center">
                                <p class="m-0 ml-3 quantity"> Quantity : </p>
                                <input type="number" class="form-control number" min="0" value="1" />
                                <p class="m-0 mr-3"> x ${one.newPrice == 0 ? one.price : one.newPrice}€ </p>
                            </div>
                    </div>
                `;
            }

            document.getElementById("addedProducts").innerHTML = content;
        },
        error: function (xhr, error, status) {
            alert(status);
        }
    });      
}
$(function () {
    $('.example-popover').popover({
        container: 'body'
    })
})

