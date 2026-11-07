# Wykorzystanie narzędzi AI

**Narzędzie:** Claude Code (Anthropic, model Claude Opus 5.5)

## Lab 1 (2026-10-18)

| Zakres wsparcia                                                                           | Sposób weryfikacji                                                          |
| ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Analiza projektu i tematu aplikacji                                                       | Porównanie z treścią dokumentów w `docs/`                                   |
| Sprawdzenie środowiska (Node.js, Android SDK, emulator, JDK, Xcode)                       | Wyniki poleceń w terminalu                                                  |
| Przygotowanie `.gitignore`                                                                | `git status` - w repozytorium tylko pliki potrzebne do odtworzenia projektu |
| Sprawdzenie odpowiedzi w `reports/lab-01.md`, `docs/technology-decision.md` i `README.md` | Przeczytane i zaproponowane poprawki                                        |

## Lab 2 (2026-11-07)

| Zakres wsparcia                                                          | Sposób weryfikacji                                           |
| ------------------------------------------------------------------------ | ------------------------------------------------------------ |
| Projekt architektury, modelu danych i nawigacji (`docs/architecture.md`) | Porównanie z kartą MOB-025 i wymaganiami wspólnymi           |
| Instalacja bibliotek i rozwiązanie konfliktu `react` / `react-dom`       | `npx expo-doctor` - 20/20                                    |
| Implementacja warstwy domenowej, repozytoriów SQLite, serwisów           | `npx tsc --noEmit` bez błędów, przegląd kodu przed commitami |
| Testy manualne na emulatorze Androida (sterowanie przez `adb`)           | Scenariusze TC-01 - TC-07 w `reports/lab-02.md`              |
