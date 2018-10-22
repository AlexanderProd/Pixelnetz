# Kommunikation über WebSockets
Alle Seiten (Client für Animation und Master für Steuerung) sind über das lokale Netzwerk erreichbar.
Das Testen mit Smartphones sollte nun möglich sein.

# zum Starten:

- node installieren https://nodejs.org/en/
- yarn installieren: in terminal "npm install -g yarn"
- in Terminal zu Projektordner navigieren
- "yarn install" ausführen
- "yarn start" baut Seiten und startet Server
- Wenn Seiten bereits gebaut wurden kann mit "yarn start:server" nur der Server gestartet werden
- Adressen zur Clientseite und zur Masterseite zum Steuern der Animation werden vom Server im Terminal geloggt
