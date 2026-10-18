# Sprawozdanie 1 – Budowa aplikacji mobilnych z użyciem technologii frontendowych

**Przedmiot:** Budowa aplikacji mobilnych z użyciem technologii frontendowych  
**Student / identyfikator:** Kacper Szczyrba, 147740
**Projekt biznesowy:** MOB-025 – FuelTracker
**Framework:** React Native
**Data zajęć:** [2026-10-18]  
**Repozytorium:** https://github.com/Kapek2534/Budowa-aplikacji-mobilnych-z-u-yciem-technologii-frontendowych-Kacper-Sz  
**Commit / tag odpowiadający oddaniu:** [hash / tag]

## Temat zajęć

**Główne technologie i frameworki frontendowe do budowy aplikacji mobilnych**

Omówienie kluczowych technologii frontendowych wykorzystywanych w tworzeniu aplikacji mobilnych, takich jak **React Native**, **Flutter**, **NativeScript**.  
Porównanie i kontrastowanie tych technologii pod kątem **wydajności**, **łatwości użycia** i **wsparcia społeczności**.  
Omówienie najważniejszych **narzędzi deweloperskich** i **systemów kontroli wersji** (VS Code, Android Studio, Xcode, Git).

## Cele ćwiczenia

1. Zrozumienie różnic między frameworkami React Native, Flutter i NativeScript.
2. Poznanie podstawowych narzędzi deweloperskich wykorzystywanych w tworzeniu aplikacji mobilnych.
3. Poznanie zasad pracy zespołowej z wykorzystaniem systemu Git.
4. Wyciągnięcie wniosków dotyczących doboru technologii do konkretnego typu projektu mobilnego.

## Pytania kontrolne i odpowiedzi

### Technologie i frameworki frontendowe

1. **Jakie są główne różnice między React Native, Flutter i NativeScript?**  
   _Odpowiedź:_ Wszystkie trzy pozwalają pisać jedną bazę kodu na Androida i iOS, ale różnią się językiem, sposobem renderowania i ekosystemem:
   - **React Native** (Meta) - JavaScript/TypeScript i model komponentów React; UI składa się z **natywnych kontrolek** platformy, a logika działa w silniku JS (Hermes). Korzysta z ogromnego ekosystemu npm, a narzędzie Expo znacznie upraszcza start projektu.
   - **Flutter** (Google) - język Dart; **nie używa natywnych kontrolek**, tylko sam rysuje każdy piksel własnym silnikiem graficznym (Impeller/Skia). Dzięki temu UI wygląda identycznie na każdej platformie, a kod jest kompilowany AOT do kodu maszynowego.
   - **NativeScript** - JavaScript/TypeScript z dowolnym frameworkiem (Angular, Vue, Svelte, Solid lub czysty TS); renderuje natywne kontrolki i daje **bezpośredni dostęp do całego natywnego API** z poziomu JS bez pisania „mostków”. Ma najmniejszą społeczność z tej trójki.

2. **Jak każdy z tych frameworków renderuje interfejs użytkownika na urządzeniach mobilnych?**  
   _Odpowiedź:_
   - **React Native** - komponenty React (`<View>`, `<Text>`) są opisem UI; renderer **Fabric** (Nowa Architektura) przelicza drzewo komponentów, wylicza layout (silnik Yoga, Flexbox) i tworzy odpowiadające im natywne widoki (`android.view.View` / `UIView`). Komunikacja JS ↔ natywny kod odbywa się przez **JSI** (bezpośrednie wywołania C++), co zastąpiło dawny asynchroniczny „bridge” z serializacją JSON.
   - **Flutter** - buduje drzewo widgetów, z którego powstaje drzewo obiektów renderujących; silnik **Impeller** (wcześniej Skia) rysuje całość na jednym płótnie (canvas) przez GPU. System operacyjny widzi tylko jedną powierzchnię graficzną, a nie poszczególne przyciski.
   - **NativeScript** - kod JS działa w silniku V8 (Android) / JavaScriptCore lub V8 (iOS); warstwa widoków NativeScript tworzy **prawdziwe natywne kontrolki** przez bezpośrednie wywołania natywnych klas z JavaScriptu.

3. **Kiedy warto wybrać Fluttera, a kiedy React Native lub NativeScript?**  
   _Odpowiedź:_
   - **Flutter** - gdy liczy się identyczny, mocno „autorski” wygląd UI na wszystkich platformach, płynne animacje i przewidywalna wydajność, a zespół jest gotowy nauczyć się Darta. Dobry też, gdy z jednej bazy kodu chcemy celować również w desktop.
   - **React Native** - gdy zespół zna JavaScript/TypeScript i React (np. ma już aplikację webową), chce współdzielić logikę i wiedzę z frontendem webowym, korzystać z ekosystemu npm, a aplikacja ma wyglądać „natywnie” dla danej platformy. Typowy wybór dla aplikacji biznesowych typu CRUD.
   - **NativeScript** - gdy zespół pracuje w Angularze lub Vue i chce pozostać przy tym frameworku albo gdy aplikacja wymaga częstego, bezpośredniego dostępu do natywnych API bez pisania modułów w Kotlinie/Swifcie. Trzeba jednak liczyć się z mniejszą liczbą gotowych bibliotek.

   W moim projekcie (FuelTracker - ewidencja tankowań, formularze, listy, lokalny zapis) wybrałem **React Native** - szczegóły w pkt. „Wnioski końcowe”.

4. **Jakie są mocne i słabe strony React Native w porównaniu do Fluttera?**  
   _Odpowiedź:_  
   **Mocne strony React Native:**
   - język JavaScript/TypeScript - powszechnie znany, niski próg wejścia dla frontendowców;
   - natywne kontrolki - aplikacja automatycznie zachowuje się zgodnie z konwencjami Androida/iOS (np. dostępność, pola tekstowe);
   - ogromny ekosystem npm i możliwość współdzielenia kodu z aplikacją webową;
   - Expo: szybki start, Expo Go, aktualizacje OTA, budowanie w chmurze (EAS);
   - Fast Refresh - zmiany w kodzie widoczne niemal natychmiast.

   **Słabe strony React Native:**
   - wygląd może różnić się między platformami (różne natywne kontrolki), trzeba to testować na obu;
   - jakość bibliotek z npm jest nierówna, część z nich zawiera kod natywny i potrafi się psuć przy aktualizacjach RN;
   - częste zmiany wersji i migracje (np. przejście na Nową Architekturę);
   - przy bardzo złożonych animacjach/grafice wydajność może ustępować Flutterowi.

   **Flutter dla porównania:** spójny wygląd na każdej platformie, bardzo dobra wydajność i dobre oficjalne narzędzia (DevTools), ale wymaga nauki Darta, generuje większy plik aplikacji, a jego widgety tylko imitują natywny wygląd platformy.

5. **Jak Flutter radzi sobie z wydajnością w porównaniu do innych rozwiązań hybrydowych?**  
   _Odpowiedź:_ Bardzo dobrze. W wersji produkcyjnej kod Darta jest kompilowany **AOT do natywnego kodu maszynowego** (ARM), więc nie ma interpretera ani mostu JS. Całe UI rysuje własny silnik (Impeller) bezpośrednio przez GPU, co daje stabilne 60/120 FPS i przewidywalne animacje; Impeller prekompiluje shadery, co usunęło dawne „przycięcia” przy pierwszej animacji. W porównaniu z aplikacjami hybrydowymi opartymi na WebView (Cordova, Ionic/Capacitor) Flutter jest wyraźnie szybszy, bo nie renderuje HTML w przeglądarce. W porównaniu z React Native różnica dla typowych aplikacji (listy, formularze) jest niewielka, szczególnie po wprowadzeniu w RN Nowej Architektury (JSI, Fabric) i silnika Hermes. Kosztem są większy rozmiar aplikacji (dołączony silnik) i większe zużycie pamięci na starcie.

6. **Jak NativeScript integruje się z natywnymi API urządzenia?**  
   _Odpowiedź:_ NativeScript podczas budowania generuje **metadane** opisujące wszystkie klasy, metody i typy z natywnych SDK (Android API, frameworki iOS). Na tej podstawie runtime udostępnia je w JavaScripcie jako zwykłe obiekty - można np. wywołać `new android.widget.Toast(...)` lub użyć `UIDevice.currentDevice` bezpośrednio w kodzie TS, a runtime sam konwertuje typy między JS a Javą/Kotlinem lub Objective-C/Swiftem. Dzięki temu nie trzeba pisać natywnych modułów ani czekać, aż ktoś przygotuje wtyczkę - nowe API systemu jest dostępne od razu. Do wygody istnieją też gotowe pluginy (`@nativescript/*`) opakowujące typowe funkcje (kamera, geolokalizacja, pliki), a deklaracje typów TypeScript dają podpowiedzi w edytorze.

7. **Który framework ma obecnie największe wsparcie społeczności i dlaczego?**  
   _Odpowiedź:_ Największe społeczności mają **React Native i Flutter**, z wyraźną przewagą nad NativeScriptem. Flutter ma więcej gwiazdek na GitHubie i w ankietach programistów (np. Stack Overflow Developer Survey) od kilku lat jest na pierwszym lub drugim miejscu wśród frameworków wieloplatformowych, ponieważ Google aktywnie go rozwija i promuje, a dokumentacja i narzędzia są bardzo spójne. React Native ma za to największy ekosystem bibliotek (npm), korzysta z popularności Reacta i JavaScriptu, jest wspierany przez Metę, Microsoft i firmę Expo oraz używany w dużych aplikacjach produkcyjnych (Facebook, Instagram, Microsoft Office, Shopify). NativeScript ma niewielką, ale aktywną społeczność; projekt jest rozwijany przez społeczność i fundację OpenJS, więc gotowych bibliotek i odpowiedzi na typowe problemy jest znacznie mniej.

8. **W jakich przypadkach lepiej wybrać framework natywny zamiast hybrydowego?**  
   _Odpowiedź:_ Rozwiązanie w pełni natywne jest lepsze, gdy:
   - aplikacja wymaga **maksymalnej wydajności** - gry, zaawansowana grafika 3D, przetwarzanie obrazu/wideo w czasie rzeczywistym, AR/VR;
   - intensywnie korzysta ze **specyficznych funkcji platformy** lub nowych API zaraz po ich premierze (widżety, Apple Watch/Wear OS, CarPlay/Android Auto, rozszerzenia systemu, zaawansowany Bluetooth);
   - aplikacja jest przeznaczona **tylko na jedną platformę**, więc zysk ze wspólnego kodu znika;
   - wymagana jest pełna zgodność z wytycznymi projektowymi platformy (Material Design / Human Interface Guidelines) i dostępnością;
   - firma ma osobne zespoły Android i iOS oraz budżet na utrzymanie dwóch baz kodu.

9. **Jakie języki programowania są używane w poszczególnych frameworkach?**  
   _Odpowiedź:_
   - **React Native** - JavaScript lub (zalecany) **TypeScript** + JSX; moduły natywne w **Kotlinie/Javie** (Android) i **Swifcie/Objective-C** (iOS), rdzeń frameworka częściowo w C++. W moim projekcie: TypeScript.
   - **Flutter** - **Dart**; integracja z platformą przez _platform channels_ w Kotlinie/Javie i Swifcie/Objective-C, silnik napisany w C++.
   - **NativeScript** - JavaScript/**TypeScript**, opcjonalnie z Angularem, Vue, Svelte, Solid lub Reactem; natywne API wywoływane z TS, ewentualny kod natywny w Kotlinie/Javie i Swifcie/Objective-C.

10. **Jak wygląda proces budowania i publikacji aplikacji w każdym z frameworków?**  
    _Odpowiedź:_ We wszystkich trzech końcowy etap jest taki sam: powstaje natywny pakiet **AAB/APK** (Android, budowany Gradle'em) lub **IPA** (iOS, budowany przez Xcode - wymaga macOS), który trzeba **podpisać** (keystore dla Androida, certyfikat i profil Apple dla iOS) i wysłać do **Google Play Console** / **App Store Connect** (TestFlight, review Apple).
    - **React Native** - w czystym RN: `npx react-native build-android` / Xcode Archive. Z **Expo**: `npx expo prebuild` generuje projekty natywne, `npx expo run:android` buduje lokalnie, a **EAS Build** buduje i podpisuje w chmurze (także iOS bez Maca), **EAS Submit** wysyła do sklepów, **EAS Update** pozwala wypuszczać poprawki JS „over the air”.
    - **Flutter** - `flutter build appbundle` (Android) i `flutter build ipa` (iOS), konfiguracja w `pubspec.yaml`; publikacja ręczna lub przez fastlane/Codemagic.
    - **NativeScript** - `ns build android --release` / `ns build ios --release` z parametrami podpisu, następnie ręczne wysłanie do sklepów lub automatyzacja (fastlane, CI).

### Techniki i narzędzia programistyczne

11. **Jakie funkcje Visual Studio Code są szczególnie przydatne w tworzeniu aplikacji mobilnych?**  
    _Odpowiedź:_ W moim projekcie pracuję w VS Code. Najbardziej przydatne są:
    - **IntelliSense** dla TypeScriptu - podpowiedzi, typy propsów komponentów, szybkie wykrywanie błędów jeszcze przed uruchomieniem;
    - **zintegrowany terminal** - uruchamianie `npm run android`, Metro i emulatora bez opuszczania edytora;
    - **debugger** z breakpointami (`launch.json`) oraz podgląd zmiennych i stosu wywołań;
    - **wbudowana obsługa Gita** - podgląd zmian, staging, commity, konflikty, gałęzie;
    - **rozszerzenia** (lint, formatowanie, wsparcie frameworka) oraz refaktoryzacja (zmiana nazw, „Go to definition”, wyszukiwanie w całym projekcie);
    - lekkość w porównaniu z pełnym IDE - Android Studio jest mi potrzebne głównie do SDK i emulatora.

12. **Czym różni się Android Studio od Xcode?**  
    _Odpowiedź:_
    | Cecha | Android Studio | Xcode |
    |---|---|---|
    | Producent / platforma docelowa | Google (JetBrains IntelliJ), Android | Apple, iOS/iPadOS/macOS/watchOS |
    | System operacyjny | Windows, macOS, Linux | **tylko macOS** |
    | Języki | Kotlin, Java (C/C++ przez NDK) | Swift, Objective-C |
    | System budowania | Gradle | xcodebuild / Swift Package Manager |
    | Projektowanie UI | Jetpack Compose (podgląd), edytor XML | SwiftUI (podgląd), Interface Builder/Storyboard |
    | Testowanie | Emulator Androida (AVD, Device Manager) | Symulator iOS (Simulator.app) |
    | Narzędzia | Profiler, Logcat, Layout Inspector | Instruments, View Debugger |
    | Publikacja | Podpis keystore → Google Play Console | Certyfikaty i profile → App Store Connect |

    W React Native oba IDE są potrzebne głównie jako źródło SDK, emulatora/symulatora i narzędzi budowania; kod JS/TS piszę w VS Code. Na moim Macu jest zainstalowane tylko Android Studio (bez pełnego Xcode), dlatego projekt uruchamiam na Androidzie.

13. **Jakie rozszerzenia VS Code usprawniają pracę z React Native lub Flutterem?**  
    _Odpowiedź:_
    - **React Native:** _Expo Tools_ (podpowiedzi i walidacja `app.json`, debugowanie aplikacji Expo), _React Native Tools_ (Microsoft - uruchamianie i debugowanie aplikacji, polecenia RN), _ESLint_ (analiza statyczna), _Prettier_ (formatowanie), _ES7+ React/React Native snippets_ (szybkie szablony komponentów), _Error Lens_ (błędy wyświetlane bezpośrednio w linii kodu).
    - **Flutter:** _Flutter_ i _Dart_ (Dart-Code) - uruchamianie na urządzeniach, hot reload, debugger, Flutter DevTools, Widget Inspector, refaktoryzacje typu „Wrap with widget”.
    - **Wspólne:** _GitLens_ (historia i autorstwo linii), _GitHub Pull Requests_ (przegląd PR i Issues z poziomu edytora), _YAML_ (konfiguracja CI), _Markdown All in One_ (dokumentacja i sprawozdania).

14. **Jak przebiega proces debugowania aplikacji mobilnej w VS Code lub Android Studio?**  
    _Odpowiedź:_ Ogólny schemat: uruchamiam aplikację w trybie deweloperskim na emulatorze/urządzeniu → podłączam debugger → ustawiam **breakpointy** → odtwarzam problem → analizuję zmienne, stos wywołań i logi → poprawiam kod i sprawdzam efekt (Fast Refresh / hot reload).
    - **React Native/Expo w VS Code:** aplikacja jest uruchamiana przez `npx expo start`; po naciśnięciu `j` w terminalu Metro otwiera się **React Native DevTools** (konsola, breakpointy, inspektor komponentów, profiler). Alternatywnie rozszerzenia _Expo Tools_ / _React Native Tools_ pozwalają podłączyć debugger VS Code (konfiguracja w `launch.json`) i zatrzymywać się na breakpointach bezpośrednio w edytorze. Logi `console.log` pojawiają się w terminalu Metro, a menu deweloperskie otwiera się skrótem `Cmd+M` (Android) w emulatorze.
    - **Android Studio:** uruchomienie w trybie _Debug_, breakpointy w kodzie Kotlin/Java, podgląd logów w **Logcat**, analiza widoków w **Layout Inspector** i wydajności w **Profilerze**; w projekcie RN przydaje się do błędów warstwy natywnej (np. awarie przy starcie, błędy Gradle).

15. **Jakie są zalety używania emulatorów i symulatorów w procesie testowania aplikacji?**  
    _Odpowiedź:_
    - nie trzeba kupować wielu fizycznych urządzeń - można testować różne rozmiary ekranów, gęstości pikseli i wersje systemu (np. tworząc kolejne AVD w Device Manager);
    - szybki cykl pracy: instalacja i Fast Refresh bez kabla, łatwe robienie zrzutów ekranu (np. przez `adb`) do dokumentacji;
    - możliwość symulowania warunków trudnych do odtworzenia: lokalizacja GPS, słaby/brak internetu, niski poziom baterii, obrót ekranu, połączenia przychodzące;
    - powtarzalny stan - łatwo wyczyścić dane aplikacji lub cofnąć urządzenie do snapshotu, co pomaga przy testach trwałości danych;
    - integracja z CI (uruchamianie testów na emulatorach w pipeline).

    **Ograniczenia:** emulator nie oddaje dokładnie wydajności, czujników, aparatu, zachowania baterii i niektórych gestów prawdziwego telefonu, dlatego przed wydaniem warto przetestować aplikację także na fizycznym urządzeniu. Symulator iOS wymaga macOS z Xcode.

    W tym laboratorium szkielet aplikacji uruchomiłem na emulatorze **Pixel_8** (Android) utworzonym w Android Studio.

16. **Jakie problemy mogą wystąpić przy konfiguracji środowiska deweloperskiego i jak je rozwiązać?**  
    _Odpowiedź:_ Typowe problemy (część z nich wystąpiła u mnie podczas tego laboratorium):
    - **Brak zmiennych środowiskowych `ANDROID_HOME` i `PATH`** - u mnie Android SDK był zainstalowany (`~/Library/Android/sdk`), ale `adb` i `emulator` nie były dostępne z terminala. Rozwiązanie: dopisanie `ANDROID_HOME` oraz katalogów `platform-tools` i `emulator` do `PATH` w `~/.zshrc`.
    - **Brak lub zła wersja JDK** - na moim Macu nie było zainstalowanej Javy (`java` zwracała błąd). Do buildów Gradle można użyć JDK dołączonego do Android Studio (JBR, Java 21) przez ustawienie `JAVA_HOME`.
    - **Brak Xcode na macOS** - miałem tylko Command Line Tools, więc symulator iOS i build iOS nie są dostępne. Rozwiązanie: zgodnie z wymaganiem TECH-02 uruchamiam aplikację na Androidzie; ewentualnie instalacja Xcode z App Store lub budowanie iOS w chmurze (EAS).
    - **Niezgodne wersje Node.js/npm lub bibliotek** - rozwiązanie: używanie wersji LTS Node, instalowanie bibliotek przez `npx expo install` (dobiera wersje zgodne z SDK) i diagnoza przez `npx expo-doctor`.
    - **Ostrzeżenia `npm audit`** - po utworzeniu projektu npm zgłosił podatności w zależnościach szablonu; trzeba je przeanalizować, a nie ślepo uruchamiać `npm audit fix --force`, który może zepsuć zgodność wersji.
    - **Emulator nie startuje lub działa wolno** - brak akceleracji sprzętowej, za mało pamięci, obraz systemu dla złej architektury (na Apple Silicon potrzebny obraz ARM64). Rozwiązanie: Device Manager → poprawny obraz systemu, „Wipe Data”, cold boot.
    - **Zajęty port 8081 (Metro) / problemy z cache** - zamknięcie innego procesu Metro, `npx expo start --clear`.
    - **Generator projektu w istniejącym repozytorium** - `create-expo-app` wykrył istniejące repo Git i nie zainicjował zagnieżdżonego repozytorium, ale dodał własny `.gitignore` i pliki konfiguracyjne asystentów AI; scaliłem reguły do jednego `.gitignore` w katalogu głównym i usunąłem zbędne pliki.

17. **Jak działa system kontroli wersji Git i dlaczego jest istotny w projektach zespołowych?**  
    _Odpowiedź:_ Git jest **rozproszonym** systemem kontroli wersji - każdy programista ma lokalnie pełną kopię repozytorium z całą historią. Zmiany przechodzą przez trzy obszary: **katalog roboczy** → **staging area** (`git add`) → **repozytorium** (`git commit`). Każdy commit to migawka stanu projektu z autorem, datą, opisem i odnośnikiem do poprzedniego commita (identyfikowana skrótem SHA), więc historia tworzy graf. **Gałęzie** to lekkie wskaźniki na commity, pozwalające rozwijać funkcje niezależnie i łączyć je przez `merge` lub `rebase`. Synchronizacja ze zdalnym repozytorium odbywa się przez `fetch`/`pull`/`push`.

    W pracy zespołowej Git jest istotny, bo pozwala wielu osobom równolegle pracować nad tym samym kodem i w kontrolowany sposób łączyć zmiany, daje pełną historię (kto, co, kiedy i dlaczego zmienił), umożliwia cofnięcie błędnych zmian, wykrywa konflikty oraz stanowi podstawę do code review i automatyzacji CI/CD. W tym projekcie (indywidualnym) historia Git jest też dowodem systematycznej pracy.

18. **Jakie korzyści daje korzystanie z GitHub lub GitLab w pracy zespołowej?**  
    _Odpowiedź:_
    - centralne **zdalne repozytorium** dostępne dla całego zespołu (i prowadzącego) oraz kopia zapasowa kodu;
    - **Pull/Merge Requesty** z przeglądem kodu, komentarzami do konkretnych linii i dyskusją przed scaleniem;
    - **Issues** i tablice projektowe (Projects / Boards) do planowania zadań, etykiety, kamienie milowe, powiązanie zadań z commitami (`Closes #12`);
    - wbudowane **CI/CD** - GitHub Actions / GitLab CI uruchamiające testy i analizę statyczną przy każdym PR;
    - **ochrona gałęzi** (np. zakaz bezpośredniego pushowania do `main`, wymagany zielony CI);
    - kontrola dostępu i uprawnień, wiki, wydania (Releases, tagi), skanowanie zależności i sekretów (Dependabot, secret scanning).

    W tym projekcie korzystam z GitHuba: repozytorium jest dostępne dla prowadzącego, a w kolejnych laboratoriach dojdą Issues, Pull Requesty i GitHub Actions.

19. **Na czym polega workflow oparty o branchowanie, pull requesty i code review?**  
    _Odpowiedź:_ Gałąź `main` zawiera zawsze stabilną wersję i nie pracuje się na niej bezpośrednio. Typowy cykl:
    1. Utworzenie lub wybranie **Issue** opisującego zadanie.
    2. Utworzenie krótkotrwałej gałęzi od aktualnego `main`, np. `feature/refuel-form`, `fix/mileage-validation`, `docs/architecture`.
    3. Praca w małych, opisowych commitach (np. w formacie Conventional Commits: `feat(refuels): add refuel form`).
    4. Wypchnięcie gałęzi i otwarcie **Pull Requesta** do `main` z opisem celu, powiązanym Issue, sposobem testowania i zrzutami ekranu.
    5. **CI** automatycznie uruchamia lint i testy.
    6. **Code review** - inna osoba (lub w projekcie indywidualnym: samodzielny przegląd diffu) sprawdza poprawność, czytelność i zgodność z wymaganiami, zgłasza uwagi, autor wprowadza poprawki.
    7. Po akceptacji i zielonym CI - **merge** do `main`, usunięcie gałęzi, zamknięcie Issue.

    Zalety: izolacja niedokończonych zmian, wczesne wykrywanie błędów, dzielenie się wiedzą w zespole i czytelna historia projektu.

20. **Jak zintegrować Git z procesem CI/CD w projekcie mobilnym?**  
    _Odpowiedź:_ Konfigurację pipeline'u trzyma się w repozytorium (np. `.github/workflows/ci.yml` dla GitHub Actions), a zdarzenia Gita uruchamiają kolejne etapy:
    - **CI - przy każdym Pull Requeście / pushu do `main`:** pobranie kodu (`actions/checkout`), instalacja Node.js i zależności (`npm ci` z `package-lock.json`), analiza statyczna (`npx expo lint`, `npx tsc --noEmit`), testy automatyczne (`npm test` / Jest). Błąd dowolnego kroku oznacza czerwony status PR, a ochrona gałęzi blokuje merge.
    - **CD - np. po tagu wersji (`v1.0.0`) lub merge do `main`:** budowanie podpisanych paczek AAB/IPA (np. EAS Build, fastlane lub Gradle/Xcode na runnerze macOS), dystrybucja testowa (Firebase App Distribution, TestFlight, wewnętrzne ścieżki Google Play) i publikacja w sklepie; w Expo także aktualizacje OTA (EAS Update).
    - **Sekrety** (klucze podpisu, tokeny sklepów, `EXPO_TOKEN`) przechowuje się w GitHub Secrets, nigdy w repozytorium.

    Specyfika mobilna: buildy iOS wymagają runnera z macOS (drogie i wolne), więc często w CI uruchamia się tylko testy i analizę statyczną, a pełne buildy - rzadziej lub w usłudze zewnętrznej. W tym projekcie wymagane jest CI uruchamiające instalację zależności, lint i testy dla Pull Requestów do `main` (do realizacji w Lab 4).

## Wnioski końcowe

Podsumuj najważniejsze wnioski z ćwiczenia:

- Który framework wybrałbyś do własnego projektu i dlaczego?
- Jakie narzędzia najbardziej ułatwiły pracę?
- Jakie problemy napotkałeś i jak je rozwiązałeś?

_Odpowiedź:_

**Wybór frameworka.** Do projektu **FuelTracker** wybrałem **React Native z Expo i TypeScriptem**. Aplikacja jest typowym CRUD-em z listami, formularzami, walidacją i lokalnym zapisem - nie potrzebuje zaawansowanej grafiki, więc przewaga wydajnościowa Fluttera nie ma tu znaczenia. Znam JavaScript/TypeScript i Reacta, więc mogę skupić się na logice biznesowej zamiast na nauce nowego języka Dart. Ekosystem npm zapewnia gotowe biblioteki do nawigacji, lokalnej bazy danych i testów, a Expo upraszcza konfigurację i uruchamianie. NativeScript odrzuciłem ze względu na mniejszą społeczność i liczbę bibliotek. Ograniczeniem wyboru jest zależność od wersji Expo SDK i jakości bibliotek zewnętrznych.

**Najbardziej pomocne narzędzia.**

- `create-expo-app` z szablonem `blank-typescript` - działający projekt TypeScript w jednym poleceniu;
- **Expo Go** - uruchomienie aplikacji na emulatorze bez lokalnego budowania kodu natywnego;
- **Android Studio** jako źródło Android SDK i emulatora (AVD Pixel_8);
- **VS Code** ze zintegrowanym terminalem i obsługą Gita;
- `npx tsc --noEmit` - szybka weryfikacja, że projekt kompiluje się bez błędów typów.

**Napotkane problemy i rozwiązania.**

- Android SDK był zainstalowany, ale `ANDROID_HOME`, `adb` i `emulator` nie były widoczne w terminalu → ustawienie zmiennych środowiskowych (`ANDROID_HOME`, `PATH`).
- Brak zainstalowanej Javy w systemie → do budowania natywnego użyję JDK dołączonego do Android Studio (`JAVA_HOME`).
- Brak pełnego Xcode → nie mogę uruchomić symulatora iOS; jako platformę docelową wybrałem Androida (zgodnie z TECH-02 wystarczy jedna platforma).
- Generator projektu dodał własny `.gitignore` oraz pliki konfiguracyjne dla asystentów AI → usunąłem zbędne pliki i scaliłem reguły w jeden `.gitignore` w katalogu głównym repozytorium, tak aby w repozytorium znalazły się tylko pliki potrzebne do odtworzenia projektu (`npm ci`).
- `npm install` zgłosił ostrzeżenia o podatnościach w zależnościach szablonu → odnotowane do analizy w ramach `docs/security.md` (Lab 4), bez ryzykownego `npm audit fix --force`.

**Efekt laboratorium:** utworzony szkielet aplikacji FuelTracker w katalogu `FuelTracker/`, uruchomiony na emulatorze Androida:

![Szkielet aplikacji FuelTracker uruchomiony na emulatorze Androida Pixel_8](img/lab-01-skeleton-android.png)
