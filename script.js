const inputSlider = document.querySelector("[data-length-slider]");//custom attribute ko fetch ke liye ("[dara-length-slider]") ese likha jata h
const lengthDisplay = document.querySelector("[data-length-number]");
const passwordDisplay = document.querySelector("[data-password-display]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copy-msg]");
const  uppercaseCheck =document.querySelector("#uppercase");
const lowercaseCheck =document.querySelector("#lowercase");
const numbersCheck =document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbol");
const indicator = document.querySelector("[data-indicator]");
const generationBtn = document.querySelector(".generate-button");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = "~!@#$%^&*()_+=-{}[]|;:,.<>/?";

let password = "";
let passwordLength = 10;
let checkCount = 1;

handleSlider();

//set strenght circle color to grey

// set password length 
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

  
}
function setIndicator(color){
    indicator.style.backgroundColor = color;
    //shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRndNumber(){
    return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));  //.'StringfromCharcode' ka use krke hm ek number ko character mwin comvert kr skte h 
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}


function generateRndSymbol(){
    const random =getRndInteger(0, symbols.length);
    return symbols.charAt(random); //symbols.charAt(0) se symbols ki first character milega
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true; 
    if(numbersCheck.checked) hasNum = true;
    if(symbolCheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength > 8) {
        setIndicator("#0f0"); //green
    } else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
        setIndicator('#ff0'); //yellow
    } else {
        setIndicator('#f00'); //red
    }

}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value); // clipboard mein copy krne ke liye navigator.clipboard.writeText() ka use hota h
        copyMsg.innerHTML = "copied"
    }
    catch(e){
        copyMsg.innerHTML = "Failed";
    }
    //to  make coopy wala span visible
    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);

}


function shufflePassword(array){
    //Fisher yates method
    for(let i = array.length-1; i>0; i--){
        const j = Math.floor(Math.random() * (i+1)); //random number bnaya
        const temp = array[i]; 
        array[i] = array[j]; //array ki value ko swap kiya
        array[j] = temp; //array ki value ko swap kiya
    }
    let str = "";
    array.forEach((el) => str += el); //array ke elements ko string mein convert kiya
    return str; //string return kiya
}



function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked) 
            checkCount++;
    });
    //specialcondition
    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change',handleCheckBoxChange)
});



inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value; //input slider ki value ko password length mein store krne ke liye
    handleSlider();

});


copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value) {
        copyContent();
    }
});


generationBtn.addEventListener('click', () => {
    //none of the checkbox are selected
    if(checkCount <= 0) return;

    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    //lets start the journey to find new password
    //remove old password
    password = "";
    //lets put stuff mention by checkboxes

    // if(uppercaseCheck.checked){
    //     password += generateUpperCase(); //uppercase wala function call kiya
    // }

    // if(lowercaseCheck.checked){
    //     password += generateLowerCase(); //lowercase wala function call kiya
    // }

    // if(numbersCheck.checked){
    //     password += generateRndNumber(); //numbers wala function call kiya
    // }

    // if(symbolCheck.checked){
    //     password += generateRndSymbol(); //symbol wala function call kiya
    // }

    let funArr = [];//array bnaya
    if(uppercaseCheck.checked){
        funArr.push(generateUpperCase); //uppercase wala function call kiya
    }
    if(lowercaseCheck.checked){
        funArr.push(generateLowerCase); //lowercase wala function call kiya
    }   
    if(numbersCheck.checked){
        funArr.push(generateRndNumber); //numbers wala function call kiya
    }
    if(symbolCheck.checked){
        funArr.push(generateRndSymbol); //symbol wala function call kiya
    }

    //compulsory addition of the stuff
    for(let i = 0; i<funArr.length; i++){
        password += funArr[i](); //function call kiya
    }

    //remaining addition of stuff to complete the password length
    for (let i = 0; i < passwordLength - funArr.length; i++) {
        let randIndex = getRndInteger(0, funArr.length);
        password += funArr[randIndex](); // Function call
    }

    //shuffle the password
    password = shufflePassword(Array.from(password)); //password ko shuffle kiya

    //show in UI
    passwordDisplay.value = password;

    //calculate strength
    calcStrength();

    

});