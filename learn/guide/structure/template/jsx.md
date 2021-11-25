JSX — это раздел шаблона компонента, предназначенный для указания его HTML-содержимого

```info_md
При парсинге, с помощью специальной функции ParseJSX, содержимое этого раздела автоматически преобразуется в HTML-формат отображения компонента в браузере, с учетом всех заданных реактивных особенностей его элементов.
```

В JSX-шаблоне можно:

1. Задавать нативные HTML-элементы.
1. Осуществлять биндинг свойств.
1. Указывать обработчики событий.
1. Использовать специальные директивы.
1. Указывать текстовые выражения.

JSX – это препроцессор, который добавляет синтаксис XML к JavaScript. Вы можете использовать React без JSX, но JSX делает React более элегантным.
JSX – синтаксис, похожий на XML / HTML, используемый в React, расширяет ECMAScript, так что XML / HTML-подобный текст может сосуществовать с кодом JavaScript / React. Синтаксис предназначен для использования препроцессорами (т. е. транспилерами, такими как Babel), чтобы преобразовать HTML-подобный текст, найденный в файлах JavaScript, в стандартные объекты JavaScript, которые будут анализировать движок JavaScript.

В основном, используя JSX, вы можете писать сжатые структуры HTML / XML (например, DOM подобные древовидные структуры) в том же файле, что и код JavaScript, а затем Babel преобразует эти выражения в код JavaScript. В отличие от прошлого, вместо того, чтобы помещать JavaScript в HTML, JSX позволяет нам помещать HTML в JavaScript.

Рассмотрим объявление переменной:

const element = <h1>Hello, world!</h1>;
Синтаксис этого смешного тега не является строкой HTML.
Он называется JSX, и это расширение синтаксиса JavaScript. Мы рекомендуем использовать его с React для описания того, как должен выглядеть пользовательский интерфейс. JSX может напомнить вам о языке шаблонов, но он поставляется с мощью JavaScript.
JSX создает «элементы» React. Мы рассмотрим рендеринг в DOM в следующем разделе. Ниже вы можете найти основы JSX, необходимые для начала работы.