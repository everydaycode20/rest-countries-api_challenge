
let dropdown = document.getElementById("dropdown");//variable declaration for dropdown menu
let btnFilter = document.querySelector(".btn-filter");//button that enables dropdown menu
let dropdownItems = document.querySelectorAll(".dropdown p");//gets the list of items from the dropdown menu

let countryFlag = document.querySelectorAll(".image-country");//gets all country flags from the DOM
let countryInfo = document.querySelectorAll(".country");//gest each country info card
let countryInfoId;//variable declaration for the container that holds all country cards
let input = document.querySelector(".input");//gets the search bar

let listCountries = document.querySelectorAll(".container-countries");//gets all country cards
let form = document.querySelector(".form");//gets the container that wraps the input and dropdown menu around
let detailedPage = document.querySelector(".detailed-page");//gets detailed info when user clicks a country card
let detailedPage1 = document.querySelectorAll(".part1 p");//gets country info concerning country name, region, etc
let detailedPage2 = document.querySelectorAll(".other-info p");////gets country info concerning domain, currency, etc
let flagDetail = document.querySelector(".image-country-detailed");//gets the country image from detailed page

let backBtn = document.querySelector(".btn-detailed");//gets the button that brings from the detailed page to back the main page

let darkMode = document.querySelector(".dark-mode");//gets the dark mode button

let scrollPosition = 0;//variable declaration for the users scroll position

detailedPage.style.display = "none";//sets the initial detailed page display to none

let topBtn = document.querySelector(".top");//to top button container
let btnTop = document.querySelector(".btn-top");//to top button

const body = document.querySelector('body');

let countriesDisplayed;//counts how many countries are displayed in main page
let cc;//stores countriesDisplayed when needed

let statusScroll = 0;//points out scroll functionality, window event scroll 

let regionSelected = "All";//which region is selected by the user, it start with all countries shown


/**
 * --------------------
 * Scroll functionality
 * --------------------
 */

btnTop.addEventListener("click", ()=>{
    //scrolls back to top when the user clicks on the button 
    window.scrollTo(0,0);
});

body.addEventListener("mousemove", ()=>{
    //when the user moves around the page, it sets scrollBehaviour to smooth
    const html = document.querySelector('html');
    html.style.scrollBehavior = 'smooth';
});

window.addEventListener("scroll", e =>{
    //when the user scrolls down to the end of the page, it loads more content
    if (statusScroll === 0) {//it only works if statusScroll is 0, otherwise it means the user is not in the main page
        const {scrollHeight,scrollTop,clientHeight} = document.documentElement;
        let countryList = document.querySelectorAll(".country");
        
        //checks whether the user reaches the bottom of the page, scrollTop gets the total pixels the user has scrolled down
        //clientHeight returns the viewports height, if the sum of both are greater or equal than scrollHeight minus 100, then it loads the next 12 elements
        if (scrollTop + clientHeight >= scrollHeight - 100) {
            for (let i = countriesDisplayed + 1; i < countryList.length; i++) {
                //countriesDisplayed starts at 11 (zero base index), that means the user will load 12 new elements every time it reaches the bottom of the page
                if (i <= (countriesDisplayed + 11) + 1) {
                    countryList[i].style.display = "grid";
                }
            }
            countriesDisplayed = countriesDisplayed + 11 + 1;
        }
    }
    scrollBtn();//see function declaration
});

function scrollBtn() {
    //if the user scrolls down enough that exceeds viewport height, to top button shows and adds an animation class to it
    if (window.pageYOffset > screen.height) {
        topBtn.classList.add("btn-topAnimationIn");
        document.querySelector(".btn-top").classList.add("pointer");
    }
    else{
        topBtn.classList.remove("btn-topAnimationIn");
        document.querySelector(".btn-top").classList.remove("pointer");
    }
}

/**
 * ---------------------------------------
 * Requesting data from REST Countries API
 * ---------------------------------------
 */

let url = fetch("https://restcountries.eu/rest/v2/all");//fetches the url resource from https://restcountries.eu/

url.then(response =>{//it then returns a promise as json

    let middleContainer = document.querySelector(".middle-container");
    middleContainer.style.display = "none";
    return response.json();
}).then(data =>{

    for (let i = 0; i < data.length; i++) {
        addCountry();//see function declaration
        
        countryInfo = document.querySelectorAll(".country");//gets all country cards
        countryFlag = document.querySelectorAll(".image-country");//gets all country flags
        countryInfoId = document.querySelector("#container-countries");//gets all country flags
        
        countryFlag[i].src = data[i].flag;//asigns flag image to every country card
        countryInfo[i].childNodes[1].childNodes[0].textContent = data[i].name;//asigns name to every country card
        countryInfo[i].childNodes[1].childNodes[1].childNodes[1].textContent = numberWithCommas(data[i].population);//asigns population to every country card
        countryInfo[i].childNodes[1].childNodes[2].childNodes[1].textContent = data[i].region;//asigns region to every country card
        countryInfo[i].childNodes[1].childNodes[3].childNodes[1].textContent = data[i].capital;//asigns capital name to every country card

        loadImages(countryFlag[i]);//passes each image element
    }

    for (let i = 0; i < countryInfo.length; i++) {//shows 11 elements from countryInfo
        if (i > 11) {
            countryInfo[i].style.display = "none";
        }
    }
    countriesDisplayed = 11;//sets variable to 11, see window event

}).catch(err =>{
    console.log("error " + err);
});

function loadImages(countryFlag){
    //waits until every image is loaded to the DOM and displays middle-container to grid
    countryFlag.addEventListener("load", ()=>{
        setTimeout(() => {
            document.querySelector(".middle-container").style.display = "grid";
            document.querySelector(".icon-wrapper").style.display = "none";//loading page is hidden
        }, 200);
    });
}

function numberWithCommas(n) {
    //for better formatting, see link below
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}//from https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript

function addCountry(){
    //sets up a country card to the DOM and inserts it into container-countries
    let container = document.querySelector(".container-countries");

    let countryBox = document.createElement("section");
    countryBox.classList.add("country");
    countryBox.setAttribute("id", "country");

    let img = document.createElement("img");
    img.classList.add("image-country");
    img.src = "";
    img.alt = "country-image";
    countryBox.appendChild(img);

    let div = document.createElement("div");
    div.classList.add("info-country");
    countryBox.appendChild(div);

    let info = ["Country", "Population: ", "Region: ", "Capital: "];
    for (let i = 0; i < 4; i++) {
        let p = document.createElement("p");
        let node = document.createTextNode(info[i]);
        p.appendChild(node);
        let span = document.createElement("span");
        p.appendChild(span);
        div.appendChild(p);
    }

    container.appendChild(countryBox);
}

function country(countryName){
    //fetches url based on countryName then returns data and shows it in the detailed page
    let url = fetch(`https://restcountries.eu/rest/v2/name/${countryName}`);
    
    url.then(response =>{
        return response.json();
    }).then(data =>{

        flagDetail.src = data[0].flag;
        detailedPage1[0].textContent = data[0].name;
        detailedPage1[1].children[0].textContent = data[0].nativeName;
        detailedPage1[2].children[0].textContent = data[0].region;
        detailedPage1[3].children[0].textContent = data[0].subregion;
        detailedPage1[4].children[0].textContent = data[0].capital;

        detailedPage2[0].children[0].textContent = data[0].topLevelDomain[0];
        detailedPage2[1].children[0].textContent = data[0].currencies[0].name;
        detailedPage2[2].children[0].textContent = "";
        for (let i = 0; i < data[0].languages.length; i++) {
            
            if (i < data[0].languages.length-1) {
                detailedPage2[2].children[0].textContent += data[0].languages[i].name + ", ";
            }
            else{
                detailedPage2[2].children[0].textContent += data[0].languages[i].name;
            }
        }
        let borders = data[0].borders;
        
        findCountrysByCode(borders);
        
    });

}

function findCountrysByCode(borders){
    //fetches url based on every country that shares border with the specified country clicked by the user
    borders = borders.sort();//it sorts all countries alphabetically
    for (let i = 0; i < borders.length; i++) {
        let url = fetch(`https://restcountries.eu/rest/v2/alpha/${borders[i]}`);
        url.then(response =>{
            return response.json();
        }).then(data => {
            if (data.length !== 0) {
                addBorderCountry(data.name);//passes each country name to function
            }
        });
    }
}

function addBorderCountry(country){
    //passes a country name that shares border with the specified country clicked by the user and inserts it into the border list container borderCountries
    let borderCountries = document.querySelector(".list-border-countries");

    let countryBorder = document.createElement("p");
    countryBorder.classList.add("b-country");
    if (cont === 1) {
        countryBorder.classList.add("dark-mode-border-countries");
    }
    countryBorder.textContent = country;
    
    borderCountries.appendChild(countryBorder);
}

/**
 * --------------------
 * Filtering countries
 * -------------------
 */

input.addEventListener("keyup", e =>{
    //filters every country card based on what the user types
    statusScroll = 1;

    const letters = e.target.value.toLowerCase();
    const countryNames = countryInfoId.getElementsByTagName("div");

    document.querySelector(".form").classList.add("form-fix");

    Array.from(countryNames).forEach(name => {
        
        searchCountryByRegionFilter(name, regionSelected, letters)
    });
});

function searchCountryByRegionFilter(name, region, letters) {
    //shows countries that meets user criteria
    //filters based on what the user selected in the dropdown menu
    if (region !== "All") {
        if (name.childNodes[2].lastChild.textContent === region) {

            const n = name.firstElementChild.textContent.toLowerCase();
        
            if (n.includes(letters)) {
                name.parentElement.style.display = "grid";
                name.parentElement.classList.add("visible");
            }
            else{
                name.parentElement.style.display = "none";
                name.parentElement.classList.remove("visible");
            }
        }
    }
    else{
        const n = name.firstElementChild.textContent.toLowerCase();
        
        if (n.includes(letters)) {
            name.parentElement.style.display = "grid";
            name.parentElement.classList.add("visible");
        }
        else{
            name.parentElement.style.display = "none";
            name.parentElement.classList.remove("visible");
        }
    }
}

input.oninput = handleInput;

let visibleCountries;

function handleInput(e) {
    /* 
        *if the search bar is empty then it brings back the elements that were being shown before the user started typing on the search bar
        *whether the user selected any region
    */
    if (e.target.value.length === 0) {
        
        setTimeout(() => {

            if (regionSelected === "Africa") {
                findByRegion("Africa");
                statusScroll = 1;
            }
            else if (regionSelected === "Americas") {
                findByRegion("Americas");
                statusScroll = 1;
            }
            else if (regionSelected === "Asia") {
                findByRegion("Asia");
                statusScroll = 1;
            }
            else if (regionSelected === "Europe") {
                findByRegion("Europe");
                statusScroll = 1;
            }
            else if (regionSelected === "Oceania") {
                findByRegion("Oceania");
                statusScroll = 1;
            }
            else{
                for (let i = 0; i < countryInfo.length; i++) {
                    let info = document.querySelectorAll(".country");
                    if (i > countriesDisplayed) {
                        if (info[i].style.display !== "none") {
                            info[i].style.display = "none";
                        }
                    }
                }
                statusScroll = 0;
            }
            document.querySelector(".form").classList.toggle("form-fix");
            
            Array.from(document.querySelectorAll(".country")).forEach(element => {
                if (element.classList.contains("visible")) {
                    element.classList.remove("visible");
                }
            });
        }, 500); 
    }
    visibleCountries = 1;
}

dropdownItems.forEach(e =>{
    e.addEventListener("click", b =>{
        /**
         * when the user clicks any of the options on the dropdown menu it will show the countries related to its region
         */
        let item = b.currentTarget.classList;

        Array.from(document.querySelectorAll(".country")).forEach(element => {
            if (element.classList.contains("visible")) {
                element.classList.remove("visible");
            }
        });

        if (item.contains("Africa")) {
            item = "Africa";
            findByRegion(item,1);
            regionSelected = "Africa";
        }
        else if(item.contains("America")){
            item = "Americas";
            findByRegion(item,1);
            regionSelected = "Americas";
        }
        else if(item.contains("Asia")){
            item = "Asia";
            findByRegion(item,1);
            regionSelected = "Asia";
        }
        else if(item.contains("Europe")){
            item = "Europe";
            findByRegion(item,1);
            regionSelected = "Europe";
        }
        else if(item.contains("Oceania")){
            item = "Oceania";
            findByRegion(item,1);
            regionSelected = "Oceania";
        }
        else if(item.contains("All")){
            item = "All";
            findByRegion(item,1);
            regionSelected = "All";
        }
    });
});

function findByRegion(region, mode){
    //filters the list of country cards based on which region the user clicked on the dropdown menu
    countryInfo.forEach(element => element.style.display = "grid");
    if (region !== "All") {
        
        for (let i = 0; i < countryInfo.length; i++) {
            if (countryInfo[i].childNodes[1].childNodes[2].childNodes[1].innerHTML !== region) {
                countryInfo[i].style.display = "none";
            }
        }
        statusScroll = 1;
    }
    else{
        let countryList = document.querySelectorAll(".country");
        for (let i = 0; i < countryList.length; i++) {
            if (i > countriesDisplayed) {
                countryInfo[i].style.display = "none";
            }
        }
        statusScroll = 0;
    }
    
    if (mode === 1) {
        dropdown.classList.toggle("show");
    }
}

btnFilter.addEventListener("click", () =>{
    //hides/show dropdown menu
    dropdown.classList.toggle("show"); 
});

/**
 * ----------
 * Back button
 * -----------
 */


backBtn.addEventListener("click", () =>{
    //when the user clicks the back button it displays back the country cards the user was looking whether it was by region or through the search bar
    countriesDisplayed = cc;

    const html = document.querySelector('html');
    html.style.scrollBehavior = 'auto';

    let countryList = document.querySelectorAll(".country");

    let containerCountries = document.querySelector(".container-countries");
    containerCountries.style.display = "flex";

    if (visibleCountries === 1) {//it may be the case that the user was using the search bar, so it will look for 'visible' class at every country container

        Array.from(countryList).forEach(element => {
            if (element.classList.contains("visible")) {
                element.style.display = "grid";
            }
        });
    }
    else{//if the user was not using the search bar, that might mean the user clicked the dropdown menu to filter the country cards or was scrolling down
        if (regionSelected === "Africa") {
            findByRegion("Africa");
        }
        else if (regionSelected === "Americas") {
            findByRegion("Americas");
        }
        else if (regionSelected === "Asia") {
            findByRegion("Asia");
        }
        else if (regionSelected === "Europe") {
            findByRegion("Europe");
        }
        else if (regionSelected === "Oceania") {
            findByRegion("Oceania");
        }
        else{
            for (let i = 0; i < countryList.length; i++) {
                if (i > countriesDisplayed) {
                    countryInfo[i].style.display = "none";
                }
            }
        }    
    }
    
    let mainContainer = document.querySelector(".navbar .dark-mode");
    mainContainer.style.marginRight = "0";
    let p = document.querySelectorAll(".list-border-countries p");
    
    for (let i = 0; i < p.length; i++) {
        p[i].remove();
    }

    form.style.display = "flex";
    detailedPage.style.display = "none";
    document.documentElement.scrollTop = document.body.scrollTop = scrollPosition;
});

/**
 * --------------------------------------------------------------
 * Functionality that allows users to click on every country card
 * --------------------------------------------------------------
 */

listCountries.forEach(e =>{
    e.addEventListener("click", b =>{
        //this event is used when the user clicks the country card, whether is the country info or flag or the areas surrounding them
        //gets country name when the user clicks any of the country cards
        cc = countriesDisplayed;

        let mainContainer = document.querySelector(".navbar .dark-mode");

        let t;
        if (b.target.nodeName === "DIV") {
            t = b.target.childNodes[0].textContent;//gets country name based on target clicked by the user and asingns it to the variable
            scrollPosition = getScrollPos();//stores the scroll position so that when the user clicks the back button, it shows where it left it based on the vertical scroll
        }
        else if(b.target.nodeName === "P"){
            t = b.target.parentElement.childNodes[0].textContent;
            scrollPosition = getScrollPos();
        }
        else if(b.target.nodeName === "IMG"){
            t = b.target.nextSibling.childNodes[0].textContent;
            scrollPosition = getScrollPos();
        }
        else if(b.target.nodeName === "SPAN"){
            t = b.target.parentElement.parentElement.childNodes[0].textContent;
            scrollPosition = getScrollPos();
        }
        let containerCountries = document.querySelector(".container-countries");
        let calcScrollWidth = window.innerWidth - document.documentElement.clientWidth;
        mainContainer.style.marginRight = calcScrollWidth + "px";

        country(t);//passes the country name and shows it in the detailed page
        form.style.display = "none";//hides all elements that are not necessary
        containerCountries.style.display = "none";
        detailedPage.style.display = "flex";//shows detailed page
    });
});

function getScrollPos(){
    //returns the scroll position before the user clicks any of the countries shown
    var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft, scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    return scrollTop;
}

/**
 * --------
 * DarkMode
 * --------
 */

let cont = 0;//counter for dark mode, 1 to dark 0 to light

darkMode.addEventListener("click", () =>{
    //when user clicks it, enables dark mode
    //it adds a specific class to every element
    let navBar = document.querySelector(".navbar, .country");
    let country = document.querySelectorAll(".country");
    let middleContainer = document.querySelector(".middle-container");
    let icon = document.querySelector(".input-wrapper");
    let searchIcon = document.querySelector(".search-icon");
    let infoPage = document.querySelector(".detailed-page");
    let borderCountries = document.querySelectorAll(".list-border-countries .b-country");

    navBar.classList.toggle("dark-mode-class");
    for (let i = 0; i < country.length; i++) {
        country[i].classList.toggle("dark-mode-class");
    }

    middleContainer.classList.toggle("dark-mode-container");
    btnFilter.classList.toggle("dark-mode-class");
    icon.classList.toggle("dark-mode-class");
    dropdown.classList.toggle("dark-mode-class");
    searchIcon.classList.toggle("dark-mode-class-input");
    input.classList.toggle("dark-mode-class-input");
    infoPage.classList.toggle("detailed-page-dark");
    backBtn.classList.toggle("dark-mode-class");
    btnTop.classList.toggle("topShadow");
    
    for (let i = 0; i < borderCountries.length; i++) {
        borderCountries[i].classList.toggle("dark-mode-border-countries");
    }
    
    if (cont === 1) {
        cont = 0;
    }
    else{
        cont++;
    }
});
