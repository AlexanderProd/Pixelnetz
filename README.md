# Trello Board

[Pixelnetz](https://trello.com/b/mGaOpOxx/pixelnetz)

# AWS Instanz

SSH Verbindung mit Server herstellen:
*Anleitung nur für macOS/Linux gülitg.*
- Terminal in dem Ordner mit der pixelnetz-new.pem Datei öffnen oder pixelnetz-new.pem in den .ssh Ordner kopieren.
- `chmod 400 pixelnetz-new.pem`
- `ssh -i pixelnetz-new.pem pixelnetz@ec2-3-121-177-95.eu-central-1.compute.amazonaws.com`
- IP: 3.121.177.95

# Kommunikation über WebSockets
Alle Seiten (Client für Animation und Master für Steuerung) sind über das lokale Netzwerk erreichbar.
Das Testen mit Smartphones sollte nun möglich sein.

# zum Starten:
- node installieren https://nodejs.org/en/
- in den drei Ordnern (frontend, master, server) "yarn install" ausführen
- in den Ordnern können über die yarn Befehle, die in den entsprechenden READMEs angegeben sind, die einzelnen Teile der Anwendung gestartet werden
  - Server: yarn start:dev
  - Frontend & Master: yarn start
- um alles auf einmal zu bauen und den Server im Produktionsmodus zu starten in Terminal "bash prodStart.sh" ausführen
