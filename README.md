# FuelTracker

Mobilna aplikacja do ewidencji tankowań i analizy spalania. Projekt semestralny z przedmiotu _Budowa aplikacji mobilnych z użyciem technologii frontendowych_.

- Karta biznesowa: [MOB-025 - FuelTracker](docs/business-requirements_25.md)
- Wymagania wspólne: [docs/requirements.md](docs/requirements.md)
- Decyzja technologiczna: [docs/technology-decision.md](docs/technology-decision.md)
- Architektura i model danych: [docs/architecture.md](docs/architecture.md)
- Sprawozdania: [reports/](reports/)

## Technologia

React Native + Expo + TypeScript. Kod aplikacji znajduje się w katalogu [`FuelTracker/`](FuelTracker/).

| Narzędzie    | Wersja |
| ------------ | ------ |
| Expo SDK     | 58     |
| React Native | 0.88   |
| TypeScript   | 6.0    |
| Node.js      | 24.11  |
| npm          | 11.6   |

Główne biblioteki: `expo-router` (nawigacja), `expo-sqlite` (lokalna baza danych), `expo-crypto` (UUID). Uzasadnienie w [docs/architecture.md](docs/architecture.md#8-biblioteki).

## Struktura projektu

```text
FuelTracker/src/
├── app/          # ekrany (Expo Router): lista, szczegóły i formularz tankowania, pojazdy
├── components/   # komponenty UI wielokrotnego użytku
├── state/        # FuelDataContext - stan współdzielony
├── services/     # przypadki użycia (walidacja + zapis)
├── domain/       # typy, walidacja, jednostki (bez React i SQLite)
└── data/         # schemat SQLite, migracje, repozytoria
```

## Wymagania środowiskowe

- Node.js (LTS, testowane na 24.11) i npm
- Android Studio z Android SDK i utworzonym emulatorem (AVD), np. Pixel 8
- Zmienne środowiskowe (macOS, `~/.zshrc`):

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$PATH
```

## Instalacja i uruchomienie

```bash
cd FuelTracker
npm ci
npm run android
```

`npm run android` uruchamia serwer Metro, instaluje Expo Go na działającym emulatorze i otwiera w nim aplikację. Emulator można uruchomić z Android Studio (Device Manager) lub poleceniem `emulator -avd Pixel_8`.

Dane zapisywane są w lokalnej bazie SQLite (`fueltracker.db`) wewnątrz aplikacji i są zachowywane po jej ponownym uruchomieniu. Aby zacząć od pustej bazy, wyczyść dane Expo Go w ustawieniach Androida.

Sprawdzenie typów i konfiguracji:

```bash
npx tsc --noEmit
npx expo-doctor
```

## Testy

Testy automatyczne - do uzupełnienia (Lab 4). Wyniki testów manualnych z Lab 2: [reports/lab-02.md](reports/lab-02.md#t5-weryfikacja-działania-i-wnioski).

## Zakres funkcji

- [x] Szkielet aplikacji uruchomiony na emulatorze Androida (Lab 1)
- [x] Architektura, model danych (Pojazd 1:N Tankowanie), nawigacja, warstwa danych SQLite (Lab 2)
- [x] Dodawanie i przeglądanie tankowań (lista, szczegóły) z walidacją i trwałym zapisem (Lab 2)
- [x] Dodawanie i przeglądanie pojazdów (Lab 2)
- [ ] Edycja i usuwanie tankowań, edycja pojazdów, blokada usunięcia pojazdu z tankowaniami (Lab 3)
- [ ] Wyszukiwanie, filtrowanie, sortowanie, obliczanie spalania l/100 km (Lab 3)
- [ ] Testy automatyczne i CI (Lab 4)

## Znane ograniczenia

- Aplikacja jest uruchamiana i testowana na Androidzie i IOS.
- Data tankowania wpisywana jest jako tekst `RRRR-MM-DD` (domyślnie dzisiejsza), bez kalendarza.
- Aplikacja działa w Expo Go - dodanie biblioteki natywnej spoza Expo Go wymagałoby development builda.

## Wykorzystanie AI

Projekt powstaje przy wsparciu asystenta AI (Claude Code) - pomoc przy konfiguracji środowiska, tworzeniu szkieletu projektu, projektowaniu architektury, implementacji kodu i redagowaniu dokumentacji. Szczegóły: [docs/ai-usage.md](docs/ai-usage.md). Wszystkie wyniki są przeze mnie weryfikowane.
