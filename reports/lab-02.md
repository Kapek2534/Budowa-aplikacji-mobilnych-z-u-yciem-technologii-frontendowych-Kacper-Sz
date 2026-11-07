# Sprawozdanie — Laboratorium 2

**Przedmiot:** Budowa aplikacji mobilnych z użyciem technologii frontendowych  
**Student / identyfikator:** Kacper Szczyrba, 147740  
**Projekt biznesowy:** MOB-025 - FuelTracker  
**Framework:** React Native (Expo SDK 58, TypeScript)  
**Data zajęć:** 2026-11-07  
**Repozytorium:** https://github.com/Kapek2534/Budowa-aplikacji-mobilnych-z-u-yciem-technologii-frontendowych-Kacper-Sz  
**Commit / tag odpowiadający oddaniu:** [tag `lab-02`]

## T1. Analiza podejść do tworzenia aplikacji

| Wymaganie z projektu                                                                                                              | Znaczenie dla wyboru technologii                                                                                                                                                                                                                                      | Wniosek                                                                           |
| --------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| **W1.** Trwały lokalny zapis z relacją Pojazd 1:N Tankowanie i blokadą usuwania pojazdu (FR-11, BR-04, TECH-04)                   | Potrzebna jest relacyjna baza danych na urządzeniu, działająca bez internetu, z kluczami obcymi. Natywne i wieloplatformowe podejście daje dostęp do SQLite. PWA ma tylko IndexedDB, a przeglądarka (szczególnie Safari na iOS) może usunąć dane nieużywanej witryny. | Podejście natywne lub wieloplatformowe; PWA i WebView niosą ryzyko utraty danych. |
| **W2.** Wygodne formularze z walidacją i dostępnością - klawiatura numeryczna, duże pola dotykowe, czytniki ekranu (FR-08, UX-04) | Natywne kontrolki zapewniają systemową klawiaturę `decimal-pad`, obsługę TalkBack/VoiceOver i zachowanie zgodne z platformą. W WebView i PWA UI jest stroną HTML, która tylko imituje aplikację.                                                                      | Najlepiej natywne kontrolki - podejście natywne lub React Native.                 |
| **W3.** Projekt jednoosobowy, ograniczony czas, wymagana co najmniej jedna platforma, aplikacja instalowana (TECH-01, TECH-02)    | Dwie natywne bazy kodu (Kotlin + Swift) podwajają pracę. Znam TypeScript i React, a Expo pozwala uruchomić aplikację na emulatorze bez konfiguracji kodu natywnego. Rozwiązanie wyłącznie webowe (PWA) nie spełnia TECH-01.                                           | Wieloplatformowe React Native z Expo.                                             |

**Porównanie podejść i uzasadnienie:**

- **Natywne (Kotlin/Swift):** spełnia W1 i W2 najlepiej (Room/Core Data, pełna dostępność), ale przy W3 oznacza dwie aplikacje i dwa języki - nieproporcjonalnie dużo pracy przy prostej aplikacji CRUD.
- **Hybrydowe WebView (Capacitor, Cordova):** jedna baza kodu webowego, SQLite dostępne przez wtyczkę, ale interfejs to HTML w przeglądarce osadzonej w aplikacji - słabiej spełnia W2 (klawiatury, gesty, dostępność zależne od WebView).
- **Wieloplatformowe (React Native, Flutter):** jedna baza kodu, dostęp do SQLite (W1). React Native renderuje natywne kontrolki (W2), a znajomość TypeScriptu i Reacta oraz Expo skracają czas pracy (W3).
- **PWA:** najłatwiejsza dystrybucja (link zamiast sklepu), ale dane w IndexedDB mogą zostać usunięte przez przeglądarkę (W1), a projekt nie spełniłby TECH-01.

Wybór z laboratorium 1 (**React Native + Expo**) pozostaje odpowiedni. Laboratorium 2 to potwierdziło w praktyce: `expo-sqlite` dał relacyjną bazę z kluczem obcym i `ON DELETE RESTRICT`, `expo-router` dał nawigację stosu z natywnymi przejściami, a całość działa w Expo Go bez budowania kodu natywnego. Ograniczenie: korzystam tylko z modułów dostępnych w Expo Go; inna biblioteka natywna wymagałaby development builda.

**Wskazane źródła (dokumentacja, artykuły techniczne):**

- React Native - About the New Architecture, https://reactnative.dev/architecture/landing-page - sposób renderowania natywnych kontrolek.
- Expo - SQLite, https://docs.expo.dev/versions/latest/sdk/sqlite/ - API bazy (`SQLiteProvider`, `onInit`, transakcje).
- MDN - Progressive web apps, https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps - możliwości i ograniczenia PWA.
- MDN - Storage quotas and eviction criteria, https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria - ryzyko usunięcia danych przez przeglądarkę.
- Capacitor - Documentation, https://capacitorjs.com/docs - model aplikacji hybrydowej WebView.

## T2. Projekt architektury aplikacji

Zależności idą w jednym kierunku: ekrany nie znają SQL-a, a `domain/` nie importuje ani Reacta, ani SQLite.

### T2.2. Model danych

| Encja      | Pole         | Typ                              | Wymagane | Znaczenie                              |
| ---------- | ------------ | -------------------------------- | -------- | -------------------------------------- |
| Pojazd     | `id`         | UUID (TEXT, PK)                  | Tak      | Identyfikator lokalny z `expo-crypto`  |
| Pojazd     | `name`       | TEXT, 1-50 znaków                | Tak      | Nazwa pojazdu                          |
| Pojazd     | `fuelType`   | enum `petrol` / `diesel` / `lpg` | Tak      | Rodzaj paliwa                          |
| Pojazd     | `createdAt`  | TEXT, ISO 8601 UTC               | Tak      | Pole techniczne                        |
| Tankowanie | `id`         | UUID (TEXT, PK)                  | Tak      | Identyfikator lokalny                  |
| Tankowanie | `vehicleId`  | UUID (TEXT, FK)                  | Tak      | `parentId` z karty - pojazd            |
| Tankowanie | `date`       | TEXT `YYYY-MM-DD`                | Tak      | Data tankowania (bez strefy czasowej)  |
| Tankowanie | `odometerKm` | INTEGER, 0 - 2 000 000           | Tak      | Stan licznika w km                     |
| Tankowanie | `volumeMl`   | INTEGER > 0                      | Tak      | Litry jako mililitry (45,32 l = 45320) |
| Tankowanie | `costCents`  | INTEGER > 0                      | Tak      | Koszt w groszach (289,99 zł = 28999)   |
| Tankowanie | `isFullTank` | INTEGER 0/1                      | Tak      | Czy do pełna                           |
| Tankowanie | `createdAt`  | TEXT, ISO 8601 UTC               | Tak      | Pole techniczne                        |

**Relacja i sposób zapewnienia spójności:**

- `refuels.vehicle_id REFERENCES vehicles(id) ON DELETE RESTRICT` z włączonym `PRAGMA foreign_keys = ON` ([database.ts](../FuelTracker/src/data/database.ts)).
- Przed zapisem tankowania `refuelService` sprawdza, czy pojazd istnieje (BR-04); klucz obcy w bazie jest drugą linią obrony.
- Usuwanie pojazdu (Lab 3) będzie blokowane, jeśli ma tankowania - najpierw komunikat z serwisu, a `ON DELETE RESTRICT` gwarantuje, że nie powstaną osierocone rekordy nawet przy błędzie w kodzie.
- Kwoty i litry są liczbami całkowitymi (grosze, mililitry), a tekst z formularza jest parsowany bez użycia float - karta wymaga wartości dziesiętnych zamiast binarnych zmiennoprzecinkowych.

### T2.3. Decyzje projektowe

| Decyzja                | Wybrane rozwiązanie                                                                       | Alternatywa                            | Uzasadnienie                                                                                                                                             |
| ---------------------- | ----------------------------------------------------------------------------------------- | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Zarządzanie stanem     | React Context + hooki (`FuelDataContext`)                                                 | Redux Toolkit, Zustand                 | Dwie encje i kilka ekranów - dodatkowa biblioteka nie jest uzasadniona. Jedno źródło danych dla wszystkich ekranów, po zapisie ponowne wczytanie z bazy. |
| Przechowywanie danych  | SQLite (`expo-sqlite`) z migracjami przez `PRAGMA user_version`                           | AsyncStorage (klucz-wartość, JSON)     | Relacja 1:N, klucz obcy, `ON DELETE RESTRICT` i ograniczenia `CHECK` są wbudowane w SQLite; w AsyncStorage spójność trzeba by pilnować ręcznie.          |
| Nawigacja              | Expo Router (routing plikowy, Stack)                                                      | React Navigation konfigurowany ręcznie | Oficjalne rozwiązanie Expo zbudowane na React Navigation; ekran = plik w `src/app/`, parametr `[id]` w ścieżce.                                          |
| Separacja logiki od UI | Warstwy `domain/` (czyste funkcje), `services/` (przypadki użycia), `data/` (repozytoria) | Logika i SQL bezpośrednio w ekranach   | Walidację i reguły można testować bez UI i bazy (Lab 4), a ekrany tylko wyświetlają wynik.                                                               |

**Plik `docs/architecture.md`:** [docs/architecture.md](../docs/architecture.md)

## T3. Nawigacja i ekrany

| Ekran               | Plik / komponent                                                                                                            | Przejście do / z ekranu                                                                   | Dowód działania                                                     |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Lista               | [src/app/index.tsx](../FuelTracker/src/app/index.tsx), `RefuelListItem`                                                     | Do szczegółów (dotknięcie rekordu), formularza („Dodaj tankowanie”), pojazdów („Pojazdy”) | [05-list-after-save.png](screenshots/lab-02/05-list-after-save.png) |
| Szczegóły           | [src/app/refuels/[id].tsx](../FuelTracker/src/app/refuels/[id].tsx)                                                         | Z listy; powrót strzałką wstecz                                                           | [07-refuel-details.png](screenshots/lab-02/07-refuel-details.png)   |
| Formularz           | [src/app/refuels/new.tsx](../FuelTracker/src/app/refuels/new.tsx), `FormField`, `OptionGroup`                               | Z listy; po zapisie powrót do listy                                                       | [03-refuel-form.png](screenshots/lab-02/03-refuel-form.png)         |
| Pojazdy (dodatkowo) | [src/app/vehicles/index.tsx](../FuelTracker/src/app/vehicles/index.tsx), [new.tsx](../FuelTracker/src/app/vehicles/new.tsx) | Z listy tankowań („Pojazdy”) lub z pustego stanu                                          | [09-vehicles.png](screenshots/lab-02/09-vehicles.png)               |

Ekrany pojazdów dodałem ponad minimum, bo tankowanie musi wskazywać istniejący pojazd (BR-04) - bez nich nie dałoby się utworzyć pierwszego tankowania.

**Dlaczego taki układ nawigacji jest odpowiedni dla użytkownika?**

Kierowca najczęściej otwiera aplikację, żeby dopisać tankowanie lub sprawdzić ostatnie wpisy, dlatego ekranem startowym jest lista tankowań, a przycisk „Dodaj tankowanie” jest stale widoczny na dole ekranu, w zasięgu kciuka. Nawigacja stosu odpowiada naturalnemu przepływowi „lista → szczegóły/formularz → powrót”, a systemowy przycisk wstecz Androida działa zgodnie z oczekiwaniami. Pojazdy dodaje się rzadko, więc są dostępne z nagłówka, a przy pierwszym uruchomieniu pusty stan od razu prowadzi do dodania pojazdu.

## T4. Operacje Create i Read

**Powiązanie z wymaganiami biznesowymi (ID wymagań):** MOB-025-FR-01 (Create, Read tankowania), FR-02 (Create, Read pojazdu), FR-03 (przypisanie do pojazdu), FR-04 (lista i szczegóły), FR-08 (walidacja), FR-09 (komunikaty błędów i pusta lista), FR-11 (trwałość), BR-01, BR-03, BR-04.

| Operacja         | Lokalizacja kodu                                                                                                                                                                                                                                                                                                                   | Reguła walidacji / zachowanie                                                                                                                                                                                           | Wynik                                                                                |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| Create           | [refuels/new.tsx](../FuelTracker/src/app/refuels/new.tsx) → [FuelDataContext.tsx](../FuelTracker/src/state/FuelDataContext.tsx) → [refuelService.ts](../FuelTracker/src/services/refuelService.ts) → [validation.ts](../FuelTracker/src/domain/validation.ts) → [refuelRepository.ts](../FuelTracker/src/data/refuelRepository.ts) | Wymagany pojazd, data poprawna i nie z przyszłości, licznik całkowity 0 - 2 000 000 km, litry i koszt > 0 (maks. 3 i 2 miejsca po przecinku), przebieg nie maleje względem innych tankowań pojazdu, pojazd musi istnieć | Rekord zapisany w SQLite z nowym UUID; błędne dane blokowane z komunikatem pod polem |
| Read (lista)     | [index.tsx](../FuelTracker/src/app/index.tsx), `refuelRepository.findAll()`                                                                                                                                                                                                                                                        | Sortowanie od najnowszego (`ORDER BY date DESC, odometer_km DESC`), pusty stan przy braku rekordów                                                                                                                      | Lista z datą, pojazdem, litrami, przebiegiem, kosztem i oznaczeniem „do pełna”       |
| Read (szczegóły) | [refuels/[id].tsx](../FuelTracker/src/app/refuels/[id].tsx)                                                                                                                                                                                                                                                                        | Rekord wyszukiwany po `id` ze ścieżki; brak rekordu → „Nie znaleziono tankowania”                                                                                                                                       | Wszystkie pola i wyliczona cena za litr                                              |

**Wyjaśnij przepływ danych po naciśnięciu przycisku „Zapisz”:**

1. Ekran `refuels/new` przechowuje wpisane wartości jako tekst w stanie lokalnym (`useState`) i po naciśnięciu „Zapisz” wywołuje `addRefuel(form)` z `FuelDataContext`.
2. Kontekst przekazuje dane do `createRefuel` w `refuelService`.
3. Serwis wywołuje `validateRefuel` (czyste funkcje w `domain/`): sprawdza pola wymagane, typy i zakresy oraz zamienia tekst „45,32” na 45320 ml i „289,99” na 28999 gr.
4. Serwis sprawdza w `vehicleRepository`, czy pojazd istnieje, a w `refuelRepository.findByVehicle` pobiera inne tankowania pojazdu i przez `checkOdometerOrder` sprawdza, czy przebieg nie maleje.
5. Jeśli są błędy, wynik `{ ok: false, errors }` wraca do ekranu, który pokazuje komunikaty pod polami i baner „Popraw zaznaczone pola” - nic nie jest zapisywane.
6. Jeśli dane są poprawne, serwis nadaje UUID i `createdAt`, a `refuelRepository.insert` wykonuje `INSERT INTO refuels`.
7. Kontekst ponownie wczytuje pojazdy i tankowania z bazy (`reload()`) i ustawia komunikat „Zapisano tankowanie.”.
8. Ekran wraca do listy (`router.back()`); React renderuje listę z nowym stanem, więc nowy rekord jest od razu widoczny.
9. Gdy zapis do bazy zgłosi wyjątek, kontekst zwraca „Nie udało się zapisać danych. Spróbuj ponownie.”, a dane w formularzu zostają.

## T5. Weryfikacja działania i wnioski

Testy manualne wykonane na emulatorze Androida Pixel_8 (Expo Go, SDK 58).

| ID    | Scenariusz                                                                                       | Oczekiwany rezultat                         | Wynik (PASS/FAIL) | Dowód / uwagi                                                                                                                        |
| ----- | ------------------------------------------------------------------------------------------------ | ------------------------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| TC-01 | Dodanie poprawnego rekordu (Skoda Octavia, 07.11.2026, 120500 km, 45,32 l, 289,99 zł, do pełna)  | Rekord jest zapisany i widoczny             | PASS              | [05-list-after-save.png](screenshots/lab-02/05-list-after-save.png) - rekord na liście, komunikat „Zapisano tankowanie.”             |
| TC-02 | Próba zapisu pustego wymaganego pola (pusty formularz pojazdu)                                   | Zapis zablokowany, komunikat                | PASS              | [02-vehicle-validation.png](screenshots/lab-02/02-vehicle-validation.png) - „Nazwa pojazdu jest wymagana.”, „Wybierz rodzaj paliwa.” |
| TC-03 | Otwarcie szczegółów rekordu (20.10.2026, 119800 km, 40 l, 250 zł)                                | Poprawne dane rekordu                       | PASS              | [07-refuel-details.png](screenshots/lab-02/07-refuel-details.png) - zgodne dane, cena 6,25 zł/l                                      |
| TC-04 | Ponowne uruchomienie aplikacji (wymuszone zamknięcie Expo Go `am force-stop` i ponowne otwarcie) | Rekord pozostaje dostępny                   | PASS              | [08-after-restart.png](screenshots/lab-02/08-after-restart.png) - oba tankowania i pojazd dostępne                                   |
| TC-05 | Brak rekordów (pierwsze uruchomienie, wyczyszczone dane)                                         | Czytelny stan pustej listy                  | PASS              | [01-empty-state.png](screenshots/lab-02/01-empty-state.png) - „Witaj w FuelTracker” z przyciskiem „Dodaj pojazd”                     |
| TC-06 | BR-01: litry 0 i koszt 0                                                                         | Zapis zablokowany, przyczyna przy polach    | PASS              | [04-refuel-validation.png](screenshots/lab-02/04-refuel-validation.png)                                                              |
| TC-07 | BR-01: tankowanie z 20.10.2026 z przebiegiem 121000 km, gdy 07.11.2026 jest 120500 km            | Zapis zablokowany - przebieg nie może maleć | PASS              | [06-odometer-rule.png](screenshots/lab-02/06-odometer-rule.png)                                                                      |

**Najważniejszy napotkany problem i sposób rozwiązania:**

Instalacja `expo-router` i aktualizacja Expo do wersji zalecanej przez `expo-doctor` kończyła się błędem npm `ERESOLVE`. Zależności webowe routera (`@radix-ui/*`) wymagają `react-dom`, a npm wybierał najnowszy `react-dom@19.3.1`, który wymaga `react@^19.3.1`, podczas gdy React Native 0.88 korzysta z `react@19.3.0`. Nie użyłem `--force` ani `--legacy-peer-deps`, które ukryłyby konflikt. Zamiast tego przypiąłem `react-dom@19.3.0` do tej samej wersji co `react` - instalacja przeszła, a `expo-doctor` zwraca 20/20. Drugi, mniejszy problem wyszedł w testach manualnych: czerwony baner „Popraw zaznaczone pola” zostawał po poprawieniu danych - teraz znika przy edycji dowolnego pola.

**Co wymaga dalszej pracy przed laboratorium 3?**

- Edycja i usuwanie tankowania z potwierdzeniem (pełny CRUD, FR-01), edycja pojazdu (FR-02).
- Blokada usunięcia pojazdu z tankowaniami z komunikatem (BR-04, kryterium akceptacji 4).
- Wyszukiwanie, filtrowanie po pojeździe i rodzaju tankowania, sortowanie po dacie z wyborem kierunku (FR-05 - FR-07).
- Obliczanie spalania l/100 km między tankowaniami do pełna z uwzględnieniem tankowań częściowych (FR-10, BR-02).
- Wygodniejsze wprowadzanie daty (obecnie tekst `RRRR-MM-DD`).

**Wnioski:**

Podział na warstwy `domain` / `services` / `data` sprawdził się już na tym etapie: regułę „przebieg nie może maleć” dopisałem w serwisie bez zmian w ekranie, a formularz tylko wyświetla zwrócony komunikat. Przechowywanie kwot w groszach i litrów w mililitrach wymagało własnego parsowania tekstu, ale eliminuje błędy zaokrągleń, które przy obliczaniu spalania w Lab 3 byłyby trudne do wykrycia. Zapis w SQLite z kluczem obcym od razu zapewnia spójność relacji, a migracje przez `PRAGMA user_version` pozwolą zmieniać schemat bez utraty danych. Jeden kontekst stanu ponownie wczytywany po zapisie wystarczył, by lista, szczegóły i ekran pojazdów zawsze pokazywały te same dane. Testy na emulatorze wykryły błąd UX (baner błędu), którego nie widać w samym kodzie.

## Materiały dowodowe i historia pracy

- Issue(s): [linki]
- Pull Request(s): [link do PR `feature/data-layer-and-navigation` → `main`]
- Commity związane z laboratorium:
  - `eb331cc` docs(architecture): add architecture and data model
  - `d82a896` feat(data): add domain model, validation, SQLite repositories and services
  - `e03ccba` feat(app): add navigation, shared state and refuel create/read screens
- Diagramy: [docs/architecture.md](../docs/architecture.md) (warstwy, ER, sekwencja zapisu, nawigacja)
- Zrzuty ekranu: [reports/screenshots/lab-02/](screenshots/lab-02/)
- Instrukcja uruchomienia: [README.md](../README.md)

## Użycie narzędzi AI

Opis w [docs/ai-usage.md](../docs/ai-usage.md#lab-2-2026-11-07).
