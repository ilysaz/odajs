### Showdown's Wiki pages 
[Окрыть wiki в новом окне](https://github.com/showdownjs/showdown/wiki)

CDN
~~~html _hideGutter_
<script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda-framework@master/oda.js"></script>
~~~
~~~html _hideGutter_
<script type="module" src="https://unpkg.com/browse/oda-framework@0.0.1/oda.json"></script>
~~~

NPM

~~~info_hideGutter_
 npm i oda-framework
~~~

~~~error_hideGutter_hideicon_
 npm i oda-framework
~~~

Текст `let a = "Программный код"` в одну строку

1.  level 1
    1.  Level 2
        *   Level 3
    2.  level 2
        1.  Level 3
1.  Level 1


this is a \:smile\: => :smile: emoji   

``` info_copy_md
**Имя** компонента обязательно должно содержать хотя бы один дефис в соответствии с требованиями [стандарта HTML](https://html.spec.whatwg.org/multipage/custom-elements.html#valid-custom-element-name)   
```

```javascript _run_line_edit_loadoda_console_copy_warn_error_[my-component.js]_h=120_
import '/components/buttons/icon/icon.js';

ODA({
    is: 'my-component',
    template: `
        <div ~for="items" ~is="item.tag" ~props="item"></div>
        <button @tap="_log">Console log</button>
    `,
    props:{
        items:[
            {tag: 'oda-icon', icon: 'tools:magnify', size: 96},
            {tag: 'oda-icon', icon: 'icons:android', size: 64, fill: 'green'},
            {tag: 'oda-icon', icon: 'icons:alarm', size: 32, fill: 'orange'}
        ]
    },
    ready() {
        alert('ready ... ')
    },
    attached() {
        alert('attached ... ')
        setTimeout(() => {
            console.log('iframe-log')
        }, 500);
    },
    _log() {
        alert('log ... ')
        console.log(new Date());
    }
});

```

```javascript _run_line_edit_loadoda_console_[my-component.js]_h=120_

import '/components/buttons/icon/icon.js';

ODA({
    is: 'my-component',
    template: `
        <div ~for="items" ~is="item.tag" ~props="item"></div>
        <button @tap="_log">Console log</button>
    `,
    props:{
        items:[
            {tag: 'oda-icon', icon: 'tools:magnify', size: 96},
            {tag: 'oda-icon', icon: 'icons:android', size: 64, fill: 'green'},
            {tag: 'oda-icon', icon: 'icons:alarm', size: 32, fill: 'orange'}
        ]
    },
    ready() {
        alert('ready ... ')
    },
    attached() {
        alert('attached ... ')
        setTimeout(() => {
            console.log('iframe-log')
        }, 500);
    },
    _log() {
        alert('log ... ')
        console.log(new Date());
    }
});

```

```javascript _run_line_edit_loadoda_console_[my-component.js]_h=120_

import '/components/buttons/icon/icon.js';

ODA({
    is: 'my-component',
    template: `
        <div ~for="items" ~is="item.tag" ~props="item"></div>
        <button @tap="_log">Console log</button>
    `,
    props:{
        items:[
            {tag: 'oda-icon', icon: 'tools:magnify', size: 96},
            {tag: 'oda-icon', icon: 'icons:android', size: 64, fill: 'green'},
            {tag: 'oda-icon', icon: 'icons:alarm', size: 32, fill: 'orange'}
        ]
    },
    ready() {
        alert('ready ... ')
    },
    attached() {
        alert('attached ... ')
        setTimeout(() => {
            console.log('iframe-log')
        }, 500);
    },
    _log() {
        alert('log ... ')
        console.log(new Date());
    }
});

```

Для примера в шаблоне данного компонента задана кнопка, в обработчике нажатия **\_onTap** которой значение 
счетчика **\_count** увеличивается на единицу. В свойстве **text** объявлен метод с именем **get**, который и является геттером. Этот метод будет вызываться не только при обращение к свойству для чтения, как это указано в шаблоне компонента с помощью директивы **{{ }}**, но и при любом изменении связанного с ним свойства из-за механизма реактивности.

Начальное значение свойства **text**, указанное в параметре **default**, будет присвоено свойству только при создании компонента. После этого значение свойства будет формироваться уже геттером. При этом его начальное значение будет потеряно в любом случае, так как при первом обращении к свойству оно будет переписано геттером.

Значение выражения в двойных фигурных скобках подставляется как простой текст, а не как HTML-код. 
Если необходимо, чтобы вместо текста выводился сырой HTML-код необходимо использовать специальную директиву **~html**.

```xml _[welcome-component.css]_line_edit_
<style>
    * { 
        color: orange;
    }
</style>
```

```html run_line_copy_info_edit_{welcome-component.css}
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Template</title>
        <script type="module" src="/oda.js"></script>
    </head>
    <body>
        <my-component></my-component>
        <script type="module">
            ODA({
                is: 'my-component',
                template: `
                    <p>{{text}}</p>
                    <p ~html="text"></p>
                `,
                props: {
                    text: '<span style="color: red"> Текст должен быть красным</span>'
                }

            });
        </script>
    </body>
</html>
```

Содержимое второго тега **p** в данном примере будет заменено значением свойства **text**, интерпретированного как обычный HTML. В первом теге **p** свойство **text** интерпретируется как обычный текст.

Важно помнить html-коде все внутренние привязки игнорируются.

``` info_nocopy_md
Директиву **HTML** нельзя использовать для ~~вложения~~ шаблонов друг в друга. Вместо этого нужно использовать компоненты, позволяющие объединять и повторно использовать элементы UI.
```

``` warning_nocopy_md
Динамическая отрисовка произвольного HTML-кода на сайте крайне опасна, так как может легко привести к XSS-уязвимостям. Используйте интерполяцию HTML только для доверенного кода, и никогда не подставляйте туда содержимое, создаваемое пользователями.
```


``` warning_nocopy_md
This is WARNING message ...
This is WARNING message ...
This is WARNING message ...
This is WARNING message ...
```

``` error_nocopy_md
This is ERROR message ...
```

``` success_nocopy_md
This is SUCCESS message ...
```

``` info_nocopy_md
This is INFO message ...
```

``` help_nocopy_md
This is HELP message ...
```

``` like_nocopy_md
This is LIKE message ...
```

``` faq_nocopy_md
This is FAQ message ...
```

### Demo Highlighting <span style="color:orange">ODA framework</span> code on Markdown

Создадим первый компонент **Hello, World!**

```html run_line_edit_copy_[welcome-component.html]
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>WELCOME</title>
        <script type="module" src="/oda.js"></script>
    </head>
    <body>
        <welcome-component></welcome-component>
        <script type="module">
          ODA({
              is: 'welcome-component',
              template:`<span>{{text}}</span>`,
              props: {
                  text: 'Hello, World !!!'
              }
          });
        </script>
    </body>
</html>
```

```javascript _edit_line_run_copy_[welcome-component.js]
ODA({
    is: 'welcome-component',
    template:`<span>{{text}}</span>`,
    props: {
        text: 'Hello, World !!!'
    }
});
```

```javascript _edit_line_copy_[base-component1.js]
ODA({
    is: 'base-component1',
    template: `
        <div>Parent 1</div>
    `
});
```

```javascript _edit_line_copy_[base-component2.js]
ODA({
    is: 'base-component2',
    template: `
        <div>Parent 2</div>
    `
});
```

```javascript _edit_line_run_copy_[derived-component.js]_{base-component1.js_base-component2.js_welcome-component.css}
ODA({
    is: 'derived-component',
    extends: 'base-component1, base-component2',
    template: `
        <div>Descendant</div>
    `
})
```

```html _edit_line_run_copy_{welcome-component.js_welcome-component.css}
<welcome-component></welcome-component>
```


# H1 Demo
## H2 Demo
### H3 Demo
#### H4 Demo
##### H5 Demo
###### H6 Demo

Sub-heading
-----------

Paragraphs are separated
by a blank line.

Two spaces at the end of a line  
produces a line break.

Text attributes _italic_, 
**bold**, `monospace`.

Horizontal rule:

---

Strikethrough:
~~strikethrough~~

Bullet list:

  * apples
  * oranges
  * pears

Numbered list:

  1. lather
  2. rinse
  3. repeat

An [example](http://example.com).


[ ZIP-архив](https://odant.org/web/oda/dist/oda.zip)

CDN
~~~html_hideGutter_
<script type="module" src="https://cdn.jsdelivr.net/gh/odajs/oda-framework@master/oda.js"></script>
~~~
~~~html_hideGutter_
<script type="module" src="https://unpkg.com/browse/oda-framework@0.0.1/oda.json"></script>
~~~

NPM

~~~_hideGutter_
 npm i oda-framework
~~~

#  Сравнение СУБД: MS SQL и ODANT

В таблице приведены ряд критериев, по которым можно сравнить ODANT с реляционной СУБД MS SQL. Ниже — комментарии по некоторым вопросам.

| № | Характеристика | Реализация в ODANT | Реализация в MS SQL |
|:---:|:---|:---:|:---:|
| **1** | **Универсальные свойства СУБД** | | | 
| 1.1 | Транзакционность | В терминах реляционной базы данных нет. Развернутый комментарий ниже. | Есть |
| 1.2 | Целостность | Есть. Развернутый комментарий ниже. | Есть |
| 1.3 | Ключи | Есть | Есть |
| 1.4 | Индексы | Есть | Есть |
| 1.5 | Язык запросов | XQuery | T-SQL |
| 1.6 | Процедуры | Есть. Реализуются в виде классов, которые предоставляют свои методы другим классам. | Есть |
| 1.7 | Функции | Есть. Реализуются в виде классов, которые предоставляют свои методы другим классам. | Есть |
| 1.8 | Job | Есть. Реализуется в виде классов, код методов которых выполняется на сервере. Запуск выполнения по событиям возможен. | Есть |
| 1.9 | Контроль uid ссылок. \(при изменении источника кеш не обновляется в зависимых объектах\) | Ссылка, аналогичная uid ссылке в реляционной базе данных, не используется в ODANT по идеологическим причинам, хотя технически она реализуема. В ODANT используется понятие связи, у которой другое поведение. | Есть |
| **2** | **Администрирование, инструменты разработки** | | | 
| 2.1 | Трекинг запросов | Есть. Изменение базы данных происходит ВСЕГДА через изменение объектов. Отслеживание изменений объектов реализовано. | Есть |
| 2.2 | План запроса | Нет | Есть |
| 2.3 | Управление доступом к таблицам/классам | Есть | Есть |
| 2.4 | Шифрование, анонимизация данных в БД | Техническая возможность есть, необходимо получение лицензии | Есть |
| 2.5 | Редактор запросов | Есть | Есть |
| 2.6 | Автоматическое резервное копирование | Есть | Есть |
| 2.7 | Автоматический Shrink | Нет. Не требуется, связано с архитектурой базы данных. База всегда оптимизирована по размеру. | Есть |
| **3** | **Интеграция с другими СУБД** | | | 
| 3.1 | Подключение к другим СУБД | Реализуется на прикладном уровне. Сейчас есть сервисный класс для подключения к другим базам данных через ODBC, с возможностью импорта. Также возможен импорт из других источников: Excel, csv файлы и др. | Есть |
| 3.2 | Выполнение выборки данных из другой СУБД | При выполнении импорта с использованием ODBC драйвера возможно выполнение выборки с помощью SQL запросов. | T-SQL |
| **4** | **Использование различных приложений** | | | 
| 4.1 | Доступ к данным из приложений | Через коннектор, разработанный для данного приложения. Можно использовать уже существующие коннекторы \(например, для 1С\). | Через стандартные драйвера |
| **5** | **Объектная модель работы с данными** | | | 
| 5.1 | Наследование | Есть | Нет |
| 5.2 | Иерархическая БД | Есть | Нет |
| 5.3 | Простое построение и работа со сложными структурами данных. Возможность отображать сложные сущности внешнего мира в одном классе. | Есть | Нет |
| 5.4 | Общий репозиторий методов | Есть | Нет |
| 5.5 | Распределенные хранение и обработка данных | Есть | Нет |
| 5.6 | Глобальная идентификация сущностей | Есть | Нет |
| 5.7 | Создание модели данных, которая включает в себя зависимости между данными | Есть | Нет |
| 5.8 | Возможность обмена \(продажи\) между разработчиками частями базы данных \(классов\). Возможность построение базы данных из частей базы данных \(классов\), созданных другими разработчиками. | Есть | Нет |
| 5.9 | Возможность использовать при построении базы данных сервисы с данными \(например, поле адреса\), которые поставляются другими разработчиками. | Есть | Нет |
| 5.10 | Возможность синхронизации моделей данных через общие репозитарии моделей данных между различными разработчиками | Есть | Нет |

## Транзакционность

>При изменении данных БД должна переходить от одного целостного состояния к другому. Однако, в процессе обновления данных возможны ситуации, когда состояние целостности нарушается. Во избежание таких ситуаций в СУБД вводится понятие транзакции — атомарного действия над БД, переводящего ее из одного целостного состояния в другое целостное состояние. Другими словами, транзакция — это последовательность операций, которые должны быть или все выполнены или все не выполнены \(все или ничего\).

>Понятие транзакции было разработано и реализовано в эпоху табличных реляционных баз данных. В таких БД прикладные сущности, как правило, не могут быть реализованы в одной таблице, а располагаются сразу в нескольких связанных таблицах. В этом случае операция в БД с одной прикладной сущностью требует обращения сразу к нескольким таблицам. При этом могут возникать различные проблемы, связанные как с прерыванием операций, так и со случаями параллельной работы нескольких пользователей с одними и теми же сущностями.

>В объектной базе данных ODANT прикладная сущность описывается одним классом, а действие производится над объектом класса. В ODANT сервер контролирует целостность сущности — объекта — при операциях с ним. Можно говорить о том, что механизм транзакций, который обеспечивает целостность БД, реализован на уровне сервера, не требуя дополнительного управления на уровне программиста. При этом механизма транзакций, привычного специалистам по работе с SQL СУБД — нет.

### Целостность объектной БД — это целостность объектов, которая контролируются сервером. Для полноценной работы этого механизма необходимо построение правильной структуры данных.

У программистов, которые ранее работали только с табличными реляционными БД, возникает проблема при переходе на объектную СУБД ODANT. Они в процессе разработки пытаются реализовать структуру данных аналогичную той, которую они применяют в РСУБД. И при работе с этой структурой у них возникает потребность в транзакционности. Данная проблема решается формированием правильной структуры данных и идеологией построения приложений.

## Контроль uid ссылок

Еще одно понятие, которое присуще идеологии реляционных табличных БД. Рассмотрим простой пример.

[![](http://csc.odant.org/wp-content/uploads/2018/07/sch.jpg "")](http://csc.odant.org/wp-content/uploads/2018/07/sch.jpg "")

В таблице «Прайс-лист» информация о продавце товара дана только в виде кода продавца \(uid\). А все остальное — в таблице «Продавцы». Если нужно получить прайс-лист, в который будет вставлена информация о продавце, выполняется SQL запрос, которые объединит данные таблиц «Прайс-лист» и «Продавцы».

Подобная реализация в ODANT возможна, но обычно не применяется. В ODANT в прайс-листе атрибут, связанный с продавцом, будет включать в себя необходимое описание этого продавца \(как минимум — название, может быть адрес, телефон, а может — полные реквизиты\). При этом можно установить связь этого атрибута с классом «Продавцы», и в этой связи будет информация по uid продавца. Но поведение этой связи сложное и настраивается в зависимости от прикладной задачи. Связь бывает статической или динамической, можно настроить, какая часть информации из объекта «Продавец» будет импортироваться.

Контроль ссылочной целостности в реляционных БД подразумевает следующее. Если мы попытаемся удалить запись в таблице «Продавцы», на которую ссылается запись в таблице «Прайс-лист», то SQL эту операцию заблокирует. Этот контроль нам необходим, так как данные о продавце есть только в записи таблицы «Продавцы». Но в ODANT все не так. Данные о продавце есть в объекте «Прайс-лист». И в случае удаления объекта из класса «Продавцы» данные этого продавца останутся. Поэтому контроля ссылочной целостности в том виде, как это реализовано в табличных БД, в ODANT нет.

### Еще раз отметим, если мы захотим, то сможем с помощью XQuery получить результат как при выполнении SQL запроса.

this is a \:smile\: :smile: emoji   
Other emoji:

1	:+1:	   
-1	:-1:	   
100	:100:	   
1234	:1234:	   
1st_place_medal	:1st_place_medal:	   
2nd_place_medal	:2nd_place_medal:	   
3rd_place_medal	:3rd_place_medal:	   
8ball	:8ball:	   
a	:a:	   
ab	:ab:	   
abc	:abc:	   
abcd	:abcd:	   
accept	:accept:	   
aerial_tramway	:aerial_tramway:	   
airplane	:airplane:	   
alarm_clock	:alarm_clock:	   
alembic	:alembic:	   
alien	:alien:	   
ambulance	:ambulance:	   
amphora	:amphora:	   
anchor	:anchor:	   
angel	:angel:	   
anger	:anger:	   
angry	:angry:	   
anguished	:anguished:	   
ant	:ant:	   
apple	:apple:	   
aquarius	:aquarius:	   
aries	:aries:	   
arrow_backward	:arrow_backward:	   
arrow_double_down	:arrow_double_down:	   
arrow_double_up	:arrow_double_up:	   
arrow_down	:arrow_down:	   
arrow_down_small	:arrow_down_small:	   
arrow_forward	:arrow_forward:	   
arrow_heading_down	:arrow_heading_down:	   
arrow_heading_up	:arrow_heading_up:	   
arrow_left	:arrow_left:	   
arrow_lower_left	:arrow_lower_left:	   
arrow_lower_right	:arrow_lower_right:	   
arrow_right	:arrow_right:	   
arrow_right_hook	:arrow_right_hook:	   
arrow_up	:arrow_up:	   
arrow_up_down	:arrow_up_down:	   
arrow_up_small	:arrow_up_small:	   
arrow_upper_left	:arrow_upper_left:	   
arrow_upper_right	:arrow_upper_right:	   
arrows_clockwise	:arrows_clockwise:	   
arrows_counterclockwise	:arrows_counterclockwise:	   
art	:art:	   
articulated_lorry	:articulated_lorry:	   
artificial_satellite	:artificial_satellite:	   
astonished	:astonished:	   
athletic_shoe	:athletic_shoe:	   
atm	:atm:	   
atom_symbol	:atom_symbol:	   
avocado	:avocado:	   
b	:b:	   
baby	:baby:	   
baby_bottle	:baby_bottle:	   
baby_chick	:baby_chick:	   
baby_symbol	:baby_symbol:	   
back	:back:	   
bacon	:bacon:	   
badminton	:badminton:	   
baggage_claim	:baggage_claim:	   
baguette_bread	:baguette_bread:	   
balance_scale	:balance_scale:	   
balloon	:balloon:	   
ballot_box	:ballot_box:	   
ballot_box_with_check	:ballot_box_with_check:	   
bamboo	:bamboo:	   
banana	:banana:	   
bangbang	:bangbang:	   
bank	:bank:	   
bar_chart	:bar_chart:	   
barber	:barber:	   
baseball	:baseball:	   
basketball	:basketball:	   
basketball_man	:basketball_man:	   
basketball_woman	:basketball_woman:	   
bat	:bat:	   
bath	:bath:	   
bathtub	:bathtub:	   
battery	:battery:	   
beach_umbrella	:beach_umbrella:	   
bear	:bear:	   
bed	:bed:	   
bee	:bee:	   
beer	:beer:	   
beers	:beers:	   
beetle	:beetle:	   
beginner	:beginner:	   
bell	:bell:	   
bellhop_bell	:bellhop_bell:	   
bento	:bento:	   
biking_man	:biking_man:	   
bike	:bike:	   
biking_man	:biking_man:	   
biking_woman	:biking_woman:	   
bikini	:bikini:	   
biohazard	:biohazard:	   
bird	:bird:	   
birthday	:birthday:	   
black_circle	:black_circle:	   
black_flag	:black_flag:	   
black_heart	:black_heart:	   
black_joker	:black_joker:	   
black_large_square	:black_large_square:	   
black_medium_small_square	:black_medium_small_square:	   
black_medium_square	:black_medium_square:	   
black_nib	:black_nib:	   
black_small_square	:black_small_square:	   
black_square_button	:black_square_button:	   
blonde_man	:blonde_man:	   
blonde_woman	:blonde_woman:	   
blossom	:blossom:	   
blowfish	:blowfish:	   
blue_book	:blue_book:	   
blue_car	:blue_car:	   
blue_heart	:blue_heart:	   
blush	:blush:	   
boar	:boar:	   
boat	:boat:	   
bomb	:bomb:	   
book	:book:	   
bookmark	:bookmark:	   
bookmark_tabs	:bookmark_tabs:	   
books	:books:	   
boom	:boom:	   
boot	:boot:	   
bouquet	:bouquet:	   
bowing_man	:bowing_man:	   
bow_and_arrow	:bow_and_arrow:	   
bowing_man	:bowing_man:	   
bowing_woman	:bowing_woman:	   
bowling	:bowling:	   
boxing_glove	:boxing_glove:	   
boy	:boy:	   
bread	:bread:	   
bride_with_veil	:bride_with_veil:	   
bridge_at_night	:bridge_at_night:	   
briefcase	:briefcase:	   
broken_heart	:broken_heart:	   
bug	:bug:	   
building_construction	:building_construction:	   
bulb	:bulb:	   
bullettrain_front	:bullettrain_front:	   
bullettrain_side	:bullettrain_side:	   
burrito	:burrito:	   
bus	:bus:	   
business_suit_levitating	:business_suit_levitating:	   
busstop	:busstop:	   
bust_in_silhouette	:bust_in_silhouette:	   
busts_in_silhouette	:busts_in_silhouette:	   
butterfly	:butterfly:	   
cactus	:cactus:	   
cake	:cake:	   
calendar	:calendar:	   
call_me_hand	:call_me_hand:	   
calling	:calling:	   
camel	:camel:	   
camera	:camera:	   
camera_flash	:camera_flash:	   
camping	:camping:	   
cancer	:cancer:	   
candle	:candle:	   
candy	:candy:	   
canoe	:canoe:	   
capital_abcd	:capital_abcd:	   
capricorn	:capricorn:	   
car	:car:	   
card_file_box	:card_file_box:	   
card_index	:card_index:	   
card_index_dividers	:card_index_dividers:	   
carousel_horse	:carousel_horse:	   
carrot	:carrot:	   
cat	:cat:	   
cat2	:cat2:	   
cd	:cd:	   
chains	:chains:	   
champagne	:champagne:	   
chart	:chart:	   
chart_with_downwards_trend	:chart_with_downwards_trend:	   
chart_with_upwards_trend	:chart_with_upwards_trend:	   
checkered_flag	:checkered_flag:	   
cheese	:cheese:	   
cherries	:cherries:	   
cherry_blossom	:cherry_blossom:	   
chestnut	:chestnut:	   
chicken	:chicken:	   
children_crossing	:children_crossing:	   
chipmunk	:chipmunk:	   
chocolate_bar	:chocolate_bar:	   
christmas_tree	:christmas_tree:	   
church	:church:	   
cinema	:cinema:	   
circus_tent	:circus_tent:	   
city_sunrise	:city_sunrise:	   
city_sunset	:city_sunset:	   
cityscape	:cityscape:	   
cl	:cl:	   
clamp	:clamp:	   
clap	:clap:	   
clapper	:clapper:	   
classical_building	:classical_building:	   
clinking_glasses	:clinking_glasses:	   
clipboard	:clipboard:	   
clock1	:clock1:	   
clock10	:clock10:	   
clock1030	:clock1030:	   
clock11	:clock11:	   
clock1130	:clock1130:	   
clock12	:clock12:	   
clock1230	:clock1230:	   
clock130	:clock130:	   
clock2	:clock2:	   
clock230	:clock230:	   
clock3	:clock3:	   
clock330	:clock330:	   
clock4	:clock4:	   
clock430	:clock430:	   
clock5	:clock5:	   
clock530	:clock530:	   
clock6	:clock6:	   
clock630	:clock630:	   
clock7	:clock7:	   
clock730	:clock730:	   
clock8	:clock8:	   
clock830	:clock830:	   
clock9	:clock9:	   
clock930	:clock930:	   
closed_book	:closed_book:	   
closed_lock_with_key	:closed_lock_with_key:	   
closed_umbrella	:closed_umbrella:	   
cloud	:cloud:	   
cloud_with_lightning	:cloud_with_lightning:	   
cloud_with_lightning_and_rain	:cloud_with_lightning_and_rain:	   
cloud_with_rain	:cloud_with_rain:	   
cloud_with_snow	:cloud_with_snow:	   
clown_face	:clown_face:	   
clubs	:clubs:	   
cocktail	:cocktail:	   
coffee	:coffee:	   
coffin	:coffin:	   
cold_sweat	:cold_sweat:	   
boom	:boom:	   
comet	:comet:	   
computer	:computer:	   
computer_mouse	:computer_mouse:	   
confetti_ball	:confetti_ball:	   
confounded	:confounded:	   
confused	:confused:	   
congratulations	:congratulations:	   
construction	:construction:	   
construction_worker_man	:construction_worker_man:	   
construction_worker_man	:construction_worker_man:	   
construction_worker_woman	:construction_worker_woman:	   
control_knobs	:control_knobs:	   
convenience_store	:convenience_store:	   
cookie	:cookie:	   
cool	:cool:	   
policeman	:policeman:	   
copyright	:copyright:	   
corn	:corn:	   
couch_and_lamp	:couch_and_lamp:	   
couple	:couple:	   
couple_with_heart_woman_man	:couple_with_heart_woman_man:	   
couple_with_heart_man_man	:couple_with_heart_man_man:	   
couple_with_heart_woman_man	:couple_with_heart_woman_man:	   
couple_with_heart_woman_woman	:couple_with_heart_woman_woman:	   
couplekiss_man_man	:couplekiss_man_man:	   
couplekiss_man_woman	:couplekiss_man_woman:	   
couplekiss_woman_woman	:couplekiss_woman_woman:	   
cow	:cow:	   
cow2	:cow2:	   
cowboy_hat_face	:cowboy_hat_face:	   
crab	:crab:	   
crayon	:crayon:	   
credit_card	:credit_card:	   
crescent_moon	:crescent_moon:	   
cricket	:cricket:	   
crocodile	:crocodile:	   
croissant	:croissant:	   
crossed_fingers	:crossed_fingers:	   
crossed_flags	:crossed_flags:	   
crossed_swords	:crossed_swords:	   
crown	:crown:	   
cry	:cry:	   
crying_cat_face	:crying_cat_face:	   
crystal_ball	:crystal_ball:	   
cucumber	:cucumber:	   
cupid	:cupid:	   
curly_loop	:curly_loop:	   
currency_exchange	:currency_exchange:	   
curry	:curry:	   
custard	:custard:	   
customs	:customs:	   
cyclone	:cyclone:	   
dagger	:dagger:	   
dancer	:dancer:	   
dancing_women	:dancing_women:	   
dancing_men	:dancing_men:	   
dancing_women	:dancing_women:	   
dango	:dango:	   
dark_sunglasses	:dark_sunglasses:	   
dart	:dart:	   
dash	:dash:	   
date	:date:	   
deciduous_tree	:deciduous_tree:	   
deer	:deer:	   
department_store	:department_store:	   
derelict_house	:derelict_house:	   
desert	:desert:	   
desert_island	:desert_island:	   
desktop_computer	:desktop_computer:	   
male_detective	:male_detective:	   
diamond_shape_with_a_dot_inside	:diamond_shape_with_a_dot_inside:	   
diamonds	:diamonds:	   
disappointed	:disappointed:	   
disappointed_relieved	:disappointed_relieved:	   
dizzy	:dizzy:	   
dizzy_face	:dizzy_face:	   
do_not_litter	:do_not_litter:	   
dog	:dog:	   
dog2	:dog2:	   
dollar	:dollar:	   
dolls	:dolls:	   
dolphin	:dolphin:	   
door	:door:	   
doughnut	:doughnut:	   
dove	:dove:	   
dragon	:dragon:	   
dragon_face	:dragon_face:	   
dress	:dress:	   
dromedary_camel	:dromedary_camel:	   
drooling_face	:drooling_face:	   
droplet	:droplet:	   
drum	:drum:	   
duck	:duck:	   
dvd	:dvd:	   
e-mail	:e-mail:	   
eagle	:eagle:	   
ear	:ear:	   
ear_of_rice	:ear_of_rice:	   
earth_africa	:earth_africa:	   
earth_americas	:earth_americas:	   
earth_asia	:earth_asia:	   
egg	:egg:	   
eggplant	:eggplant:	   
eight_pointed_black_star	:eight_pointed_black_star:	   
eight_spoked_asterisk	:eight_spoked_asterisk:	   
electric_plug	:electric_plug:	   
elephant	:elephant:	   
email	:email:	   
end	:end:	   
email	:email:	   
envelope_with_arrow	:envelope_with_arrow:	   
euro	:euro:	   
european_castle	:european_castle:	   
european_post_office	:european_post_office:	   
evergreen_tree	:evergreen_tree:	   
exclamation	:exclamation:	   
expressionless	:expressionless:	   
eye	:eye:	   
eye_speech_bubble	:eye_speech_bubble:	   
eyeglasses	:eyeglasses:	   
eyes	:eyes:	   
face_with_head_bandage	:face_with_head_bandage:	   
face_with_thermometer	:face_with_thermometer:	   
fist_oncoming	:fist_oncoming:	   
factory	:factory:	   
fallen_leaf	:fallen_leaf:	   
family_man_woman_boy	:family_man_woman_boy:	   
family_man_boy	:family_man_boy:	   
family_man_boy_boy	:family_man_boy_boy:	   
family_man_girl	:family_man_girl:	   
family_man_girl_boy	:family_man_girl_boy:	   
family_man_girl_girl	:family_man_girl_girl:	   
family_man_man_boy	:family_man_man_boy:	   
family_man_man_boy_boy	:family_man_man_boy_boy:	   
family_man_man_girl	:family_man_man_girl:	   
family_man_man_girl_boy	:family_man_man_girl_boy:	   
family_man_man_girl_girl	:family_man_man_girl_girl:	   
family_man_woman_boy	:family_man_woman_boy:	   
family_man_woman_boy_boy	:family_man_woman_boy_boy:	   
family_man_woman_girl	:family_man_woman_girl:	   
family_man_woman_girl_boy	:family_man_woman_girl_boy:	   
family_man_woman_girl_girl	:family_man_woman_girl_girl:	   
family_woman_boy	:family_woman_boy:	   
family_woman_boy_boy	:family_woman_boy_boy:	   
family_woman_girl	:family_woman_girl:	   
family_woman_girl_boy	:family_woman_girl_boy:	   
family_woman_girl_girl	:family_woman_girl_girl:	   
family_woman_woman_boy	:family_woman_woman_boy:	   
family_woman_woman_boy_boy	:family_woman_woman_boy_boy:	   
family_woman_woman_girl	:family_woman_woman_girl:	   
family_woman_woman_girl_boy	:family_woman_woman_girl_boy:	   
family_woman_woman_girl_girl	:family_woman_woman_girl_girl:	   
fast_forward	:fast_forward:	   
fax	:fax:	   
fearful	:fearful:	   
feet	:feet:	   
female_detective	:female_detective:	   
ferris_wheel	:ferris_wheel:	   
ferry	:ferry:	   
field_hockey	:field_hockey:	   
file_cabinet	:file_cabinet:	   
file_folder	:file_folder:	   
film_projector	:film_projector:	   
film_strip	:film_strip:	   
fire	:fire:	   
fire_engine	:fire_engine:	   
fireworks	:fireworks:	   
first_quarter_moon	:first_quarter_moon:	   
first_quarter_moon_with_face	:first_quarter_moon_with_face:	   
fish	:fish:	   
fish_cake	:fish_cake:	   
fishing_pole_and_fish	:fishing_pole_and_fish:	   
fist_raised	:fist_raised:	   
fist_left	:fist_left:	   
fist_oncoming	:fist_oncoming:	   
fist_raised	:fist_raised:	   
fist_right	:fist_right:	   
flags	:flags:	   
flashlight	:flashlight:	   
fleur_de_lis	:fleur_de_lis:	   
flight_arrival	:flight_arrival:	   
flight_departure	:flight_departure:	   
dolphin	:dolphin:	   
floppy_disk	:floppy_disk:	   
flower_playing_cards	:flower_playing_cards:	   
flushed	:flushed:	   
fog	:fog:	   
foggy	:foggy:	   
football	:football:	   
footprints	:footprints:	   
fork_and_knife	:fork_and_knife:	   
fountain	:fountain:	   
fountain_pen	:fountain_pen:	   
four_leaf_clover	:four_leaf_clover:	   
fox_face	:fox_face:	   
framed_picture	:framed_picture:	   
free	:free:	   
fried_egg	:fried_egg:	   
fried_shrimp	:fried_shrimp:	   
fries	:fries:	   
frog	:frog:	   
frowning	:frowning:	   
frowning_face	:frowning_face:	   
frowning_man	:frowning_man:	   
frowning_woman	:frowning_woman:	   
middle_finger	:middle_finger:	   
fuelpump	:fuelpump:	   
full_moon	:full_moon:	   
full_moon_with_face	:full_moon_with_face:	   
funeral_urn	:funeral_urn:	   
game_die	:game_die:	   
gear	:gear:	   
gem	:gem:	   
gemini	:gemini:	   
ghost	:ghost:	   
gift	:gift:	   
gift_heart	:gift_heart:	   
girl	:girl:	   
globe_with_meridians	:globe_with_meridians:	   
goal_net	:goal_net:	   
goat	:goat:	   
golf	:golf:	   
golfing_man	:golfing_man:	   
golfing_woman	:golfing_woman:	   
gorilla	:gorilla:	   
grapes	:grapes:	   
green_apple	:green_apple:	   
green_book	:green_book:	   
green_heart	:green_heart:	   
green_salad	:green_salad:	   
grey_exclamation	:grey_exclamation:	   
grey_question	:grey_question:	   
grimacing	:grimacing:	   
grin	:grin:	   
grinning	:grinning:	   
guardsman	:guardsman:	   
guardswoman	:guardswoman:	   
guitar	:guitar:	   
gun	:gun:	   
haircut_woman	:haircut_woman:	   
haircut_man	:haircut_man:	   
haircut_woman	:haircut_woman:	   
hamburger	:hamburger:	   
hammer	:hammer:	   
hammer_and_pick	:hammer_and_pick:	   
hammer_and_wrench	:hammer_and_wrench:	   
hamster	:hamster:	   
hand	:hand:	   
handbag	:handbag:	   
handshake	:handshake:	   
hankey	:hankey:	   
hatched_chick	:hatched_chick:	   
hatching_chick	:hatching_chick:	   
headphones	:headphones:	   
hear_no_evil	:hear_no_evil:	   
heart	:heart:	   
heart_decoration	:heart_decoration:	   
heart_eyes	:heart_eyes:	   
heart_eyes_cat	:heart_eyes_cat:	   
heartbeat	:heartbeat:	   
heartpulse	:heartpulse:	   
hearts	:hearts:	   
heavy_check_mark	:heavy_check_mark:	   
heavy_division_sign	:heavy_division_sign:	   
heavy_dollar_sign	:heavy_dollar_sign:	   
exclamation	:exclamation:	   
heavy_heart_exclamation	:heavy_heart_exclamation:	   
heavy_minus_sign	:heavy_minus_sign:	   
heavy_multiplication_x	:heavy_multiplication_x:	   
heavy_plus_sign	:heavy_plus_sign:	   
helicopter	:helicopter:	   
herb	:herb:	   
hibiscus	:hibiscus:	   
high_brightness	:high_brightness:	   
high_heel	:high_heel:	   
hocho	:hocho:	   
hole	:hole:	   
honey_pot	:honey_pot:	   
bee	:bee:	   
horse	:horse:	   
horse_racing	:horse_racing:	   
hospital	:hospital:	   
hot_pepper	:hot_pepper:	   
hotdog	:hotdog:	   
hotel	:hotel:	   
hotsprings	:hotsprings:	   
hourglass	:hourglass:	   
hourglass_flowing_sand	:hourglass_flowing_sand:	   
house	:house:	   
house_with_garden	:house_with_garden:	   
houses	:houses:	   
hugs	:hugs:	   
hushed	:hushed:	   
ice_cream	:ice_cream:	   
ice_hockey	:ice_hockey:	   
ice_skate	:ice_skate:	   
icecream	:icecream:	   
id	:id:	   
ideograph_advantage	:ideograph_advantage:	   
imp	:imp:	   
inbox_tray	:inbox_tray:	   
incoming_envelope	:incoming_envelope:	   
tipping_hand_woman	:tipping_hand_woman:	   
information_source	:information_source:	   
innocent	:innocent:	   
interrobang	:interrobang:	   
iphone	:iphone:	   
izakaya_lantern	:izakaya_lantern:	   
jack_o_lantern	:jack_o_lantern:	   
japan	:japan:	   
japanese_castle	:japanese_castle:	   
japanese_goblin	:japanese_goblin:	   
japanese_ogre	:japanese_ogre:	   
jeans	:jeans:	   
joy	:joy:	   
joy_cat	:joy_cat:	   
joystick	:joystick:	   
kaaba	:kaaba:	   
key	:key:	   
keyboard	:keyboard:	   
keycap_ten	:keycap_ten:	   
kick_scooter	:kick_scooter:	   
kimono	:kimono:	   
kiss	:kiss:	   
kissing	:kissing:	   
kissing_cat	:kissing_cat:	   
kissing_closed_eyes	:kissing_closed_eyes:	   
kissing_heart	:kissing_heart:	   
kissing_smiling_eyes	:kissing_smiling_eyes:	   
kiwi_fruit	:kiwi_fruit:	   
hocho	:hocho:	   
koala	:koala:	   
koko	:koko:	   
label	:label:	   
izakaya_lantern	:izakaya_lantern:	   
large_blue_circle	:large_blue_circle:	   
large_blue_diamond	:large_blue_diamond:	   
large_orange_diamond	:large_orange_diamond:	   
last_quarter_moon	:last_quarter_moon:	   
last_quarter_moon_with_face	:last_quarter_moon_with_face:	   
latin_cross	:latin_cross:	   
laughing	:laughing:	   
leaves	:leaves:	   
ledger	:ledger:	   
left_luggage	:left_luggage:	   
left_right_arrow	:left_right_arrow:	   
leftwards_arrow_with_hook	:leftwards_arrow_with_hook:	   
lemon	:lemon:	   
leo	:leo:	   
leopard	:leopard:	   
level_slider	:level_slider:	   
libra	:libra:	   
light_rail	:light_rail:	   
link	:link:	   
lion	:lion:	   
lips	:lips:	   
lipstick	:lipstick:	   
lizard	:lizard:	   
lock	:lock:	   
lock_with_ink_pen	:lock_with_ink_pen:	   
lollipop	:lollipop:	   
loop	:loop:	   
loud_sound	:loud_sound:	   
loudspeaker	:loudspeaker:	   
love_hotel	:love_hotel:	   
love_letter	:love_letter:	   
low_brightness	:low_brightness:	   
lying_face	:lying_face:	   
m	:m:	   
mag	:mag:	   
mag_right	:mag_right:	   
mahjong	:mahjong:	   
mailbox	:mailbox:	   
mailbox_closed	:mailbox_closed:	   
mailbox_with_mail	:mailbox_with_mail:	   
mailbox_with_no_mail	:mailbox_with_no_mail:	   
male_detective	:male_detective:	   
man	:man:	   
man_artist	:man_artist:	   
man_astronaut	:man_astronaut:	   
man_cartwheeling	:man_cartwheeling:	   
man_cook	:man_cook:	   
man_dancing	:man_dancing:	   
man_facepalming	:man_facepalming:	   
man_factory_worker	:man_factory_worker:	   
man_farmer	:man_farmer:	   
man_firefighter	:man_firefighter:	   
man_health_worker	:man_health_worker:	   
man_in_tuxedo	:man_in_tuxedo:	   
man_judge	:man_judge:	   
man_juggling	:man_juggling:	   
man_mechanic	:man_mechanic:	   
man_office_worker	:man_office_worker:	   
man_pilot	:man_pilot:	   
man_playing_handball	:man_playing_handball:	   
man_playing_water_polo	:man_playing_water_polo:	   
man_scientist	:man_scientist:	   
man_shrugging	:man_shrugging:	   
man_singer	:man_singer:	   
man_student	:man_student:	   
man_teacher	:man_teacher:	   
man_technologist	:man_technologist:	   
man_with_gua_pi_mao	:man_with_gua_pi_mao:	   
man_with_turban	:man_with_turban:	   
tangerine	:tangerine:	   
mans_shoe	:mans_shoe:	   
mantelpiece_clock	:mantelpiece_clock:	   
maple_leaf	:maple_leaf:	   
martial_arts_uniform	:martial_arts_uniform:	   
mask	:mask:	   
massage_woman	:massage_woman:	   
massage_man	:massage_man:	   
massage_woman	:massage_woman:	   
meat_on_bone	:meat_on_bone:	   
medal_military	:medal_military:	   
medal_sports	:medal_sports:	   
mega	:mega:	   
melon	:melon:	   
memo	:memo:	   
men_wrestling	:men_wrestling:	   
menorah	:menorah:	   
mens	:mens:	   
metal	:metal:	   
metro	:metro:	   
microphone	:microphone:	   
microscope	:microscope:	   
middle_finger	:middle_finger:	   
milk_glass	:milk_glass:	   
milky_way	:milky_way:	   
minibus	:minibus:	   
minidisc	:minidisc:	   
mobile_phone_off	:mobile_phone_off:	   
money_mouth_face	:money_mouth_face:	   
money_with_wings	:money_with_wings:	   
moneybag	:moneybag:	   
monkey	:monkey:	   
monkey_face	:monkey_face:	   
monorail	:monorail:	   
moon	:moon:	   
mortar_board	:mortar_board:	   
mosque	:mosque:	   
motor_boat	:motor_boat:	   
motor_scooter	:motor_scooter:	   
motorcycle	:motorcycle:	   
motorway	:motorway:	   
mount_fuji	:mount_fuji:	   
mountain	:mountain:	   
mountain_biking_man	:mountain_biking_man:	   
mountain_biking_man	:mountain_biking_man:	   
mountain_biking_woman	:mountain_biking_woman:	   
mountain_cableway	:mountain_cableway:	   
mountain_railway	:mountain_railway:	   
mountain_snow	:mountain_snow:	   
mouse	:mouse:	   
mouse2	:mouse2:	   
movie_camera	:movie_camera:	   
moyai	:moyai:	   
mrs_claus	:mrs_claus:	   
muscle	:muscle:	   
mushroom	:mushroom:	   
musical_keyboard	:musical_keyboard:	   
musical_note	:musical_note:	   
musical_score	:musical_score:	   
mute	:mute:	   
nail_care	:nail_care:	   
name_badge	:name_badge:	   
national_park	:national_park:	   
nauseated_face	:nauseated_face:	   
necktie	:necktie:	   
negative_squared_cross_mark	:negative_squared_cross_mark:	   
nerd_face	:nerd_face:	   
neutral_face	:neutral_face:	   
new	:new:	   
new_moon	:new_moon:	   
new_moon_with_face	:new_moon_with_face:	   
newspaper	:newspaper:	   
newspaper_roll	:newspaper_roll:	   
next_track_button	:next_track_button:	   
ng	:ng:	   
no_good_man	:no_good_man:	   
no_good_woman	:no_good_woman:	   
night_with_stars	:night_with_stars:	   
no_bell	:no_bell:	   
no_bicycles	:no_bicycles:	   
no_entry	:no_entry:	   
no_entry_sign	:no_entry_sign:	   
no_good_woman	:no_good_woman:	   
no_good_man	:no_good_man:	   
no_good_woman	:no_good_woman:	   
no_mobile_phones	:no_mobile_phones:	   
no_mouth	:no_mouth:	   
no_pedestrians	:no_pedestrians:	   
no_smoking	:no_smoking:	   
non-potable_water	:non-potable_water:	   
nose	:nose:	   
notebook	:notebook:	   
notebook_with_decorative_cover	:notebook_with_decorative_cover:	   
notes	:notes:	   
nut_and_bolt	:nut_and_bolt:	   
o	:o:	   
o2	:o2:	   
ocean	:ocean:	   
octocat	:octocat:	   
octopus	:octopus:	   
oden	:oden:	   
office	:office:	   
oil_drum	:oil_drum:	   
ok	:ok:	   
ok_hand	:ok_hand:	   
ok_man	:ok_man:	   
ok_woman	:ok_woman:	   
old_key	:old_key:	   
older_man	:older_man:	   
older_woman	:older_woman:	   
om	:om:	   
on	:on:	   
oncoming_automobile	:oncoming_automobile:	   
oncoming_bus	:oncoming_bus:	   
oncoming_police_car	:oncoming_police_car:	   
oncoming_taxi	:oncoming_taxi:	   
book	:book:	   
open_file_folder	:open_file_folder:	   
open_hands	:open_hands:	   
open_mouth	:open_mouth:	   
open_umbrella	:open_umbrella:	   
ophiuchus	:ophiuchus:	   
tangerine	:tangerine:	   
orange_book	:orange_book:	   
orthodox_cross	:orthodox_cross:	   
outbox_tray	:outbox_tray:	   
owl	:owl:	   
ox	:ox:	   
package	:package:	   
page_facing_up	:page_facing_up:	   
page_with_curl	:page_with_curl:	   
pager	:pager:	   
paintbrush	:paintbrush:	   
palm_tree	:palm_tree:	   
pancakes	:pancakes:	   
panda_face	:panda_face:	   
paperclip	:paperclip:	   
paperclips	:paperclips:	   
parasol_on_ground	:parasol_on_ground:	   
parking	:parking:	   
part_alternation_mark	:part_alternation_mark:	   
partly_sunny	:partly_sunny:	   
passenger_ship	:passenger_ship:	   
passport_control	:passport_control:	   
pause_button	:pause_button:	   
feet	:feet:	   
peace_symbol	:peace_symbol:	   
peach	:peach:	   
peanuts	:peanuts:	   
pear	:pear:	   
pen	:pen:	   
memo	:memo:	   
pencil2	:pencil2:	   
penguin	:penguin:	   
pensive	:pensive:	   
performing_arts	:performing_arts:	   
persevere	:persevere:	   
person_fencing	:person_fencing:	   
frowning_woman	:frowning_woman:	   
blonde_man	:blonde_man:	   
pouting_woman	:pouting_woman:	   
phone	:phone:	   
pick	:pick:	   
pig	:pig:	   
pig2	:pig2:	   
pig_nose	:pig_nose:	   
pill	:pill:	   
pineapple	:pineapple:	   
ping_pong	:ping_pong:	   
pisces	:pisces:	   
pizza	:pizza:	   
place_of_worship	:place_of_worship:	   
plate_with_cutlery	:plate_with_cutlery:	   
play_or_pause_button	:play_or_pause_button:	   
point_down	:point_down:	   
point_left	:point_left:	   
point_right	:point_right:	   
point_up	:point_up:	   
point_up_2	:point_up_2:	   
police_car	:police_car:	   
policeman	:policeman:	   
policewoman	:policewoman:	   
poodle	:poodle:	   
hankey	:hankey:	   
popcorn	:popcorn:	   
post_office	:post_office:	   
postal_horn	:postal_horn:	   
postbox	:postbox:	   
potable_water	:potable_water:	   
potato	:potato:	   
pouch	:pouch:	   
poultry_leg	:poultry_leg:	   
pound	:pound:	   
rage	:rage:	   
pouting_cat	:pouting_cat:	   
pouting_man	:pouting_man:	   
pouting_woman	:pouting_woman:	   
pray	:pray:	   
prayer_beads	:prayer_beads:	   
pregnant_woman	:pregnant_woman:	   
previous_track_button	:previous_track_button:	   
prince	:prince:	   
princess	:princess:	   
printer	:printer:	   
fist_oncoming	:fist_oncoming:	   
purple_heart	:purple_heart:	   
purse	:purse:	   
pushpin	:pushpin:	   
put_litter_in_its_place	:put_litter_in_its_place:	   
question	:question:	   
rabbit	:rabbit:	   
rabbit2	:rabbit2:	   
racehorse	:racehorse:	   
racing_car	:racing_car:	   
radio	:radio:	   
radio_button	:radio_button:	   
radioactive	:radioactive:	   
rage	:rage:	   
railway_car	:railway_car:	   
railway_track	:railway_track:	   
rainbow	:rainbow:	   
rainbow_flag	:rainbow_flag:	   
raised_back_of_hand	:raised_back_of_hand:	   
hand	:hand:	   
raised_hand_with_fingers_splayed	:raised_hand_with_fingers_splayed:	   
raised_hands	:raised_hands:	   
raising_hand_woman	:raising_hand_woman:	   
raising_hand_man	:raising_hand_man:	   
raising_hand_woman	:raising_hand_woman:	   
ram	:ram:	   
ramen	:ramen:	   
rat	:rat:	   
record_button	:record_button:	   
recycle	:recycle:	   
car	:car:	   
red_circle	:red_circle:	   
registered	:registered:	   
relaxed	:relaxed:	   
relieved	:relieved:	   
reminder_ribbon	:reminder_ribbon:	   
repeat	:repeat:	   
repeat_one	:repeat_one:	   
rescue_worker_helmet	:rescue_worker_helmet:	   
restroom	:restroom:	   
revolving_hearts	:revolving_hearts:	   
rewind	:rewind:	   
rhinoceros	:rhinoceros:	   
ribbon	:ribbon:	   
rice	:rice:	   
rice_ball	:rice_ball:	   
rice_cracker	:rice_cracker:	   
rice_scene	:rice_scene:	   
right_anger_bubble	:right_anger_bubble:	   
ring	:ring:	   
robot	:robot:	   
rocket	:rocket:	   
rofl	:rofl:	   
roll_eyes	:roll_eyes:	   
roller_coaster	:roller_coaster:	   
rooster	:rooster:	   
rose	:rose:	   
rosette	:rosette:	   
rotating_light	:rotating_light:	   
round_pushpin	:round_pushpin:	   
rowing_man	:rowing_man:	   
rowing_man	:rowing_man:	   
rowing_woman	:rowing_woman:	   
rugby_football	:rugby_football:	   
running_man	:running_man:	   
running_man	:running_man:	   
running_man	:running_man:	   
running_shirt_with_sash	:running_shirt_with_sash:	   
running_woman	:running_woman:	   
sa	:sa:	   
sagittarius	:sagittarius:	   
boat	:boat:	   
sake	:sake:	   
sandal	:sandal:	   
santa	:santa:	   
satellite	:satellite:	   
laughing	:laughing:	   
saxophone	:saxophone:	   
school	:school:	   
school_satchel	:school_satchel:	   
scissors	:scissors:	   
scorpion	:scorpion:	   
scorpius	:scorpius:	   
scream	:scream:	   
scream_cat	:scream_cat:	   
scroll	:scroll:	   
seat	:seat:	   
secret	:secret:	   
see_no_evil	:see_no_evil:	   
seedling	:seedling:	   
selfie	:selfie:	   
shallow_pan_of_food	:shallow_pan_of_food:	   
shamrock	:shamrock:	   
shark	:shark:	   
shaved_ice	:shaved_ice:	   
sheep	:sheep:	   
shell	:shell:	   
shield	:shield:	   
shinto_shrine	:shinto_shrine:	   
ship	:ship:	   
shirt	:shirt:	   
hankey	:hankey:	   
mans_shoe	:mans_shoe:	   
shopping	:shopping:	   
shopping_cart	:shopping_cart:	   
shower	:shower:	   
shrimp	:shrimp:	   
signal_strength	:signal_strength:	   
six_pointed_star	:six_pointed_star:	   
ski	:ski:	   
skier	:skier:	   
skull	:skull:	   
skull_and_crossbones	:skull_and_crossbones:	   
sleeping	:sleeping:	   
sleeping_bed	:sleeping_bed:	   
sleepy	:sleepy:	   
slightly_frowning_face	:slightly_frowning_face:	   
slightly_smiling_face	:slightly_smiling_face:	   
slot_machine	:slot_machine:	   
small_airplane	:small_airplane:	   
small_blue_diamond	:small_blue_diamond:	   
small_orange_diamond	:small_orange_diamond:	   
small_red_triangle	:small_red_triangle:	   
small_red_triangle_down	:small_red_triangle_down:	   
smile	:smile:	   
smile_cat	:smile_cat:	   
smiley	:smiley:	   
smiley_cat	:smiley_cat:	   
smiling_imp	:smiling_imp:	   
smirk	:smirk:	   
smirk_cat	:smirk_cat:	   
smoking	:smoking:	   
snail	:snail:	   
snake	:snake:	   
sneezing_face	:sneezing_face:	   
snowboarder	:snowboarder:	   
snowflake	:snowflake:	   
snowman	:snowman:	   
snowman_with_snow	:snowman_with_snow:	   
sob	:sob:	   
soccer	:soccer:	   
soon	:soon:	   
sos	:sos:	   
sound	:sound:	   
space_invader	:space_invader:	   
spades	:spades:	   
spaghetti	:spaghetti:	   
sparkle	:sparkle:	   
sparkler	:sparkler:	   
sparkles	:sparkles:	   
sparkling_heart	:sparkling_heart:	   
speak_no_evil	:speak_no_evil:	   
speaker	:speaker:	   
speaking_head	:speaking_head:	   
speech_balloon	:speech_balloon:	   
speedboat	:speedboat:	   
spider	:spider:	   
spider_web	:spider_web:	   
spiral_calendar	:spiral_calendar:	   
spiral_notepad	:spiral_notepad:	   
spoon	:spoon:	   
squid	:squid:	   
stadium	:stadium:	   
star	:star:	   
star2	:star2:	   
star_and_crescent	:star_and_crescent:	   
star_of_david	:star_of_david:	   
stars	:stars:	   
station	:station:	   
statue_of_liberty	:statue_of_liberty:	   
steam_locomotive	:steam_locomotive:	   
stew	:stew:	   
stop_button	:stop_button:	   
stop_sign	:stop_sign:	   
stopwatch	:stopwatch:	   
straight_ruler	:straight_ruler:	   
strawberry	:strawberry:	   
stuck_out_tongue	:stuck_out_tongue:	   
stuck_out_tongue_closed_eyes	:stuck_out_tongue_closed_eyes:	   
stuck_out_tongue_winking_eye	:stuck_out_tongue_winking_eye:	   
studio_microphone	:studio_microphone:	   
stuffed_flatbread	:stuffed_flatbread:	   
sun_behind_large_cloud	:sun_behind_large_cloud:	   
sun_behind_rain_cloud	:sun_behind_rain_cloud:	   
sun_behind_small_cloud	:sun_behind_small_cloud:	   
sun_with_face	:sun_with_face:	   
sunflower	:sunflower:	   
sunglasses	:sunglasses:	   
sunny	:sunny:	   
sunrise	:sunrise:	   
sunrise_over_mountains	:sunrise_over_mountains:	   
surfing_man	:surfing_man:	   
surfing_man	:surfing_man:	   
surfing_woman	:surfing_woman:	   
sushi	:sushi:	   
suspension_railway	:suspension_railway:	   
sweat	:sweat:	   
sweat_drops	:sweat_drops:	   
sweat_smile	:sweat_smile:	   
sweet_potato	:sweet_potato:	   
swimming_man	:swimming_man:	   
swimming_man	:swimming_man:	   
swimming_woman	:swimming_woman:	   
symbols	:symbols:	   
synagogue	:synagogue:	   
syringe	:syringe:	   
taco	:taco:	   
tada	:tada:	   
tanabata_tree	:tanabata_tree:	   
tangerine	:tangerine:	   
taurus	:taurus:	   
taxi	:taxi:	   
tea	:tea:	   
phone	:phone:	   
telephone_receiver	:telephone_receiver:	   
telescope	:telescope:	   
tennis	:tennis:	   
tent	:tent:	   
thermometer	:thermometer:	   
thinking	:thinking:	   
thought_balloon	:thought_balloon:	   
-1	:-1:	   
1	:+1:	   
ticket	:ticket:	   
tickets	:tickets:	   
tiger	:tiger:	   
tiger2	:tiger2:	   
timer_clock	:timer_clock:	   
tipping_hand_man	:tipping_hand_man:	   
tipping_hand_woman	:tipping_hand_woman:	   
tired_face	:tired_face:	   
tm	:tm:	   
toilet	:toilet:	   
tokyo_tower	:tokyo_tower:	   
tomato	:tomato:	   
tongue	:tongue:	   
top	:top:	   
tophat	:tophat:	   
tornado	:tornado:	   
trackball	:trackball:	   
tractor	:tractor:	   
traffic_light	:traffic_light:	   
train	:train:	   
train2	:train2:	   
tram	:tram:	   
triangular_flag_on_post	:triangular_flag_on_post:	   
triangular_ruler	:triangular_ruler:	   
trident	:trident:	   
triumph	:triumph:	   
trolleybus	:trolleybus:	   
trophy	:trophy:	   
tropical_drink	:tropical_drink:	   
tropical_fish	:tropical_fish:	   
truck	:truck:	   
trumpet	:trumpet:	   
shirt	:shirt:	   
tulip	:tulip:	   
tumbler_glass	:tumbler_glass:	   
turkey	:turkey:	   
turtle	:turtle:	   
tv	:tv:	   
twisted_rightwards_arrows	:twisted_rightwards_arrows:	   
two_hearts	:two_hearts:	   
two_men_holding_hands	:two_men_holding_hands:	   
two_women_holding_hands	:two_women_holding_hands:	   
u5272	:u5272:	   
u5408	:u5408:	   
u55b6	:u55b6:	   
u6307	:u6307:	   
u6708	:u6708:	   
u6709	:u6709:	   
u6e80	:u6e80:	   
u7121	:u7121:	   
u7533	:u7533:	   
u7981	:u7981:	   
u7a7a	:u7a7a:	   
umbrella	:umbrella:	   
unamused	:unamused:	   
underage	:underage:	   
unicorn	:unicorn:	   
unlock	:unlock:	   
up	:up:	   
upside_down_face	:upside_down_face:	   
v	:v:	   
vertical_traffic_light	:vertical_traffic_light:	   
vhs	:vhs:	   
vibration_mode	:vibration_mode:	   
video_camera	:video_camera:	   
video_game	:video_game:	   
violin	:violin:	   
virgo	:virgo:	   
volcano	:volcano:	   
volleyball	:volleyball:	   
vs	:vs:	   
vulcan_salute	:vulcan_salute:	   
walking_man	:walking_man:	   
walking_man	:walking_man:	   
walking_woman	:walking_woman:	   
waning_crescent_moon	:waning_crescent_moon:	   
waning_gibbous_moon	:waning_gibbous_moon:	   
warning	:warning:	   
wastebasket	:wastebasket:	   
watch	:watch:	   
water_buffalo	:water_buffalo:	   
watermelon	:watermelon:	   
wave	:wave:	   
wavy_dash	:wavy_dash:	   
waxing_crescent_moon	:waxing_crescent_moon:	   
moon	:moon:	   
wc	:wc:	   
weary	:weary:	   
wedding	:wedding:	   
weight_lifting_man	:weight_lifting_man:	   
weight_lifting_woman	:weight_lifting_woman:	   
whale	:whale:	   
whale2	:whale2:	   
wheel_of_dharma	:wheel_of_dharma:	   
wheelchair	:wheelchair:	   
white_check_mark	:white_check_mark:	   
white_circle	:white_circle:	   
white_flag	:white_flag:	   
white_flower	:white_flower:	   
white_large_square	:white_large_square:	   
white_medium_small_square	:white_medium_small_square:	   
white_medium_square	:white_medium_square:	   
white_small_square	:white_small_square:	   
white_square_button	:white_square_button:	   
wilted_flower	:wilted_flower:	   
wind_chime	:wind_chime:	   
wind_face	:wind_face:	   
wine_glass	:wine_glass:	   
wink	:wink:	   
wolf	:wolf:	   
woman	:woman:	   
woman_artist	:woman_artist:	   
woman_astronaut	:woman_astronaut:	   
woman_cartwheeling	:woman_cartwheeling:	   
woman_cook	:woman_cook:	   
woman_facepalming	:woman_facepalming:	   
woman_factory_worker	:woman_factory_worker:	   
woman_farmer	:woman_farmer:	   
woman_firefighter	:woman_firefighter:	   
woman_health_worker	:woman_health_worker:	   
woman_judge	:woman_judge:	   
woman_juggling	:woman_juggling:	   
woman_mechanic	:woman_mechanic:	   
woman_office_worker	:woman_office_worker:	   
woman_pilot	:woman_pilot:	   
woman_playing_handball	:woman_playing_handball:	   
woman_playing_water_polo	:woman_playing_water_polo:	   
woman_scientist	:woman_scientist:	   
woman_shrugging	:woman_shrugging:	   
woman_singer	:woman_singer:	   
woman_student	:woman_student:	   
woman_teacher	:woman_teacher:	   
woman_technologist	:woman_technologist:	   
woman_with_turban	:woman_with_turban:	   
womans_clothes	:womans_clothes:	   
womans_hat	:womans_hat:	   
women_wrestling	:women_wrestling:	   
womens	:womens:	   
world_map	:world_map:	   
worried	:worried:	   
wrench	:wrench:	   
writing_hand	:writing_hand:	   
x	:x:	   
yellow_heart	:yellow_heart:	   
yen	:yen:	   
yin_yang	:yin_yang:	   
yum	:yum:	   
zap	:zap:	   
zipper_mouth_face	:zipper_mouth_face:	   
zzz	:zzz:	   
