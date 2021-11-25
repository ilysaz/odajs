**Imports** — это механизм отложенного импорта JS-модулей.

В соответствии с технологией Web-компонентов различные ODA-компоненты располагаются в отдельных файлах, называемых модулями. Для использования этих компонентов первоначально необходимо подключить файл их модуля, импортировав требуемую информацию из него. Для этого в языке JavaScript предусмотрена специальная директива **import**.

Например, для того, чтобы использовать компонент **oda-icon** необходимо первоначально подключить его модуль **icon.js** , который располагается в папке **/components/buttons/icon/**.

```javascript run_line_edit_loadoda_[my-component.js]_h=100_
import '/components/buttons/icon/icon.js';
ODA({
    is: 'my-component',
    template: `
        <div>Импорт иконки</div>
        <oda-icon icon="icons:android"></oda-icon>
    `
});
```

Такой способ подключения JS-модулей работает, но он обладает рядом недостатков:

1. Необходимо знать полный путь к файлу подключаемого компонента.

1. Расположение подключаемого модуля может измениться. В этом случае код данного компонента работать перестанет.

1. Компоненты, указанные в подключаемом модуле будут регистрироваться в браузере в любом случае, независимо от того, используются они на формируемой HTML-странице или нет.

Для устранения этих недостатков в ODA-компонентах можно использовать специальную директиву **imports**, которая указывается внутри класса компонента следующим образом:

```javascript run_line_edit_loadoda_[my-component.js]_h=100_
ODA({
    is: 'my-component',
    imports: ['@oda/icon'],
    template: `
        <div>Импорт иконки</div>
        <oda-icon icon="icons:android"></oda-icon>
    `
});
```

В этом случае при загрузке страницы будет зарегистрирован пользовательский компонент **oda-icon** и браузер сможет отображать кастомный тэг **<oda-icon>** в соответствии с тем кодом, который предусмотрен в модуле **icon.js**.


Например, для того, чтобы использовать компонент **oda-icon** необходимо первоначально подключить его модуль **icon.js** , который располагается в папке **/components/buttons/button** следующим образом:.

```javascript run_line_edit_loadoda_[my-component.js]_h=190_
import '/components/buttons/button/button.js';
ODA({
    is: 'my-component',
    template: `
        <div>{{text}}</div>
        <oda-button label="Нажми на меня" @tap="onTap"></oda-button>
    `,
    props: {
        text: 'Обычный импорт',
    },
    onTap(e) {
        if (this.text === 'Я не нажата')
            this.text = 'Я нажата';
        else
            this.text = 'Я не нажата';
    }
});
```

эти компоненты Одностраничное Web-приложение (***Single-Page Application***) содержит только одну Web-страницу, содержимое которой формируется динамически в зависимости от действий пользователя. Такое поведение отличается от поведения обычного многостраничного Web-приложения (***Multi-Page Application***), когда с Web-сервера каждый раз загружаются разные страницы с новыми данными.

В SPA-приложениях вся необходимая информация либо извлекается браузером при загрузке одной страницы, либо соответствующие данные загружаются динамически в ответ на действия пользователя и добавляются на исходную страницу по мере необходимости. Исходная страница в этом случае никогда не перезагружается целиком, и ее URL-адрес не изменяется. В результате этого становится невозможно осуществлять навигацию по страницам, используя стандартный механизм навигации браузера.

ODA-фреймворк позволяет реализовать такую возможность с помощью специального объекта **ODA.router**, который создается на основе класса **odaRouter**. В результате этого можно имитировать работу многостраничного приложения, позволяя пользователю создавать разные состояния, используя хеш-составляющую URL-адреса HTML-страницы, и перемещаться по этим состояниям при помощи кнопок «**Вперед**» и «**Назад**» в истории сессий браузера, точно так же, как и при переходе на разные страницы при использовании многостраничных сайтов.

Объект **ODA.router** объявлен в библиотеке **router.js**, которую необходимо подключить как JavaScript-модуль следующим образом:

```javascript
import '/tools/router/router.js';
```

Механизм SPA-роутинга достаточно простой. Он основан на использовании объекта истории переходов браузера **window.history**. В этот объект можно добавить новое состояние с помощью метода **pushState**, поменяв только хеш-составляющую URL-адреса текущей страницы.

Например,

```javascript run_line_edit_loadoda_[my-component.js]_h=190_
import '/tools/router/router.js';
ODA({
    is: 'my-component',
    template: `
        <style>
            #shape {
                width: 100px;
                height: 100px;
                background: bisque;
            }
        </style>
        <div>Фигура</div>
        <p><input name="shape" type="radio" value='circle' @change="onTap">Круг</p>
        <p><input name="shape" type="radio" value='square' @change="onTap">Квадрат</p>
        <div id="shape" ~style="{borderRadius: \`\${radius}%\`}"></div>
        <div>Навигация</div>
        <button @tap="onPrev">Назад</button>
        <button @tap="onNext">Вперед</button>
        <div>URL-адрес: {{url}}</div>
    `,
    props: {
        url: '',
        radius: 0,
    },
    onTap(e) {
        const state = "#shape/" + e.target.value;
        this.radius = e.target.value === 'circle' ? 50 : 0;
        window.history.pushState({path: state}, '', state);
        this.url = window.location.href;
    },
    onNext() {
        window.history.forward();
    },
    onPrev() {
        window.history.back();
    }
});
```

В этом случае действия, которые должны привести к изменению содержания страницы, нужно выполнять явно в каждом обработчике перехода к этому состоянию. Кроме этого, не будет работать обработка переходов нажатием на кнопки «**Вперед**» и «**Назад**» в истории сессий браузера. В данном примере элемент **div** не будет изменять свою форму при нажатии на кнопки «**Вперед**» и «**Назад**». Для этого необходимо обрабатывать специальное событие **popstate** объекта **window.history**.

Для того, чтобы упростить этот процесс можно использовать специальный класс **odaRouter**, в котором уже реализованы все методы, необходимые для разработки SPA-приложения.

Метод **go()** позволяет создать новое состояние и сразу же вызвать обработчик перехода к нему.

Он объявлен в классе **odaRouter** следующим образом:

```javascript
 go(path, idx = 0);
```

 Ему передаются 2 параметра:

 1. **path** – создаваемое состояние, к которому необходимо перейти.
 1. **idx** – дополнительный параметр, который используется только при мультихешевой адресации.

Обработчик перехода в указанное состояние задается в методе **create**, который объявлен в классе **odaRouter** следующим образом:

```javascript
create(rule, callback);
```

Ему передаются два параметра:

1. **rule** — правило маршрутизации, которое определяет соответствует ли текущее состояние его обработчику или нет. Например, **'#spa'**.
1. **callback** – обработчик перехода к состоянию, которое соответствует указанному правилу.

Данный метод задает обработчик, который будет вызываться автоматически тогда, когда текущее состояние будет соответствовать заданному правилу маршрутизации.

Например,

```javascript run_line_edit_loadoda_[my-component.js]_h=190_
import '/tools/router/router.js';
ODA({
    is: 'my-component',
    template: `
        <style>
            #shape {
                width: 100px;
                height: 100px;
                background: bisque;
            }
        </style>
        <div>Фигура</div>
        <p><input name="shape" type="radio" value='circle' @change="onTap">Круг</p>
        <p><input name="shape" type="radio" value='square' @change="onTap">Квадрат</p>
        <div id="shape" ~style="{borderRadius: \`\${radius}%\`}"></div>
        <div>Навигация</div>
        <button @tap="onPrev">Назад</button>
        <button @tap="onNext">Вперед</button>
        <div>URL-адрес: {{window.location.href}}</div>
    `,
    props: {
        radius: 0
    },
    onTap(e) {
        ODA.router.go('#shape/' + e.target.value);
    },
    onNext() {
        ODA.router.forward();
    },
    onPrev() {
        ODA.router.back();
    },
    ready() {
        ODA.router.create('#shape/circle', (hash) => {
            this.radius = '50';
        });
        ODA.router.create('#shape/square', (hash) => {
            this.radius = '0';
        });
    }
});
```

В этом примере в хуке **ready** задаются два правила для обработки перехода к состояниям: **#shape/circle** и **#shape/square**. В первом правиле у фигуры задается 50%-ый радиус скругления рамки для прорисовки элемента **div** в виде круга. Во втором состоянии радиус скругления задается равным 0%, заставляя браузер прорисовывать тот же самый **div** в виде квадрата.

Переход в то или иное состояние в обработчиках нажатия кнопок выбора **radio** осуществляется с помощью метода **go** класс **odaRouter**. При этом будет срабатывать только один из обработчиков, или

```javascript
(hash) => {
    this.radius = '50';
}
```

или

```javascript
(hash) => {
    this.radius = '0';
}
```

В результате этого браузер будет прорисовывать элемент **div** в форме круга или квадрата.

Кроме этого, наличие разных состояний позволяет осуществлять навигацию по ним с помощью соответствующих кнопок перехода в истории сессий браузера **«Вперед»** или **«Назад»**.

Для программной реализации таких переходов в классе **odaRouter** предусмотрены два специальных метода:

1. **forward** — осуществляет переход к следующему состоянию.
1. **back** — осуществляет переход к предыдущему состоянию.

Они фактически вызывают одноименные методы объекта истории сессий браузера **window.history**.

Для выполнения одного и того же обработчика при переходе к различным состояниям можно использовать специальные шаблонные подстановки:

1. **\*** – заменяет любую последовательность символов. Например, **'#*'**
1. **?** – заменяет любой символ. Например, **'#?'**

Используя эти подстановки, можно задать одно общее правило маршрутизации в методе **create**, обработчик которого будет вызываться при переходе к любому состоянию, удовлетворяющему этому правилу.

Например,

```javascript run_line_edit_loadoda_[my-component.js]_h=200_
import '/tools/router/router.js';
ODA({
    is: 'my-component',
    template: `
        <style>
            #shape {
                width: 100px;
                height: 100px;
                background: bisque;
            }
        </style>
        <div>Фигура</div>
        <p><input name="shape" type="radio" value='circle' @change="onTap">Круг</p>
        <p><input name="shape" type="radio" value='square' @change="onTap">Квадрат</p>
        <div id="shape" ~style="{borderRadius: \`\${radius}%\`}"></div>
        <div>Навигация</div>
        <button @tap="onPrev">Назад</button>
        <button @tap="onNext">Вперед</button>
        <div>URL-адрес: {{window.location.href}}</div>
    `,
    props: {
        shape: {
            default: '',
            set(n) {
                if (!n)
                    return;
                const state = n.split('/');
                switch (state[1]) {
                    case 'circle':
                        this.radius = 50;
                        break;
                    case 'square':
                        this.radius = 0;
                        break;
                }
            }
        },
        radius: 0
    },
    onTap(e) {
        ODA.router.go('#shape/' + e.target.value);
    },
    onNext() {
        ODA.router.forward();
    },
    onPrev() {
        ODA.router.back();
    },
    ready() {
        ODA.router.create('#*', (hash) => {
            this.shape = hash;
        });
    }
});
```

В этом примере создается одно общее правило в хуке **ready**, которое позволяет обрабатывать любое состояние. Значение текущего состояния передается свойству компонента **shape**. В сеттере этого свойства предусмотрена вся необходимая логика работы SPA-приложения. В данном примере происходит разбор текущего состояние, значение которого задается с помощью метода **go** и передается обработчику в параметре **hash**, который затем присваивается свойству **shape**, что приводит к вызову его сеттера.

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/CiyAufIXpF4?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>