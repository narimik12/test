const CATEGORIES = ['Все', 'Основы', 'Датчики', 'Моторы', 'Звук', 'Дисплеи'];

const COLORS = [
  { name: 'Чёрный',    hex: '#1a1a1a', digit: 0, mult: 1,    tol: null, temp: 250 },
  { name: 'Коричневый',hex: '#6b3f1d', digit: 1, mult: 10,   tol: 1,    temp: 100 },
  { name: 'Красный',   hex: '#d32f2f', digit: 2, mult: 100,  tol: 2,    temp: 50 },
  { name: 'Оранжевый', hex: '#ef6c00', digit: 3, mult: 1e3,  tol: null, temp: 15 },
  { name: 'Жёлтый',    hex: '#fbc02d', digit: 4, mult: 1e4,  tol: null, temp: 25 },
  { name: 'Зелёный',   hex: '#2e7d32', digit: 5, mult: 1e5,  tol: 0.5,  temp: 20 },
  { name: 'Синий',     hex: '#1565c0', digit: 6, mult: 1e6,  tol: 0.25, temp: 10 },
  { name: 'Фиолетовый',hex: '#7b1fa2', digit: 7, mult: 1e7,  tol: 0.1,  temp: 5 },
  { name: 'Серый',     hex: '#8a8a8a', digit: 8, mult: 1e8,  tol: 0.05, temp: 1 },
  { name: 'Белый',     hex: '#f5f5f5', digit: 9, mult: 1e9,  tol: null, temp: null },
  { name: 'Золотой',   hex: '#d4af37', digit: null,mult: 0.1, tol: 5,    temp: null },
  { name: 'Серебряный',hex: '#bfbfbf', digit: null,mult: 0.01,tol: 10,   temp: null }
];

const E24 = [1.0,1.1,1.2,1.3,1.5,1.6,1.8,2.0,2.2,2.4,2.7,3.0,3.3,3.6,3.9,4.3,4.7,5.1,5.6,6.2,6.8,7.5,8.2,9.1];

const PROJECTS = [
  {
    id: 'blink',
    title: 'Мигающий светодиод (Blink)',
    level: 'Новичок',
    category: 'Основы',
    time: '10 мин',
    icon: 'bulb',
    short: 'Встроенный светодиод на пине 13. Проверка связи с платой.',
    description: 'Самый простой способ убедиться, что плата работает и прошивается. Используется встроенный светодиод LED_BUILTIN (пин 13).',
    components: ['Arduino Uno / Nano', 'USB-кабель', 'Компьютер с Arduino IDE'],
    wiring: `
     [Arduino Uno]
          │
    ┌─────┴─────┐
    │  LED_BUILTIN │  ← уже на плате, пин 13
    │    (L)     │
    └─────────────┘
    `,
    steps: [
      { t: 'Подключите плату', d: 'USB-кабелем к компьютеру. Должен загореться зелёный LED ON.' },
      { t: 'Выберите плату и порт', d: 'Arduino IDE → Инструменты → Плата: Arduino Uno. Порт: тот, что появился при подключении (COM3, /dev/ttyUSB0 и т.д.).' },
      { t: 'Загрузите скетч', d: 'Скопируйте код ниже и нажмите «Загрузка» (Ctrl+U). Через 5–10 секунд светодиод L начнёт мигать.' }
    ],
    code: `// Проект: Blink
// Встроенный светодиод на пине 13 (LED_BUILTIN)

void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH);  // вкл
  delay(1000);                      // 1 сек
  digitalWrite(LED_BUILTIN, LOW);   // выкл
  delay(1000);                      // 1 сек
}`,
    tips: [
      'Если не прошивается — проверьте выбор порта в IDE.',
      'LED_BUILTIN = 13 на Uno/Nano.',
      'Попробуйте поменять delay() на 100 и 900 — получится несимметричный blink.'
    ]
  },
  {
    id: 'button-led',
    title: 'Кнопка управляет светодиодом',
    level: 'Новичок',
    category: 'Основы',
    time: '20 мин',
    icon: 'button',
    short: 'Чтение цифрового входа с подтяжкой INPUT_PULLUP.',
    description: 'Подключаем внешнюю тактовую кнопку к цифровому пину. Используем внутреннюю подтяжку, чтобы не ставить резистор на 10 кОм.',
    components: ['Arduino Uno', 'Тактовая кнопка', 'Светодиод 5 мм', 'Резистор 220 Ом', 'Макетная плата', 'Провода'],
    wiring: `
    [Arduino Uno]          [Кнопка]
         D2 ◄───────────┤ ├──┐
         GND ────────────┘    │
                              │
    [Светодиод]               │
         А ──[220Ω]── D13     │
         К ────────── GND     │
    `,
    steps: [
      { t: 'Соберите схему', d: 'Кнопка: один контакт на D2, другой на GND. Светодиод: анод через 220 Ом на D13, катод на GND.' },
      { t: 'Загрузите скетч', d: 'Скопируйте код и загрузите.' },
      { t: 'Проверьте', d: 'Нажмите кнопку — светодиод загорается. Отпустите — гаснет. В Serial Monitor (9600) отображается состояние.' }
    ],
    code: `// Проект: Кнопка + светодиод
const int BUTTON_PIN = 2;
const int LED_PIN    = 13;

void setup() {
  pinMode(LED_PIN, OUTPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  Serial.begin(9600);
}

void loop() {
  int state = digitalRead(BUTTON_PIN);
  if (state == LOW) {
    digitalWrite(LED_PIN, HIGH);
    Serial.println("Кнопка нажата");
  } else {
    digitalWrite(LED_PIN, LOW);
  }
  delay(20);  // антидребезг
}`,
    tips: [
      'INPUT_PULLUP подтягивает пин к 5 В внутренним резистором ~20–50 кОм. При замыкании на GND читается LOW.',
      '220 Ом — токоограничивающий резистор для LED. Без него сгорит пин или светодиод.',
      'delay(20) защищает от дребезга контактов. Для серьёзных задач используйте millis() или библиотеку Bounce2.'
    ]
  },
  {
    id: 'traffic-light',
    title: 'Светофор на трёх светодиодах',
    level: 'Новичок',
    category: 'Основы',
    time: '25 мин',
    icon: 'traffic',
    short: 'Массив пинов и функция allOff() для управления тремя выходами.',
    description: 'Три светодиода, три резистора, три пина. Учимся группировать однотипные выходы в массив и избегать дублирования кода.',
    components: ['Arduino Uno', '3 светодиода (R, Y, G)', '3 резистора 220 Ом', 'Макетная плата', 'Провода'],
    wiring: `
    [Arduino Uno]
         D8 ──[220Ω]── Красный LED ── GND
         D9 ──[220Ω]── Жёлтый LED ── GND
        D10 ──[220Ω]── Зелёный LED ── GND
    `,
    steps: [
      { t: 'Подключите светодиоды', d: 'Каждый анод через свой резистор на пин (8, 9, 10). Катоды на общую GND.' },
      { t: 'Загрузите код', d: 'Функция allOff() гасит все LED перед зажиганием следующего.' },
      { t: 'Настройте тайминги', d: 'Поменяйте задержки в loop() под ваши задачи.' }
    ],
    code: `// Проект: Светофор
const int RED    = 8;
const int YELLOW = 9;
const int GREEN  = 10;

void setup() {
  pinMode(RED, OUTPUT);
  pinMode(YELLOW, OUTPUT);
  pinMode(GREEN, OUTPUT);
}

void allOff() {
  digitalWrite(RED, LOW);
  digitalWrite(YELLOW, LOW);
  digitalWrite(GREEN, LOW);
}

void loop() {
  allOff(); digitalWrite(RED, HIGH);    delay(3000);
  allOff(); digitalWrite(YELLOW, HIGH); delay(1000);
  allOff(); digitalWrite(GREEN, HIGH);  delay(3000);
  allOff(); digitalWrite(YELLOW, HIGH); delay(1000);
}`,
    tips: [
      'allOff() избавляет от дублирования — если LED будет 6, менять код проще.',
      'Для реалистичного светофора добавьте задержку перед зелёным (все выключены 1–2 сек).',
      'Замените delay() на millis(), если нужно реагировать на кнопку во время свечения.'
    ]
  },
  {
    id: 'fade-led',
    title: 'Плавное затухание (PWM)',
    level: 'Новичок',
    category: 'Основы',
    time: '15 мин',
    icon: 'fade',
    short: 'ШИМ на пинах ~3, ~5, ~6, ~9, ~10, ~11. analogWrite(0–255).',
    description: 'ШИМ (Pulse Width Modulation) имитирует аналоговый сигнал прямоугольными импульсами. analogWrite() задаёт скважность: 0 = 0%, 255 = 100%.',
    components: ['Arduino Uno', 'Светодиод', 'Резистор 220 Ом', 'Провода'],
    wiring: `
    [Arduino Uno]
         D9 (~PWM) ──[220Ω]── LED ── GND
    `,
    steps: [
      { t: 'Подключите светодиод', d: 'Анод через 220 Ом на пин 9 (с меткой ~), катод на GND.' },
      { t: 'Загрузите скетч', d: 'LED плавно набирает яркость от 0 до 255 и обратно.' },
      { t: 'Поэкспериментируйте', d: 'Попробуйте шаг 1 и задержку 10 мс — получится более плавное мерцание.' }
    ],
    code: `// Проект: Плавное затухание (PWM)
const int LED_PIN = 9;  // пин с ~

void setup() {
  pinMode(LED_PIN, OUTPUT);
}

void loop() {
  for (int b = 0; b <= 255; b += 5) {
    analogWrite(LED_PIN, b);
    delay(30);
  }
  for (int b = 255; b >= 0; b -= 5) {
    analogWrite(LED_PIN, b);
    delay(30);
  }
}`,
    tips: [
      'analogWrite() работает только на пинах с тильдой (~): 3, 5, 6, 9, 10, 11.',
      'Частота ШИМ на Uno/Nano: ~490 Гц (пины 3, 9, 10, 11) и ~980 Гц (5, 6).',
      'Тот же принцип для управления скоростью мотора через MOSFET или яркостью LED-ленты.'
    ]
  },
  {
    id: 'ultrasonic',
    title: 'Дальномер HC-SR04',
    level: 'Средний',
    category: 'Датчики',
    time: '35 мин',
    icon: 'radar',
    short: 'Ультразвуковой датчик расстояния. TRIG и ECHO.',
    description: 'HC-SR04 излучает ультразвуковой импульс и ловит эхо. Измеряя время задержки, рассчитываем расстояние: s = (t × 0,0343) / 2. Диапазон 2–400 см.',
    components: ['Arduino Uno', 'HC-SR04', 'Макетная плата', 'Провода'],
    wiring: `
    [Arduino Uno]          [HC-SR04]
         5V ─────────────── VCC
        GND ─────────────── GND
         D9 ─────────────── TRIG
        D10 ─────────────── ECHO
    `,
    steps: [
      { t: 'Подключите датчик', d: 'VCC → 5V, GND → GND, TRIG → D9, ECHO → D10. На ECHO напряжение 5 В — для 3,3-вольтовых плат используйте делитель.' },
      { t: 'Загрузите скетч', d: 'Откройте Serial Monitor (9600 baud).' },
      { t: 'Проверьте', d: 'Подносите ладонь к датчику — расстояние в см меняется в реальном времени.' }
    ],
    code: `// Проект: Дальномер HC-SR04
const int TRIG_PIN = 9;
const int ECHO_PIN = 10;

void setup() {
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  Serial.begin(9600);
}

long measureDistance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  long duration = pulseIn(ECHO_PIN, HIGH, 30000);
  if (duration == 0) return 0;
  return duration * 0.0343 / 2;  // см
}

void loop() {
  long cm = measureDistance();
  if (cm == 0) Serial.println("Вне зоны");
  else {
    Serial.print("Расстояние: ");
    Serial.print(cm);
    Serial.println(" см");
  }
  delay(200);
}`,
    tips: [
      'Минимальное расстояние ~2 см (мёртвая зона), максимальное ~400 см.',
      'Мягкие и пушистые поверхности плохо отражают ультразвук — замеры будут неточными.',
      'Если ECHO подключён к 3,3-вольтовому пину на ESP32/STM32 — ставьте делитель 1:2, иначе сожжёте вход.'
    ]
  },
  {
    id: 'dht11',
    title: 'Термометр и гигрометр DHT11',
    level: 'Средний',
    category: 'Датчики',
    time: '30 мин',
    icon: 'thermometer',
    short: 'Цифровой датчик температуры и влажности по однопроводному интерфейсу.',
    description: 'DHT11 передаёт 40 бит данных (целая и дробная части температуры и влажности). Точность ±2 °C, ±5 % RH. Для точных измерений используйте DHT22 или BME280.',
    components: ['Arduino Uno', 'DHT11', 'Резистор 10 кОм (подтяжка)', 'Макетная плата', 'Провода'],
    wiring: `
    [Arduino Uno]          [DHT11]
         5V ─────────────── VCC (pin 1)
         D2 ─────────────── DATA (pin 2)
        GND ─────────────── GND (pin 4)
         5V ──[10k]──────── DATA (pin 2)  ← подтяжка
    `,
    steps: [
      { t: 'Установите библиотеку', d: 'Arduino IDE → Скетч → Подключить библиотеку → Управлять библиотеками… → найдите «DHT sensor library» Adafruit и установите.' },
      { t: 'Подключите датчик', d: 'VCC → 5V, GND → GND, DATA → D2. Между VCC и DATA — резистор 10 кОм.' },
      { t: 'Загрузите и проверьте', d: 'Serial Monitor на 9600. Данные обновляются раз в 2 секунды.' }
    ],
    code: `// Проект: DHT11
#include <DHT.h>

#define DHTPIN  2
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  dht.begin();
}

void loop() {
  delay(2000);  // интервал опроса

  float t = dht.readTemperature();
  float h = dht.readHumidity();

  if (isnan(t) || isnan(h)) {
    Serial.println("Ошибка чтения датчика");
    return;
  }

  Serial.print("T: "); Serial.print(t);
  Serial.print(" C  H: "); Serial.print(h);
  Serial.println(" %");
}`,
    tips: [
      'Минимальный интервал опроса DHT11 — 1–2 секунды. Чаще — получите NaN.',
      'Для точности ±0,5 °C и ±2 % RH перейдите на DHT22 (тот же код, DHTTYPE DHT22).',
      'Если данные не читаются — проверьте резистор подтяжки и правильность монтажа.'
    ]
  },
  {
    id: 'servo',
    title: 'Управление сервоприводом',
    level: 'Новичок',
    category: 'Моторы',
    time: '20 мин',
    icon: 'motor',
    short: 'Сервопривод SG90: 0–180° через библиотеку Servo.',
    description: 'Сервопривод SG90 — недорогой актуатор с угловым позиционированием. Управляется импульсами 0,5–2,5 мс с периодом 20 мс. Библиотека Servo скрывает эти детали.',
    components: ['Arduino Uno', 'Сервопривод SG90', 'Провода'],
    wiring: `
    [Arduino Uno]          [SG90]
         5V ─────────────── Красный (+)
        GND ─────────────── Коричневый (–)
         D9 ─────────────── Оранжевый (сигнал)
    `,
    steps: [
      { t: 'Подключите сервопривод', d: 'По цветам: коричневый — GND, красный — 5V, оранжевый — D9.' },
      { t: 'Загрузите скетч', d: 'Библиотека Servo входит в стандартную поставку IDE.' },
      { t: 'Проверьте', d: 'Вал должен плавно поворачиваться от 0° до 180° и обратно.' }
    ],
    code: `// Проект: Сервопривод
#include <Servo.h>

Servo myServo;

void setup() {
  myServo.attach(9);
}

void loop() {
  for (int a = 0; a <= 180; a++) {
    myServo.write(a);
    delay(15);
  }
  for (int a = 180; a >= 0; a--) {
    myServo.write(a);
    delay(15);
  }
}`,
    tips: [
      'Мощные сервоприводы (более 1 А) требуют внешнего источника питания. GND внешнего БП и Arduino соедините.',
      'Для точного позиционирования используйте writeMicroseconds(1000–2000) вместо write(0–180).',
      'Не забудьте detach() перед выключением, чтобы серво не грелась удержанием позиции.'
    ]
  },
  {
    id: 'buzzer',
    title: 'Мелодия на пьезоизлучателе',
    level: 'Новичок',
    category: 'Звук',
    time: '25 мин',
    icon: 'music',
    short: 'Генерация частоты функцией tone(). Пассивный buzzer.',
    description: 'tone() генерирует меандр заданной частоты на любом цифровом пине. Пьезоизлучатель без встроенного генератора (пассивный) превращает электрические колебания в звук.',
    components: ['Arduino Uno', 'Пьезоизлучатель (пассивный)', 'Провода'],
    wiring: `
    [Arduino Uno]          [Buzzer]
         D8 ─────────────── (+)
        GND ─────────────── (–)
    `,
    steps: [
      { t: 'Подключите buzzer', d: 'Плюс на D8, минус на GND. Полярность на пьезоизлучателе обычно не критична.' },
      { t: 'Загрузите скетч', d: 'В примере — упрощённая мелодия «Happy Birthday».' },
      { t: 'Настройте темп', d: 'Переменная tempo задает BPM. Увеличьте для ускорения.' }
    ],
    code: `// Проект: Мелодия
const int BUZZER = 8;

#define NOTE_C4 262
#define NOTE_D4 294
#define NOTE_E4 330
#define NOTE_F4 349
#define NOTE_G4 392

int melody[]   = { NOTE_C4, NOTE_C4, NOTE_D4, NOTE_C4, NOTE_F4, NOTE_E4 };
int durations[] = { 4, 4, 4, 4, 4, 2 };
const int tempo = 120;

void setup() {
  pinMode(BUZZER, OUTPUT);
}

void loop() {
  int notes = sizeof(melody) / sizeof(melody[0]);
  int wholenote = (60000 * 4) / tempo;

  for (int i = 0; i < notes; i++) {
    int noteDuration = wholenote / durations[i];
    tone(BUZZER, melody[i], noteDuration * 0.9);
    delay(noteDuration);
    noTone(BUZZER);
  }
  delay(3000);
}`,
    tips: [
      'tone() конфликтует с ШИМ на пинах 3 и 11 (Timer2). Используйте другие пины.',
      'Пассивный buzzer играет мелодии; активный (с встроенным генератором) издаёт только один тон.',
      'Для громкости без усилителя подключите buzzer между двумя пинами и используйте противофазу.'
    ]
  },
  {
    id: 'photoresistor',
    title: 'Автоматический ночник',
    level: 'Средний',
    category: 'Датчики',
    time: '30 мин',
    icon: 'moon',
    short: 'Фоторезистор + делитель напряжения + аналоговый вход.',
    description: 'Фоторезистор меняет сопротивление в зависимости от освещённости. В паре с постоянным резистором образует делитель напряжения. Arduino читает напряжение через analogRead().',
    components: ['Arduino Uno', 'Фоторезистор GL5528', 'Резистор 10 кОм', 'Светодиод', 'Резистор 220 Ом', 'Макетная плата', 'Провода'],
    wiring: `
    [Arduino Uno]
         5V ──[Фоторезистор]── A0 ──[10k]── GND
        D13 ──[220Ω]── LED ── GND
    `,
    steps: [
      { t: 'Соберите делитель', d: 'Один вывод фоторезистора на 5V, второй на A0. С A0 на GND — 10 кОм. Светодиод на D13 через 220 Ом.' },
      { t: 'Загрузите скетч', d: 'Serial Monitor покажет сырые значения 0–1023.' },
      { t: 'Настройте порог', d: 'Подберите threshold в коде под вашу освещённость.' }
    ],
    code: `// Проект: Автоматический ночник
const int SENSOR_PIN = A0;
const int LED_PIN    = 13;
const int THRESHOLD  = 500;  // подберите экспериментально

void setup() {
  pinMode(LED_PIN, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int value = analogRead(SENSOR_PIN);
  Serial.println(value);

  if (value < THRESHOLD) {
    digitalWrite(LED_PIN, HIGH);  // темно — свет включён
  } else {
    digitalWrite(LED_PIN, LOW);   // светло — свет выключен
  }
  delay(100);
}`,
    tips: [
      'Поменяйте местами фоторезистор и резистор, если логика работает наоборот.',
      'Для стабильности добавьте гистерезис: два порога (например, 400 вкл, 600 выкл).',
      'Можно заменить LED на MOSFET + лампа или реле для управления мощной нагрузкой.'
    ]
  },
  {
    id: 'lcd1602',
    title: 'Дисплей 1602 по I2C',
    level: 'Средний',
    category: 'Дисплеи',
    time: '30 мин',
    icon: 'display',
    short: 'Текстовый экран 16×2 через I2C-адаптер на PCF8574.',
    description: 'LCD 1602 без I2C занимает 6–10 пинов. С I2C-адаптером — всего 2 (SDA, SCL) плюс питание. Адрес обычно 0x27 или 0x3F.',
    components: ['Arduino Uno', 'LCD 1602 с I2C-модулем', 'Провода'],
    wiring: `
    [Arduino Uno]          [LCD 1602 I2C]
         5V ─────────────── VCC
        GND ─────────────── GND
        A4 ─────────────── SDA  (Uno/Nano)
        A5 ─────────────── SCL  (Uno/Nano)
    `,
    steps: [
      { t: 'Установите библиотеку', d: 'LiquidCrystal I2C by Frank de Brabander. Проверьте через Скетч → Подключить библиотеку.' },
      { t: 'Подключите дисплей', d: 'SDA → A4, SCL → A5 на Uno/Nano. На Mega — SDA→20, SCL→21.' },
      { t: 'Определите I2C-адрес', d: 'Запустите I2C Scanner, если экран не заработает с 0x27.' },
      { t: 'Загрузите скетч', d: 'Текст должен отобразиться на обеих строках.' }
    ],
    code: `// Проект: LCD 1602 I2C
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

// Адрес 0x27 или 0x3F, 16 символов, 2 строки
LiquidCrystal_I2C lcd(0x27, 16, 2);

void setup() {
  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("Hello, Arduino!");
  lcd.setCursor(0, 1);
  lcd.print("Millis: ");
}

void loop() {
  lcd.setCursor(8, 1);
  lcd.print(millis() / 1000);
  delay(500);
}`,
    tips: [
      'Если экран не работает — проверьте адрес сканером I2C (код в интернете).',
      'Для яркости без подсветки используйте lcd.noBacklight().',
      'Для экономии пинов I2C — лучший вариант. SPI-дисплеи быстрее, но занимают больше проводов.'
    ]
  },
  {
    id: 'pot-servo',
    title: 'Потенциометр управляет сервой',
    level: 'Средний',
    category: 'Моторы',
    time: '25 мин',
    icon: 'dial',
    short: 'Аналоговый вход A0 → map() → servo.write().',
    description: 'Потенциометр 10 кОм выдаёт 0–5 В на A0. analogRead() даёт 0–1023. Функция map() масштабирует диапазон до 0–180 для сервопривода.',
    components: ['Arduino Uno', 'Потенциометр 10 кОм', 'Сервопривод SG90', 'Провода'],
    wiring: `
    [Arduino Uno]
         5V ──[Потенциометр]── GND
                    │
                   A0
         D9 ─────── SG90 (сигнал)
    `,
    steps: [
      { t: 'Подключите потенциометр', d: 'Крайние выводы на 5V и GND, средний на A0.' },
      { t: 'Подключите сервопривод', d: 'Сигнал на D9, питание на 5V/GND.' },
      { t: 'Загрузите скетч', d: 'Поворачивайте ручку потенциометра — серво повторяет.' }
    ],
    code: `// Проект: Потенциометр → Серво
#include <Servo.h>

Servo myServo;
const int POT_PIN = A0;

void setup() {
  myServo.attach(9);
  Serial.begin(9600);
}

void loop() {
  int raw = analogRead(POT_PIN);          // 0 … 1023
  int angle = map(raw, 0, 1023, 0, 180);  // 0 … 180

  myServo.write(angle);

  Serial.print("Raw: "); Serial.print(raw);
  Serial.print("  Angle: "); Serial.println(angle);
  delay(50);
}`,
    tips: [
      'map() не ограничивает выход: если raw > 1023, angle > 180. Используйте constrain() при необходимости.',
      'Дрожание серво при неподвижной ручке — нормально, это шум АЦП. Добавьте порог ±5.',
      'Потенциометр потребляет ~0,5 мА — питать можно от пина 5V Arduino.'
    ]
  },
  {
    id: 'stepper',
    title: 'Шаговый мотор 28BYJ-48',
    level: 'Средний',
    category: 'Моторы',
    time: '40 мин',
    icon: 'stepper',
    short: 'Униполярный шаговик с драйвером ULN2003.',
    description: '28BYJ-48 — дешёвый униполярный шаговый мотор с редуктором 1:64. С драйвером ULN2003 управляется через 4 пина. Полный оборот — 2048 шагов (с редуктором).',
    components: ['Arduino Uno', '28BYJ-48', 'Драйвер ULN2003', 'Провода'],
    wiring: `
    [Arduino Uno]          [ULN2003]
         D8 ─────────────── IN1
         D9 ─────────────── IN2
        D10 ─────────────── IN3
        D11 ─────────────── IN4
         5V ─────────────── (+)
        GND ─────────────── (–)
    `,
    steps: [
      { t: 'Подключите драйвер', d: 'IN1–IN4 → D8–D11. Питание ULN2003 от 5V Arduino (до 4 моторов, если по очереди).' },
      { t: 'Установите библиотеку', d: 'Stepper (встроена) или AccelStepper для плавного разгона.' },
      { t: 'Загрузите скетч', d: 'Мотор должен повернуться на 360° в одну сторону, потом в другую.' }
    ],
    code: `// Проект: Шаговый мотор 28BYJ-48
#include <Stepper.h>

const int STEPS_PER_REV = 2048;  // с редуктором
Stepper myStepper(STEPS_PER_REV, 8, 10, 9, 11);

void setup() {
  myStepper.setSpeed(10);  // об/мин
}

void loop() {
  myStepper.step(STEPS_PER_REV);    // +1 оборот
  delay(1000);
  myStepper.step(-STEPS_PER_REV);   // –1 оборот
  delay(1000);
}`,
    tips: [
      'Максимальная скорость без пропуска шагов — ~14 об/мин. Для быстродействия используйте AccelStepper.',
      'При одновременном питании нескольких моторов используйте внешний источник 5V/1A.',
      'Шаговый мотор удерживает позицию при подаче тока. Для экономии энергии отключайте питание обмоток, если позиция не критична.'
    ]
  },
  {
    id: 'joystick',
    title: 'Джойстик и координаты',
    level: 'Средний',
    category: 'Датчики',
    time: '25 мин',
    icon: 'joystick',
    short: 'Два потенциометра (X, Y) и кнопка (Z) в одном модуле.',
    description: 'Модуль джойстика содержит два потенциометра по осям X и Y и тактовую кнопку по оси Z. Удобен для управления манипуляторами, игр и меню.',
    components: ['Arduino Uno', 'Модуль джойстика', 'Провода'],
    wiring: `
    [Arduino Uno]          [Джойстик]
         5V ─────────────── VCC
        GND ─────────────── GND
        A0 ─────────────── VRX
        A1 ─────────────── VRY
         D2 ─────────────── SW
    `,
    steps: [
      { t: 'Подключите модуль', d: 'VRX → A0, VRY → A1, SW → D2 (с INPUT_PULLUP). VCC и GND стандартно.' },
      { t: 'Загрузите скетч', d: 'Serial Monitor покажет X, Y (0–1023) и состояние кнопки.' },
      { t: 'Поэкспериментируйте', d: 'Добавьте dead zone в центре, чтобы исключить дрейф.' }
    ],
    code: `// Проект: Джойстик
const int PIN_X  = A0;
const int PIN_Y  = A1;
const int PIN_SW = 2;

void setup() {
  pinMode(PIN_SW, INPUT_PULLUP);
  Serial.begin(9600);
}

void loop() {
  int x  = analogRead(PIN_X);
  int y  = analogRead(PIN_Y);
  int sw = digitalRead(PIN_SW);

  Serial.print("X: "); Serial.print(x);
  Serial.print("  Y: "); Serial.print(y);
  Serial.print("  SW: "); Serial.println(sw == LOW ? "PRESSED" : "RELEASED");
  delay(100);
}`,
    tips: [
      'Механический джойстик имеет люфт в центре. Вводите dead zone ±30–50 от 512.',
      'Для управления сервоприводом используйте map() от 0–1023 к 0–180 на обеих осях.',
      'SW подключён с INPUT_PULLUP, поэтому нажатие = LOW.'
    ]
  },
  {
    id: 'relay-lamp',
    title: 'Реле управляет лампой 220 В',
    level: 'Продвинутый',
    category: 'Основы',
    time: '35 мин',
    icon: 'power',
    short: 'Модуль реле с опторазвязкой для управления сетевой нагрузкой.',
    description: 'Модуль реле на 5V с опторазвязкой позволяет безопасно управлять устройствами 220 В через Arduino. Важно: высокое напряжение опасно — соблюдайте технику безопасности.',
    components: ['Arduino Uno', 'Модуль реле 5V (1 канал)', 'Лампа или вентилятор 220 В', 'Провода'],
    wiring: `
    [Arduino Uno]          [Реле модуль]
         5V ─────────────── VCC
        GND ─────────────── GND
         D7 ─────────────── IN

    [Реле модуль]          [Лампа 220V]
         COM ─────────────── Фаза (L)
         NO  ─────────────── Лампа
         NC  ─────────────── (не используется)
    `,
    steps: [
      { t: 'Подключите реле к Arduino', d: 'VCC → 5V, GND → GND, IN → D7.' },
      { t: 'Подключите нагрузку', d: 'Разрыв фазного провода (L) через контакты COM и NO реле. Нейтраль (N) напрямую к лампе.' },
      { t: 'Загрузите скетч', d: 'Лампа будет включаться на 5 секунд и выключаться на 5 секунд.' }
    ],
    code: `// Проект: Реле + лампа 220 В
const int RELAY_PIN = 7;

void setup() {
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW);  // реле выключено при старте
}

void loop() {
  digitalWrite(RELAY_PIN, HIGH);  // вкл
  delay(5000);
  digitalWrite(RELAY_PIN, LOW);   // выкл
  delay(5000);
}`,
    tips: [
      'Работайте с 220 В только при выключенном питании. Используйте корпус для клемм реле.',
      'Максимальный ток модуля обычно 10 А при 250 В AC. Не превышайте.',
      'У некоторых модулей реле логика инвертирована: LOW = вкл. Проверяйте маркировку на плате.'
    ]
  }
];

const HL_KEYWORDS = [
  'void','setup','loop','if','else','for','while','do','return','break','continue',
  'switch','case','default','const','static','volatile','byte','int','long','float',
  'double','bool','char','String','true','false','NULL','sizeof','struct','class',
  'public','private','protected','virtual','include','define'
];

const HL_FUNCS = [
  'pinMode','digitalWrite','digitalRead','analogRead','analogWrite','analogReference',
  'delay','delayMicroseconds','millis','micros','pulseIn','pulseInLong',
  'tone','noTone','shiftOut','shiftIn','attachInterrupt','detachInterrupt',
  'Serial','print','println','write','read','available','flush','begin','end',
  'map','constrain','min','max','abs','sq','sqrt','pow','sin','cos','tan',
  'random','randomSeed','lowByte','highByte','word','bitRead','bitWrite','bitSet','bitClear'
];
