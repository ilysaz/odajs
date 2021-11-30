ODA({is: 'oda-calculator2', imports: '@oda/button',
    template: /*html*/ `
        <style>
            :host {
                @apply --vertical;
                padding: 16px;
                @apply --shadow;
            }
            .header {
                @apply --header
            }
            .layout {
                @apply --layout
            }
            oda-button {
                margin: 0px 2px;
            }
        </style>
        <div class="border vertical" style="margin-bottom: 16px; text-align: right">
            <span style="font-size: small" class="dimmed">{{result}}</span>
            <span style="font-size: large">{{expression || value || error || 0}}
                <span disabled>{{hint}}</span>
            </span>
        </div>
        <div class="horizontal">
            <div class="vertical flex" ~for="col in data?.cols" style="margin: 0px 8px" ~props="col.props" >
                <div ~for="row in col?.rows" class="horizontal flex" style="margin-top: 8px;" ~props="row.props" ~style="{height: buttonHeight + 'px'}">
                    <oda-button class="raised flex" ~for="button in row.buttons" ~html="button.key" @tap="tap" :item="button" ~props="col?.rows.props" >
                    <span disabled ~if="row.buttons.Acc">{{Acc}}</span>
                    </oda-button>
                </div>
            </div>
        </div>
    `,
    keyBindings: {
        Enter () {
            this.calc();
        },
        Backspace () {
            this.back();
        },
        Escape () {
            this.clear();
        },
    },
    attached() {
        document.addEventListener('keydown', this._onKeyDown.bind(this));
    },
    detached() {
        document.removeEventListener('keydown', this._onKeyDown.bind(this));
    },
    _onKeyDown (e) {
        e.key.match(/[0-9().*/+-]/) ? this.tap(e.key) : false;
    },
    get hint () {
        return this.hints.map(i=>i?.hint).join('');
    },
    get expression () {
        return this.stack.map(i=>(i?.name || i?.key)).join('').replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    },
    get calcExpression () {
        return ([...this.stack]).map(i=>{
            return (i.expr || i.name || i.key);
        }).join('');
    },
    get Acc () { // bit width of the result
        return ` = ${this.accuracy}`
    }, 
    error: undefined,
    hints: [], // unclosed brackets
    stack: [],
    timerClear: '', // a variable containing a timer to clear the monitor
    result: '0', // the value of the previous expression
    value: 0, // the resulting expression value
    props:{
        accuracy:{
            default: 2,
            label: 'Точность',
            save: true
        },
        buttonHeight:{
            default: 32,
            save: true
        }
    },
    hostAttributes: {
        tabindex: 1
    },
    props: {
        accuracy: {
            default: 2,
            save: true,
            list: [0, 1, 2, 3, 4, 5],
        },
        buttonHeight: {
            default: 30,
            save: true,
        },
    },
    tap (e) {
        this.error = undefined; // on any input, the error is cleared
        this.result = `Ans = ${this.value}`; // for any input, the result is formed according to a given template
        const model = e.target?.item ? e.target.item : {key: e}; // determine if a calculator button or keyboard key was pressed
        if (model?.command && this[model.command]) // if the button has a function, then it is executed
            return this[model.command]()
        if (this.hints[0]?.hint === (model?.key || model?.name)) // checking closing brackets
            this.hints.shift();
        this.expression == 0 && this.stack.length === 1 ? this.stack.splice(0, 1, model) : this.stack.push(model); // if there is only zero in the expression, replace it with the entered character
        if (model?.hint)
            this.hints.unshift({key: model?.hint, hint: model?.hint});
        this.expression = undefined;
        this.hint = undefined;
        try {
            (new Function([], `with (this) {return ${this.calcExpression.replace(/[a-zA-Z]\.|[a-zA-Z()]/g, '')+0}}`)).call(this); // remove all letters, brackets and dots in operations and test
            this.expression = undefined;
            this.hint = undefined;
        }
        catch (e) {
            this.error = e;
            this.stack[this.stack.length-1]?.hint ? this.hints.pop() : false;
            this.stack.pop(model);
        }
    },
    calc () {
        this.stack.push(...this.hints); // close all brackets
        this.expression = undefined;
        try{
            this.value = (new Function([], `with (this) {return ${this.calcExpression}}`)).call(this);
            this.value = this.value.toFixed(this.Acc.match(/\d$/)); // rounding to the specified value
            this.result = this.expression + ' =';
        }
        catch (e){
            this.error = e;
            console.error(e);
        }
        this.stack = [{key: this.value}];
        this.hints = [];
    },
    clear () {
        this.stack = [{key: 0}];
        this.hints = [];
        this.result = '0';
    },
    back () {
        if (this.stack[this.stack.length-1]?.hint === this.hints[this.hints.length - 1]?.hint) { 
            this.hints.shift();
            this.hint = undefined;
        }
        if (this.stack.length === 1) {
            this.stack.splice(-1, 1, {key: 0});
            this.expression = undefined;
        } else {
            this.stack.pop();
            this.expression = undefined;
            this.hint = undefined;
        }
    },
    getAnswer () {
        this.expression == 0 && this.stack.length === 1 ? this.stack.splice(0, 1, {name: this.value}) : this.stack.push({name: this.value}); 
        this.expression = undefined;
    },
    invert () {
        
    },
    calcFactorial () {
        const factorial = (num = this.stack[this.stack.length-1].key-1) => {
            return (num !== 1) ? num * factorial(num-1) : 1
        }
        this.stack.push({name: '!', expr: `*${factorial()}`}); 
        this.expression = undefined;
    },
    // choose what bit depth the number will be
    chooseAccuracy () {
        switch (this.accuracy) {
            case 0:
                this.accuracy = 1;
                break;
            case ' = 1': 
                this.Acc = ' = 2';
                break;
            case ' = 2': 
                this.Acc = ' = 3';
                break;
            case ' = 3': 
                this.Acc = ' = 4';
                break;
            case ' = 4': 
                this.Acc = ' = 5';
                break;
            case ' = 5': 
                this.Acc = ' = 0';
                break;
        }
    },
})