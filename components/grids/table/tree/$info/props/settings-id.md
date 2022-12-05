Свойство **settingsId** задает имя, которое используется при чтении или сохранении некоторых текущих настроек компонента в локальном хранилище.

При создании компонента это свойство задается по умолчанию равным названию тэга компонента. В данном случае это **oda-tree**. Сами дополнительные настройки хранятся в локальном хранилище **localStorage** с ключом по имени аттрибута **is** компонента.

В качестве дополнительных настроек в хранилище сохраняются:

1. Видимость столбца (hidden).
1. Порядок столбца (order).

Если на странице используются два или более компонентов дерева, то эти настройки могут пересекаться друг с другом, так как ключ и путь к настройка внутри хранилища будут совпадать и иметь одно и тоже значения **oda-tree**. В этом случае для разных компонентов можно задать другое уникальное имя в свойстве **settingsId**, идущее в хранилище сразу после имени компонента.

В компоненте дерева используется только один столбец таблицы, он всегда видим и не изменяет свой порядок. Поэтому для деревьев это свойство никак не используется.