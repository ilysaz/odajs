ODA({is: 'oda-calculator', imports: '@oda/button, @oda/icons',
    template: /*html*/ `
        <style>
            :host {
                flex-grow: 0;
                @apply --vertical;
                /*max-width: 300px;*/
                padding: 16px;
                @apply --shadow;
            }
            .header {
                @apply --header
            }
            .layout {
                @apply --layout
            }
        </style>
        <div class="border vertical" style="margin-bottom: 16px; text-align: right; border-radius: 5px">
        <oda-button icon="icons:history" style="position: absolute;" @tap="getHistory()" class="dimmed"></oda-button>
            <span style="font-size: small" class="dimmed">{{result}}</span>
            <span style="font-size: large; overflow: hidden">{{error || expression || value}}
                <sup disabled>{{degree}}</sup>
                <span disabled>{{predicate}}</span>
            </span>
        </div>
        <div ~for="data?.rows" class="horizontal between" style="margin-top: 8px;" >
            <oda-button class="raised flex" style="width: 12.5%; font-size: 16px; border-radius: 5px" ~for="md in item" :label="md.label" @tap="tap" @mousedown="mousedown" @mouseup="mouseup" :model="md" ~props="md.props">
                <sup ~style="md.props?.supStyle">{{md.sup}}</sup>
            </oda-button>
        </div>
    `,
    get predicate () { // unclosed brackets
        return this.predicates.map(i=>{
            return i.predicate;
        }).join('');
    },
    get expression () {
        return this.stack.map(i=>{
            return (i.name || i.label);
        }).join('');
    },
    get cWidth () {
        
    },
    predicates: [], // container for unclosed brackets
    stack: [{label: 0, initial: true}], // container for models of all pressed buttons
    result: '0', // variable to display the calculated expression
    value: 0, // variable to display the result of the entered expression
    history: [], // variable to save the history of operations
    error: '', // variable to display errors
    degree: '', // variable to display the power of a number on the monitor
    timerClear: '', // a variable containing a timer to clear the monitor
    inverse: false, // variable containing the flag of inversion of some functions
    hostAttributes: {
        tabindex: 1
    },
    keyBindings: {
        Enter () {
            this.calc();
        },
        Backspace () {
            this.back();
        },
        Escape () {
            this.clear();
        }
    },
    attached() {
        document.addEventListener('keydown', this._onKeyDown.bind(this));
    },
    detached() {
        document.removeEventListener('keydown', this._onKeyDown.bind(this));
    },
    _onKeyDown (e) {
        this.tap(e.key);
    },
    mousedown (e) {
        if (e.target.model.command === 'back') {
            this.timerClear = setTimeout(() => {
                this.clear();
            }, 500)
        }  
    },
    mouseup () {
        clearTimeout(this.timerClear);
    },
    tap (e) {
        let model = '';
        if (e.target?.model) { // checking the presses of calculator buttons or keyboard keys
            model = e.target.model;
        } else if (e.match(/[0-9.)]/)) {
            model = {label: e};
        } else if (e.match(/\(/)) {
            model = {label: e, predicate: ')'};
        } else if (e.match(/[-+/*]/)) {
            model = {label: e, name: ` ${e} `};
        } else if (e === 'e') {
            model = {label: 'e', expr: '2.71828182846'};
        } else if (e === 'p') {
            model = {label: 'π', expr: '3.14159265359'}
        } else if (e === 'Enter' || e === 'Backspace' || e === 'Escape') {
            return
        }
        switch (model.command){
            case 'calc':
            case 'clear':
            case 'back':
                return this[model.command]();
        }
        // checking for exceptions
        this.isResult();
        if (this.result === '0') { 
            this.result = 'Ans = 0';
        } 
        if (this.expression === '0' && model.label === 0) {
            this.stack.splice(-1, 1, {label: 0}) 
            return
        } 
        if (this.stack[this.stack.length-1].label === 'EXP' && model.label.toString().match(/[0-9-]/) === null) return
        if (model.label === 'Inv') this.inverse = this.inverse ? false : true; // inversion check 
        if (model.label === '%') {
            const signBeforePercent = this.getExpression().match(/\D(?=\d+\.?\d+?\%?$)/); // find the mathematical sign that is entered before the number with a percentage
            if (signBeforePercent !== null && (signBeforePercent[0] === '+' || signBeforePercent[0] === '-')) { 
                const numForPercent = this.getExpression().match(/\d+\.?\d*(?=\D\d+\.?\d+?\%?)/g), // find the number for which we want to calculate the percentage
                      percent = numForPercent[0] / 100;
                this.stack.push({label: '%', expr: '*' + percent})
            } else {
                this.stack.push(model); 
            }
            this.getReactivity();
            return
        } 
        if (model.label === '-') {
        this.getExpression().match(/[*/]$/) ? this.stack.push(model) : this.canBeReplaced
        this.getReactivity();
        }
        if (model.label.toString().match(/[0-9]/) && this.expression === '0') {
            this.stack.splice(-1, 1, model);
        } else if (model.label === 'x!') {
            try{
                if (this.stack[this.stack.length-1].label === '%') { // if the last element is '%', first calculate the expression with a percentage
                    const exprForFactorial = (new Function([], `with (this) {return ${this.getExpression().match(/\d+\.?\d*\D\d+\.\d*$/)}}`)).call(this);
                    console.log(exprForFactorial);
                    this.factorialOfZero(exprForFactorial);
                } else if (this.getExpression().toString().match(/[1-9.]$/)) { // if the last element is a number from 0 to 9, or a point, write the function for calculating the factorial
                    this.stack.push({label: '!', expr: '*' + this.calcFactorial(this.getExpression().toString().match(/\d+\.?\d*$/) - 1)});
                } else if (this.getExpression().toString().match(/[-+*/]$/)) { // if the last element is a mathematical sign, then we replace it with the factorial calculation function
                    this.stack.splice(-1, 1, {label: '!', expr: '*' + this.calcFactorial(this.getExpression().toString().match(/\d+\.?\d*(?!\d)/) - 1)});
                } else if (this.getExpression().match(/\)$/)) { // if the last element is a closing bracket, then first calculate the expression inside the brackets
                    const exprForFactorial = (new Function([], `with (this) {return ${this.getExpression().match(/\(.*\)$/)}}`)).call(this);
                    this.factorialOfZero(exprForFactorial);
                } else if (this.stack[this.stack.length-1].label === 0) {
                    this.factorialOfZero(0);
                }
            } catch (e) {
                this.stack.push(model);
                console.log(e);
            }
        } else if (model.label === 'Ans') {
            if (this.canBeDeleted(model)) {
                this.error = '';
                this.isResult();
                this.stack.splice(0, 1, {label: model.label, name: model.name, expr: `${this.result.match(/(?<=\=\s).*/)[0]}`});
            } else if (this.getExpression().match(/[0-9.]$/)) { // if you use Ans after any number or point, multiplication is performed
                this.stack.push({label: model.label, name: model.name, expr: `*${this.result.match(/(?<=\=\s).*/)[0]}`});
            } else {
                this.stack.push({label: model.label, name: model.name, expr: `${this.result.match(/(?<=\=\s).*/)[0]}`});
            }
        } else if (model.label === 'π' || model.label === 'e') { // checking for constants
            if (this.canBeDeleted(model)) {
                this.stack.splice(-1, 1, model);
                this.getReactivity();
                return
            }  
            if (this.getExpression().match(/[0-9).]$/) !== null) {
                this.stack.push({label: model.label, expr: `*${model.expr}`});
            } else {
                this.stack.push(model);
            }
        } else if (model.label === '(' && this.expression !== '0' && !this.stack[this.stack.length-1]?.result) {
            this.stack.push(model);
            if (this.getExpression().match(/\d+\.?\d*\%?(?=\()/) || this.getExpression().match(/\)/)) { // if exist the number after which comes the bracket, add '*' in front of the bracket
                this.stack[this.stack.length-1] = {label: model.label, predicate: ')', expr: '*' + model.label};
            }
        } else if (model.label === ')') {
            if (this.canWriteBracket()) {
                this.stack.push(model);
                this.predicates.shift();
            }
        } else if (model.label === '.') {
            if (this.canBeDeleted(model)) { 
                this.isResult();
                this.error = '';
                this.stack.splice(0, 1, model);
            } else if (this.getExpression().match(/[%)]$/) || this.stack[this.stack.length-1].label === 'Ans') {
                this.stack.push({label: `*${model.label}`, name: ` * ${model.label}`})
            } else if (this.stack[this.stack.length-1].label === '(') {
                this.stack.push(model);
            } else {
                const enteredNumbers = this.getExpression().match(/\d+\.?(\d*)?/g); // get an array of all entered numbers for further checks
                enteredNumbers[(enteredNumbers.length - 1)].match(/\./) ? false : this.stack.push(model);
            }
        } else if (model.label === 'EXP') {
            this.getExpression().match(/\D$/) ? false : this.expression === '0' ? false : this.stack.push(model);
        } else if (this.canBeDeleted(model)) { 
            this.isResult();
            this.error = '';
            this.stack.splice(0, 1, model);
        } else if (this.canBeReplaced(model)) {
            if (this.getExpression().match(/[-+*/][-+*/]$/)) return
            this.stack.splice(-1, 1, model);
        } else if (model.label.toString().match(/[0-9]/) && this.getExpression().match(/\)$/)) {
            this.stack.push({label: model.label, expr: '*' + model.label});
        } else {
            this.stack.push(model);
        } 
        if (model.predicate) this.predicates.unshift({label: model.predicate, predicate: model.predicate});
        this.getReactivity();
    },
    calc () {
        this.stack.push(...this.predicates);
        this.predicates = [];
        this.getReactivity();
        try {
            if (this.stack[this.stack.length-1].name === 'E') { // if there is nothing after EXP, replace it with *1
                this.stack[this.stack.length-1] = {expr: '*1'};
            } 
            const expr = this.getExpression();
            console.log(expr);
            if (expr.match(/[-+*/]$/)) return // if the expression ends with a mathematical sign, do not calculate
            this.value = (new Function([], `with (this) {return ${expr}}`)).call(this);
            this.getHistory(this.expression, this.value);
            this.result = this.expression + ' =';
        }
        catch (e) {
            this.error = 'Error';
            this.stack = [];
            console.log(e);
        }
        this.stack = [{label: this.value, result: true}]; // push the result to the stack
        this.getReactivity();
    },
    clear () {
        this.isResult();
        this.stack = [{label: 0, initial: true}];
        this.predicates = [];
        this.value = 0;
        this.error = '';
    },
    back () {
        this.error = '';
        if (this.getExpression().match(/\)$/)) this.predicates.unshift({label: ')', predicate: ')'});
        if (this.stack[this.stack.length-1]?.predicate === this.predicates[this.predicates.length - 1]?.predicate){ 
            this.predicates.shift();
        }
        if (this.stack.length === 1) {
            this.isResult();
            this.stack.splice(-1, 1, {label: 0, initial: true});
        } else {
            this.stack.pop();
        }
        this.getReactivity();
    },
    // checking if the value in the output line can be deleted
    canBeDeleted (model) {
        return ((this.stack[this.stack.length-1]?.initial) || this.stack[this.stack.length-1]?.result || this.error) &&
                (model.label.toString().match(/[0-9.]/) ||
                model.label === 'sin' ||
                model.label === 'cos' ||
                model.label === 'tan' ||
                model.label === '(' ||
                model.label === '√' ||
                model.label === 'ln' ||
                model.label === 'log' ||
                model.label === 'π' ||
                model.label === 'e' ||
                model.label === 'Ans')
    },
    // checking the possibility of replacing the mathematical sign
    canBeReplaced (model) {
    return  this.getExpression().match(/[-+*/]$/) && 
            (model.label.toString().match(/[-+*/]/) || model.label === '%')
    },
    // checking the possibility of writing the closing bracket
    canWriteBracket () {
        const lastOperation = this.stack[this.stack.length-1].label !== undefined ? this.stack[this.stack.length-1].label : this.stack[this.stack.length-1].expr;
        return lastOperation.toString().match(/[0-9%)]/) && this.predicates.length !== 0
    },
    // activation of reactivity
    getReactivity () {
        this.expression = undefined;
        this.predicate = undefined;
    },
    // get the expression as a string
    getExpression () {
        const expr = this.stack.map(i=>{
            return (i.expr || i.label);
        }).join('');
        return expr
    },
    // checking that the line contains the result
    isResult () {
        if (this.stack[this.stack.length-1].result) {
            this.result = `Ans = ${this.stack[0].label}`;
        }
    },
    // show transaction history
    getHistory (key, value) {
        if (key && value) {
            const expression = key,
                  result = value, 
                  historyExpression = `${expression} = ${result}`;
            this.history.push(historyExpression);
        } 
        if (this.history.length !== 0) {
            console.log(this.history)
        } else {
            console.log('История чиста')
        }
    },
    calcFactorial (n) {
        return (n != 1) ? n * this.calcFactorial(n-1) : 1
    },
    // checking the number before the factorial for equality to 0 or 1
    factorialOfZero (num) {
        if (num === 0) {
            this.stack.push({label: '!', expr: '**0'});
        } else if (num === 1) {
            this.stack.push({label: '!', expr: '*1'});
        } else {
            this.stack.push({label: '!', expr: '*' + this.calcFactorial(num-1)});
        }
    }
})