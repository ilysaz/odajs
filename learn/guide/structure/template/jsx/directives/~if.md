﻿Директива **~if** используется для условного рендеринга HTML-элемента.

Если значение этой директивы можно привести к значению **true**, то HTML-элемент, в котором она указана, будет создан в DOM и прорисован браузером.
В противном случае, если директива **~if** имеет значение **false**, то HTML-элемент будет автоматически удален из DOM, и на HTML-странице он отображаться не будет.

Пример 1
```javascript_run_line_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <span ~if="_isShow">Меня видно</span>
        <button @tap="_onTap">Кнопка</button>
    `,
    props: {
        _isShow: false
    },
    _onTap() {
        this._isShow = !this._isShow;
    }
});
```

В данном примере нажатие на кнопку **button** изменяет значение свойства **_isShow** с **false** на **true**, и наоборот. При каждом таком изменении элемент **span** будет динамически добавляться в DOM и удаляться из него, отображаясь и удаляясь с HTML-страницы.

```info_md
В отличие от директивы **~show**, директива **~if** полностью удаляет HTML-элемент из DOM и снова создает его при любом изменении её значения.
```

По этой причине директиву **~if** эффективнее всего использовать тогда, когда сам HTML-элемент на странице изначально не нужен, а переключение его в режим отображения осуществляется крайне редко. В этом случае директива **~if** ускорит загрузку HTML-страницы, так как сам элемент изначально в DOM создаваться не будет. Однако при этом замедлится процесс его отображения, так как сам элемент будет необходимо каждый раз заново добавлять в DOM перед его прорисовкой.

```help_md
Если изменение режима отображения элемента будет происходить достаточно часто, то эффективнее всего будет применить директиву **~show**, которая не создает и не удаляет элемент из DOM, а только прячет его на странице и отображает вновь, используя атрибут **display**.
```

Директива **~else** используется для условного рендеринга HTML-элемента, когда условие предыдущей директивы **~if** не выполняется.

Пример 2
```javascript_run_line_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <span ~if="_isShow">Меня видно</span>
        <span ~else>Меня не видно</span>
        <button @tap="_onTap">Кнопка</button>
    `,
    props: {
        _isShow: true
    },
    _onTap() {
        this._isShow = !this._isShow;
     }
});
```

В этом случае, когда свойство **_isShow** примет значение **false**, первый **span** будет удален из DOM, а второй **span**, в котором указана директива **~else**, будет в него добавлен и прорисован на странице. И наоборот — при значении  **true** будет создан и отображен только первый элемент **span**, а второй будет из DOM удален.

```warning_md
HTML-элемент с директивой **~else** должен обязательно идти сразу после HTML-элемента c директивой **~if**. В противном случае элемент с директивой **~else** будет создан в DOM в любом случае, а его отображение не будет зависеть от значения директивы **~if**, идущей до него.
```

Директива **~else-if** используется для условного рендеринга HTML-элемента, когда директива **~if** у предыдущего элемента не выполняется, но при этом следующий HTML-элемент необходимо отображать не всегда, а только при выполнении дополнительного условия, указанного в директиве **~else-if**.

Пример 3
```javascript_run_line_edit_h=80_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <span ~if="item === 'A'">Элемент span
            <input placeholder="Введите имя пользователя">
        </span>
        <div ~else-if="item === 'B'">Элемент div
            <input placeholder="Введите фамилию пользователя">
        </div>
        <p ~else>Элемент p
           <input placeholder="Введите email">
        </p>
        <button @tap="_onTap">Кнопка</button>
    `,
    props: {
        item: 'A'
    },
    _onTap() {
        switch (this.item) {
            case 'A':
                this.item = 'B';
                break;
            case 'B':
                this.item = 'C';
                break;
            case 'C':
                this.item = 'A';
                break;
        }
    }
});
```

HTML-элемент, в котором указана директива **~else-if**, будет создаваться и прорисовываться только в том случае, когда значение директивы **~if** у предыдущего элемента будет равно **false**. При этом значение выражения у самой директивы **~else-if** должно быть истинным (**true**).

```like_md
Директивы **~else-if** можно использовать последовательно друг за другом неоднократно.
```

Если выражения у всех директив **~if** и **~else-if** будут ложными, то прорисован будет только HTML-элемент, указанный с директивой **~else**.

```warning_md
Элементы с директивой **~else-if** обязательно должны идти после HTML-элементов с директивой **~if** или **~else-if**. В противном случае элемент с директивой **~else-if** будет создан в DOM не зависимо от значения директив **~if** или **~else-if**, идущими до него.
```

```warning_md
Будьте внимательны при использовании директив **~if**, **~else-if** и **~else** с компонентами. Эти директивы полностью удаляют компонент из DOM и создают его заново, поэтому все сделанные в компоненте изменения теряются. Если необходимо сохранять эти изменения, используйте директиву **~show**.
```

Пример 4

```javascript_run_line_edit_loadoda_[my-component.js]_h=100_
import 'https://odajs.org/components/buttons/icon/icon.js';
ODA({
    is: 'my-icon',
    template: `
        <oda-icon icon='icons:android' icon-size='48' :fill='color'></oda-icon>
        <button @tap='_onTap'>Изменить цвет</button>
    `,
    props: {
        color: 'lime'
    },
    _onTap() {
        this.color = 'orange';
    }
});

ODA({
    is: 'my-component',
    template: `
        <button @tap='_onTap'>Показать / Скрыть</button>
        <my-icon ~if='_isShow'></my-icon>
    `,
    props:{
        _isShow: true
    },
    _onTap() {
        this._isShow = !this._isShow;
    }
});
```

В данном примере нажатие на кнопку **Изменить цвет** изменяет в компоненте **my-icon** цвет иконки на оранжевый. Но после каждой операции условного рендеринга компонента, вызванного нажатием на кнопку **Показать/Скрыть**, иконка приобретает цвет заданный по умолчанию, так как компонент создается заново.

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/M6QI9qut0wI?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen 
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>