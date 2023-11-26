const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lengthNumber");
const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generateButton");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");

const symbols='~`!@#$%^&*()_-+={[]}|\:;"<,>.?/';
let password="";
let passwordLength=10;
let checkCount=0;

setIndicator("#ccc");
handleSlider();
//set passwordLength 
function handleSlider(){

  inputSlider.value=passwordLength;
  lengthDisplay.innerHTML=passwordLength;
  //color fill correction
  const min=inputSlider.min;
  const max=inputSlider.max;
  inputSlider.style.backgroundSize= ((passwordLength-min)*100/(max-min))+"% 100%";
}


function setIndicator(color){
  indicator.style.backgroundColor=color;
  //shadow is your hw
  indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;
}



function getRndInteger(min,max){
   return Math.floor(Math.random()*(max-min)) + min;
  //

}

function generateRandomNumber(){
  return getRndInteger(0,9);
}

function generateLowerCase(){
  return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase(){
  return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbols(){
  const randNum=getRndInteger(0,symbols.length);
  return symbols.charAt(randNum);
}

function calcStrength(){
  //Based on rules which can be different for anyone 
  let hasUpper=false;
  let hasLower=false;
  let hasNum=false;
  let hasSym=false;

  if(uppercaseCheck.checked) hasUpper=true;
  if(lowercaseCheck.checked) hasLower=true;
  if(numbersCheck.checked) hasNum=true;
  if(symbolsCheck.checked) hasSym=true;

  //Rules which is specific and might not be same for you
  if(hasUpper&&hasLower&&(hasNum||hasSym)&&passwordLength>=8){
    setIndicator("#0f8");
  }
  else if((hasLower||hasUpper)&&(hasNum||hasSym)&&passwordLength>=6){
    setIndicator("$ff8");
  }
  else{
    setIndicator("#f08");
  }
}

async function copyContent(){
  try{
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText="Copied";
  }

  catch(e){
    copyMsg.innerText="Failed";
  }
  //Make span copy visible
 copyMsg.classList.add("active");
 //Remove span after 2 seconds
 setTimeout(()=>{
  copyMsg.classList.remove("active");
 },2000);
}

function handleCheckBoxChange(){
  checkCount=0;
  allCheckBox.forEach((checkbox)=>{
    if(checkbox.checked)
      checkCount++;
  })

  //special condition

  if(passwordLength<checkCount){
    passwordLength=checkCount;
    handleSlider();
  }
}

function shufflePassword(shufflePassword){
  //Fischer yates Method
  for(let i=shufflePassword.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    const temp=shufflePassword[i];
    shufflePassword[i]=shufflePassword[j];
    shufflePassword[j]=temp;
  }

  let str="";
  shufflePassword.forEach((el)=>{str+=el});
  return str;
}
//Event Listeners

allCheckBox.forEach((checkbox)=>{
  checkbox.addEventListener('change',handleCheckBoxChange);
})

inputSlider.addEventListener('input',(e)=>{
  passwordLength=e.target.value;
  handleSlider();
})

copyBtn.addEventListener('click',()=>{
  if(passwordDisplay.value)
    copyContent();
});

generateBtn.addEventListener('click',()=>{
  //none of the checkbox are selected
  if(checkCount<=0)
     return;

  console.log('bhag ja');
  if(passwordLength<checkCount){
    passwordLength=checkCount;
    handleSlider();
  }
  console.log('password chout h be');
  //New Password generation code Here

  //remove old Password
  password="";
  console.log('old remove krdiye be');
  //Include content as per checkboxes

  // if(uppercaseCheck.checked){
  //   password+=generateUpperCase();
  // }
  // if(lowercaseCheck.checked){
  //   password+=generateLowerCase();
  // }
  // if(numbersCheckCheck.checked){
  //   password+=generateRandomNumber();
  // }
  // if(symbolsCheck.checked){
  //   password+=generateSymbols();
  // }

  //Take care of rest 

  let funcArr=[];

  if(uppercaseCheck.checked){
    funcArr.push(generateUpperCase);
    console.log('push krdiye be u');

  }
  if(lowercaseCheck.checked){
    funcArr.push(generateLowerCase);
    console.log('push krdiye be l');

  }
  if(numbersCheck.checked){
    funcArr.push(generateRandomNumber);
    console.log('push krdiye be r');

  }
  if(symbolsCheck.checked){
    funcArr.push(generateSymbols);
    console.log('push krdiye be s');

  }

  
  //compulsory addition
  for(let i=0;i<funcArr.length;i++){
    password+=funcArr[i]();
  }

  console.log('COMP ADD');
  //remaining addition

  for(let i=0;i<passwordLength-funcArr.length;i++){
    let randIndex=getRndInteger(0,funcArr.length);
    password+=funcArr[randIndex]();
  }

  console.log('REMAIN ADD');
  //shuffle the password 
  password=shufflePassword(Array.from(password));
  console.log('SHUFFLE');

  //show in UI
  passwordDisplay.value=password;
  console.log('show in ui');
  //express strength of password;
  calcStrength();
});