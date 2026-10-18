# Decyzja technologiczna

**Projekt:** MOB-025 FuelTracker
**Decyzja:** React Native + Expo + TypeScript  
**Data:** 2026-10-18

## Kontekst

FuelTracker to aplikacja CRUD dla jednego użytkownika: ewidencja pojazdów i tankowań, listy, formularze z walidacją, wyszukiwanie/filtrowanie/sortowanie, lokalny zapis danych i obliczanie spalania l/100 km. Aplikacja nie wymaga zaawansowanej grafiki, animacji ani niestandardowych natywnych API. Środowisko pracy: macOS (Apple Silicon), VS Code, Android Studio (bez Xcode).

## Porównanie technologii

| Kryterium                  | React Native                              | Flutter                              | NativeScript                      |
| -------------------------- | ----------------------------------------- | ------------------------------------ | --------------------------------- |
| Język                      | JavaScript / TypeScript                   | Dart                                 | JavaScript / TypeScript           |
| Renderowanie UI            | Natywne kontrolki platformy (Fabric, JSI) | Własny silnik graficzny (Impeller)   | Natywne kontrolki platformy       |
| Wydajność (aplikacja CRUD) | Bardzo dobra                              | Bardzo dobra                         | Dobra                             |
| Łatwość startu             | Wysoka (Expo, Expo Go)                    | Wysoka (`flutter create`, dobre CLI) | Średnia                           |
| Społeczność i biblioteki   | Bardzo duża (npm)                         | Bardzo duża (pub.dev)                | Mała                              |
| Dostęp do natywnych API    | Moduły natywne / biblioteki Expo          | Platform channels / pluginy          | Bezpośrednio z JS/TS              |
| Moja znajomość             | JavaScript, TypeScript, React             | Brak (nowy język)                    | JS/TS, brak znajomości frameworka |

## Wybór i uzasadnienie

Wybrałem **React Native z Expo i TypeScriptem**, ponieważ:

- znam JavaScript/TypeScript i Reacta, więc mogę skupić się na logice biznesowej (walidacja, obliczanie spalania) zamiast na nauce nowego języka;
- dla aplikacji typu CRUD przewaga wydajnościowa Fluttera nie ma praktycznego znaczenia;
- ekosystem npm dostarcza sprawdzone biblioteki do nawigacji, lokalnego przechowywania danych i testów;
- Expo upraszcza konfigurację: projekt uruchamia się na emulatorze przez Expo Go bez budowania kodu natywnego, a `npx expo install` dobiera wersje bibliotek zgodne z SDK;
- TypeScript pozwala wykryć błędy typów w modelu danych jeszcze przed uruchomieniem.

**Dlaczego nie Flutter:** równie dobra technologia, ale wymaga nauki Darta, a jej główne zalety (spójny, „autorski” wygląd UI, wydajna grafika) nie są potrzebne w tym projekcie.

**Dlaczego nie NativeScript:** najmniejsza społeczność i liczba bibliotek, mniej materiałów i odpowiedzi na typowe problemy.

## Wersje

| Narzędzie    | Wersja |
| ------------ | ------ |
| Expo SDK     | 58     |
| React Native | 0.88   |
| React        | 19.3   |
| TypeScript   | 6.0    |
| Node.js      | 24.11  |
| npm          | 11.6   |

## Kompromisy i ograniczenia

- **Zależność od Expo SDK:** aktualizacje SDK co kilka miesięcy wprowadzają zmiany niekompatybilne wstecz; biblioteki trzeba dobierać pod konkretną wersję SDK.
- **Expo Go:** obsługuje tylko moduły natywne wbudowane w Expo Go. Jeśli projekt będzie potrzebował innej biblioteki natywnej, konieczny będzie development build (`npx expo run:android`, wymaga JDK).
- **Jakość bibliotek zewnętrznych:** ekosystem npm jest nierówny, każdą dodatkową zależność trzeba uzasadnić i sprawdzić.
- **Platforma:** brak Xcode na moim komputerze, więc aplikacja jest uruchamiana i testowana tylko na Androidzie (TECH-02 wymaga jednej platformy).

Wybór modelu zarządzania stanem i sposobu lokalnego przechowywania danych zostanie opisany w `architecture.md` (Lab 2).
