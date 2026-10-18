# Specyfikacje biznesowa 25
**Przedmiot:** Budowa aplikacji mobilnych z użyciem technologii frontendowych  
**Poziom:** studia I stopnia, semestr 7  
**Data:** 2026-10-18

## Zasady wspólne i interpretacja
- Każda aplikacja realizuje pełny CRUD **głównej encji podrzędnej** (druga encja w karcie) oraz co najmniej tworzenie, odczyt i edycję encji nadrzędnej; usuwanie nadrzędnej encji musi mieć zdefiniowaną politykę dla istniejących rekordów zależnych (np. blokada usunięcia).
- Wymagane są: lista, szczegóły, formularz, wyszukiwanie po nazwie/tytule, filtr po atrybucie domenowym, sortowanie po dacie/nazwie oraz trwały zapis lokalny.
- Wszystkie identyfikatory są lokalnymi UUID; pola oznaczone `?` są opcjonalne. Wymagane są też pola techniczne `id` i klucz obcy encji podrzędnej. Kwoty przechowuje się jako wartości dziesiętne, a nie binarne float; daty i strefy czasowe obsługuje się spójnie.
- Minimum trzy walidacje domenowe: wymagane nazwy, ograniczenia typów/zakresów oraz reguła specyficzna z karty. Co najmniej jedna reguła biznesowa musi mieć automatyczny test pozytywny i negatywny.
- Zakres: jedna osoba, dane lokalne, bez backendu, logowania, płatności i integracji zewnętrznych. Dane demonstracyjne są fikcyjne. Dodatkowe rozszerzenia są przekazywane dopiero w późniejszym laboratorium i nie wchodzą do podstawowego zakresu.
- Kryteria akceptacji są przykładowymi scenariuszami obowiązkowymi; nie zastępują testów całego CRUD ani testów sytuacji pustych/błędnych.

## MOB-025 – FuelTracker
**Kontekst i problem:** Analiza tankowań i spalania. Brak uporządkowanej ewidencji utrudnia przegląd informacji i podejmowanie decyzji.  
**Użytkownik docelowy:** kierowca.  
**Cel biznesowy:** Umożliwić prowadzenie ewidencji „tankowanie” w kontekście „pojazd”, kontrolę poprawności danych oraz uzyskanie użytecznego podsumowania.

### Model danych
- **Pojazd** (`id:uuid`; nazwa:text; rodzajPaliwa:enum).
- **Tankowanie** (`id:uuid`; `parentId:uuid`; data:date; licznikKm:int; litry:decimal; koszt:decimal; doPełna:boolean).
- **Relacja:** `Pojazd (1) → (N) Tankowanie`. Rekord podrzędny musi wskazywać istniejący rekord nadrzędny. Usunięcie nadrzędnego rekordu z powiązaniami jest blokowane z czytelnym komunikatem.

### Wymagania biznesowe
- **MOB-025-FR-01:** Dodawanie, wyświetlanie, edycja i usuwanie rekordów „tankowanie”.
- **MOB-025-FR-02:** Tworzenie, przeglądanie i edycja rekordów „pojazd”.
- **MOB-025-FR-03:** Przypisywanie każdego rekordu „tankowanie” do wybranego rekordu nadrzędnego.
- **MOB-025-FR-04:** Wyświetlanie listy rekordów wraz z widokiem szczegółów.
- **MOB-025-FR-05:** Wyszukiwanie po nazwie/tytule (dla encji bez takiego pola: po podstawowym polu tekstowym).
- **MOB-025-FR-06:** Filtrowanie po encji nadrzędnej oraz co najmniej jednym polu domenowym, jeżeli występuje; w przeciwnym razie po dacie.
- **MOB-025-FR-07:** Sortowanie według daty lub nazwy; określenie kierunku sortowania.
- **MOB-025-FR-08:** Walidacja pól obowiązkowych, zakresów liczbowych i reguł biznesowych.
- **MOB-025-FR-09:** Prezentowanie komunikatów błędów, pustej listy oraz potwierdzenia usunięcia.
- **MOB-025-FR-10:** Wyliczanie i prezentacja: Spalanie l/100 km między kolejnymi tankowaniami do pełna; uwzględnij paliwo zatankowane pomiędzy nimi.
- **MOB-025-FR-11:** Zachowanie danych po ponownym uruchomieniu aplikacji.

### Reguły biznesowe
- **MOB-025-BR-01:** Litry i koszt > 0; przebieg nie może maleć.
- **MOB-025-BR-02:** Spalanie l/100 km między kolejnymi tankowaniami do pełna; uwzględnij paliwo zatankowane pomiędzy nimi.
- **MOB-025-BR-03:** Puste nazwy/tytuły są niedozwolone; wartości liczbowe i daty muszą odpowiadać deklarowanym typom i zakresom.
- **MOB-025-BR-04:** Nie można zapisać rekordu podrzędnego bez istniejącego powiązania; usunięcie rekordu nadrzędnego z zależnościami jest blokowane.

### Kryteria akceptacji (Given–When–Then)
1. **CRUD:** **Mając** utworzony rekord „pojazd”, **gdy** użytkownik doda poprawny rekord „tankowanie”, **wtedy** jest on widoczny na liście i w szczegółach; po edycji prezentuje nowe wartości, a po potwierdzonym usunięciu znika z listy.
2. **Walidacja:** **Mając** formularz „tankowanie”, **gdy** użytkownik poda wartości sprzeczne z regułą `MOB-025-BR-01`, **wtedy** zapis zostaje zablokowany, a aplikacja pokazuje przyczynę.
3. **Logika domenowa:** **Mając** co najmniej dwa poprawne rekordy testowe, **gdy** użytkownik otworzy podsumowanie, **wtedy** aplikacja wyświetla wynik zgodny z zasadą: Spalanie l/100 km między kolejnymi tankowaniami do pełna; uwzględnij paliwo zatankowane pomiędzy nimi.
4. **Relacje:** **Mając** rekord „pojazd” z powiązanym rekordem „tankowanie”, **gdy** użytkownik spróbuje usunąć rekord nadrzędny, **wtedy** operacja zostaje zablokowana z informacją o istniejących zależnościach.
5. **Trwałość:** **Mając** zapisane dane, **gdy** użytkownik zamknie i uruchomi aplikację ponownie, **wtedy** rekordy oraz ich relacje pozostają dostępne.
