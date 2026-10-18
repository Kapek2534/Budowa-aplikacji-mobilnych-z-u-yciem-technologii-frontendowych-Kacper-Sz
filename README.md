# FuelTracker

Mobilna aplikacja do ewidencji tankowań i analizy spalania. Projekt semestralny z przedmiotu _Budowa aplikacji mobilnych z użyciem technologii frontendowych_.

- Karta biznesowa: [MOB-025 - FuelTracker](docs/business-requirements_25.md)
- Wymagania wspólne: [docs/requirements.md](docs/requirements.md)
- Decyzja technologiczna: [docs/technology-decision.md](docs/technology-decision.md)

## Technologia

React Native + Expo + TypeScript. Kod aplikacji znajduje się w katalogu [`FuelTracker/`](FuelTracker/).

| Narzędzie    | Wersja |
| ------------ | ------ |
| Expo SDK     | 58     |
| React Native | 0.88   |
| TypeScript   | 6.0    |
| Node.js      | 24.11  |
| npm          | 11.6   |

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

## Testy

Do uzupełnienia (Lab 4).

## Zakres funkcji

- [x] Szkielet aplikacji uruchomiony na emulatorze Androida (Lab 1)
- [ ] Model danych, nawigacja, warstwa danych (Lab 2)
- [ ] CRUD tankowań, obsługa pojazdów, walidacja, trwały zapis (Lab 3)
- [ ] Testy automatyczne i CI (Lab 4)

## Znane ograniczenia

- Aplikacja jest uruchamiana i testowana na Androidzie i IOS.

## Wykorzystanie AI

Projekt powstaje przy wsparciu asystenta AI (Claude Code) - pomoc przy konfiguracji środowiska, tworzeniu szkieletu projektu i redagowaniu dokumentacji. Wszystkie wyniki są przeze mnie weryfikowane.
