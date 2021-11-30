Компонент **«oda-calculator»** позволяет создать настраиваемый калькулятор, с помощью которого пользователь может производить сложные вычисления и настраивать точность получаемых результатов.

Точность вычислений задается с помощью свойства **accuracy**, а высоты кнопок калькулятора можно настроить с помощью свойсва **buttonHeight**.

Для использования этого компонента необходимо подключить JS-модуль **calculator.js** и добавить в HTML-код пользовательский тэг **oda-calculator**.

```javascript _run_line_edit_loadoda_[my-component.js]_h=260_eh=260_
import '/components/tools/calculator/calculator.js';
ODA({
    is: 'my-component',
    template: `
        <label> Размер кнопки <input type="number" ::value="height"></label>
        <label>Точность результата<select ::value="accuracy">
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            </select>
        </label>
        <oda-calculator :accuracy :button-height="height" :data></oda-calculator>
    `,
    props: {
        height: 50,
        accuracy: 2,
        data: {
            cols: {
                science: {
                    rows: {
                        1: {
                            buttons: {
                                "x!": {command: "calcFactorial"},
                                "sin": {name: "sin(", expr: "Math.sin(", hint: ')'},
                                "ln": {name: "ln(", expr: "Math.log(", hint: ')'},
                            },
                        },
                        2: {
                            buttons: {
                                "π": {expr: '3.14159265359'},
                                "cos": {name: "cos(", expr: "Math.cos(", hint: ')'},
                                "log": {name: "log(", expr: "Math.log10(", hint: ')'},
                            },
                        },
                        3: {
                            buttons: {
                                "e": {expr: "2.71828182846"},
                                "tan": {name: "tan(", expr: "Math.tan(", hint: ')'},
                                "√": {name: "√(", expr: "Math.sqrt(", hint: ')'},
                            },
                        },
                        4: {
                            buttons: {
                                "Ans": {command: 'getAnswer'},
                                "EXP": {name: "E", expr: "*10**"},
                                "XY": {key:"<div>X<sup>y</sup></div>", name: "^", expr: "**"},
                            },
                        },
                    },
                    props: {
                            class: "layout",
                            style: 'flex-shrink: 10000000',
                        },
                },
                numpad: {
                    rows: {
                        1: {
                            buttons: {
                                "(": {hint: ')', expr: '('},
                                ")": {},
                            },

                        },
                        2: {
                            buttons: {
                                7: {},
                                8: {},
                                9: {},
                            },
                        },
                        3: {
                            buttons: {
                                4: {},
                                5: {},
                                6: {},
                            },
                        },
                        4: {
                            buttons:{
                                1: {},
                                2: {},
                                3: {},
                            },
                        },
                        5: {
                            buttons: {
                                0: {},
                                "00": {},
                                ".": {},
                            },
                        }
                    },
                },
                sign:{
                    rows:{
                        1: {
                            buttons:{
                                "AC": {command: 'clear'},
                                "⟵": {command: 'back'},
                            },
                        },
                        2: {
                            buttons: {
                                "÷": {name: ' ÷ ', expr: '/'},
                                "%": {expr: "*0.01"},
                            },
                        },
                        3:{
                            buttons: {
                                "X": {name: ' × ', expr: '*'},
                                "-": {name: ' - ', expr: '-'},
                            },
                        },
                        4: {
                            props:{
                                style: 'flex-grow: 1000000',
                            },
                            buttons:{
                                "+": {name: ' + ', expr: '+'},
                                "=": {command: 'calc'},
                            },
                        }
                    },
                },
            },
        },
    }
});
```