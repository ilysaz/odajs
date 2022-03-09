﻿```info_md
HTML-элементы с директивами **~for** можно вкладывать друг в друга, создавая многомерные конструкции.
```

Пример 1:

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~for="element, number, sourse, prop in object">
            <div ~for="element">{{prop}}[{{index}}]: {{item}}</div>
        </div>
    `,
    props: {
        object: {
            array_1: ['A', 'B', 'C'],
            array_2: ['D', 'E', 'F']
        }
    }
});
```

В примере директива **~for** во внешнем элементе **div** поочередно выбирает свойства объекта **object**, которые являются одномерными массивами. Эти массивы являются исходными данными для директивы **~for** во вложенном элементе **div**. Они передаются через переменную цикла **element**. Вторая директива разбирает массивы на отдельные значения и выводит их на web-страницу.

Обратите внимание, что переменная цикла **element** из внешней директивы используется в качестве источника данных во второй директиве. Во внешней директиве пришлось явно указать все переменные цикла, хотя в шаблоне используются только первая и последняя переменные **element** и **prop**. Переменные цикла во внутренней директиве не заданы, в шаблоне используются переменные **item** и **index**, создаваемые фреймворком по умолчанию.

```warning_md
Во внешних и вложенных директивах **~for** имена переменных цикла должны обязательно различаться. Иначе переменные внешних директив будут перекрывать переменные внутренних директив.
```

Пример 2:

```javascript _error_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~for="array_1">
            <div ~for="item, index, items in array_2">Элемент[{{index}}]: {{item}} -- Источник: [{{items}}]</div>
        </div>
    `,
    props: {
        array_1: ['A', 'B', 'C'],
        array_2: ['D', 'E', 'F']
    }
});
```

В примере во внешней директиве **~for** переменные цикла не указаны явно, поэтому их имена заданы по умолчанию **item**, **index** и **items**. Во вложенной директиве **~for** переменные цикла указаны явно и имеют такие же имена, т.е. имена переменных перекрываются. В результате, хотя для вложенной директивы в качестве источника данных указан массив **array_2**, на страницу выводятся только данные из массива **array_1**, указанного во внешней директиве.

На самом деле, в случае совпадения имен переменных во внешней и вложенной директивах **~for**, фреймворк неявным образом модифицирует имена переменных во вложенной директиве, добавляя в конце имени символ **1**. Эти модифицированные имена можно использовать в шаблоне элемента.

Пример 3:

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~for="array_1">
            <div ~for="item, index, items in array_2">Элемент[{{index1}}]: {{item1}} -- Источник: [{{items1}}]</div>
        </div>
    `,
    props: {
        array_1: ['A', 'B', 'C'],
        array_2: ['D', 'E', 'F']
    }
});
```

В этом примере, как и в предыдущем, во внешней и вложенной директивах имена переменных цикла совпадают. Но в шаблоне вложенного элемента **div** используются переменные, к именам которых добавлен символ **1**. Эти переменные не объявлены во вложенной директиве, более того в директиве используются совсем другие имена, однако именно эти необъявленные переменные фреймворк использует в качестве переменных цикла. В результате на web-страницу выводятся данные из массива **array_2**, который указан источником данных во вложенной директиве.

Если директивы **~for** находятся на одном уровне вложенности, то перекрытия имен не происходит и можно использовать совпадающие имена переменных цикла.

Пример 4:

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~for="item, index, items in array_1">Элемент[{{index}}]: {{item}} -- Источник: [{{items}}]</div>
        <div ~for="item, index, items in array_2">Элемент[{{index}}]: {{item}} -- Источник: [{{items}}]</div>
    `,
    props: {
        array_1: ['A', 'B', 'C'],
        array_2: ['D', 'E', 'F']
    }
});
```

В примере используются два элемента **div** с директивой **~for**, в которой объявлены переменные цикла с одинаковыми именами. Эти элементы не являются вложенными друг в друга, поэтому конфликта имен не происходит и данные из массивов **array_1** и **array_2** выводятся правильно.

```info_md
Для минимизации объема кода и ускорения процесса программирования при создании иерархии вложенных директив **~for** можно опустить все параметры, указав только источник данных. В этом случае для внешней директивы фреймворк автоматически создаст переменные цикла с именами **item**, **index**, **items** и **key** соответственно. Для вложенных директив будут созданы переменные с аналогичными именами, к которым добавлены цифровые индексы, соответствующие глубине вложенности.
```

Пример 5:

```javascript _run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~for="array">
            <div ~for="item">
                <div ~for="item1">Элемент[{{index}},{{index1}},{{index2}}]: {{item2}}</div>
            </div>
        </div>
    `,
    props: {
        array: [
            [['a000', 'a001'], ['a010', 'a011']],
            [['a100', 'a101'], ['a110', 'a111']],
            [['a200', 'a201'], ['a210', 'a211']]
        ]
    }
});
```

В примере для вывода содержимого 3-х мерного массива используются три вложенные директивы **~for**. В директивах переменные цикла явно не указаны. В именах переменных **item1**, **item2**, **index1** и **index2** цифровые индексы показывают порядок вложенности директив, в которых эти переменные автоматически созданы.

Пример 6, как не надо делать:

```javascript _error_run_edit_[my-component.js]
ODA({
    is: 'my-component',
    template: `
        <div ~for="element in array">
            <div ~for="element in element">
                <div ~for="element1">Элемент[{{index}},{{index1}},{{index2}}]: {{item}}</div>
            </div>
        </div>
    `,
    props: {
        array: [
            [['a000', 'a001'], ['a010', 'a011']],
            [['a100', 'a101'], ['a110', 'a111']],
            [['a200', 'a201'], ['a210', 'a211']]
        ]
    }
});
```

Этот пример работает также как и предыдущий. Однако читаемость кода значительно ниже. Во-первых, во внешней и последующей внутренней директиве для текущего значения указана переменная с одним именем **element**, поэтому необходимо помнить, что фреймворк автоматически переименует вторую переменную в **element1**. Во-вторых, в третьей директиве именам переменных автоматически присвоены разные числовые индексы, как будто они принадлежат разным директивам. Так у переменной значением **item** индекс отсутствует, как будто она объявлена во внешней директиве, а у переменной **index2** присутствует индекс **2**, соответствующий реальной вложенности директивы.

```faq_md
#### Рекомендация.

Во избежание путаницы с именами переменных цикла при использовании вложенных директив **~for** рекомендуется или явно указывать все переменные во всех директивах, тщательно контролируя их уникальность, или во всех директивах использовать значения по умолчанию.
```

Если во внешних и вложенных директивах **~for** имена переменных цикла явно не заданы или заданы частично, то необъявленные имена назначаются следующим образом:

- берется основа имени **item**, **index**, **items** или **key** в соответствии с позицией в списке параметров;
- затем проверяется использование этого имени в директивах, расположенных выше по уровню;
- если соответствующее имя уже используется, то к основе имени присоединяется индекс **1**;
- если имя с индексом **1** уже существует, то к основе имени присоединяется индекс **2**, и так далее, пока не будет сформировано уникальное имя.

Если в директивах, расположенных на разных уровнях, явно заданы одинаковые имена переменных цикла, то фреймворк изменяет имя во внутренней директиве. Имя объявленной переменной берется за основу, и к нему присоединяется индекс **1**, **2**, и так далее пока не будет создано уникальное имя.

Автоматическое назначение имен переменным цикла и автоматическое переименование переменных позволяет избежать краха компонента в процессе исполнения из-за ошибок программиста, но делает код компонента сложным для сопровождения и может привести к функциональным ошибкам в работе компонента.

<div style="position:relative;padding-bottom:48%; margin:10px">
    <iframe src="https://www.youtube.com/embed/5grvyQc4-bI?start=0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
    	style="position:absolute;width:100%;height:100%;"></iframe>
</div>
