/* Регистрация Инструмента */
const Localization = ODA.regTool('localization');


Localization.path = import.meta.url.split('/').slice(0, -1).join('/'); // locales path
Localization.translateTagList = ['label', 'h3']

window.top.addEventListener('change-language', e => {
    window.location.reload();
})

try{
    const fr = await ODA.loadJSON(Localization.path+'/dictionary/phrases.json');
    fr.forEach(i => sessionStorage.setItem(i, '?'))
}
catch (e){
}
let dictionary;
    try{
        dictionary = await ODA.loadJSON(Localization.path+'/dictionary/'+ODA.language + '.json');
    }
    catch (e){
        dictionary = { phrase: {}, words: {} };
    }

// Localization.setLocale(ODA.language);

const separators = [' ', '.', ',', ':', '-', '(', ')', '~', '!', '<', '>', '/', '\\'] // ! '<', '>', -- нельзя! Иначе переводим теги!

/* Ф-я перевода */

function translateWord(word, uppercases){
    let key = word.toLowerCase();
    if (key!='') sessionStorage.setItem(key, 'w');
    let value = dictionary?.words[key] || '';
    if (!value){
        value = word;
        // console.log(word, uppercases)
    }
    else if (uppercases) {
        if (uppercases === 1)
            value = value.toCapitalCase();
        else if(word.length === uppercases)
            value = value.toUpperCase();
    }

    return value;
}
Localization.translate = function (text = ''){
    let key = text.toLowerCase();
    sessionStorage.setItem(key, 'p')
    let value = dictionary?.phrase[key] || '';
    if (!value){
        let word = '';
        let uc = 0;
        for (let ch of text){
            if (separators.includes(ch)){
                // console.log(word);
                value += translateWord(word, uc) + ch;
                uc = 0;
                word  = ''
            }
            else{
                const lch = ch.toLowerCase()
                uc +=  (lch !== ch)?1:0
                word += ch;
            }
        }
        if(word)
            value += translateWord(word, uc);
    }
    return value;
}

function _newVal(val, mTag=false) {
    if (!this.isConnected || !val)
        return val;
    switch (this.__translate) {
        case false:
            return val;
        case undefined:
            break;
        default: {
            return this.__translate;
        }
    }
    this.__translate = false;
    switch (this.nodeType) {
        case 3: {
            if (!Localization.translateTagList.includes(this.parentElement?.localName)) {
                return val;
            }
        } break;
        case 1: {
            if (!Localization.translateTagList.includes(this.localName)) {
                return val;
            }
        } break;
        default:
            return val;
    }

    if (mTag) {
        // let inLabel = (text) => {
        //     if (!text.includes('<')) return Localization.translate(text)
        //     else {
        //         function replacer (_, p1, p2, p3) { return '<label'+ p1 +'>'+ inLabel(p2) + p3 }
        //         return text.replaceAll(/<label(.*?)>(.*?)(<\/label>|$)/g, replacer )
        //     } 
        // }
        function replacer(_, p1, p2) {  return ( (p1.trim()==='')?p1:Localization.translate(p1) ) + p2 }
        this.__translate = val.replace(/([^<]*?)(<[^>]*>|$)/g, replacer )

    } else 
        this.__translate = Localization.translate( val )

    return this.__translate;

}
/* Переопределение Геттера и Сеттера */
const textContent = Object.getOwnPropertyDescriptor(Node.prototype, 'textContent') //Node.textContent
const textSet = textContent.set;
const textGet = textContent.get;

textContent.set = function (val) {
    if (this.__translate && this.__translate.src !== val)
        this.__translate = undefined;
    const newVal = _newVal.call(this, val)
    textSet.call(this, newVal)  // переводим, перевод сохраняем
}
textContent.get = function () {
    const val = textGet.call(this)
    const newVal = _newVal.call(this, val)
    return newVal
}


Object.defineProperty(Node.prototype, 'textContent', textContent)

const innerHTML = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML')
const innerSet = innerHTML.set;
const innerGet = innerHTML.get;

innerHTML.set = function (val) {
    if (this.__translate && this.__translate.src !== val)
        this.__translate = undefined;
    const newVal = _newVal.call(this, val,true)
    innerSet.call(this, newVal)  // переводим, перевод сохраняем
}
innerHTML.get = function () {
    const val = innerGet.call(this)
    const newVal = _newVal.call(this, val,true)
    return newVal
}
Object.defineProperty(Element.prototype, 'innerHTML', innerHTML)

/* Нажатие клавиши */
window.addEventListener('keydown', async e => {
    if (e.code === 'KeyL' && e.altKey) {
        try {
            await ODA.import('@tools/containers');
            const result = await ODA.showDialog('oda-localization-tree', {}, {
                 icon: 'icons:flag', 
                 title: 'Dictionaries', 
                 autosize: false, 
                 buttons: [{ label: 'Download', icon: 'icons:file-download', tap: (e)=>{
                        alert('yflfnf ryjgrf')
                     } }]
                })
            console.log(result?.focusedButton)
            // console.log(result)
            // console.log(result.focusedButton)
            // result.dlDict()
            // result.setNewDict()
            // if (result.focusedButton.label === 'Download')
            //     // result.dlDict();
            //     console.log('result')
        }
        catch (e) {
            console.error('dddd');
        }
    }
})


/*  */
ODA({ is: 'oda-localization-tree', imports: '@oda/table', extends: 'oda-table',
    attached() { this._dataSet() } ,
    props: {
        evenOdd: true,
        showHeader: true,
        allowSort: true,
        lazy: true,
        showFilter: true,
        autoSize: true,
        autoWidth: true, //sort: [[letter]],
        dataSet : []
    },
    columns: [{ name: 'words', treeMode: true, $sort: 1, fix: 'left' },
              { name: 'translates', template: 'oda-localization-input' },
              { name: 'letter', hidden: true, $sortGroups: 1, $expanded: true, $hideExppander: true }],
    _dataSet() {
        const [iW,iP] = [{},{}]
        Object.entries( sessionStorage ).forEach( ([k,v]) => (v==='p')? iP[k]='' : iW[k]='' )

        const words  =  Object.entries( sumObAB(dictionary.words, iW ) )
        const phrase =  Object.entries( sumObAB(dictionary.phrase, iP ) )

        let ds = {}
    
        words.forEach(([k,v]) => ds[k] = {words: k, translates:v, letter: k.slice(0,1).toLowerCase(), items: [] } )
        phrase.forEach(([k,v]) => {
            // const localWords = k.split(/\s+/).map(a => a.trim())
            let localWords = []
            let word = ''
            for (let ch of k) {
                if (separators.includes(ch)) {
                    localWords.push(word)
                    word  = ''
                } 
                else word += ch.toLowerCase()
            }
            if (word)  localWords.push(word)
            // console.log(localWords)

            localWords.filter(w => w!='').forEach(w => {
                if (ds[w] == undefined) ds[w] = { words: w, translates: '', letter: w.slice(0,1).toLowerCase(),
                                                    items: [{ words: k, translates: v }] }
                else ds[w].items.push( { words: k, translates: v })
            })
        })
    
        this.groups = [this.columns.find(c => c.name === 'letter')];
        this.dataSet = Object.values(ds).map(o => {
            if ( (o.items.length === 1) && (o.words ===  o.items[0].words) ) o.items = []
            return o
        })
    },
    dlDict() {
        let rez = { phrase: {}, words: {} }
        this.dataSet.forEach( o => {
            if (o.translates != '') rez.words[o.words] = o.translates
            o.items.forEach( p => {
                if (p.translates != '') rez.phrase[p.words] = p.translates
            })
        })
        let a = document.createElement("a");
        let file = new Blob([JSON.stringify(rez, null, " ")], {type: 'application/json'});
        a.href = URL.createObjectURL(file);
        a.download = ODA.language + ".json";
        a.click();
    },
    dlPhrase() {
        let rez = []
        Object.entries( sessionStorage ).forEach( ([k,v]) => (v==='p')? rez.push(k) : {} )
        let a = document.createElement("a");
        let file = new Blob([JSON.stringify(rez, null, " ")], {type: 'application/json'});
        a.href = URL.createObjectURL(file);
        a.download = "phrases.json";
        a.click();
    }


})

ODA({ is: 'oda-localization-input', template: /*html*/ `<input ::value='item.translates'>`, })


function sumObAB(a, b) { return { ...b, ...a } }
function subObAB(a, b) {
    let rez = { ...a }
    for (let key in b) { if (key in a) delete rez[key] }
    return rez
}
function supObAB(a, b) {
    let rez = {}
    for (let key in a) { if (key in b) rez[key] = a[key] }
    return rez
}

