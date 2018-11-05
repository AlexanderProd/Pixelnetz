# Trello Board

[Pixelnetz](https://trello.com/b/mGaOpOxx/pixelnetz)

# AWS Instanz

SSH Verbindung mit Server herstellen:
*Anleitung nur für macOS/Linux gülitg.*
- Terminal in dem Ordner mit der pixelnetz.pem Datei öffnen oder pixelnetz.pem in den .ssh Ordner kopieren.
- `chmod 600 pixelnetz.pem`
- `ssh -i pixelnetz.pem pixelnetz@ec2-3-120-26-9.eu-central-1.compute.amazonaws.com`
- IP: 3.120.26.9

# Kommunikation über WebSockets
Alle Seiten (Client für Animation und Master für Steuerung) sind über das lokale Netzwerk erreichbar.
Das Testen mit Smartphones sollte nun möglich sein.

# zum Starten:
- node installieren https://nodejs.org/en/
- in den drei Ordnern (frontend, master, server) "yarn install" ausführen
- in den Ordnern können über die yarn Befehle, die in den entsprechenden READMEs angegeben sind, die einzelnen Teile der Anwendung gestartet werden
- um alles auf einmal zu bauen und den Server im Produktionsmodus zu starten in Terminal "bash startServer.sh" ausführen

# Pixelnetz ToDo

- GPS Werte zu 2D Pixelnetz konvertieren [Hilfreicher Thread](https://stackoverflow.com/questions/2651099/convert-long-lat-to-pixel-x-y-on-a-given-picture)
- [Scaling...](https://blog.jayway.com/2015/04/13/600k-concurrent-websocket-connections-on-aws-using-node-js/)

- Master durch Passwort schützen
- Eine Animationssequenz, statt an/aus Impuls von Server
  - Client muss Sequenz verarbeiten können
  - Server erzeugt rasterisierte Darstellung eines Bildes anhand Rastergröße aus verbundenen Clients
- IP Untersscheidung Prod/Dev
- Server generiert Sequenzen aus Bildern und Videos
- Server und Client synchronisieren Startzeitpunkt (WebSocket Performance Testen)
- Test Umgebung einrichten
- Tollen Namen überlegen
- Bild und Ton Effekt 
