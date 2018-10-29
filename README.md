# Trello Board

[Pixelnetz](https://trello.com/b/mGaOpOxx/pixelnetz)

# AWS Instanz

SSH Verbindung mit Server herstellen:
*Anleitung nur für macOS/Linux gülitg.*
- Terminal in dem Ordner mit der pixelnetz.pem Datei öffnen oder pixelnetz.pem in den .ssh Ordner kopieren.
- chmod 600 pixelnetz.pem
- `ssh -i pixelnetz.pem pixelnetz@ec2-3-120-26-9.eu-central-1.compute.amazonaws.com`
- IP: 3.120.26.9

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
