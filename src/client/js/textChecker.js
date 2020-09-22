import { formTypes } from '../../server/formEnum'

function checkText(inputText) {
    console.log("::: Running checkText :::", inputText);
    if(!(inputText && /\S/.test(inputText))){
        return formTypes.INV;
    }
    if(/https?:\/\/*.*/.test(inputText)) {
        return formTypes.URL;
    }
    return formTypes.TEXT;
}

export { checkText }
